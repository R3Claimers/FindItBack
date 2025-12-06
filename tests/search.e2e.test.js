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
    search: jest.fn(),
  };
});
jest.mock("../backend/src/repositories/foundItemRepository", () => {
  return {
    search: jest.fn(),
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

describe("Search functionality (end-to-end)", () => {
  const apiPrefix = "/api/v1";

  test("Search lost items returns results and pagination (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    lostItemRepository.search.mockResolvedValueOnce({
      items: [
        { _id: "l1", title: "Lost Wallet", status: "open" },
        { _id: "l2", title: "Lost Keys", status: "open" },
      ],
      pagination: { page: 1, limit: 10, total: 2, pages: 1 },
    });

    const res = await request(app)
      .get(`${apiPrefix}/lost-items/search?q=wallet&page=1&limit=10`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination).toMatchObject({ total: 2, pages: 1 });
  });

  test("Search found items returns results and pagination (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    foundItemRepository.search.mockResolvedValueOnce({
      items: [
        { _id: "f1", title: "Found Phone", status: "available" },
        { _id: "f2", title: "Found Charger", status: "available" },
      ],
      pagination: { page: 1, limit: 10, total: 2, pages: 1 },
    });

    const res = await request(app)
      .get(`${apiPrefix}/found-items/search?q=phone&page=1&limit=10`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(2);
    expect(res.body.pagination).toMatchObject({ total: 2, pages: 1 });
  });

  test("Lost items search requires auth (negative)", async () => {
    const res = await request(app)
      .get(`${apiPrefix}/lost-items/search?q=something`);
    expect(res.status).toBe(401);
  });

  test("Found items search fails with empty query (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .get(`${apiPrefix}/found-items/search?q=`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/Search term is required/i);
  });
});

