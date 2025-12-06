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
    update: jest.fn(),
    findById: jest.fn(),
  };
});
jest.mock("../backend/src/repositories/foundItemRepository", () => {
  return {
    update: jest.fn(),
    findById: jest.fn(),
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

describe("Status update (owner actions)", () => {
  const apiPrefix = "/api/v1";
  const lostId = "64b7fa0f3b1a2c4d5e6f7890";
  const lostId2 = "64b7fa0f3b1a2c4d5e6f7892";
  const foundId = "64b7fa0f3b1a2c4d5e6f7891";
  const foundId2 = "64b7fa0f3b1a2c4d5e6f7893";

  test("Owner marks lost item as found", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const updated = {
      _id: "lost1",
      status: "found",
      userId: mockUserDoc,
    };
    lostItemRepository.update.mockResolvedValueOnce(updated);

    const res = await request(app)
      .patch(`${apiPrefix}/lost-items/${lostId}/resolve`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ status: "found" });
  });

  test("Owner updates lost item status to open", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const updated = {
      _id: lostId2,
      status: "open",
      userId: mockUserDoc,
    };
    lostItemRepository.update.mockResolvedValueOnce(updated);

    const res = await request(app)
      .patch(`${apiPrefix}/lost-items/${lostId2}/status`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({ status: "open" });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ status: "open" });
  });

  test("Invalid lost status rejected (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .patch(`${apiPrefix}/lost-items/${lostId}/status`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({ status: "invalid" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid status. Must be 'open' or 'found'/i);
  });

  test("Non-owner cannot update lost item status (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    lostItemRepository.update.mockResolvedValueOnce(null);

    const res = await request(app)
      .patch(`${apiPrefix}/lost-items/${lostId}/status`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({ status: "found" });

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/not authorized/i);
  });

  test("Owner marks found item as claimed", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const updated = {
      _id: "found1",
      status: "claimed",
      isReturned: true,
      userId: mockUserDoc,
    };
    foundItemRepository.update.mockResolvedValueOnce(updated);

    const res = await request(app)
      .patch(`${apiPrefix}/found-items/${foundId}/return`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ status: "claimed", isReturned: true });
  });

  test("Owner updates found item status to claimed", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const updated = {
      _id: foundId2,
      status: "claimed",
      isReturned: true,
      userId: mockUserDoc,
    };
    foundItemRepository.update.mockResolvedValueOnce(updated);

    const res = await request(app)
      .patch(`${apiPrefix}/found-items/${foundId2}/status`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({ status: "claimed" });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ status: "claimed", isReturned: true });
  });

  test("Invalid found status rejected (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .patch(`${apiPrefix}/found-items/${foundId}/status`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({ status: "invalid" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid status. Must be 'available' or 'claimed'/i);
  });

  test("Non-owner cannot update found item status (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    foundItemRepository.update.mockResolvedValueOnce(null);

    const res = await request(app)
      .patch(`${apiPrefix}/found-items/${foundId}/status`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({ status: "claimed" });

    expect(res.status).toBe(500);
    expect(res.body.message).toMatch(/not authorized/i);
  });
});
