"use client"

import { createContext, useState, useEffect } from "react"

export const SettingsContext = createContext()

const defaultSettings = {
  defaultPriority: "Medium",
  defaultNotificationMethod: "Push",
  reminderTime: 15, // minutes before task
  defaultAlertType: "Sound",
  deviceId: `device_${Math.random().toString(36).substr(2, 9)}`,
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem("settings")
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings
  })

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings })
  }

  return <SettingsContext.Provider value={{ settings, updateSettings }}>{children}</SettingsContext.Provider>
}
