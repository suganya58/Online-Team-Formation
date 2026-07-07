const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Team = require("../models/Team");
const Hackathon = require("../models/Hackathon");

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTeams = await Team.countDocuments();
    const totalHackathons = await Hackathon.countDocuments();
    const activeTeams = await Team.countDocuments({
      status: "Recruiting",
    });

    res.status(200).json({
      totalUsers,
      totalTeams,
      totalHackathons,
      activeTeams,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;