<<<<<<< HEAD
import { Routes, Route, Navigate } from "react-router-dom";
=======
import { Routes, Route } from "react-router-dom";
>>>>>>> 90fb055 (Prepare frontend for deployment)
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Hackathons from "./pages/Hackathons";
import MyTeams from "./pages/MyTeams";
import TeamFinding from "./pages/TeamFinding";
import Profile from "./pages/Profile";
import CreateTeam from "./pages/CreateTeam";
import EditTeam from "./pages/EditTeam";
<<<<<<< HEAD
import Workspace from "./pages/Workspace";

// Admin Route Guard
function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
=======
>>>>>>> 90fb055 (Prepare frontend for deployment)

function App() {
  return (
    <Routes>
<<<<<<< HEAD
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
=======
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
>>>>>>> 90fb055 (Prepare frontend for deployment)
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/hackathons" element={<Hackathons />} />
      <Route path="/my-teams" element={<MyTeams />} />
      <Route path="/team-finding" element={<TeamFinding />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/create-team" element={<CreateTeam />} />
      <Route path="/edit-team/:id" element={<EditTeam />} />
<<<<<<< HEAD
      <Route path="/workspace/:id" element={<Workspace />} />
=======
>>>>>>> 90fb055 (Prepare frontend for deployment)
    </Routes>
  );
}

export default App;