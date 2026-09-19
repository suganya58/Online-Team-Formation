import { useState, useEffect } from "react";
import axios from "axios";
<<<<<<< HEAD
=======
import API_URL from "../api";
>>>>>>> 90fb055 (Prepare frontend for deployment)
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";


function EditTeam() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
    teamName: "",
    hackathon: "",
    projectIdea: "",
    skills: "",
    maxMembers: "",
    status: "Recruiting",
  });

<<<<<<< HEAD
  const [currentMemberCount, setCurrentMemberCount] = useState(1);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/teams");

      const team = res.data.find((t) => t._id === id);

      if (!team) {
        alert("Team not found");
        return navigate("/my-teams");
      }

      const isLeader =
        (team.teamLeader?._id?.toString() || team.teamLeader?.toString()) ===
        loggedInUser?._id?.toString();

      if (!isLeader) {
        alert("Only the team leader can edit this team");
        return navigate("/my-teams");
      }

      setCurrentMemberCount(team.members?.length || 1);

      setFormData({
        teamName: team.teamName,
        hackathon: team.hackathonName,
        projectIdea: team.description,
        skills: Array.isArray(team.requiredSkills) ? team.requiredSkills.join(", ") : "",
        maxMembers: team.maxMembers,
        status: team.status,
      });

    } catch (err) {
      console.log(err);
    }
  };
=======
  useEffect(() => {
  fetchTeam();
}, []);

const fetchTeam = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/teams`);

    const team = res.data.find((t) => t._id === id);

    if (!team) {
      alert("Team not found");
      return;
    }

    setFormData({
      teamName: team.teamName,
      hackathon: team.hackathonName,
      projectIdea: team.description,
      skills: team.requiredSkills.join(", "),
      maxMembers: team.maxMembers,
      status: team.status,
    });

  } catch (err) {
    console.log(err);
  }
};
>>>>>>> 90fb055 (Prepare frontend for deployment)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loggedInUser || !loggedInUser._id) {
      alert("Please login to edit your team");
      return navigate("/");
    }

    const newMaxMembers = Number(formData.maxMembers);
    if (isNaN(newMaxMembers) || newMaxMembers < 1) {
      alert("Maximum members must be at least 1");
      return;
    }

    if (newMaxMembers < currentMemberCount) {
      alert(
        `Maximum members cannot be smaller than current number of members (${currentMemberCount})`
      );
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/teams/edit/${id}`,
        {
          userId: loggedInUser._id,
          teamName: formData.teamName,
          hackathonName: formData.hackathon,
          description: formData.projectIdea,
          requiredSkills: formData.skills
            .split(",")
            .map((skill) => skill.trim()),
          maxMembers: newMaxMembers,
          status: formData.status,
        }
      );

      alert("Team Updated Successfully!");
      navigate("/my-teams");

    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
        "Unable to update team"
      );
    }
  };
=======
const handleSubmit = async (e) => {
  e.preventDefault();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  try {

    await axios.put(
      `${API_URL}/api/teams/edit/${id}`,
      {
        userId: loggedInUser._id,
        teamName: formData.teamName,
        hackathonName: formData.hackathon,
        description: formData.projectIdea,
        requiredSkills: formData.skills
          .split(",")
          .map((skill) => skill.trim()),
        maxMembers: Number(formData.maxMembers),
        status: formData.status,
      }
    );

    alert("Team Updated Successfully!");

    navigate("/my-teams");

  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
      "Unable to update team"
    );
  }
};
>>>>>>> 90fb055 (Prepare frontend for deployment)
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Edit Team
          </h1>

          <p className="text-slate-500 mt-2">
            Update your team information and recruitment details. 
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Team Name
              </label>

              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleChange}
                placeholder="AI Warriors"
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Hackathon Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hackathon Name
              </label>

              <input
                type="text"
                name="hackathon"
                value={formData.hackathon}
                onChange={handleChange}
                placeholder="AI Builders Hack 2026"
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Project Idea */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Project Idea
              </label>

              <textarea
                rows="4"
                name="projectIdea"
                value={formData.projectIdea}
                onChange={handleChange}
                placeholder="Describe your project idea..."
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Required Skills
              </label>

              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Max Members */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Maximum Members
              </label>

              <input
                type="number"
                name="maxMembers"
                value={formData.maxMembers}
                onChange={handleChange}
                placeholder="5"
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recruitment Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>Recruiting</option>
                <option>Closed</option>
              </select>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold transition"
            >
             Save Changes
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditTeam;