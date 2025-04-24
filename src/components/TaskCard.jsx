import { Link } from "react-router-dom"
import "../styles/TaskCard.css"

const TaskCard = ({ task }) => {
  const priorityClass = `priority-${task.priority.toLowerCase()}`

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
    <div className={`task-card ${priorityClass}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className="task-priority">{task.priority}</span>
      </div>

      <div className="task-details">
        <p className="task-date">
          <i className="far fa-calendar"></i> {formatDate(task.dateTime)}
        </p>

        {task.location && (
          <p className="task-location">
            <i className="fas fa-map-marker-alt"></i> {task.location}
          </p>
        )}

        <p className="task-notification">
          <i className="far fa-bell"></i> {task.notificationMethod}
        </p>
      </div>

      {task.summary && <p className="task-summary">{task.summary}</p>}

      <Link to={`/task/${task.id}`} className="view-details-btn">
        View Details
      </Link>
    </div>
  )
}

export default TaskCard
