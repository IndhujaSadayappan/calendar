"use client"

import { useContext, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { TaskContext } from "../context/TaskContext"
import TaskForm from "../components/TaskForm"
import "../styles/TaskDetails.css"

const TaskDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask, updateTask, deleteTask } = useContext(TaskContext)
  const [isEditing, setIsEditing] = useState(false)

  const task = getTask(id)

  if (!task) {
    return (
      <div className="task-not-found">
        <h2>Task Not Found</h2>
        <p>The task you're looking for doesn't exist or has been deleted.</p>
        <button onClick={() => navigate("/")} className="back-btn">
          Back to Tasks
        </button>
      </div>
    )
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleUpdate = (updatedTask) => {
    updateTask(id, updatedTask)
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask(id)
      navigate("/")
    }
  }

  const handleToggleComplete = () => {
    updateTask(id, { completed: !task.completed })
  }

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="task-details-container">
      {isEditing ? (
        <>
          <h1>Edit Task</h1>
          <TaskForm initialValues={task} onSubmit={handleUpdate} buttonText="Update Task" />
          <button className="cancel-btn" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </>
      ) : (
        <>
          <div className="task-details-header">
            <h1>{task.title}</h1>
            <div className="task-status">
              <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
              <span className={`status-badge ${task.completed ? "completed" : "pending"}`}>
                {task.completed ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          <div className="task-details-content">
            <div className="task-info">
              <div className="info-item">
                <span className="info-label">Date & Time:</span>
                <span className="info-value">{formatDate(task.dateTime)}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Notification:</span>
                <span className="info-value">
                  {formatDate(task.notificationTime)} via {task.notificationMethod}
                </span>
              </div>

              {task.location && (
                <div className="info-item">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{task.location}</span>
                </div>
              )}

              {task.summary && (
                <div className="info-item summary">
                  <span className="info-label">Summary:</span>
                  <p className="info-value">{task.summary}</p>
                </div>
              )}

              <div className="info-item">
                <span className="info-label">Created:</span>
                <span className="info-value">{formatDate(task.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="task-actions">
            <button
              className={`complete-btn ${task.completed ? "uncomplete" : "complete"}`}
              onClick={handleToggleComplete}
            >
              {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
            </button>
            <button className="edit-btn" onClick={handleEdit}>
              Edit Task
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete Task
            </button>
          </div>

          <button className="back-btn" onClick={() => navigate("/")}>
            Back to Tasks
          </button>
        </>
      )}
    </div>
  )
}

export default TaskDetails
