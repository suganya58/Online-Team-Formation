import { useEffect, useState } from "react";
import axios from "axios";
import API_URL from "../api";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FiAward,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiClock,
} from "react-icons/fi";

function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/hackathons/all`
      );
      setHackathons(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            Upcoming Hackathons
          </h1>

          <p className="text-slate-500 mt-2">
            Discover events and register before the deadline.
          </p>
        </div>

        <div className="flex gap-3">
         <button
  onClick={() => setFilter("All")}
  className={`px-5 py-2 rounded-xl ${
    filter === "All"
      ? "bg-indigo-600 text-white"
      : "bg-slate-100"
  }`}
>
  All
</button>

<button
  onClick={() => setFilter("Online")}
  className={`px-5 py-2 rounded-xl ${
    filter === "Online"
      ? "bg-indigo-600 text-white"
      : "bg-slate-100"
  }`}
>
  Online
</button>

<button
  onClick={() => setFilter("Open")}
  className={`px-5 py-2 rounded-xl ${
    filter === "Open"
      ? "bg-indigo-600 text-white"
      : "bg-slate-100"
  }`}
>
  Open
</button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search hackathons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 px-4 py-3 border rounded-2xl"
      />

      <p className="mb-4">Total: {hackathons.length}</p>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {hackathons
          .filter((hackathon) =>
            hackathon.title.toLowerCase().includes(search.toLowerCase())
          )
          .filter((hackathon) => {
            if (filter === "All") return true;
            if (filter === "Online") return hackathon.mode === "Online";
            if (filter === "Open") return hackathon.participants === "Open";
            return true;
          })
          .map((hackathon, index) => (
            <div
              key={index}
              className="bg-white rounded-[28px] border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Top */}
              <div className="flex justify-between items-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-500 flex items-center justify-center text-white">
                  <FiAward size={24} />
                </div>

                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-600">
                  <FiClock size={14} />
                  {hackathon.daysLeft}
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-slate-900 mt-6">
                {hackathon.title}
              </h2>

              <p className="text-slate-500 mt-1">
                Hosted by {hackathon.organizer}
              </p>

              {/* Info */}
              <div className="mt-6 space-y-3 text-slate-600">
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-indigo-600" />
                  <span>{hackathon.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiMapPin className="text-indigo-600" />
                  <span>{hackathon.mode}</span>
                </div>

                <div className="flex items-center gap-3">
                  <FiUsers className="text-indigo-600" />
                  <span>{hackathon.participants}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                {hackathon.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <hr className="my-6 border-slate-200" />

              {/* Bottom */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-sm">Prize Pool</p>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {hackathon.prize}
                  </h3>
                </div>

                <a
                  href="https://devfolio.co/hackathons"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-medium transition"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
      </div>
    </DashboardLayout>
  );
}

export default Hackathons;