const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema(
  {
    title: String,
    organizer: String,
    date: String,
    mode: String,
    participants: String,
    tags: [String],
    prize: String,
    daysLeft: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hackathon", hackathonSchema);