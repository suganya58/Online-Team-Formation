import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const initials = user?.fullName
    ?.split(" ")
    .map((name) => name[0])
    .join("");

  return (
    <div className="h-20 bg-white border-b border-slate-200 flex items-center justify-end px-8">
      {/* Right Side */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 px-3 py-2 rounded-2xl transition"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            {initials || "U"}
          </div>
          <div>
            <h4 className="font-semibold">
              {user?.fullName || "User"}
            </h4>
            <p className="text-sm text-slate-500">
              {user?.role === "admin"
                ? "Admin"
                : "Hackathon Participant"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Navbar;