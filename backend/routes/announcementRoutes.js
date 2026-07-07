const express = require("express");
const router = express.Router();
const Announcement = require("../models/Announcement");

// GET ALL ANNOUNCEMENTS
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({
      createdAt: -1,
    });

    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD ANNOUNCEMENT
router.post("/add", async (req, res) => {
  try {
    const { message } = req.body;

    const announcement = await Announcement.create({
      message,
    });

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE ANNOUNCEMENT
router.delete("/:id", async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;