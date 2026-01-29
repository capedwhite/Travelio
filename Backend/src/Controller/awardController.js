import Award from "../Model/awardModel.js";
import { challenge } from "../Model/ChallengeModel.js";




export const getUserAwards = async (req, res) => {
    console.log("fetching user api hitting")
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
console.log(awards)
    res.status(200).json({
      success: true,
      message: "Awards fetched successfully",
      data: awards,
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
    