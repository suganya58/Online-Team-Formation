const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/users");
const teamRoutes = require("./routes/teamRoutes");
const hackathonRoutes = require("./routes/hackathonRoutes");
const adminRoutes = require("./routes/adminRoutes");
const trendingTopicRoutes = require("./routes/trendingTopicRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/hackathons", hackathonRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/topics", trendingTopicRoutes);
app.use("/api/announcements", announcementRoutes);

app.get("/", (req, res) => {
  res.send("HackMate API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});