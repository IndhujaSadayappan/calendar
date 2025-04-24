"use client"

import { useState, useEffect } from "react"
import "../styles/VoiceInput.css"

const VoiceInput = ({ onTranscriptReceived }) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setError("Speech recognition is not supported in this browser.")
      return
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onstart = () => {
      setIsListening(true)
      setError("")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      setError(`Error occurred in recognition: ${event.error}`)
      setIsListening(false)
    }

    recognition.onresult = (event) => {
      const current = event.resultIndex
      const currentTranscript = event.results[current][0].transcript

      setTranscript(currentTranscript)

      // If this is a final result, send it to the parent component
      if (event.results[current].isFinal) {
        onTranscriptReceived(currentTranscript)
      }
    }

    // Store recognition instance
    window.recognition = recognition

    return () => {
      // Clean up
      if (window.recognition) {
        window.recognition.stop()
      }
    }
  }, [onTranscriptReceived])

  const toggleListening = () => {
    if (isListening) {
      window.recognition.stop()
    } else {
      setTranscript("")
      window.recognition.start()
    }
  }

  return (
    <div className="voice-input-container">
      <button className={`voice-button ${isListening ? "listening" : ""}`} onClick={toggleListening} disabled={!!error}>
        <i className={`fas ${isListening ? "fa-stop" : "fa-microphone"}`}></i>
        {isListening ? "Stop Listening" : "Start Voice Input"}
      </button>

      {error && <p className="voice-error">{error}</p>}

      {transcript && (
        <div className="transcript-container">
          <h4>Transcript:</h4>
          <p className="transcript-text">{transcript}</p>
        </div>
      )}
    </div>
  )
}

export default VoiceInput
