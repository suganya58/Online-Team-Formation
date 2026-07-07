const mongoose = require("mongoose");

const trendingTopicSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "TrendingTopic",
  trendingTopicSchema
);