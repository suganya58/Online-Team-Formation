import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";
import DashboardLayout from "../layouts/DashboardLayout";
import { FiSearch, FiUsers, FiCpu, FiCheckCircle, FiAlertCircle, FiAward, FiGlobe } from "react-icons/fi";

function TeamFinding() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("recommended"); // "recommended" or "all"

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
  const hasUserSkills = Array.isArray(loggedInUser.skills) && loggedInUser.skills.length > 0;

  useEffect(() => {
    fetchTeams();
  }, [activeTab]);

  const fetchTeams = async () => {
    setLoading(true);
    setError("");

    try {
      let url = `${API_URL}/api/teams`;

      if (activeTab === "recommended" && loggedInUser && loggedInUser._id) {
        url = `${API_URL}/api/teams/recommendations/${loggedInUser._id}`;
      }

      const res = await axios.get(url);
      setTeams(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load team recommendations. Please ensure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (teamId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user._id) {
        alert("Please log in to send a join request.");
        return;
      }

      // Sends userId to backend API
      const res = await axios.put(
        `${API_URL}/api/teams/join/${teamId}`,
        {
          userId: user._id,
        }
      );

      alert(res.data?.message || "Join request sent successfully!");
      fetchTeams();
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Failed to send join request.");
    }
  };

  const filteredTeams = teams.filter((team) =>
    team.teamName?.toLowerCase().includes(search.toLowerCase()) ||
    team.hackathonName?.toLowerCase().includes(search.toLowerCase()) ||
    team.requiredSkills?.some((skill) =>
      skill.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Find Teams</h1>
          <p className="text-slate-500 mt-2">
            Discover hackathon teams ranked dynamically by our backend AI skill matching engine.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab("recommended")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === "recommended"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiAward size={16} />
            AI Recommended
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition ${
              activeTab === "all"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FiGlobe size={16} />
            All Teams
          </button>
        </div>
      </div>

      {/* No Skills Alert Banner */}
      {!hasUserSkills && activeTab === "recommended" && (
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-amber-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-700">
              <FiAlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-base">Add skills to your profile for better AI recommendations</h4>
              <p className="text-sm text-amber-700 mt-0.5">
                Your profile currently has no skills listed. Update your profile to get personalized AI team matches.
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/profile")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl transition whitespace-nowrap shadow-sm"
          >
            Update Profile Skills
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-xl mb-8">
        <FiSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search by skill, team name, or hackathon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm my-6">
          <div className="inline-block animate-spin text-indigo-600 mb-4">
            <FiCpu size={36} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">Finding the best teams for you...</h3>
          <p className="text-slate-500 text-sm mt-1">Our AI engine is matching your skills against recruiting teams.</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-red-700 mb-8">
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredTeams.length === 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm my-6">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiUsers size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">No suitable teams found yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2 text-sm">
            {activeTab === "recommended"
              ? "No AI recommendations available right now. Try exploring 'All Teams' or create your own team."
              : "No teams currently match your search query."}
          </p>
          {activeTab === "recommended" && (
            <button
              onClick={() => setActiveTab("all")}
              className="mt-6 bg-indigo-600 text-white font-semibold text-sm px-6 py-3 rounded-2xl hover:bg-indigo-700 transition"
            >
              Browse All Available Teams
            </button>
          )}
        </div>
      )}

      {/* Team Cards Grid */}
      {!loading && !error && filteredTeams.length > 0 && (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTeams.map((team, index) => {
            const matchPct = typeof team.matchPercentage === "number" ? team.matchPercentage : 0;
            const category = team.matchCategory || (matchPct >= 80 ? "Excellent Match" : matchPct >= 60 ? "Good Match" : matchPct >= 40 ? "Moderate Match" : "Low Match");

            // Category Badge styling
            let badgeStyle = "bg-slate-100 text-slate-600 border-slate-200";
            if (matchPct >= 80) badgeStyle = "bg-emerald-50 text-emerald-800 border-emerald-200";
            else if (matchPct >= 60) badgeStyle = "bg-indigo-50 text-indigo-800 border-indigo-200";
            else if (matchPct >= 40) badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";

            return (
              <div
                key={team._id || index}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">
                      {team.status || "Recruiting"}
                    </span>

                    {activeTab === "recommended" && (
                      <div className={`flex items-center gap-1.5 border px-3 py-1 rounded-full text-xs font-bold ${badgeStyle}`}>
                        <FiCpu size={14} />
                        <span>AI Match: {matchPct}% ({category})</span>
                      </div>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">{team.teamName}</h2>

                  <p className="text-indigo-600 font-semibold mt-1 text-sm">
                    🏆 {team.hackathonName}
                  </p>

                  <p className="text-slate-500 text-sm mt-3 leading-relaxed line-clamp-3">
                    {team.description}
                  </p>

                  {/* Team Leader */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Team Leader</p>
                    <p className="font-semibold text-slate-800">
                      {team.teamLeader?.fullName || "Leader"}
                    </p>
                  </div>

                  {/* Members & Slots */}
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                      <FiUsers className="text-indigo-600" />
                      <span>
                        {team.members?.length || 0} / {team.maxMembers} Members
                      </span>
                    </div>

                    <span className="text-green-600 font-semibold text-xs bg-green-50 px-2.5 py-1 rounded-lg border border-green-100">
                      {Math.max(0, team.maxMembers - (team.members?.length || 0))} Slots Open
                    </span>
                  </div>

                  {/* Required Tech Stack */}
                  <div className="mt-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Required Tech Stack
                      </p>

                      {activeTab === "recommended" && team.requiredSkills?.length > 0 && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                          Matched {team.matchedSkills?.length || 0} of {team.requiredSkills?.length} skills
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {team.requiredSkills?.map((skill, idx) => {
                        const isMatched = team.matchedSkills?.includes(skill);
                        return (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-xl text-xs font-medium flex items-center gap-1 border ${
                              isMatched
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-slate-50 text-slate-600 border-slate-200"
                            }`}
                          >
                            {isMatched ? <FiCheckCircle size={12} className="text-emerald-600" /> : null}
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                  {/* Action Button */}
                  {(() => {
                    const currentUserId = loggedInUser && loggedInUser._id ? loggedInUser._id.toString() : null;

                    const getEntityId = (val) => {
                      if (!val) return null;
                      if (typeof val === "object" && val._id) {
                        return val._id.toString();
                      }
                      if (typeof val === "string") return val;
                      return val.toString ? val.toString() : null;
                    };

                    const isMember = Boolean(
                      currentUserId &&
                        (team.members || []).some((m) => getEntityId(m) === currentUserId)
                    );

                    const isLeader = Boolean(
                      currentUserId && getEntityId(team.teamLeader) === currentUserId
                    );

                    const isRequested = Boolean(
                      currentUserId &&
                        (team.joinRequests || []).some((r) => getEntityId(r?.user || r) === currentUserId)
                    );

                    const isFull = (team.members?.length || 0) >= (team.maxMembers || 0);
                    const isButtonDisabled = !currentUserId || isMember || isLeader || isRequested || isFull;

                    let buttonText = "Request to Join";
                    if (!currentUserId) buttonText = "Log in to Join";
                    else if (isLeader) buttonText = "Team Leader";
                    else if (isMember) buttonText = "Already a Member";
                    else if (isRequested) buttonText = "Request Pending";
                    else if (isFull) buttonText = "Team Full";

                    return (
                      <button
                        disabled={isButtonDisabled}
                        onClick={() => handleJoin(team._id)}
                        className={`w-full mt-6 py-3.5 rounded-2xl font-semibold text-sm transition ${
                          isButtonDisabled
                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow"
                        }`}
                      >
                        {buttonText}
                      </button>
                    );
                  })()}
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default TeamFinding;