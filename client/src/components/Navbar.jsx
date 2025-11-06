import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">
          Smart Meeting
        </Link>
        <div className="space-x-4">
          <Link to="/dashboard" className="hover:text-gray-200">
            Dashboard
          </Link>
          <Link to="/create-meeting" className="hover:text-gray-200">
            Create Meeting
          </Link>
          <Link to="/attendance" className="hover:text-gray-200">
            Attendance
          </Link>
        </div>
      </div>
    </nav>
  );
}
