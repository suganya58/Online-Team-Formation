const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Team = require("../models/Team");
const Task = require("../models/Task");

const router = express.Router();

// Helper to check valid Mongo ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/* ===========================
   REGISTER API
=========================== */
router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      college,
      department,
      year,
      skills,
      github,
      linkedin,
      about,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required fields.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    let parsedSkills = [];
    if (typeof skills === "string") {
      parsedSkills = skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    } else if (Array.isArray(skills)) {
      parsedSkills = skills.map((s) => (typeof s === "string" ? s.trim() : s)).filter(Boolean);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
      college: college || "",
      department: department || "",
      year: year || "",
      skills: parsedSkills,
      github: github || "",
      linkedin: linkedin || "",
      about: about || "",
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      message: "Registration successful! Please login.",
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   LOGIN API (User & Admin Modes)
=========================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password, loginType } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = (await bcrypt.compare(password, user.password)) || user.password === password;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (loginType === "admin") {
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Admin access denied." });
      }
    } else if (loginType === "user") {
      if (user.role === "admin") {
        return res.status(400).json({ message: "Please use Admin Login for administrator access." });
      }
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({
      message: user.role === "admin" ? "Admin login successful" : "Login successful",
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   GET USER PROFILE WITH REAL STATS & ACHIEVEMENTS
=========================== */
router.get("/profile/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    const profileUserId = req.params.id;
    const user = await User.findById(profileUserId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Calculate Real Teams Count
    const userTeams = await Team.find({
      $or: [{ teamLeader: profileUserId }, { members: profileUserId }],
    });
    const teamsCount = userTeams.length;

    // 2. Calculate Created Teams Count
    const createdTeamsCount = userTeams.filter(
      (t) => (t.teamLeader?._id || t.teamLeader)?.toString() === profileUserId.toString()
    ).length;

    // 3. Calculate Distinct Hackathons Count
    const uniqueHackathons = new Set(
      userTeams
        .map((t) => t.hackathonName)
        .filter((name) => name && name.trim().length > 0)
    );
    const hackathonsCount = uniqueHackathons.size;

    // 4. Calculate Real Projects Count
    const projectsCount = teamsCount;

    // 5. Calculate Real Completed Tasks Count
    const completedTasksCount = await Task.countDocuments({
      assignedTo: profileUserId,
      status: "Completed",
    });

    // 6. Dynamically Evaluate Earned Achievements Based on Verified Data Rules
    const achievements = [];

    if (teamsCount >= 1) {
      achievements.push({
        id: "first_team",
        title: "First Team",
        description: "Joined your first hackathon team",
        icon: "🏆",
      });
    }

    if (createdTeamsCount >= 1) {
      achievements.push({
        id: "team_builder",
        title: "Team Builder",
        description: `Created and led ${createdTeamsCount} hackathon team${createdTeamsCount > 1 ? "s" : ""}`,
        icon: "👑",
      });
    }

    if (teamsCount >= 2) {
      achievements.push({
        id: "active_collaborator",
        title: "Active Collaborator",
        description: `Participated in ${teamsCount} different teams`,
        icon: "🤝",
      });
    }

    if (hackathonsCount >= 1) {
      achievements.push({
        id: "hackathon_participant",
        title: "Hackathon Participant",
        description: `Participated in ${hackathonsCount} hackathon event${hackathonsCount > 1 ? "s" : ""}`,
        icon: "⚡",
      });
    }

    if (projectsCount >= 1) {
      achievements.push({
        id: "project_contributor",
        title: "Project Contributor",
        description: "Contributed to hackathon project development",
        icon: "🚀",
      });
    }

    if (completedTasksCount >= 1) {
      achievements.push({
        id: "task_finisher",
        title: "Task Finisher",
        description: `Completed ${completedTasksCount} workspace task${completedTasksCount > 1 ? "s" : ""}`,
        icon: "✅",
      });
    }

    const userObj = user.toObject();

    res.status(200).json({
      ...userObj,
      user: userObj,
      statistics: {
        hackathons: hackathonsCount,
        teams: teamsCount,
        projects: projectsCount,
        completedTasks: completedTasksCount,
      },
      achievements,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   UPDATE USER PROFILE
=========================== */
router.put("/profile/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    const updateData = { ...req.body };
    delete updateData.password;
    delete updateData.role;

    if (typeof updateData.skills === "string") {
      updateData.skills = updateData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObj = updatedUser.toObject();

    res.status(200).json({
      ...userObj,
      user: userObj,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;