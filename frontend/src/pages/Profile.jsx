import { useEffect, useState } from "react";
import axios from "axios";
<<<<<<< HEAD
=======
import API_URL from "../api";
>>>>>>> 90fb055 (Prepare frontend for deployment)
import DashboardLayout from "../layouts/DashboardLayout";
import { useParams } from "react-router-dom";
import {
  FiMapPin,
  FiMail,
  FiCode,
  FiGlobe,
  FiEdit,
  FiAward,
  FiUsers,
  FiBriefcase,
  FiStar,
<<<<<<< HEAD
  FiCheckSquare,
=======
>>>>>>> 90fb055 (Prepare frontend for deployment)
} from "react-icons/fi";

function Profile() {
  const { userId } = useParams();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwnProfile =
<<<<<<< HEAD
    !userId || userId?.toString() === loggedInUser?._id?.toString();

  const [user, setUser] = useState(null);
  const [statistics, setStatistics] = useState({
    hackathons: 0,
    teams: 0,
    projects: 0,
    completedTasks: 0,
  });
  const [achievements, setAchievements] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    college: "",
    department: "",
    year: "",
    github: "",
    linkedin: "",
    about: "",
    skills: "",
  });

  useEffect(() => {
    setIsEditing(false);
    const profileId = userId || loggedInUser?._id;
    if (profileId) {
      fetchProfile(profileId);
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        skills: typeof formData.skills === "string"
          ? formData.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : formData.skills,
      };

      const res = await axios.put(
        `http://localhost:5000/api/users/profile/${user._id}`,
        payload
      );

      const updatedUser = res.data.user || res.data;
      setUser(updatedUser);
      setIsEditing(false);
      
      // Refresh statistics after update
      fetchProfile(user._id);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to update profile.");
    }
  };

  const fetchProfile = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/profile/${id}`
      );

      const fetchedUser = res.data.user || res.data;
      setUser(fetchedUser);

      if (res.data.statistics) {
        setStatistics(res.data.statistics);
      }

      if (Array.isArray(res.data.achievements)) {
        setAchievements(res.data.achievements);
      }

      setFormData({
        fullName: fetchedUser.fullName || "",
        college: fetchedUser.college || "",
        department: fetchedUser.department || "",
        year: fetchedUser.year || "",
        github: fetchedUser.github || "",
        linkedin: fetchedUser.linkedin || "",
        about: fetchedUser.about || "",
        skills: fetchedUser.skills ? fetchedUser.skills.join(", ") : "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center text-slate-500 font-medium">Loading profile...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header Banner & User Info */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-500"></div>

        <div className="px-8 pb-8 relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-500 border-4 border-white flex items-center justify-center text-white text-3xl font-bold -mt-10">
            {user.fullName
              ?.split(" ")
              .map((word) => word[0])
              .join("") || "U"}
          </div>

          {isOwnProfile && (
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsEditing(true)}
                disabled={isEditing}
                className={`flex items-center gap-2 border px-5 py-2 rounded-2xl text-sm font-semibold transition ${
                  isEditing
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200"
                    : "border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <FiEdit />
                Edit Profile
              </button>
            </div>
          )}

          <div className="mt-4">
            {isEditing ? (
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full border border-slate-300 px-4 py-3 rounded-2xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Department"
                      className="w-full border border-slate-300 px-4 py-3 rounded-2xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">College</label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      placeholder="College"
                      className="w-full border border-slate-300 px-4 py-3 rounded-2xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Year of Study</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="Year"
                    className="w-full border border-slate-300 px-4 py-3 rounded-2xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">GitHub</label>
                    <input
                      type="text"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="GitHub URL"
                      className="w-full border border-slate-300 px-4 py-3 rounded-2xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">LinkedIn</label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="LinkedIn URL"
                      className="w-full border border-slate-300 px-4 py-3 rounded-2xl text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => {
                      setFormData({
                        fullName: user.fullName || "",
                        college: user.college || "",
                        department: user.department || "",
                        year: user.year || "",
                        github: user.github || "",
                        linkedin: user.linkedin || "",
                        about: user.about || "",
                        skills: user.skills ? user.skills.join(", ") : "",
                      });
                      setIsEditing(false);
                    }}
                    className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-6 py-2.5 rounded-xl text-sm transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-extrabold text-slate-900">{user.fullName}</h1>

                <p className="text-slate-500 text-sm mt-1 font-medium">
                  {user.department ? `${user.department} · ` : ""}
                  {user.college || "Student"}
                  {user.year ? ` (${user.year})` : ""}
                </p>

                <div className="flex flex-wrap gap-5 mt-4 text-slate-600 text-sm">
                  {user.college && (
                    <div className="flex items-center gap-2">
                      <FiMapPin className="text-indigo-600" />
                      {user.college}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <FiMail className="text-indigo-600" />
                    {user.email}
                  </div>

                  <div className="flex items-center gap-2">
                    <FiCode className="text-indigo-600" />
                    {user.github ? (
                      <a href={user.github} target="_blank" rel="noreferrer" className="hover:underline text-indigo-600">
                        GitHub Profile
                      </a>
                    ) : (
                      "Not Added"
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <FiGlobe className="text-indigo-600" />
                    {user.linkedin ? (
                      <a href={user.linkedin} target="_blank" rel="noreferrer" className="hover:underline text-indigo-600">
                        LinkedIn Profile
                      </a>
                    ) : (
                      "Not Added"
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* REAL PROFILE STATISTICS (Calculated from MongoDB) */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {/* Hackathons Stat */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FiAward size={26} />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{statistics.hackathons}</h2>
            <p className="text-slate-500 font-medium text-sm">Hackathons</p>
          </div>
        </div>

        {/* Teams Stat */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FiUsers size={26} />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{statistics.teams}</h2>
            <p className="text-slate-500 font-medium text-sm">Teams</p>
          </div>
        </div>

        {/* Projects Stat */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <FiBriefcase size={26} />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">{statistics.projects}</h2>
            <p className="text-slate-500 font-medium text-sm">Projects</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: About, Skills, and REAL Earned Achievements */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6 items-start">
        {/* About & Skills */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">About</h2>

          {isEditing ? (
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="5"
              className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write about yourself..."
            />
          ) : (
            <p className="text-slate-600 leading-relaxed text-sm">
              {user.about || "No bio added yet."}
            </p>
          )}

          <h3 className="text-xl font-bold text-slate-900 mt-8 mb-3">Skills</h3>

          {isEditing ? (
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, Python"
              className="w-full border border-slate-300 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-4 py-1.5 rounded-full text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-400 text-sm">No skills added yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[350px]">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FiStar className="text-amber-500" />
            Achievements ({achievements.length})
          </h2>

          {achievements.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm bg-slate-50 rounded-2xl border border-slate-200 mt-4">
              <p className="font-semibold text-slate-700">No achievements yet</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Start participating in hackathons and creating teams to earn real achievements!
              </p>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {achievements.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex gap-4 items-center bg-slate-50 border border-slate-200 p-4 rounded-2xl transition hover:bg-slate-100/80"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold shadow-xs">
                    {item.icon || "🏆"}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                    <p className="text-slate-500 text-xs mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
=======
  !userId ||
  userId?.toString() === loggedInUser?._id?.toString();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

const [formData, setFormData] = useState({
  fullName: "",
  college: "",
  department: "",
  year: "",
  github: "",
  linkedin: "",
  about:"",
  skills:"",
});

    useEffect(() => {
    if (!loggedInUser) {
      return;
    }

    const profileId = userId || loggedInUser._id;

    fetchProfile(profileId);
  }, [userId]);


const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
const handleSave = async () => {
  try {
    const payload = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim()),
    };

    console.log("Sending payload:", payload);

const res = await axios.put(
  `${API_URL}/api/users/profile/${user._id}`,
  payload
);

console.log("Response:", res.data);

    setUser(res.data);
    setIsEditing(false);
  } catch (error) {
    console.log(error);
  }
};
const fetchProfile = async (id) => {
  try {
    console.log("Fetching profile...");

    const res = await axios.get(
      `${API_URL}/api/users/profile/${id}`
    );

    console.log("Profile response:", res.data);

    setUser(res.data);

setFormData({
  fullName: res.data.fullName || "",
  college: res.data.college || "",
  department: res.data.department || "",
  year: res.data.year || "",
  github: res.data.github || "",
  linkedin: res.data.linkedin || "",
  about: res.data.about || "",
  skills: res.data.skills ? res.data.skills.join(", ") : "",
});
  } catch (error) {
    console.log(error);
  }
};
  const [achievements, setAchievements] = useState([
  { title: "Best AI Hack", event: "DevPilot · 2025" },
  { title: "1st Place", event: "Campus Sprint · 2024" },
  { title: "People's Choice", event: "GreenTech · 2024" },
]);

  if (!user) {
  return <div>Loading...</div>;
}

const handleAchievementChange = (index, field, value) => {
  const updated = [...achievements];
  updated[index][field] = value;
  setAchievements(updated);
};

const addAchievement = () => {
  setAchievements([
    ...achievements,
    { title: "", event: "" },
  ]);
};

const removeAchievement = (index) => {
  setAchievements(
    achievements.filter((_, i) => i !== index)
  );
};

  return (
    <DashboardLayout>
  <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
    <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-500"></div>

    <div className="px-8 pb-8 relative">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-500 border-4 border-white flex items-center justify-center text-white text-3xl font-bold">
  {user.fullName
    ?.split(" ")
    .map((word) => word[0])
    .join("")}
</div>
     {isOwnProfile && (
  <div className="flex justify-end pt-4">
    <button
      onClick={() => setIsEditing(true)}
      disabled={isEditing}
      className={`flex items-center gap-2 border px-5 py-2 rounded-2xl ${
        isEditing
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      <FiEdit />
      Edit Profile
    </button>
  </div>
)}
      <div className="mt-2 ml-24">

         {isEditing ? (
    <div className="space-y-4">
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full border px-4 py-3 rounded-2xl"
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="Department"
          className="border px-4 py-3 rounded-2xl"
        />

        <input
          type="text"
          name="college"
          value={formData.college}
          onChange={handleChange}
          placeholder="College"
          className="border px-4 py-3 rounded-2xl"
        />
      </div>
      <input
  type="text"
  name="year"
  value={formData.year}
  onChange={handleChange}
  placeholder="Year"
  className="w-full border px-4 py-3 rounded-2xl"
/>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          name="github"
          value={formData.github}
          onChange={handleChange}
          placeholder="GitHub"
          className="border px-4 py-3 rounded-2xl"
        />

        <input
          type="text"
          name="linkedin"
          value={formData.linkedin}
          onChange={handleChange}
          placeholder="LinkedIn"
          className="border px-4 py-3 rounded-2xl"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          Save
        </button>

       <button
  onClick={() => {
  setFormData({
    fullName: user.fullName || "",
    college: user.college || "",
    department: user.department || "",
    year: user.year || "",
    github: user.github || "",
    linkedin: user.linkedin || "",
    about: user.about || "",
    skills: user.skills ? user.skills.join(", ") : "",
  });
  setIsEditing(false);
}}
  className="border px-5 py-2 rounded-xl"
>
  Cancel
</button>
      </div>
    </div>
  ) : (
    <>
      <h1 className="text-3xl font-bold text-slate-900">
        {user.fullName}
      </h1>

      <p className="text-slate-500 mt-1">
        {user.department} · {user.college}
      </p>

      <div className="flex flex-wrap gap-5 mt-4 text-slate-500">
        <div className="flex items-center gap-2">
          <FiMapPin />
          {user.college}
        </div>

        <div className="flex items-center gap-2">
          <FiMail />
          {user.email}
        </div>

        <div className="flex items-center gap-2">
          <FiCode />
          {user.github || "Not Added"}
        </div>

        <div className="flex items-center gap-2">
          <FiGlobe />
          {user.linkedin || "Not Added"}
        </div>
      </div>
    </>
  )}
</div>
  </div>
</div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <FiAward size={22} />
          </div>

          <div>
            <h2 className="text-3xl font-bold">14</h2>
            <p className="text-slate-500">Hackathons</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <FiUsers size={22} />
          </div>

          <div>
            <h2 className="text-3xl font-bold">8</h2>
            <p className="text-slate-500">Teams</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
            <FiBriefcase size={22} />
          </div>

          <div>
            <h2 className="text-3xl font-bold">9</h2>
            <p className="text-slate-500">Projects</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
{/* Bottom Section */}
<div className="grid lg:grid-cols-3 gap-6 mt-6 items-start">

  {/* About */}
  <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 h-full">
    <h2 className="text-2xl font-bold mb-5">About</h2>

    {isEditing ? (
      <textarea
        name="about"
        value={formData.about}
        onChange={handleChange}
        rows="5"
        className="w-full border rounded-2xl px-4 py-3"
        placeholder="Write about yourself..."
      />
    ) : (
      <p className="text-slate-600 leading-8 mt-4">
        {user.about || "No bio added yet."}
      </p>
    )}

    <h3 className="text-xl font-bold mt-8 mb-4">Skills</h3>

    {isEditing ? (
      <input
        type="text"
        name="skills"
        value={formData.skills}
        onChange={handleChange}
        placeholder="React, Node.js, Python"
        className="w-full border px-4 py-3 rounded-2xl"
      />
    ) : (
      <div className="flex flex-wrap gap-3">
        {user.skills?.length > 0 ? (
          user.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-slate-400">No skills added yet.</p>
        )}
      </div>
    )}
  </div>

  {/* Achievements */}
  <div className="bg-white rounded-3xl border border-slate-200 p-6 h-full min-h-[350px]">
    <h2 className="text-2xl font-bold mb-5">Achievements</h2>

    <div className="space-y-5 mt-8">
      {achievements.map((item, index) => (
        <div key={index}>
          {isEditing ? (
            <div className="space-y-3 border p-4 rounded-2xl">
              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  handleAchievementChange(index, "title", e.target.value)
                }
                placeholder="Achievement Title"
                className="w-full border px-4 py-3 rounded-xl"
              />

              <input
                type="text"
                value={item.event}
                onChange={(e) =>
                  handleAchievementChange(index, "event", e.target.value)
                }
                placeholder="Event Name"
                className="w-full border px-4 py-3 rounded-xl"
              />

              <button
                onClick={() => removeAchievement(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <FiStar />
              </div>

              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.event}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>

    {isEditing && (
      <button
        onClick={addAchievement}
        className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-xl"
      >
        + Add Achievement
      </button>
    )}
  </div>
</div>

      
>>>>>>> 90fb055 (Prepare frontend for deployment)
    </DashboardLayout>
  );
}

export default Profile;