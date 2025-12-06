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

describe("Signup process (end-to-end)", () => {
  const apiPrefix = "/api/v1";

  test("User signs up and can fetch their profile (positive)", async () => {
    // 1) Simulate Firebase creating the user and issuing an ID token
    const idToken = "token123";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });

    // 2) Backend has no existing user, create on POST /users
    userRepository.findByUid.mockResolvedValueOnce(null);
    userRepository.findByEmail.mockResolvedValueOnce(null);
    userRepository.create.mockResolvedValueOnce(mockUserDoc);

    const createRes = await request(app)
      .post(`${apiPrefix}/users`)
      .send({
        uid: mockUserDoc.uid,
        name: mockUserDoc.name,
        email: mockUserDoc.email,
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe("success");

    // 3) Now authenticated call to GET /users/me using the issued token
    // First call by auth middleware, second call by userService
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);
    const meRes = await request(app)
      .get(`${apiPrefix}/users/me`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.status).toBe("success");
    expect(meRes.body.data).toMatchObject({
      email: mockUserDoc.email,
      name: mockUserDoc.name,
    });
  });

  test("Signup fails with invalid email (negative)", async () => {
    // Attempt to create profile with invalid email (backend validation)
    const res = await request(app)
      .post(`${apiPrefix}/users`)
      .send({ uid: "uid-x", name: "Bad Email", email: "not-an-email" });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Validation failed/i);
  });

  
});
