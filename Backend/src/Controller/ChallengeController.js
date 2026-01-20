import { challenge } from "../Model/ChallengeModel.js";
import { Submission } from "../Model/submissionModel.js";

// Create a new challenge
export const createChallenge = async (req, res) => {
  try {
    const {
      challengeName,
      submissionDeadline,
      description,
      award,
      awardDetail,
    } = req.body;

  //Basic challenge validation
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




export const getAllChallenges = async (req, res) => {
  console.log("get all challenges api hitting")
  try {
    const challengesWithSubmissions = await challenge.findAll({
      include: [
        {
          model: Submission,
        },
      ],
    });

    res.status(200).send({
      data: challengesWithSubmissions,
      message: "Successfully fetched challenges with submissions",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};





