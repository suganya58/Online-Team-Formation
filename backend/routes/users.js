const express = require("express");
const User = require("../models/User");

const router = express.Router();

// REGISTER API
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
    } = req.body;

    const user = await User.create({
      fullName,
      email,
      password,
      college,
      department,
      year,
      skills,
      github,
      linkedin,
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    res.status(200).json({
      message: "Login Successful",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    console.log("Profile ID:", req.params.id);

    const user = await User.findById(req.params.id);

    console.log("User Found:", user);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/profile/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;