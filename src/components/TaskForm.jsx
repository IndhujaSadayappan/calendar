"use client"

import { useState, useContext, useEffect } from "react"
import { SettingsContext } from "../context/SettingsContext"
import "../styles/TaskForm.css"

const TaskForm = ({ initialValues = {}, onSubmit, buttonText = "Save Task" }) => {
  const { settings } = useContext(SettingsContext)

  const [formData, setFormData] = useState({
    title: "",
    dateTime: "",
    priority: settings.defaultPriority,
    notificationTime: "",
    summary: "",
    location: "",
    notificationMethod: settings.defaultNotificationMethod,
    userId: settings.deviceId,
    ...initialValues,
  })

  // Update form when settings change
  useEffect(() => {
    if (!initialValues.priority) {
      setFormData((prev) => ({ ...prev, priority: settings.defaultPriority }))
    }
    if (!initialValues.notificationMethod) {
      setFormData((prev) => ({ ...prev, notificationMethod: settings.defaultNotificationMethod }))
    }
  }, [settings, initialValues])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Calculate default notification time (15 minutes before task by default)
  const calculateDefaultNotificationTime = () => {
    if (formData.dateTime) {
      const taskDate = new Date(formData.dateTime)
      taskDate.setMinutes(taskDate.getMinutes() - settings.reminderTime)
      return taskDate.toISOString().slice(0, 16) // Format for datetime-local input
    }
    return ""
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Task Title*</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter task title"
        />
      </div>

      <div className="form-group">
        <label htmlFor="dateTime">Date & Time*</label>
        <input
          type="datetime-local"
          id="dateTime"
          name="dateTime"
          value={formData.dateTime}
          onChange={(e) => {
            handleChange(e)
            // If notification time is empty, set it to default (15 min before task)
            if (!formData.notificationTime) {
              const taskDate = new Date(e.target.value)
              taskDate.setMinutes(taskDate.getMinutes() - settings.reminderTime)
              setFormData((prev) => ({
                ...prev,
                notificationTime: taskDate.toISOString().slice(0, 16),
              }))
            }
          }}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="priority">Priority*</label>
        <select id="priority" name="priority" value={formData.priority} onChange={handleChange} required>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="notificationTime">Notification Time*</label>
        <input
          type="datetime-local"
          id="notificationTime"
          name="notificationTime"
          value={formData.notificationTime || calculateDefaultNotificationTime()}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="notificationMethod">Notification Method*</label>
        <select
          id="notificationMethod"
          name="notificationMethod"
          value={formData.notificationMethod}
          onChange={handleChange}
          required
        >
          <option value="Push">Push</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="SMS">SMS</option>
          <option value="Email">Email</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="summary">Summary (Optional)</label>
        <textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Enter task summary or description"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Location (Optional)</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter task location"
        />
      </div>

      <button type="submit" className="submit-btn">
        {buttonText}
      </button>
    </form>
  )
}

export default TaskForm
