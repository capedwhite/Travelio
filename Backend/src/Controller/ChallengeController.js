import { Sequelize } from "sequelize";
import { challenge } from "../Model/ChallengeModel.js";
import { Submission } from "../Model/submissionModel.js";
import { User } from "../Model/userModel.js";


export const createChallenge = async (req, res) => {
  try {
    const {
      challengeName,
      submissionDeadline,
      description,
      award,
      awardDetail,
    } = req.body;

    if (
      !challengeName ||
      !submissionDeadline ||
      !description ||
      !award ||
      !awardDetail
    ) {
      return res
        .status(400)
        .send({ message: "All fields are required for creating a challenge" });
    }

    const newChallenge = await challenge.create({
      challengeName,
      submissionDeadline,
      description,
      award,
      awardDetail,
    });

    res.status(201).send({
      data: newChallenge,
      message: "Challenge created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};


export const submitChallenge = async (req, res) => {
  try {
    const userId = req.user?.id;
    const challengeId=req.params.id;
    const {caption} = req.body;

    if (!userId) {
      return res.status(401).send({ message: "User not authenticated" });
    }

    if (!challengeId) {
      return res.status(400).send({ message: "challengeId is required" });
    }

    const existingChallenge = await challenge.findByPk(challengeId);
    if (!existingChallenge) {
      return res.status(404).send({ message: "Challenge not found" });
    }
    const existingSubmission = await Submission.findOne({
      where: {
        challengeId,
        userId
      }
    });
    if(existingSubmission){
      return res.status(400).send({message:"You have already submitted your challenge"})
    }
    let imagePaths = [];

    if (req.file) {
      imagePaths.push(req.file.path.replace(/\\/g, "/"));
    } 
    else if (Array.isArray(req.files)) {
      imagePaths = req.files.map(file =>
        file.path.replace(/\\/g, "/")
      );
    }

    const submission = await Submission.create({
      challengeId,
      userId,
      caption: caption || null,
      images: imagePaths,
    });

    return res
      .status(201)
      .send({ data: submission, message: "Challenge submitted successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send({ message: error.message });
  }
};


export const getAllChallenges = async (req, res) => {
  console.log("get all challenges api hitting");

  try {
    const userId = req.user?.id;

    const challenges = await challenge.findAll({
      include: [
        {
          model: Submission,
          required: false, 
        },
      ],
    });


    const formattedChallenges = challenges.map((ch) => {
      const hasSubmitted = userId
        ? ch.submissions?.some(
            (sub) => sub.userId === userId
          )
        : false;

      return {
        ...ch.toJSON(),
        hasSubmitted,
      };
    });

    res.status(200).send({
      data: formattedChallenges,
      message: "Successfully fetched challenges",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};


export const getTopChallengeUsers = async (req, res) => {
  try {
    const topUsers = await User.findAll({
      include: [
        {
          model: Submission,
          as: "submissions",
          attributes: [],
        },
      ],
      attributes: [
        "id",
        "username",
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.col("submissions.submissionId")
          ),
          "submissionCount",
        ],
      ],
      group: ["users.id"],
      order: [
        [
          Sequelize.fn(
            "COUNT",
            Sequelize.col("submissions.submissionId")
          ),
          "DESC",
        ],
      ],
      limit: 10,
      subQuery: false,
    });

    res.status(200).json({
      data: topUsers,
      message: "Global leaderboard fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get challenge by ID with all submissions and user details
export const getChallengeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const challengeData = await challenge.findByPk(id, {
      include: [
        {
          model: Submission,
          required: false,
          include: [
            {
              model: User,
              attributes: ["id", "username", "email"],
            },
          ],
        },
      ],
    });

    if (!challengeData) {
      return res.status(404).send({ message: "Challenge not found" });
    }

    // Find current user's submission
    const currentUserSubmission = userId
      ? challengeData.submissions?.find((sub) => sub.userId === userId)
      : null;

    // Find winner's submission if result is published
    const winnerSubmission =
      challengeData.result === "published" && challengeData.winnerId
        ? challengeData.submissions?.find(
            (sub) => sub.userId === challengeData.winnerId
          )
        : null;

    const response = {
      ...challengeData.toJSON(),
      currentUserSubmission: currentUserSubmission || null,
      winnerSubmission: winnerSubmission || null,
    };

    res.status(200).send({
      data: response,
      message: "Challenge fetched successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

// Update challenge
export const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      challengeName,
      submissionDeadline,
      description,
      award,
      awardDetail,
      result,
      winnerId,
    } = req.body;

    const challengeData = await challenge.findByPk(id);
    if (!challengeData) {
      return res.status(404).send({ message: "Challenge not found" });
    }

    if (challengeName) challengeData.challengeName = challengeName;
    if (submissionDeadline) challengeData.submissionDeadline = submissionDeadline;
    if (description) challengeData.description = description;
    if (award) challengeData.award = award;
    if (awardDetail) challengeData.awardDetail = awardDetail;
    if (result) challengeData.result = result;
    if (winnerId !== undefined) challengeData.winnerId = winnerId;

    await challengeData.save();

    res.status(200).send({
      data: challengeData,
      message: "Challenge updated successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

export const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;

    const challengeData = await challenge.findByPk(id);
    if (!challengeData) {
      return res.status(404).send({ message: "Challenge not found" });
    }

    // Check if challenge has submissions
    const submissionCount = await Submission.count({
      where: { challengeId: id },
    });

    if (submissionCount > 0) {
      return res.status(400).send({
        message: `Cannot delete challenge with ${submissionCount} submission(s). Please remove submissions first.`,
      });
    }

    await challengeData.destroy();

    res.status(200).send({
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};






