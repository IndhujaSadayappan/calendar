import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import TaskList from "./pages/TaskList"
import AddTask from "./pages/AddTask"
import TaskDetails from "./pages/TaskDetails"
import Settings from "./pages/Settings"
import NotificationHistory from "./pages/NotificationHistory"
import { TaskProvider } from "./context/TaskContext"
import { SettingsProvider } from "./context/SettingsContext"
import "./styles/App.css"

function App() {
  return (
    <SettingsProvider>
      <TaskProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<TaskList />} />
              <Route path="/add" element={<AddTask />} />
              <Route path="/task/:id" element={<TaskDetails />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<NotificationHistory />} />
            </Routes>
          </main>
        </div>
      </TaskProvider>
    </SettingsProvider>
  )
}

export default App
