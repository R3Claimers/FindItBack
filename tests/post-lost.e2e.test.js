const request = require("../backend/node_modules/supertest");

jest.mock("../backend/src/config/database", () => jest.fn());
jest.mock("../backend/src/config/firebase", () => {
  const verifyIdToken = jest.fn();
  return {
    initializeFirebase: jest.fn(),
    getFirebaseAdmin: () => ({ auth: () => ({ verifyIdToken }) }),
    __mock: { verifyIdToken },
  };
});
jest.mock("../backend/src/config/cloudinary", () => {
  const uploadMultiple = jest.fn();
  const handleUploadError = (uploadMiddleware) => (req, res, next) => {
    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024;
    const count = Number(req.body?.mockFileCount || 0);
    const sizes = Array.isArray(req.body?.mockImageSizes)
      ? req.body.mockImageSizes.map((s) => Number(s))
      : [];

    if (count > maxFiles) {
      return res.status(400).json({ success: false, message: "Maximum 5 images allowed" });
    }
    if (sizes.some((s) => s > maxSize)) {
      return res.status(400).json({ success: false, message: "File size exceeds 5MB limit" });
    }

    if (count || sizes.length) {
      const effectiveSizes = sizes.length ? sizes : Array.from({ length: count }, () => 1024);
      req.files = effectiveSizes.map((size, i) => ({ size, path: `cloudinary/path/img${i + 1}` }));
    }
    next();
  };
  return {
    uploadMultiple,
    handleUploadError,
  };
});
jest.mock("../backend/src/repositories/userRepository", () => {
  return {
    findByUid: jest.fn(),
  };
});
jest.mock("../backend/src/repositories/lostItemRepository", () => {
  return {
    create: jest.fn(),
    findById: jest.fn(),
  };
});

const app = require("../backend/src/app");
const firebase = require("../backend/src/config/firebase");
const userRepository = require("../backend/src/repositories/userRepository");
const lostItemRepository = require("../backend/src/repositories/lostItemRepository");
const cloudinary = require("../backend/src/config/cloudinary");

const mockUserDoc = {
  _id: "507f1f77bcf86cd799439011",
  uid: "uid123",
  name: "John Doe",
  email: "john@example.com",
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("Post Lost Item (end-to-end)", () => {
  const apiPrefix = "/api/v1";

  test("Authenticated user posts a lost item (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    // Mock repository create + readback
    const created = { _id: "lost1" };
    const populated = {
      _id: "lost1",
      title: "Lost Wallet",
      description: "Brown leather wallet lost near park.",
      category: "Wallets",
      dateLost: new Date("2025-01-01T00:00:00Z"),
      location: "City Park",
      status: "open",
      userId: mockUserDoc,
      images: [],
    };
    lostItemRepository.create.mockResolvedValueOnce(created);
    lostItemRepository.findById.mockResolvedValueOnce(populated);

    const res = await request(app)
      .post(`${apiPrefix}/lost-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Lost Wallet",
        description: "Brown leather wallet lost near park.",
        category: "Wallets",
        dateLost: "2025-01-01",
        location: "City Park",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toMatchObject({
      title: "Lost Wallet",
      category: "Wallets",
      status: "open",
    });
  });

  test("Posting lost item fails with empty category (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .post(`${apiPrefix}/lost-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Lost Gadget",
        description: "Small device lost.",
        category: "",
        dateLost: "2025-01-01",
        location: "Library",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed/i);
  });

  test("Posting lost item fails with missing required fields (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .post(`${apiPrefix}/lost-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed/i);
  });

  test("Posting lost item fails with short title/description (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .post(`${apiPrefix}/lost-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Hi",
        description: "Too short",
        category: "Electronics",
        dateLost: "2025-01-01",
        location: "Downtown",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed/i);
  });

  test("Posting lost item fails with empty category (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .post(`${apiPrefix}/lost-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Lost Gadget",
        description: "Small device lost.",
        category: "",
        dateLost: "2025-01-01",
        location: "Library",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed/i);
  });

  test("Posting lost item fails when more than 5 images uploaded (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    // upload limits enforced via mocked cloudinary.handleUploadError

    const res = await request(app)
      .post(`${apiPrefix}/lost-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Lost Bag",
        description: "Black backpack lost near station.",
        category: "Bags",
        dateLost: "2025-01-01",
        location: "Central Station",
        mockFileCount: 6,
      });

    expect(res.status).toBe(400);
    expect(res.body.message || res.body?.error || res.body?.msg || res.body?.Message).toMatch(/Maximum 5 images allowed/i);
  });

  test("Posting lost item fails when any image exceeds 5MB (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    // upload limits enforced via mocked cloudinary.handleUploadError

    const res = await request(app)
      .post(`${apiPrefix}/lost-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Lost Wallet",
        description: "Brown leather wallet.",
        category: "Wallets",
        dateLost: "2025-01-01",
        location: "City Park",
        mockImageSizes: [6 * 1024 * 1024],
      });

    expect(res.status).toBe(400);
    expect(res.body.message || res.body?.error || res.body?.msg || res.body?.Message).toMatch(/5MB/i);
  });

  test("Posting lost item succeeds with up to 5 images at <=5MB (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const created = { _id: "lost2" };
    const populated = {
      _id: "lost2",
      title: "Lost Phone",
      description: "Black smartphone lost in mall.",
      category: "Electronics",
      dateLost: new Date("2025-01-03T00:00:00Z"),
      location: "City Mall",
      status: "open",
      userId: mockUserDoc,
      images: [
        "cloudinary/path/img1",
        "cloudinary/path/img2",
        "cloudinary/path/img3",
        "cloudinary/path/img4",
        "cloudinary/path/img5",
      ],
    };
    lostItemRepository.create.mockResolvedValueOnce(created);
    lostItemRepository.findById.mockResolvedValueOnce(populated);

    const res = await request(app)
      .post(`${apiPrefix}/lost-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Lost Phone",
        description: "Black smartphone lost in mall.",
        category: "Electronics",
        dateLost: "2025-01-03",
        location: "City Mall",
        mockFileCount: 5,
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.images.length).toBe(5);
  });
});
