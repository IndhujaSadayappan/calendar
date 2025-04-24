"use client"

import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { TaskContext } from "../context/TaskContext"
import "../styles/NotificationHistory.css"

const NotificationHistory = () => {
  const { tasks, getMissedTasks } = useContext(TaskContext)
  const [filter, setFilter] = useState("all") // all, missed, sent

  // Get all tasks that have notification time in the past
  const pastNotifications = tasks.filter((task) => {
    const notificationTime = new Date(task.notificationTime)
    return notificationTime < new Date()
  })

  // Get missed tasks (past due date and not completed)
  const missedTasks = getMissedTasks()

  // Filter notifications based on the selected filter
  const filteredNotifications =
    filter === "all"
      ? pastNotifications
      : filter === "missed"
        ? missedTasks
        : pastNotifications.filter((task) => !missedTasks.includes(task))

  // Sort notifications by date (most recent first)
  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    return new Date(b.notificationTime) - new Date(a.notificationTime)
  })

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="notification-history-container">
      <h1>Notification History</h1>

      <div className="notification-filters">
        <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All Notifications
        </button>
        <button className={`filter-btn ${filter === "missed" ? "active" : ""}`} onClick={() => setFilter("missed")}>
          Missed Tasks
        </button>
        <button className={`filter-btn ${filter === "sent" ? "active" : ""}`} onClick={() => setFilter("sent")}>
          Sent Notifications
        </button>
      </div>

      {sortedNotifications.length > 0 ? (
        <div className="notification-list">
          {sortedNotifications.map((task) => (
            <div
              key={task.id}
              className={`notification-item ${task.completed ? "completed" : ""} ${
                new Date(task.dateTime) < new Date() && !task.completed ? "missed" : ""
              }`}
            >
              <div className="notification-content">
                <h3 className="notification-title">{task.title}</h3>
                <div className="notification-details">
                  <p className="notification-time">
                    <i className="far fa-clock"></i> Notification sent: {formatDate(task.notificationTime)}
                  </p>
                  <p className="notification-method">
                    <i className="far fa-bell"></i> Via: {task.notificationMethod}
                  </p>
                  <p className="task-time">
                    <i className="far fa-calendar"></i> Task time: {formatDate(task.dateTime)}
                  </p>
                </div>
                <div className="notification-status">
                  {task.completed ? (
                    <span className="status completed">Completed</span>
                  ) : new Date(task.dateTime) < new Date() ? (
                    <span className="status missed">Missed</span>
                  ) : (
                    <span className="status pending">Pending</span>
                  )}
                </div>
              </div>
              <Link to={`/task/${task.id}`} className="view-task-btn">
                View Task
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-notifications">
          <p>No notifications found for the selected filter.</p>
        </div>
      )}
    </div>
  )
}

export default NotificationHistory
