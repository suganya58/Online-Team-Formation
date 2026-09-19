import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import DashboardLayout from "../layouts/DashboardLayout";

function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalHackathons: 0,
    activeTeams: 0,
  });

  const [topics, setTopics] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchStats();
      fetchTopics();
      fetchAnnouncements();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/admin/stats`, {
        headers: { "x-user-id": user?._id },
      });
      setStats(res.data);
    } catch (error) {
      console.log("Error fetching admin stats:", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/topics`);
      setTopics(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTopic = async () => {
    if (!newTopic) return;
    try {
      await axios.post(`${API_URL}/api/topics/add`, { topic: newTopic });
      setNewTopic("");
      fetchTopics();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTopic = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/topics/${id}`);
      fetchTopics();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/announcements`);
      setAnnouncements(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addAnnouncement = async () => {
    if (!newAnnouncement) return;
    try {
      await axios.post(`${API_URL}/api/announcements/add`, { message: newAnnouncement });
      setNewAnnouncement("");
      fetchAnnouncements();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/announcements/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.log(error);
    }
  };

  // STRICT ROLE-BASED ACCESS CONTROL
  if (!user || user.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex flex-col justify-center items-center h-[70vh] text-center px-4">
          <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
            <span className="text-4xl">🛡️</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-500 max-w-md">
            Administrator privileges (role = "admin") are required to view this portal.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage HackMate platform activities.</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium text-sm">Total Users</h3>
          <p className="text-3xl font-bold mt-2 text-slate-900">{stats.totalUsers}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium text-sm">Total Teams</h3>
          <p className="text-3xl font-bold mt-2 text-slate-900">{stats.totalTeams}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium text-sm">Hackathons</h3>
          <p className="text-3xl font-bold mt-2 text-slate-900">{stats.totalHackathons}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-slate-500 font-medium text-sm">Active Teams</h3>
          <p className="text-3xl font-bold mt-2 text-slate-900">{stats.activeTeams}</p>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mt-10 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Trending Topics</h2>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter trending topic..."
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          <button
            onClick={addTopic}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-2xl transition text-sm"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {topics.map((topic) => (
            <div
              key={topic._id}
              className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl"
            >
              <span className="font-semibold text-slate-800 text-sm">🔥 {topic.topic}</span>

              <button
                onClick={() => deleteTopic(topic._id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-xl font-medium transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="mt-10 bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">📢 Announcements</h2>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter announcement..."
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            className="flex-1 px-4 py-3 border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          <button
            onClick={addAnnouncement}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-2xl transition text-sm"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl"
            >
              <span className="font-semibold text-slate-800 text-sm">📢 {announcement.message}</span>

              <button
                onClick={() => deleteAnnouncement(announcement._id)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-xl font-medium transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;