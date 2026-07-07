const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
    },
    hackathonName: {
      type: String,
      required: true,
    },
    teamLeader: {
      type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
    },
    requiredSkills: [
      {
        type: String,
      },
    ],
    maxMembers: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    members: [
      {
       type: mongoose.Schema.Types.ObjectId,
    ref: "User",
      },
    ],
    
    joinRequests: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "Pending",
    },
    matchPercentage: {
      type: Number,
      default: 0,
    },
  },
],

    status: {
      type: String,
      default: "Recruiting",
    },

    progress: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);