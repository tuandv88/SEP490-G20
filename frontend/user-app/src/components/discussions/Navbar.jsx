import React from "react";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <a className="navbar-brand" href="/">Forum</a>
        <div className="navbar-nav">
          <a className="nav-link active" href="/">Home</a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
