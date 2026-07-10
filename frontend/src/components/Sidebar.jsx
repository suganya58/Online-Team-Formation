import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiSearch,
  FiUser,
  FiShield,
} from "react-icons/fi";

function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const menuItems = [
    {
      name: "Home",
      path: "/home",
      icon: <FiHome size={20} />,
    },
    {
      name: "Upcoming Hackathons",
      path: "/hackathons",
      icon: <FiCalendar size={20} />,
    },
    {
      name: "My Teams",
      path: "/my-teams",
      icon: <FiUsers size={20} />,
    },
    {
      name: "Team Finding",
      path: "/team-finding",
      icon: <FiSearch size={20} />,
    },
    {
      name: "My Profile",
      path: "/profile",
      icon: <FiUser size={20} />,
    },
    ...(user?.email === "suganya@gmail.com"
    ? [
        {
          name: "Admin Dashboard",
          path: "/admin-dashboard",
          icon: <FiShield size={20} />,
        },
      ]
    : []),

  ];

  return (
   <div className="w-64 min-h-screen bg-white border-r border-slate-200 flex-shrink-0">

      {/* Logo */}
      <div className="p-6">
       <h1 className="text-4xl font-bold text-slate-900">
  HackMate
</h1>

        <p className="text-sm text-slate-400">
          Team Formation
        </p>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4">

        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition ${
              location.pathname === item.path
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      
    </div>
  );
}

export default Sidebar;