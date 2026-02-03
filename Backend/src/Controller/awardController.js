import Award from "../Model/awardModel.js";
import { challenge } from "../Model/ChallengeModel.js";
import { Submission } from "../Model/submissionModel.js";

export const getUserAwards = async (req, res) => {
  console.log("fetching user api hitting");
  try {
    const userId = req.user.id;

    const awards = await Award.findAll({
      where: { userId },
      include: [
        {
          model: challenge,
          attributes: ["id", "challengeName"],
        },
      ],
      order: [["awardedAt", "DESC"]],
    });

    // Fetch submission images for each award
    const awardsWithSubmissions = await Promise.all(
      awards.map(async (award) => {
        const awardData = award.toJSON();

        // Find the user's submission for this challenge
        const submission = await Submission.findOne({
          where: {
            challengeId: award.challengeId,
            userId: userId,
          },
          attributes: ["images", "caption"],
        });

        awardData.submission = submission ? submission.toJSON() : null;
        return awardData;
      }),
    );

    console.log(awardsWithSubmissions);
    res.status(200).json({
      success: true,
      message: "Awards fetched successfully",
      data: awardsWithSubmissions,
    });
  } catch (error) {
    console.error("Error fetching awards:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch awards",
    });
  }
};
export const awardChallengeWinner = async (req, res) => {
  try {
    const { challengeId, winnerId } = req.body;

    const challenge = await challenge.findByPk(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    const award = await Award.create({
      userId: winnerId,
      challengeId,
      challengeTitle: challenge.challengeName,
      awardWon: challenge.award,
      awardDescription: challenge.awardDetail,
    });

    res.status(201).json({
      success: true,
      message: "Award given successfully",
      data: award,
    });
  } catch (error) {
    console.error("Error awarding challenge winner:", error);
    res.status(500).json({
      success: false,
      message: "Failed to award challenge winner",
    });
  }
};
export const markAwardAsUsed = async (req, res) => {
  try {
    const { awardId } = req.params;
    const userId = req.user.id;

    const award = await Award.findOne({
      where: {
        id: awardId,
        userId,
      },
    });

    if (!award) {
      return res.status(404).json({
        success: false,
        message: "Award not found",
      });
    }

    if (award.isUsed) {
      return res.status(400).json({
        success: false,
        message: "Award already used",
      });
    }

    await award.update({
      isUsed: true,
      usedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Award marked as used",
      data: award,
    });
  } catch (error) {
    console.error("Error marking award as used:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark award as used",
    });
  }
};
