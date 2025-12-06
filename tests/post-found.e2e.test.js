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
jest.mock("../backend/src/repositories/foundItemRepository", () => {
  return {
    create: jest.fn(),
    findById: jest.fn(),
  };
});

const app = require("../backend/src/app");
const firebase = require("../backend/src/config/firebase");
const userRepository = require("../backend/src/repositories/userRepository");
const foundItemRepository = require("../backend/src/repositories/foundItemRepository");
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

describe("Post Found Item (end-to-end)", () => {
  const apiPrefix = "/api/v1";

  test("Authenticated user posts a found item (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const created = { _id: "found1" };
    const populated = {
      _id: "found1",
      title: "Found Keys",
      description: "A set of keys found near cafe.",
      category: "Keys",
      dateFound: new Date("2025-01-02T00:00:00Z"),
      location: "Downtown Cafe",
      status: "available",
      isReturned: false,
      userId: mockUserDoc,
      images: [],
    };
    foundItemRepository.create.mockResolvedValueOnce(created);
    foundItemRepository.findById.mockResolvedValueOnce(populated);

    const res = await request(app)
      .post(`${apiPrefix}/found-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Found Keys",
        description: "A set of keys found near cafe.",
        category: "Keys",
        dateFound: "2025-01-02",
        location: "Downtown Cafe",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toMatchObject({
      title: "Found Keys",
      category: "Keys",
      status: "available",
      isReturned: false,
    });
  });

  test("Posting found item fails with missing required fields (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .post(`${apiPrefix}/found-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed/i);
  });

  test("Posting found item fails with short title/description (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .post(`${apiPrefix}/found-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Hi",
        description: "Too short",
        category: "Electronics",
        dateFound: "2025-01-02",
        location: "Downtown",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed/i);
  });

  test("Posting found item fails when more than 5 images uploaded (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .post(`${apiPrefix}/found-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Found Bag",
        description: "Black backpack near station.",
        category: "Bags",
        dateFound: "2025-01-02",
        location: "Central Station",
        mockFileCount: 6,
      });

    expect(res.status).toBe(400);
    expect(res.body.message || res.body?.error || res.body?.msg || res.body?.Message).toMatch(/Maximum 5 images allowed/i);
  });

  test("Posting found item fails when any image exceeds 5MB (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .post(`${apiPrefix}/found-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Found Wallet",
        description: "Brown leather wallet.",
        category: "Wallets",
        dateFound: "2025-01-02",
        location: "City Park",
        mockImageSizes: [6 * 1024 * 1024],
      });

    expect(res.status).toBe(400);
    expect(res.body.message || res.body?.error || res.body?.msg || res.body?.Message).toMatch(/5MB/i);
  });

  test("Posting found item succeeds with up to 5 images at <=5MB (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const created = { _id: "found3" };
    const populated = {
      _id: "found3",
      title: "Found Camera",
      description: "DSLR camera found in mall.",
      category: "Electronics",
      dateFound: new Date("2025-01-04T00:00:00Z"),
      location: "City Mall",
      status: "available",
      isReturned: false,
      userId: mockUserDoc,
      images: [
        "cloudinary/path/img1",
        "cloudinary/path/img2",
        "cloudinary/path/img3",
        "cloudinary/path/img4",
        "cloudinary/path/img5",
      ],
    };
    foundItemRepository.create.mockResolvedValueOnce(created);
    foundItemRepository.findById.mockResolvedValueOnce(populated);

    const res = await request(app)
      .post(`${apiPrefix}/found-items`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        title: "Found Camera",
        description: "DSLR camera found in mall.",
        category: "Electronics",
        dateFound: "2025-01-04",
        location: "City Mall",
        mockFileCount: 5,
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data.images.length).toBe(5);
  });

  test("Unauthenticated user cannot post found item (negative)", async () => {
    const res = await request(app)
      .post(`${apiPrefix}/found-items`)
      .send({
        title: "Found Keys",
        description: "Set of keys.",
        category: "Keys",
        dateFound: "2025-01-02",
        location: "Downtown",
      });

    expect(res.status).toBe(401);
  });
});
