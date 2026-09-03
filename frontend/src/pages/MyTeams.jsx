
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teams");
      console.log("Logged User:", loggedInUser);
console.log("All Teams:", res.data);

res.data.forEach((team) => {
  console.log("-------------");
  console.log("Team:", team.teamName);
  console.log("Leader:", team.teamLeader);
  console.log("Members:", team.members);
});
      console.log("Logged User");
      console.log(loggedInUser);
      console.log("All Teams");
      console.log(JSON.stringify(res.data,null,2));

   const myTeams = res.data.filter((team) => {
  const isLeader =
    team.teamLeader &&
    team.teamLeader._id &&
    team.teamLeader._id.toString() === loggedInUser._id.toString();

  const isMember =
    Array.isArray(team.members) &&
    team.members.some(
      (member) =>
        member &&
        member._id &&
        member._id.toString() === loggedInUser._id.toString()
    );

  return isLeader || isMember;
});

      setTeams(myTeams);
    } catch (err) {
      console.log(err);
    }
  };

  const handleApprove = async (teamId, userId) => {
    try {
      await axios.put(`http://localhost:5000/api/teams/approve/${teamId}`, {
        userId,
        leaderId: loggedInUser._id,
      });
      alert("Member approved successfully!");
      setShowRequests(false);
      fetchTeams();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to approve member");
    }
  };

  const handleReject = async (teamId, userId) => {
    try {
      await axios.put(`http://localhost:5000/api/teams/reject/${teamId}`, {
        userId,
        leaderId: loggedInUser._id,
      });
      alert("Request rejected successfully!");
      setShowRequests(false);
      fetchTeams();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to reject request");
    }
  };

  const handleTransferLeader = async (teamId, newLeaderId) => {
    try {
      const confirmTransfer = window.confirm(
        "Are you sure you want to transfer leadership to this member?"
      );
      if (!confirmTransfer) return;

      await axios.put(`http://localhost:5000/api/teams/transfer-leader/${teamId}`, {
        userId: loggedInUser._id,
        newLeaderId,
      });
      alert("Team Leader Updated Successfully");
      fetchTeams();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to transfer leadership");
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this team?"
      );

      if (!confirmDelete) return;

      await axios.delete(
        `http://localhost:5000/api/teams/delete/${teamId}`,
        {
          data: {
            userId: loggedInUser._id,
          },
        }
      );

      alert("Team deleted successfully");

      fetchTeams();

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Unable to delete team"
      );
    }
  };

  const handleViewProfile = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Teams</h1>
          <p className="text-slate-500 mt-2">
            Manage your hackathon teams and members.
          </p>
        </div>

        <Link
          to="/create-team"
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl"
        >
          + Create Team
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {teams?.map((team) => (
          <div key={team._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
  <div>
    <div className="flex items-center gap-3">
      <h2 className="text-xl font-bold text-slate-800">
        {team.teamName}
      </h2>

      <span className="text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">
        {team.status}
      </span>
    </div>

    <p className="text-sm text-slate-500 mt-1">
      {team.hackathonName}
    </p>
  </div>
</div>

            <div className="mt-6">
             <h3 className="font-semibold text-slate-700 mb-2">
     Team Leader
</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                  {team.teamLeader?.fullName?.split(" ").map(x=>x[0]).join("")}
                </div>

                <div>
                  <p className="font-semibold">{team.teamLeader?.fullName}</p>
                  <p className="text-sm text-slate-500">Leader</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="font-semibold mb-3">Members</h3>

              {Array.isArray(team.members) &&
  team.members.map((member) => (
                <div
                  key={member._id}
                  className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 mb-2"
                >
                  <div>
                    <p className="font-medium">{member.fullName}</p>
                    <p className="text-sm text-slate-500">
                      {member._id?.toString() ===
team.teamLeader?._id?.toString()
  ? "👑 Team Leader"
  : "👤 Member"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProfile(member._id)}
                      className="border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-xl font-medium"
                    >
                      View Profile
                    </button>

                    {team.teamLeader?._id?.toString() ===
                      loggedInUser?._id?.toString() &&
                      member._id?.toString() !==
                      loggedInUser?._id?.toString() && (
                        <button
                          onClick={() =>
                            handleTransferLeader(team._id, member._id)
                          }
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-xl font-medium"
                        >
                          Make Leader
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex justify-between">
                <span>Progress</span>
                <span>{team.progress}%</span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full mt-2">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${team.progress}%` }}
                />
              </div>
            </div>

{team.teamLeader?._id?.toString() === loggedInUser?._id?.toString() && (
  <div className="mt-5">
    <div className="flex items-center justify-between bg-slate-50 border rounded-xl p-4">
      <div>
        <p className="font-semibold">Pending Requests</p>
        <p className="text-sm text-slate-500">
          {team.joinRequests?.length || 0} request(s)
        </p>
      </div>

      <button
        onClick={() => {
          setSelectedTeam(team);
          setShowRequests(true);
        }}
        className="bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
      >
        View Requests
      </button>
    </div>
  </div>
)}

<div className="flex gap-3 mt-6">
  <button
    onClick={() => navigate(`/workspace/${team._id}`)}
    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition text-center"
  >
    Workspace
  </button>

  {team.teamLeader?._id?.toString() === loggedInUser?._id?.toString() && (
    <>
      <button
        onClick={() => navigate(`/edit-team/${team._id}`)}
        className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 rounded-xl transition text-center"
      >
        Edit
      </button>

      <button
        onClick={() => handleDeleteTeam(team._id)}
        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-xl transition text-center"
      >
        Delete
      </button>
    </>
  )}
</div>
          </div>
        ))}
      </div>
      {showRequests && selectedTeam && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-[700px] max-h-[80vh] overflow-y-auto p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Pending Requests
        </h2>

        <button
          onClick={() => setShowRequests(false)}
          className="text-slate-500 hover:text-black text-xl"
        >
          ✕
        </button>
      </div>

      {selectedTeam.joinRequests?.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          No Pending Requests
        </div>
      ) : (
        selectedTeam.joinRequests.map((req) => (
          <div
            key={req.user?._id}
            className="border border-slate-200 rounded-2xl p-5 mb-4 bg-slate-50 hover:bg-white transition"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-slate-900">
                    {req.user?.fullName}
                  </h3>
                  <span className="bg-indigo-100 text-indigo-700 px-3 py-0.5 rounded-full text-xs font-bold border border-indigo-200">
                    🤖 AI Match: {req.matchPercentage}%
                  </span>
                </div>

                <p className="text-sm text-slate-500 mt-0.5">
                  {req.user?.email} {req.user?.department ? `· ${req.user.department}` : ""}
                </p>

                {req.user?.skills?.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Applicant Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {req.user.skills.map((skill, idx) => (
                        <span key={idx} className="bg-white text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-lg text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleViewProfile(req.user?._id)}
                  className="border border-slate-300 text-slate-700 text-xs px-4 py-2 rounded-xl hover:bg-slate-100 font-medium"
                >
                  View Profile
                </button>

                <button
                  onClick={() =>
                    handleApprove(
                      selectedTeam._id,
                      req.user?._id
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-xl font-medium shadow-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleReject(
                      selectedTeam._id,
                      req.user?._id
                    )
                  }
                  className="bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-xl font-medium shadow-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))
      )}

    </div>
  </div>
)}
    </DashboardLayout>
  );
}

export default MyTeams;
