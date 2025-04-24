"use client"

import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { TaskContext } from "../context/TaskContext"
import TaskCard from "../components/TaskCard"
import "../styles/TaskList.css"

const TaskList = () => {
  const { tasks } = useContext(TaskContext)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Filter tasks based on completion status and search term
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" || (filter === "completed" && task.completed) || (filter === "pending" && !task.completed)

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.summary && task.summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (task.location && task.location.toLowerCase().includes(searchTerm.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  // Sort tasks by date (most recent first)
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    return new Date(a.dateTime) - new Date(b.dateTime)
  })

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1>My Tasks</h1>
        <Link to="/add" className="add-task-btn">
          <i className="fas fa-plus"></i> Add New Task
        </Link>
      </div>

      <div className="task-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All
          </button>
          <button className={`filter-btn ${filter === "pending" ? "active" : ""}`} onClick={() => setFilter("pending")}>
            Pending
          </button>
          <button
            className={`filter-btn ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {sortedTasks.length > 0 ? (
        <div className="task-grid">
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="no-tasks">
          <p>No tasks found. {filter !== "all" ? "Try changing the filter or " : ""}Add a new task to get started!</p>
          <Link to="/add" className="add-task-btn">
            <i className="fas fa-plus"></i> Add New Task
          </Link>
        </div>
      )}
    </div>
  )
}

export default TaskList
