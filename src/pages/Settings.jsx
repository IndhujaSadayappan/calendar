"use client"

import { useContext, useState } from "react"
import { SettingsContext } from "../context/SettingsContext"
import "../styles/Settings.css"

const Settings = () => {
  const { settings, updateSettings } = useContext(SettingsContext)
  const [formData, setFormData] = useState({ ...settings })
  const [saveMessage, setSaveMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleNumberChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: Number.parseInt(value, 10) })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateSettings(formData)
    setSaveMessage("Settings saved successfully!")

    // Clear the message after 3 seconds
    setTimeout(() => {
      setSaveMessage("")
    }, 3000)
  }

  return (
    <div className="settings-container">
      <h1>User Preferences</h1>

      {saveMessage && <div className="save-message success">{saveMessage}</div>}

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="defaultPriority">Default Task Priority</label>
          <select id="defaultPriority" name="defaultPriority" value={formData.defaultPriority} onChange={handleChange}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="defaultNotificationMethod">Default Notification Method</label>
          <select
            id="defaultNotificationMethod"
            name="defaultNotificationMethod"
            value={formData.defaultNotificationMethod}
            onChange={handleChange}
          >
            <option value="Push">Push</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="SMS">SMS</option>
            <option value="Email">Email</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reminderTime">Default Reminder Time (minutes before task)</label>
          <input
            type="number"
            id="reminderTime"
            name="reminderTime"
            min="1"
            max="1440"
            value={formData.reminderTime}
            onChange={handleNumberChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="defaultAlertType">Default Alert Type</label>
          <select
            id="defaultAlertType"
            name="defaultAlertType"
            value={formData.defaultAlertType}
            onChange={handleChange}
          >
            <option value="Sound">Sound</option>
            <option value="Vibration">Vibration</option>
            <option value="Both">Both</option>
            <option value="Silent">Silent</option>
          </select>
        </div>

        

        <button type="submit" className="save-btn">
          Save Settings
        </button>
      </form>
    </div>
  )
}

export default Settings
