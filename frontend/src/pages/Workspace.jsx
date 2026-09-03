import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  FiUsers,
  FiAward,
  FiCode,
  FiArrowLeft,
  FiCheckCircle,
  FiPlus,
  FiTrash2,
  FiClock,
  FiShield,
  FiAlertCircle,
  FiCheckSquare,
  FiList,
} from "react-icons/fi";

function Workspace() {
  const { id } = useParams(); // teamId
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};

  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState("");

  // Modal / Form state for Task Creation
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "To Do",
  });
  const [creatingTask, setCreatingTask] = useState(false);

  useEffect(() => {
    fetchTeamAndTasks();
  }, [id]);

  const fetchTeamAndTasks = async () => {
    setLoading(true);
    setError("");

    try {
      // 1. Fetch team details
      const teamRes = await axios.get("http://localhost:5000/api/teams");
      const foundTeam = teamRes.data.find((t) => t._id === id);

      if (!foundTeam) {
        setError("Team not found.");
        setLoading(false);
        return;
      }

      setTeam(foundTeam);

      // Check authorization
      const leaderId = (foundTeam.teamLeader?._id || foundTeam.teamLeader)?.toString();
      const isLeader = leaderId === loggedInUser._id?.toString();
      const isMember = (foundTeam.members || []).some(
        (m) => (m._id?.toString() || m.toString()) === loggedInUser._id?.toString()
      );

      if (!isLeader && !isMember) {
        setError("Unauthorized: You must be a member of this team to access the workspace.");
        setLoading(false);
        return;
      }

      // Pre-select first member/leader in task assignment form
      const defaultAssignee = foundTeam.teamLeader?._id || foundTeam.members?.[0]?._id || "";
      setTaskForm((prev) => ({ ...prev, assignedTo: defaultAssignee }));

      // 2. Fetch team tasks
      await fetchTasks(foundTeam._id);
    } catch (err) {
      console.error(err);
      setError("Failed to load team workspace. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (teamId) => {
    setTasksLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks/team/${teamId}?userId=${loggedInUser._id}`
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!taskForm.title.trim()) {
      alert("Task title is required");
      return;
    }

    if (!taskForm.assignedTo) {
      alert("Please select a team member to assign the task");
      return;
    }

    setCreatingTask(true);
    try {
      await axios.post("http://localhost:5000/api/tasks", {
        title: taskForm.title,
        description: taskForm.description,
        assignedTo: taskForm.assignedTo,
        teamId: id,
        userId: loggedInUser._id,
        status: taskForm.status,
      });

      alert("Task created successfully!");
      setShowTaskModal(false);
      setTaskForm({
        title: "",
        description: "",
        assignedTo: team?.teamLeader?._id || team?.members?.[0]?._id || "",
        status: "To Do",
      });

      fetchTasks(id);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        userId: loggedInUser._id,
        status: newStatus,
      });

      fetchTasks(id);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        data: { userId: loggedInUser._id },
      });

      fetchTasks(id);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-12 text-center text-slate-500 font-medium">
          <div className="inline-block animate-spin text-indigo-600 mb-3">
            <FiClock size={32} />
          </div>
          <p>Loading Workspace...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Access Denied / Error View
  if (error || !team) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiShield size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Workspace Access Denied</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            {error || "You do not have permission to access this team workspace."}
          </p>
          <button
            onClick={() => navigate("/my-teams")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-2xl transition"
          >
            Back to My Teams
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const taskProgressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Deduplicated roster of leader + members
  const allTeamUsers = [];
  const seenUserIds = new Set();

  if (team.teamLeader) {
    const leaderId = team.teamLeader._id || team.teamLeader;
    allTeamUsers.push(team.teamLeader);
    seenUserIds.add(leaderId.toString());
  }

  if (Array.isArray(team.members)) {
    team.members.forEach((m) => {
      const memberId = m._id || m;
      if (memberId && !seenUserIds.has(memberId.toString())) {
        allTeamUsers.push(m);
        seenUserIds.add(memberId.toString());
      }
    });
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/my-teams")}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition"
          >
            <FiArrowLeft size={18} />
            Back to My Teams
          </button>

          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold ${
              team.status === "Closed"
                ? "bg-amber-100 text-amber-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            ● {team.status}
          </span>
        </div>

        {/* Hero Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-lg">
          <div className="flex items-center gap-3 text-indigo-100 text-sm font-semibold mb-2">
            <FiAward size={18} />
            <span>{team.hackathonName}</span>
          </div>

          <h1 className="text-4xl font-extrabold mb-3">{team.teamName}</h1>
          <p className="text-indigo-100 max-w-2xl leading-relaxed">{team.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
              <FiUsers size={16} />
              <span>
                {team.members?.length || 0} / {team.maxMembers} Members Capacity
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-2xl backdrop-blur-md">
              <FiCheckSquare size={16} />
              <span>
                {completedTasks} / {totalTasks} Tasks Completed ({taskProgressPct}%)
              </span>
            </div>
          </div>
        </div>

        {/* Dual Progress Bars Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Member Capacity Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-2 font-semibold text-slate-700 text-sm">
              <span>Member Capacity Progress</span>
              <span className="text-indigo-600 font-bold">{team.progress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${team.progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {team.members?.length || 0} active members of {team.maxMembers} maximum capacity slots.
            </p>
          </div>

          {/* Task Completion Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-2 font-semibold text-slate-700 text-sm">
              <span>Task Completion Progress</span>
              <span className="text-emerald-600 font-bold">{taskProgressPct}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {completedTasks} of {totalTasks} workspace tasks completed.
            </p>
          </div>
        </div>

        {/* Team Members Roster */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FiUsers className="text-indigo-600" />
            Team Members ({allTeamUsers.length})
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allTeamUsers.map((user) => {
              const userIdStr = (user._id || user).toString();
              const leaderIdStr = (team.teamLeader?._id || team.teamLeader)?.toString();
              const isLeader = userIdStr === leaderIdStr;

              return (
                <div
                  key={userIdStr}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                        {user.fullName
                          ?.split(" ")
                          .map((x) => x[0])
                          .join("") || "U"}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{user.fullName || "Member"}</h4>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        isLeader ? "bg-amber-100 text-amber-800" : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {isLeader ? "★ Leader" : "Member"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1 mb-3">
                    {user.department && <p>Department: {user.department}</p>}
                    {user.college && <p className="truncate">College: {user.college}</p>}
                  </div>

                  {user.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {user.skills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/profile/${userIdStr}`)}
                    className="w-full border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs py-1.5 rounded-xl font-medium transition text-center"
                  >
                    View Profile
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Management Section Header */}
        <div className="flex justify-between items-center pt-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <FiList className="text-indigo-600" />
              Workspace Tasks
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Create, assign, and track project tasks across team members.
            </p>
          </div>

          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-2xl font-semibold text-sm transition shadow-sm"
          >
            <FiPlus size={18} />
            Add Task
          </button>
        </div>

        {/* Task Columns / Kanban Layout */}
        {tasksLoading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <FiCheckSquare size={26} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No tasks yet</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">Create your first task to assign items to team members.</p>
            <button
              onClick={() => setShowTaskModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition"
            >
              + Create First Task
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {["To Do", "In Progress", "Completed"].map((statusCategory) => {
              const columnTasks = tasks.filter((t) => t.status === statusCategory);
              let headerBg = "bg-slate-100 text-slate-700 border-slate-200";
              if (statusCategory === "In Progress") headerBg = "bg-indigo-50 text-indigo-700 border-indigo-200";
              if (statusCategory === "Completed") headerBg = "bg-emerald-50 text-emerald-700 border-emerald-200";

              return (
                <div
                  key={statusCategory}
                  className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex flex-col justify-between min-h-[400px]"
                >
                  <div>
                    {/* Column Header */}
                    <div className={`flex justify-between items-center border px-4 py-2.5 rounded-2xl mb-4 font-bold text-sm ${headerBg}`}>
                      <span>{statusCategory}</span>
                      <span className="bg-white px-2.5 py-0.5 rounded-full text-xs shadow-xs">
                        {columnTasks.length}
                      </span>
                    </div>

                    {/* Column Task Cards */}
                    <div className="space-y-3">
                      {columnTasks.map((task) => (
                        <div
                          key={task._id}
                          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition space-y-3"
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                            <button
                              onClick={() => handleDeleteTask(task._id)}
                              className="text-slate-400 hover:text-red-600 transition"
                              title="Delete Task"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>

                          {task.description && (
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Assignee Badge */}
                          <div className="pt-1 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">Assigned to:</span>
                            <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                              👤 {task.assignedTo?.fullName || "Team Member"}
                            </span>
                          </div>

                          {/* Move Task Buttons */}
                          <div className="pt-2 border-t border-slate-100 flex gap-1 justify-end">
                            {statusCategory !== "To Do" && (
                              <button
                                onClick={() =>
                                  handleUpdateTaskStatus(
                                    task._id,
                                    statusCategory === "Completed" ? "In Progress" : "To Do"
                                  )
                                }
                                className="text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition"
                              >
                                ← Move Left
                              </button>
                            )}

                            {statusCategory !== "Completed" && (
                              <button
                                onClick={() =>
                                  handleUpdateTaskStatus(
                                    task._id,
                                    statusCategory === "To Do" ? "In Progress" : "Completed"
                                  )
                                }
                                className="text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg transition"
                              >
                                Move Right →
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-xl border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Create New Task</h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="text-slate-400 hover:text-slate-900 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Build Authentication Endpoint"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Task Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe task objectives or acceptance criteria..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assign To *
                </label>
                <select
                  value={taskForm.assignedTo}
                  onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Team Member</option>
                  {allTeamUsers.map((u) => {
                    const uId = (u._id || u).toString();
                    return (
                      <option key={uId} value={uId}>
                        {u.fullName || "Member"} ({u.email})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Initial Status
                </label>
                <select
                  value={taskForm.status}
                  onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={creatingTask}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-2xl transition text-sm shadow-sm"
                >
                  {creatingTask ? "Creating..." : "Create Task"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold px-5 py-3.5 rounded-2xl transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Workspace;
