import { useContext, useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { TaskContext } from "../context/TaskContext"
import { SettingsContext } from "../context/SettingsContext"
import TaskForm from "../components/TaskForm"
import VoiceInput from "../components/VoiceInput"
import "../styles/AddTask.css"

const AddTask = () => {
  const { addTask } = useContext(TaskContext)
  const { settings } = useContext(SettingsContext)
  const navigate = useNavigate()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [mode, setMode] = useState("manual")
  const [extractedData, setExtractedData] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const voiceInputRef = useRef()

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  useEffect(() => {
    if (mode === "voice" && voiceInputRef.current?.startListening) {
      voiceInputRef.current.startListening()
    }
  }, [mode])

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-open")
    } else {
      document.body.classList.remove("modal-open")
    }
  }, [isModalOpen])

  const handleSubmit = (formData) => {
    const taskId = addTask(formData)
    navigate(`/task/${taskId}`)
    setIsModalOpen(false)
  }

  const handleVoiceClick = () => {
    setMode("voice")
    setExtractedData(null)
  }

  const handleManualClick = () => {
    setMode("manual")
    setExtractedData(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const processVoiceInput = async (transcript) => {
    if (!transcript) return
    setIsProcessing(true)

    try {
      const titleMatch = transcript.match(/^(.*?)(?=\son\s|\sat\s|\stomorrow|\stoday|$)/i)
      const title = titleMatch ? titleMatch[0].trim() : transcript

      const dateTime = selectedDate ? new Date(selectedDate) : new Date()

      if (transcript.includes("tomorrow")) {
        dateTime.setDate(dateTime.getDate() + 1)
      }

      const dateTimeMatch = transcript.match(/on\s(.*?)(?=\sat\s|$)/i)
      if (dateTimeMatch && dateTimeMatch[1].includes("next")) {
        dateTime.setDate(dateTime.getDate() + 7)
      }

      const timeMatch = transcript.match(/at\s(.*?)(?=\son\s|$)/i)
      if (timeMatch) {
        const timeStr = timeMatch[1]
        const hourMatch = timeStr.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i)
        if (hourMatch) {
          let hour = Number.parseInt(hourMatch[1])
          const minute = hourMatch[2] ? Number.parseInt(hourMatch[2]) : 0
          const ampm = hourMatch[3]?.toLowerCase()

          if (ampm === "pm" && hour < 12) hour += 12
          if (ampm === "am" && hour === 12) hour = 0

          dateTime.setHours(hour, minute, 0, 0)
        }
      }

      let priority = settings.defaultPriority
      if (transcript.includes("high priority") || transcript.includes("urgent")) {
        priority = "High"
      } else if (transcript.includes("low priority") || transcript.includes("not urgent")) {
        priority = "Low"
      }

      const locationMatch = transcript.match(/at\s(.*?)(?=\son\s|\sat\s|$)/i)
      const location = locationMatch ? locationMatch[1].trim() : ""

      const notificationTime = new Date(dateTime)
      notificationTime.setMinutes(notificationTime.getMinutes() - settings.reminderTime)

      const summaryMatch = transcript.match(/(?:about|regarding|summary)\s(.*?)$/i)
      const summary = summaryMatch ? summaryMatch[1].trim() : ""

      setExtractedData({
        title,
        dateTime: dateTime.toISOString().slice(0, 16),
        priority,
        notificationTime: notificationTime.toISOString().slice(0, 16),
        summary,
        location,
        notificationMethod: settings.defaultNotificationMethod,
        userId: settings.deviceId,
      })
    } catch (error) {
      console.error("Error processing voice input:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="add-task-container">
      <div className="main-content wide-layout">
        <div className="calendar-section">
          <h2 className="month-title">
            {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h2>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>

        <div className="task-display">
          <div className="task-header">
            <h2>{formattedDate}</h2>
            <div className="task-buttons">
              <button className="voice-btn" onClick={handleVoiceClick}>Voice Input</button>
              <button className="add-btn" onClick={handleManualClick}>Add Task</button>
            </div>
          </div>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-container">
                <button className="close-btn" onClick={closeModal}>
                  <i className="fas fa-times"></i>
                </button>

                <TaskForm
                  initialValues={extractedData || { dateTime: selectedDate.toISOString().slice(0, 16) }}
                  onSubmit={handleSubmit}
                  buttonText="Add Task"
                />
              </div>
            </div>
          )}

          <div className="input-methods">
            {mode === "voice" && (
              <div className="voice-input-section">
                <VoiceInput ref={voiceInputRef} onTranscriptReceived={processVoiceInput} />
                {isProcessing && (
                  <div className="processing-indicator">
                    <div className="spinner"></div>
                    <p>Processing your request...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddTask
