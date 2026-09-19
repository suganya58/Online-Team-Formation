const express = require("express");
const mongoose = require("mongoose");
const Team = require("../models/Team");
<<<<<<< HEAD
const User = require("../models/User");
const { matchSkills } = require("../services/skillMatcher");

const router = express.Router();

// Helper to check valid Mongo ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ===========================
   CREATE TEAM
=========================== */
=======
const router = express.Router();

 
   //CREATE TEAM

>>>>>>> 90fb055 (Prepare frontend for deployment)
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

    if (!teamName || !hackathonName || !teamLeader) {
      return res.status(400).json({ message: "Team name, hackathon name, and team leader are required." });
    }

    if (!isValidObjectId(teamLeader)) {
      return res.status(400).json({ message: "Invalid Team Leader User ID format." });
    }

    const leaderUser = await User.findById(teamLeader);
    if (!leaderUser) {
      return res.status(404).json({ message: "Team leader user not found." });
    }

    const maxM = Number(maxMembers);
    if (isNaN(maxM) || maxM < 1) {
      return res.status(400).json({ message: "Maximum members must be a number at least 1" });
    }

    const team = await Team.create({
      teamName: teamName.trim(),
      hackathonName: hackathonName.trim(),
      teamLeader,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      maxMembers: maxM,
      description: description || "",
      members: [teamLeader],
      joinRequests: [],
      status: status || "Recruiting",
      progress: Math.round((1 / maxM) * 100),
    });

    res.status(201).json({
      message: "Team created successfully",
      team,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


  // GET ALL TEAMS

router.get("/", async (req, res) => {
  try {
    const teams = await Team.find()
<<<<<<< HEAD
      .populate("teamLeader", "fullName email college department github linkedin")
      .populate("members", "fullName email college department year skills github linkedin about")
      .populate("joinRequests.user", "fullName email college department year skills github linkedin about");
=======
      .populate(
        "teamLeader",
        "fullName email college department github linkedin skills"
      )
      .populate(
        "members",
        "fullName email college department github linkedin skills"
      )
      .populate(
        "joinRequests.user",
        "fullName email college department github linkedin skills year about"
      );
>>>>>>> 90fb055 (Prepare frontend for deployment)

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

<<<<<<< HEAD
/* ===========================
   GET AI TEAM RECOMMENDATIONS
=========================== */
router.get("/recommendations/:userId", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.userId)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allTeams = await Team.find()
      .populate("teamLeader", "fullName email college department github linkedin")
      .populate("members", "fullName email college department year skills github linkedin about")
      .populate("joinRequests.user", "fullName email college department year skills github linkedin about");

    const recommendedTeams = allTeams
      .filter((team) => {
        const leaderId = (team.teamLeader?._id || team.teamLeader)?.toString();
        const isLeader = leaderId === req.params.userId.toString();
        const isMember = (team.members || []).some(
          (m) => (m._id?.toString() || m.toString()) === req.params.userId.toString()
        );
        const isFull = (team.members?.length || 0) >= (team.maxMembers || 0) || team.status === "Closed";

        return !isLeader && !isMember && !isFull;
      })
      .map((team) => {
        const teamObj = team.toObject();
        const matchResult = matchSkills(user.skills, team.requiredSkills);

        let matchCategory = "Low Match";
        if (matchResult.matchPercentage >= 80) {
          matchCategory = "Excellent Match";
        } else if (matchResult.matchPercentage >= 60) {
          matchCategory = "Good Match";
        } else if (matchResult.matchPercentage >= 40) {
          matchCategory = "Moderate Match";
        }

        return {
          ...teamObj,
          matchScore: matchResult.matchPercentage,
          matchPercentage: matchResult.matchPercentage,
          matchCategory,
          matchedSkills: matchResult.matchedSkills,
          missingSkills: matchResult.missingSkills,
        };
      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json(recommendedTeams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   EDIT TEAM
=========================== */
router.put("/edit/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Team ID format." });
    }

    const {
      userId,
      teamName,
      hackathonName,
      description,
      requiredSkills,
      maxMembers,
      status,
    } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid User ID is required." });
    }
=======

   //JOIN TEAM REQUEST

router.put("/join/:id", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { userId, matchPercentage } = req.body;
>>>>>>> 90fb055 (Prepare frontend for deployment)

    console.log("User ID:", userId);
    console.log("Match:", matchPercentage);

    const team = await Team.findById(req.params.id);

    console.log("Team:", team);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

<<<<<<< HEAD
    const leaderId = (team.teamLeader?._id || team.teamLeader).toString();
    if (leaderId !== userId.toString()) {
      return res.status(403).json({ message: "Only the team leader can edit this team" });
    }

    const newMaxMembers = Number(maxMembers);
    if (isNaN(newMaxMembers) || newMaxMembers < 1) {
      return res.status(400).json({ message: "Maximum members must be at least 1" });
    }

    if (newMaxMembers < team.members.length) {
=======


    if (team.teamLeader.toString() === userId) {
  return res.status(400).json({
    message: "You are already the Team Leader."
  });
}
    // Already a member
    if (
      team.members.some(
        (member) => member.toString() === userId
      )
    ) {
>>>>>>> 90fb055 (Prepare frontend for deployment)
      return res.status(400).json({
        message: `Maximum members cannot be less than current member count (${team.members.length})`,
      });
    }

    team.teamName = teamName ? teamName.trim() : team.teamName;
    team.hackathonName = hackathonName ? hackathonName.trim() : team.hackathonName;
    team.description = description !== undefined ? description : team.description;
    team.requiredSkills = Array.isArray(requiredSkills) ? requiredSkills : team.requiredSkills;
    team.maxMembers = newMaxMembers;
    team.status = status || team.status;

    team.progress = Math.round((team.members.length / newMaxMembers) * 100);

    if (team.members.length >= newMaxMembers) {
      team.status = "Closed";
    }

    await team.save();

    res.status(200).json({
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   DELETE TEAM
=========================== */
router.delete("/delete/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Team ID format." });
    }

    const userId = req.body.userId || req.query.userId || req.headers["x-user-id"];

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid User ID is required." });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const leaderId = (team.teamLeader?._id || team.teamLeader).toString();
    if (leaderId !== userId.toString()) {
      return res.status(403).json({ message: "Only the team leader can delete this team" });
    }

    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   JOIN TEAM REQUEST (AI Skill Matched)
=========================== */
router.put("/join/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Team ID format." });
    }

    const { userId } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid User ID is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const leaderId = (team.teamLeader?._id || team.teamLeader).toString();
    if (leaderId === userId.toString()) {
      return res.status(400).json({ message: "You are the team leader of this team" });
    }

    if ((team.members || []).some((m) => (m._id || m).toString() === userId.toString())) {
      return res.status(400).json({ message: "Already a member of this team" });
    }

    if (team.members.length >= team.maxMembers || team.status === "Closed") {
      return res.status(400).json({ message: "This team is already full or closed for recruitment" });
    }

    const alreadyRequested = team.joinRequests.find(
      (request) => (request.user?._id || request.user).toString() === userId.toString()
    );

    if (alreadyRequested) {
      return res.status(400).json({ message: "Join request already sent" });
    }

    // Backend AI skill matching (never trust req.body.matchPercentage)
    const matchResult = matchSkills(user.skills, team.requiredSkills);

    team.joinRequests.push({
      user: userId,
      status: "Pending",
      matchPercentage: matchResult.matchPercentage,
    });

    await team.save();

    res.status(200).json({
      message: "Join request sent successfully",
      matchPercentage: matchResult.matchPercentage,
      team,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


   //APPROVE REQUEST

router.put("/approve/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Team ID format." });
    }

    const { userId, leaderId } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid User ID is required." });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const actualLeaderId = (team.teamLeader?._id || team.teamLeader).toString();

    if (leaderId && actualLeaderId !== leaderId.toString()) {
      return res.status(403).json({ message: "Only the team leader can approve join requests" });
    }

    const hasRequest = team.joinRequests.some(
      (reqObj) => (reqObj.user?._id || reqObj.user).toString() === userId.toString()
    );

    if (!hasRequest) {
      return res.status(400).json({ message: "No join request found for this user" });
    }

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ message: "Team has reached maximum capacity" });
    }

<<<<<<< HEAD
    team.joinRequests = team.joinRequests.filter(
      (request) => (request.user?._id || request.user).toString() !== userId.toString()
    );

    if (!team.members.some((m) => (m._id || m).toString() === userId.toString())) {
      team.members.push(userId);
    }

    team.progress = Math.round((team.members.length / team.maxMembers) * 100);

    if (team.members.length >= team.maxMembers) {
      team.status = "Closed";
    }
=======
    // Already a member
    const alreadyMember = team.members.some(
      (member) => member.toString() === userId
    );

    if (!alreadyMember) {
      team.members.push(userId);
    }

    // Remove join request
    team.joinRequests = team.joinRequests.filter((request) => {
      const requestUserId = request.user._id
        ? request.user._id.toString()
        : request.user.toString();

      return requestUserId !== userId;
    });

    // Update progress
    team.progress = Math.round(
      (team.members.length / team.maxMembers) * 100
    );
>>>>>>> 90fb055 (Prepare frontend for deployment)

    await team.save();

    res.status(200).json({
      message: "Member approved successfully",
      team,
    });

  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ message: error.message });
=======
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
>>>>>>> 90fb055 (Prepare frontend for deployment)
  }
});


  // DELETE TEAM

router.delete("/delete/:id", async (req, res) => {
  try {
    const { userId } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    // Only Team Leader can delete
    if (team.teamLeader.toString() !== userId) {
      return res.status(403).json({
        message: "Only Team Leader can delete the team",
      });
    }

    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Team deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// REJECT JOIN REQUEST

router.put("/reject/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Team ID format." });
    }

    const { userId, leaderId } = req.body;

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid User ID is required." });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const actualLeaderId = (team.teamLeader?._id || team.teamLeader).toString();

    if (leaderId && actualLeaderId !== leaderId.toString()) {
      return res.status(403).json({ message: "Only the team leader can reject join requests" });
    }

    team.joinRequests = team.joinRequests.filter(
      (request) => (request.user?._id || request.user).toString() !== userId.toString()
    );

    await team.save();

    res.status(200).json({
      message: "Join request rejected successfully",
      team,
    });

  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   TRANSFER LEADERSHIP
=========================== */
router.put("/transfer-leader/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid Team ID format." });
    }

    const { userId, newLeaderId } = req.body;

    if (!userId || !isValidObjectId(userId) || !newLeaderId || !isValidObjectId(newLeaderId)) {
      return res.status(400).json({ message: "Valid User ID and New Leader ID are required." });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const actualLeaderId = (team.teamLeader?._id || team.teamLeader).toString();
    if (actualLeaderId !== userId.toString()) {
      return res.status(403).json({ message: "Only the team leader can transfer leadership" });
    }

    const isMember = team.members.some((m) => (m._id || m).toString() === newLeaderId.toString());
    if (!isMember) {
      return res.status(400).json({ message: "New leader must be an existing team member" });
    }

    team.teamLeader = newLeaderId;
    await team.save();

    res.status(200).json({
      message: "Team leader updated successfully",
      team,
=======
    console.log("Reject Request Error:", error);

    res.status(500).json({
      message: error.message,
>>>>>>> 90fb055 (Prepare frontend for deployment)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


   //EDIT TEAM

router.put("/edit/:id", async (req, res) => {
  try {
    const {
      userId,
      teamName,
      hackathonName,
      description,
      requiredSkills,
      maxMembers,
      status,
    } = req.body;

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    // Only the current Team Leader can edit the team
    if (team.teamLeader.toString() !== userId) {
      return res.status(403).json({
        message: "Only Team Leader can edit this team",
      });
    }

    // Maximum members cannot be lower than current member count
    if (Number(maxMembers) < team.members.length) {
      return res.status(400).json({
        message: `Maximum members cannot be less than ${team.members.length}`,
      });
    }

    // Update team details
    team.teamName = teamName;
    team.hackathonName = hackathonName;
    team.description = description;
    team.requiredSkills = requiredSkills;
    team.maxMembers = Number(maxMembers);
    team.status = status;

    // Recalculate progress
    team.progress = Math.round(
      (team.members.length / team.maxMembers) * 100
    );

    await team.save();

    res.status(200).json({
      message: "Team updated successfully",
      team,
    });
  } catch (error) {
    console.log("Edit Team Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
