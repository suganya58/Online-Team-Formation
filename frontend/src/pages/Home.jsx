import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";
import DashboardLayout from "../layouts/DashboardLayout";

function Home() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => {
    fetchTopics();
    fetchAnnouncements();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/topics`
      );

    setTopics(res.data);
  } catch (error) {
    console.log(error);
  }
};

const fetchAnnouncements = async () => {
  try {
    const res = await axios.get(
      `${API_URL}/api/announcements`
    );

    setAnnouncements(res.data);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <DashboardLayout>

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-500 rounded-3xl p-10 text-white mb-8">

        <p className="mb-2 text-indigo-100">
          Welcome Back 👋
        </p>

        <h1 className="text-5xl font-bold mb-4">
          Build Your Dream Team
        </h1>

        <p className="text-indigo-100">
          Find teammates, join hackathons and create amazing projects.
        </p>
        <div className="mt-8 flex gap-4">
<button
  onClick={() => navigate("/team-finding")}
  className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold"
>
  Find Teammates
</button>

<button
  onClick={() => navigate("/hackathons")}
  className="border border-white text-white px-6 py-3 rounded-xl font-semibold"
>
  Browse Hackathons
</button>
</div>
</div>


<div className="grid md:grid-cols-2 gap-6 mb-8">

  {/* Trending Topics */}
  <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition">
    <h2 className="text-2xl font-bold mb-6 text-slate-800">
        Trending Topics
    </h2>

    <div className="flex flex-wrap gap-3">
      {topics.length > 0 ? (
        topics.map((topic) => (
          <span
            key={topic._id}
            className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-4 py-3 rounded-2xl font-semibold"
          >
            {topic.topic}
          </span>
        ))
      ) : (
        <p className="text-slate-500">
          No trending topics yet
        </p>
      )}
    </div>
  </div>

  {/* Announcements */}
  <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200 hover:shadow-lg transition">
    <h2 className="text-2xl font-bold mb-6 text-slate-800">
        Announcements
    </h2>

    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
      {announcements.length > 0 ? (
        announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="bg-gradient-to-r from-slate-50 to-indigo-50 p-4 rounded-2xl border border-slate-100"
          >
            <p className="font-medium text-slate-700">
              {announcement.message}
            </p>
          </div>
        ))
      ) : (
        <p className="text-slate-500">
          No announcements available
        </p>
      )}
    </div>
  </div>

</div>

     
    </DashboardLayout>
  );
}

export default Home;