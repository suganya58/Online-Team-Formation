const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const Team = require("../models/Team");
const User = require("../models/User");

const router = express.Router();

// Helper to check valid Mongo ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Helper function to verify if a user belongs to a team (as leader or member)
 */
function isUserInTeam(team, userId) {
  if (!team || !userId) return false;
  const strUser = userId.toString();

  const leaderId = (team.teamLeader?._id || team.teamLeader)?.toString();
  if (leaderId === strUser) return true;

  const isMember = (team.members || []).some(
    (m) => (m._id?.toString() || m.toString()) === strUser
  );

  return isMember;
}

/* ===========================
   CREATE TASK
=========================== */
router.post("/", async (req, res) => {
  try {
    const { title, description, assignedTo, teamId, userId, status } = req.body;

    if (!title || !assignedTo || !teamId || !userId) {
      return res.status(400).json({
        message: "Title, assignedTo, teamId, and userId are required fields.",
      });
    }

    if (!isValidObjectId(teamId) || !isValidObjectId(userId) || !isValidObjectId(assignedTo)) {
      return res.status(400).json({ message: "Invalid ID format in task payload." });
    }

    // Validate status enum
    const validStatuses = ["To Do", "In Progress", "Completed"];
    const taskStatus = status && validStatuses.includes(status) ? status : "To Do";

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid task status. Must be 'To Do', 'In Progress', or 'Completed'." });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // Verify creator belongs to the team
    if (!isUserInTeam(team, userId)) {
      return res.status(403).json({
        message: "Access Denied: You must be a team member to create tasks.",
      });
    }

    // Verify assigned user belongs to the team
    if (!isUserInTeam(team, assignedTo)) {
      return res.status(400).json({
        message: "Invalid Assignee: The assigned user must belong to this team.",
      });
    }

    let newTask = await Task.create({
      title: title.trim(),
      description: description || "",
      assignedTo,
      team: teamId,
      status: taskStatus,
      createdBy: userId,
    });

    newTask = await Task.findById(newTask._id)
      .populate("assignedTo", "fullName email college department skills")
      .populate("createdBy", "fullName email");

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   GET TASKS FOR A TEAM
=========================== */
router.get("/team/:teamId", async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.query.userId || req.headers["x-user-id"];

    if (!isValidObjectId(teamId)) {
      return res.status(400).json({ message: "Invalid Team ID format." });
    }

    if (userId && !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid User ID format." });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // If userId provided, verify team authorization
    if (userId && !isUserInTeam(team, userId)) {
      return res.status(403).json({
        message: "Access Denied: You must be a member of this team to view tasks.",
      });
    }

    const tasks = await Task.find({ team: teamId })
      .populate("assignedTo", "fullName email college department skills")
      .populate("createdBy", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   UPDATE TASK STATUS / DETAILS
=========================== */
router.put("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId, status, title, description, assignedTo } = req.body;

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID format." });
    }

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid User ID is required." });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const team = await Team.findById(task.team);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // Verify caller belongs to team
    if (!isUserInTeam(team, userId)) {
      return res.status(403).json({
        message: "Access Denied: You must be a team member to update tasks.",
      });
    }

    // Validate status if updated
    if (status) {
      const validStatuses = ["To Do", "In Progress", "Completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status. Must be 'To Do', 'In Progress', or 'Completed'.",
        });
      }
      task.status = status;
    }

    // Validate assignedTo if updated
    if (assignedTo) {
      if (!isValidObjectId(assignedTo)) {
        return res.status(400).json({ message: "Invalid Assignee ID format." });
      }
      if (!isUserInTeam(team, assignedTo)) {
        return res.status(400).json({
          message: "Invalid Assignee: The assigned user must belong to this team.",
        });
      }
      task.assignedTo = assignedTo;
    }

    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "fullName email college department skills")
      .populate("createdBy", "fullName email");

    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ===========================
   DELETE TASK
=========================== */
router.delete("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.body.userId || req.query.userId || req.headers["x-user-id"];

    if (!isValidObjectId(taskId)) {
      return res.status(400).json({ message: "Invalid Task ID format." });
    }

    if (!userId || !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Valid User ID is required to delete task." });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const team = await Team.findById(task.team);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    // Verify caller belongs to team
    if (!isUserInTeam(team, userId)) {
      return res.status(403).json({
        message: "Access Denied: You must be a team member to delete tasks.",
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
