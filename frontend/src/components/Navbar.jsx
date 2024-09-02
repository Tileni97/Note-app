import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, LogIn, UserPlus } from "lucide-react";
import { Button } from "./ui/button";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold">
            Notes App
          </Link>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/notes">
                  <Button variant="ghost">My Notes</Button>
                </Link>
                <Button onClick={handleLogout} variant="secondary">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">
                    <LogIn className="mr-2 h-4 w-4" /> Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="secondary">
                    <UserPlus className="mr-2 h-4 w-4" /> Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
