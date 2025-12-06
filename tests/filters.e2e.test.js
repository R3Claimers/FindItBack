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
jest.mock("../backend/src/repositories/userRepository", () => {
  return {
    findByUid: jest.fn(),
  };
});
jest.mock("../backend/src/repositories/lostItemRepository", () => {
  return {
    findAll: jest.fn(),
  };
});
jest.mock("../backend/src/repositories/foundItemRepository", () => {
  return {
    findAll: jest.fn(),
  };
});

const app = require("../backend/src/app");
const firebase = require("../backend/src/config/firebase");
const userRepository = require("../backend/src/repositories/userRepository");
const lostItemRepository = require("../backend/src/repositories/lostItemRepository");
const foundItemRepository = require("../backend/src/repositories/foundItemRepository");

const mockUserDoc = {
  _id: "507f1f77bcf86cd799439011",
  uid: "uid123",
  name: "John Doe",
  email: "john@example.com",
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("Filter functionality (end-to-end)", () => {
  const apiPrefix = "/api/v1";

  test("Filter lost items by category", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    lostItemRepository.findAll.mockResolvedValueOnce({
      items: [
        { _id: "l1", title: "Lost Wallet", category: "Wallets", location: "City Park", status: "open" },
      ],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
    });

    const res = await request(app)
      .get(`${apiPrefix}/lost-items?category=Wallets`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]).toMatchObject({ category: "Wallets"});
  });

  test("Filter found items by category and isReturned=false (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    foundItemRepository.findAll.mockResolvedValueOnce({
      items: [
        { _id: "f1", title: "Found Keys", category: "Keys", isReturned: false, status: "available" },
      ],
      pagination: { page: 2, limit: 5, total: 6, pages: 2 },
    });

    const res = await request(app)
      .get(`${apiPrefix}/found-items?category=Keys&isReturned=false&page=2&limit=5`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data[0]).toMatchObject({ category: "Keys", isReturned: false });
    expect(res.body.pagination).toMatchObject({ page: 2, limit: 5, total: 6 });
  });

  test("Invalid page returns validation error (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .get(`${apiPrefix}/lost-items?page=0&limit=10`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed/i);
    const messages = (res.body.errors || []).map((e) => e.message).join(" \n ");
    expect(messages).toMatch(/Page must be a positive integer/i);
  });

  test("Invalid limit returns validation error (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .get(`${apiPrefix}/found-items?page=1&limit=200`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed/i);
    const messages2 = (res.body.errors || []).map((e) => e.message).join(" \n ");
    expect(messages2).toMatch(/Limit must be between 1 and 100/i);
  });
});
