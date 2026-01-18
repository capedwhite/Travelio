import { challenge } from "../Model/ChallengeModel.js";

export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await challenge.findAll();
    console.log(challenges);
    res.status(200).send({
      data: challenges,
      message: "Successfully fetched all challenges"
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

