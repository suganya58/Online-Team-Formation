const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    college: {
      type: String,
    },

    department: {
      type: String,
    },

    year: {
      type: String,
    },
    github: {
      type: String,
    },
about: {
  type: String,
  default: "",
},


skills: {
  type: [String],
  default: [],
},
    linkedin: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
  
);

module.exports = mongoose.model("User", userSchema);