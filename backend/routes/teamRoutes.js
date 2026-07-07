const express = require("express");
const Team = require("../models/Team");

const router = express.Router();

/* ===========================
   CREATE TEAM
=========================== */
router.post("/create", async (req, res) => {
  try {
    const {
      teamName,
      hackathonName,
      teamLeader,
      requiredSkills,
      maxMembers,
      description,
      status,
    } = req.body;

    const team = await Team.create({
      teamName,
      hackathonName,
      teamLeader, // Logged-in user becomes leader
      requiredSkills,
      maxMembers,
      description,

      // Leader is automatically added as first member
      members: [teamLeader],

      joinRequests: [],

      status: status || "Recruiting",

      progress: Math.round((1 / maxMembers) * 100),
    });

    res.status(201).json({
      message: "Team created successfully",
      team,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/* ===========================
   GET ALL TEAMS
=========================== */
router.get("/", async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("teamLeader", "fullName email college department github linkedin")
      .populate("members", "fullName email");

    res.status(200).json(teams);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ===========================
   JOIN TEAM REQUEST
=========================== */
router.put("/join/:id", async (req, res) => {
  try {
    const { userId, matchPercentage } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    // Already a member
    if (
      team.members.some(
        (member) => member.toString() === userId
      )
    ) {
      return res.status(400).json({
        message: "Already a member of this team",
      });
    }

    // Already requested
    const alreadyRequested = team.joinRequests.find(
      (request) => request.user.toString() === userId
    );

    if (alreadyRequested) {
      return res.status(400).json({
        message: "Join request already sent",
      });
    }

    team.joinRequests.push({
      user: userId,
      status: "Pending",
      matchPercentage,
    });

    await team.save();

    res.status(200).json({
      message: "Join request sent successfully",
      team,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ===========================
   APPROVE REQUEST
=========================== */
router.put("/approve/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    team.joinRequests = team.joinRequests.filter(
      (request) => request.user.toString() !== userId
    );

    team.members.push(userId);

    team.progress = Math.round(
      (team.members.length / team.maxMembers) * 100
    );

    await team.save();

    res.status(200).json({
      message: "Member approved successfully",
      team,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

/* ===========================
   REJECT REQUEST
=========================== */
router.put("/reject/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    team.joinRequests = team.joinRequests.filter(
      (request) => request.user.toString() !== userId
    );

    await team.save();

    res.status(200).json({
      message: "Request rejected successfully",
      team,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;