"use client"

import { createContext, useState, useEffect } from "react"

export const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks")
    return savedTasks ? JSON.parse(savedTasks) : []
  })

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setTasks([...tasks, newTask])
    return newTask.id
  }

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updatedTask } : task)))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const getTask = (id) => {
    return tasks.find((task) => task.id === id)
  }

  const getMissedTasks = () => {
    const now = new Date()
    return tasks.filter((task) => {
      const taskDate = new Date(task.dateTime)
      return taskDate < now && !task.completed
    })
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTask,
        getMissedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
