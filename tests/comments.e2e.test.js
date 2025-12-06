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
jest.mock("../backend/src/models/Comment", () => {
  return {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
  };
});

const app = require("../backend/src/app");
const firebase = require("../backend/src/config/firebase");
const userRepository = require("../backend/src/repositories/userRepository");
const Comment = require("../backend/src/models/Comment");

const mockUserDoc = {
  _id: "507f1f77bcf86cd799439011",
  uid: "uid123",
  name: "John Doe",
  email: "john@example.com",
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("Comments functionality (end-to-end)", () => {
  const apiPrefix = "/api/v1";

  test("Add a comment to a lost item (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const commentDoc = {
      _id: "c1",
      itemId: "lost1",
      itemType: "LostItem",
      userId: mockUserDoc._id,
      content: "Hope you find it soon",
    };
    commentDoc.populate = jest.fn().mockResolvedValue(commentDoc);
    Comment.create.mockResolvedValueOnce(commentDoc);

    const res = await request(app)
      .post(`${apiPrefix}/comments`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({
        itemId: "lost1",
        itemType: "LostItem",
        content: "Hope you find it soon",
      });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toMatchObject({ content: "Hope you find it soon" });
  });

  test("Get comments for an item (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const listDoc = {
      _id: "c2",
      itemId: "lost1",
      itemType: "LostItem",
      userId: mockUserDoc._id,
      content: "Any updates?",
    };

    const chain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([listDoc]),
    };
    Comment.find.mockReturnValueOnce(chain);

    const res = await request(app)
      .get(`${apiPrefix}/comments/lost1`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data[0]).toMatchObject({ content: "Any updates?" });
  });

  test("Update own comment (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const commentDoc = {
      _id: "c3",
      itemId: "lost1",
      itemType: "LostItem",
      userId: mockUserDoc._id,
      content: "Old text",
    };
    commentDoc.save = jest.fn().mockResolvedValue(commentDoc);
    commentDoc.populate = jest.fn().mockResolvedValue(commentDoc);
    Comment.findById.mockResolvedValueOnce(commentDoc);

    const res = await request(app)
      .put(`${apiPrefix}/comments/c3`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({ content: "Updated text" });

    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ content: "Updated text" });
  });

  test("Delete own comment (positive)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const commentDoc = {
      _id: "c4",
      itemId: "lost1",
      itemType: "LostItem",
      userId: mockUserDoc._id,
      content: "To delete",
    };
    commentDoc.deleteOne = jest.fn().mockResolvedValue();
    Comment.findById.mockResolvedValueOnce(commentDoc);

    const res = await request(app)
      .delete(`${apiPrefix}/comments/c4`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  test("Cannot update someone else's comment (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const otherCommentDoc = {
      _id: "c5",
      itemId: "lost1",
      itemType: "LostItem",
      userId: "aaaaaaaaaaaaaaaaaaaaaaaa",
      content: "Not yours",
    };
    Comment.findById.mockResolvedValueOnce(otherCommentDoc);

    const res = await request(app)
      .put(`${apiPrefix}/comments/c5`)
      .set("Authorization", `Bearer ${idToken}`)
      .send({ content: "Try update" });

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/only update your own comments/i);
  });

  test("Cannot delete someone else's comment (negative)", async () => {
    const idToken = "validtoken";
    firebase.__mock.verifyIdToken.mockResolvedValue({ uid: mockUserDoc.uid });
    userRepository.findByUid.mockResolvedValueOnce(mockUserDoc);

    const otherCommentDoc = {
      _id: "c6",
      itemId: "lost1",
      itemType: "LostItem",
      userId: "aaaaaaaaaaaaaaaaaaaaaaaa",
      content: "Not yours",
    };
    Comment.findById.mockResolvedValueOnce(otherCommentDoc);

    const res = await request(app)
      .delete(`${apiPrefix}/comments/c6`)
      .set("Authorization", `Bearer ${idToken}`);

    expect(res.status).toBe(403);
    expect(res.body.message).toMatch(/only delete your own comments/i);
  });
});

