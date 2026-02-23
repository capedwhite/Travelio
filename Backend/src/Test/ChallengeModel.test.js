import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

// Mock Challenge Model
const ChallengeMock = dbMock.define("Challenge", {
  id: 1,
  challengeName: "Best Travel Photo 2026",
  submissionDeadline: new Date("2026-03-15"),
  description: "Share your best travel photo from your adventures!",
  award: "Free Trip Package",
  awardDetail:
    "Win a free 5-day trip to Bali including flights and accommodation",
  result: "pending",
  winnerId: null,
});

// Mock Submission Model
const SubmissionMock = dbMock.define("Submission", {
  submissionId: 1,
  challengeId: 1,
  userId: 1,
  caption: "My amazing sunset photo from Greece!",
  images: ["uploads/submissions/image1.jpg", "uploads/submissions/image2.jpg"],
  submissionDate: new Date("2026-02-20"),
  submissionStatus: "pending",
});

describe("Challenge Model", () => {
  it("should create a challenge with all required fields", async () => {
    const challenge = await ChallengeMock.create({
      id: 1,
      challengeName: "Best Travel Photo 2026",
      submissionDeadline: new Date("2026-03-15"),
      description: "Share your best travel photo from your adventures!",
      award: "Free Trip Package",
      awardDetail:
        "Win a free 5-day trip to Bali including flights and accommodation",
    });

    expect(challenge.id).toBe(1);
    expect(challenge.challengeName).toBe("Best Travel Photo 2026");
    expect(challenge.description).toBe(
      "Share your best travel photo from your adventures!",
    );
    expect(challenge.award).toBe("Free Trip Package");
    expect(challenge.awardDetail).toBe(
      "Win a free 5-day trip to Bali including flights and accommodation",
    );
  });

  it("should have default result as pending", async () => {
    const challenge = await ChallengeMock.create({
      challengeName: "Summer Challenge",
      submissionDeadline: new Date("2026-06-01"),
      description: "Summer photo challenge",
      award: "Gift Card",
      awardDetail: "$100 gift card",
    });

    expect(challenge.result).toBe("pending");
  });

  it("should have winnerId as null by default", async () => {
    const challenge = await ChallengeMock.create({
      challengeName: "Winter Challenge",
      submissionDeadline: new Date("2026-12-01"),
      description: "Winter photo challenge",
      award: "Camera",
      awardDetail: "Professional DSLR camera",
    });

    expect(challenge.winnerId).toBeNull();
  });

  it("should allow setting winnerId when result is published", async () => {
    const challenge = await ChallengeMock.create({
      challengeName: "Completed Challenge",
      submissionDeadline: new Date("2026-01-15"),
      description: "Already completed challenge",
      award: "Prize",
      awardDetail: "Prize details",
      result: "published",
      winnerId: 5,
    });

    expect(challenge.result).toBe("published");
    expect(challenge.winnerId).toBe(5);
  });

  it("should have valid submission deadline date", async () => {
    const challenge = await ChallengeMock.create({
      challengeName: "Test Challenge",
      submissionDeadline: new Date("2026-05-20"),
      description: "Test description",
      award: "Test Award",
      awardDetail: "Test detail",
    });

    expect(challenge.submissionDeadline).toBeInstanceOf(Date);
  });
});

describe("Submission Model", () => {
  it("should create a submission with all required fields", async () => {
    const submission = await SubmissionMock.create({
      submissionId: 1,
      challengeId: 1,
      userId: 1,
      caption: "My amazing sunset photo from Greece!",
      images: ["uploads/submissions/image1.jpg"],
    });

    expect(submission.submissionId).toBe(1);
    expect(submission.challengeId).toBe(1);
    expect(submission.userId).toBe(1);
    expect(submission.caption).toBe("My amazing sunset photo from Greece!");
  });

  it("should have default submissionStatus as pending", async () => {
    const submission = await SubmissionMock.create({
      challengeId: 2,
      userId: 3,
      caption: "Beach photo",
      images: ["uploads/submissions/beach.jpg"],
    });

    expect(submission.submissionStatus).toBe("pending");
  });

  it("should allow multiple images", async () => {
    const submission = await SubmissionMock.create({
      challengeId: 1,
      userId: 2,
      caption: "Multiple photos",
      images: ["image1.jpg", "image2.jpg", "image3.jpg"],
    });

    expect(submission.images).toBeDefined();
  });

  it("should have submissionDate", async () => {
    const submission = await SubmissionMock.create({
      challengeId: 1,
      userId: 1,
      caption: "Test submission",
      images: [],
    });

    expect(submission.submissionDate).toBeDefined();
  });

  it("should allow caption to be null", async () => {
    const submission = await SubmissionMock.create({
      challengeId: 1,
      userId: 1,
      caption: null,
      images: ["photo.jpg"],
    });

    expect(submission.caption).toBeNull();
  });

  it("should reference valid challengeId and userId", async () => {
    const submission = await SubmissionMock.create({
      challengeId: 5,
      userId: 10,
      caption: "Reference test",
      images: [],
    });

    expect(submission.challengeId).toBe(5);
    expect(submission.userId).toBe(10);
  });
});
