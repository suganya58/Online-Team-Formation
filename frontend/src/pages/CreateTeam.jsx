import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";


function CreateTeam() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamName: "",
    hackathon: "",
    projectIdea: "",
    skills: "",
    maxMembers: "",
    status: "Recruiting",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  if (!loggedInUser || !loggedInUser._id) {
    alert("Please login to create a team");
    return navigate("/");
  }

  const maxM = Number(formData.maxMembers);
  if (isNaN(maxM) || maxM < 1) {
    alert("Maximum members must be at least 1");
    return;
  }

  try {
    await axios.post("http://localhost:5000/api/teams/create", {
      teamName: formData.teamName,
      hackathonName: formData.hackathon,
      teamLeader: loggedInUser._id,
      requiredSkills: formData.skills
        .split(",")
        .map((skill) => skill.trim()),
      maxMembers: maxM,
      description: formData.projectIdea,
      status: formData.status,
    });

    alert("Team Created Successfully!");
    navigate("/my-teams");
  } catch (error) {
    console.log(error.response?.data);
    alert(error.response?.data?.message || "Failed to create team");
  }
};
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Create Team
          </h1>

          <p className="text-slate-500 mt-2">
            Create a team and recruit members for your hackathon project.
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
              Create Team
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateTeam;