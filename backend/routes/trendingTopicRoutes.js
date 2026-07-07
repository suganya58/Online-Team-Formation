const express = require("express");
const router = express.Router();
const TrendingTopic = require("../models/TrendingTopic");


// GET ALL TOPICS
router.get("/", async (req, res) => {
  try {
    const topics = await TrendingTopic.find();

    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD TOPIC
router.post("/add", async (req, res) => {
  try {
    const { topic } = req.body;

    const newTopic = await TrendingTopic.create({
      topic,
    });

    res.status(201).json(newTopic);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE TOPIC
router.delete("/:id", async (req, res) => {
  try {
    await TrendingTopic.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Topic deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;