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
    updateByUid: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
  };
});

const app = require("../backend/src/app");
const firebase = require("../backend/src/config/firebase");
const userRepository = require("../backend/src/repositories/userRepository");

const mockUserDoc = {
  _id: "507f1f77bcf86cd799439011",
  uid: "uid123",
  name: "John Doe",
  email: "john@example.com",
  phone: "+123456789",
  profilePic: null,
  bio: "Hello",
  createdAt: new Date("2020-01-01T00:00:00Z"),
  getPublicProfile() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      phone: this.phone,
      profilePic: this.profilePic,
      bio: this.bio,
      createdAt: this.createdAt,
    };
  },
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("Login process (end-to-end)", () => {
  const apiPrefix = "/api/v1";

  test("User logs in and can fetch their profile (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });

    // User already exists in DB (auth middleware + service fetch)
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const res = await request(app)
      .get(`${apiPrefix}/users/me`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toMatchObject({
      email: mockUserDoc.email,
      name: mockUserDoc.name,
    });
  });

  test("Logged-in user updates profile successfully (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });

    // Auth middleware needs the user to exist
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const updatedDoc = { ...mockUserDoc, name: "Updated Name" };
    userRepository.updateByUid.mockResolvedValueOnce(updatedDoc);

    const res = await request(app)
      .put(`${apiPrefix}/users/me`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({ name: "Updated Name" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toMatchObject({ name: "Updated Name" });
  });

  test("Login fails when user profile not found (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });

    // No user profile in DB
    userRepository.findByUid.mockResolvedValueOnce(null);

    const res = await request(app)
      .get(`${apiPrefix}/users/me`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/User not found/i);
  });

  test("Login fails with expired token (negative)", async () => {
    firebase.__mock.verifyIdToken.mockRejectedValue({ code: "auth/id-token-expired" });

    const res = await request(app)
      .get(`${apiPrefix}/users/me`)
      .set("Authorization", "Bearer expiredtoken");

    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/Token expired/i);
  });
});
