import React from "react";

function Footer() {
  return (
    <footer className="bg-blue-100 py-4 text-center">
      <p className="text-gray-700 text-sm">
        &copy; {new Date().getFullYear()} Your Website Name. All rights
        reserved.
      </p>
    </footer>
  );
}

export default Footer;
