import { useState } from "react";
<<<<<<< HEAD
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
=======
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../api";
>>>>>>> 90fb055 (Prepare frontend for deployment)

function Register() {
  const navigate = useNavigate();

<<<<<<< HEAD
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [skills, setSkills] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!password) {
      alert("Please enter a password.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
=======
const [fullName, setFullName] = useState("");
const [email, setEmail] = useState("");
const [college, setCollege] = useState("");
const [department, setDepartment] = useState("");
const [year, setYear] = useState("");
const [skills, setSkills] = useState("");
const [github, setGithub] = useState("");
const [linkedin, setLinkedin] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const handleRegister = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    await axios.post(
      `${API_URL}/api/users/register`,
      {
>>>>>>> 90fb055 (Prepare frontend for deployment)
        fullName,
        email,
        password,
        college,
        department,
        year,
<<<<<<< HEAD
        skills,
        github,
        linkedin,
      });

      alert(res.data?.message || "Registration successful! Please login.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Registration Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">HackMate</h1>
          <p className="text-slate-500 text-lg mt-2 font-medium">Build your dream hackathon team</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Create Your Account</h2>
            <p className="text-slate-500 mt-2">
              Join HackMate and find the right teammates for your next hackathon.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Full Name + Email */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
            </div>

            {/* College + Department */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  College Name
                </label>
                <input
                  type="text"
                  placeholder="State University"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Department
                </label>
                <input
                  type="text"
                  placeholder="Computer Science & Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Year + Skills */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Year of Study
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">Select Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Skills (AI Skill Matching)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB, Python"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <p className="text-[11px] text-slate-400 mt-1">Separate skills with commas</p>
              </div>
            </div>

            {/* GitHub + LinkedIn */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Password Row */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-semibold text-sm transition shadow-sm ${
                loading
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
              }`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <div className="text-center pt-2">
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/" className="text-indigo-600 font-semibold hover:text-indigo-700 transition">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
=======
        skills: skills.split(","),
        github,
        linkedin,
      }
    );

    alert("Registration Successful");

    navigate("/");
  } catch (error) {
    alert(
      error.response?.data?.message ||
      "Registration Failed"
    );
  }
};
return ( <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10"> <div className="w-full max-w-4xl">


    {/* Header */}
    <div className="text-center mb-10">
      <h1 className="text-5xl font-bold text-slate-900">
        HackMate
      </h1>

      <p className="text-slate-500 mt-3 text-lg">
        Build your dream hackathon team
      </p>
    </div>

    {/* Card */}
    <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg">

      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900">
          Create Account
        </h2>

        <p className="text-slate-500 mt-2">
          Join hackathons and connect with skilled teammates.
        </p>
      </div>

    <form onSubmit={handleRegister} className="space-y-6">
        {/* User/Admin Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Register As
          </label>

          <div className="flex gap-4">
            <button
              type="button"
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium"
            >
              User
            </button>

            <button
              type="button"
              className="px-5 py-2 rounded-xl border border-slate-300 text-slate-700"
            >
              Admin
            </button>
          </div>
        </div>
{/* Full Name + Email */}
<div className="grid md:grid-cols-2 gap-5">
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Full Name
    </label>

    <input
      type="text"
      placeholder="Enter your full name"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      Email Address
    </label>

    <input
      type="email"
      placeholder="Enter your email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
</div>

        {/* College + Department */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              College Name
            </label>

            <input
  type="text"
  placeholder="Enter your college"
  value={college}
  onChange={(e) => setCollege(e.target.value)}
  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Department
            </label>

            <input
  type="text"
  placeholder="Computer Science"
  value={department}
  onChange={(e) => setDepartment(e.target.value)}
  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
          </div>
        </div>

        {/* Year + Skills */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Year of Study
            </label>

           <select
  value={year}
  onChange={(e) => setYear(e.target.value)}
  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
>
              <option>Select Year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Skills
            </label>

           <input
  type="text"
  placeholder="React, Java, Python, AWS"
  value={skills}
  onChange={(e) => setSkills(e.target.value)}
  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>

            <p className="text-xs text-slate-400 mt-1">
              Separate skills with commas
            </p>
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            GitHub Profile
          </label>

          <input
  type="url"
  placeholder="https://github.com/username"
  value={github}
  onChange={(e) => setGithub(e.target.value)}
  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            LinkedIn Profile
          </label>

          <input
  type="url"
  placeholder="https://linkedin.com/in/username"
  value={linkedin}
  onChange={(e) => setLinkedin(e.target.value)}
  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
        </div>

        {/* Password Row */}
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

           <input
  type="password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>

           <input
  type="password"
  placeholder="Confirm password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
/>
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
        >
          Create Account
        </button>

        <div className="text-center">
          <p className="text-slate-500">
            Already have an account?
            <span className="ml-2 text-indigo-600 font-medium cursor-pointer hover:text-indigo-700">
              Sign In
            </span>
          </p>
        </div>

      </form>
    </div>
  </div>
</div>


);
>>>>>>> 90fb055 (Prepare frontend for deployment)
}

export default Register;
