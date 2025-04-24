"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import "../styles/Navbar.css"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <NavLink to="/">TaskMaster</NavLink>
        </div>

        <div className="menu-icon" onClick={toggleMenu}>
          <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={toggleMenu}
            >
              Tasks
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/add"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={toggleMenu}
            >
              Add Task
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/notifications"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={toggleMenu}
            >
              Notifications
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/settings"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              onClick={toggleMenu}
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
