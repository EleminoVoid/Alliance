import { useState } from "react"
import "./Dashboard.css"

export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState<"days" | "weeks" | "months" | "years">("weeks")

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>Room Management - Stats</h1>
        <div className="time-range-tabs">
          <button className={`tab ${timeRange === "days" ? "active" : ""}`} onClick={() => setTimeRange("days")}>
            Days
          </button>
          <button className={`tab ${timeRange === "weeks" ? "active" : ""}`} onClick={() => setTimeRange("weeks")}>
            Weeks
          </button>
          <button className={`tab ${timeRange === "months" ? "active" : ""}`} onClick={() => setTimeRange("months")}>
            Months
          </button>
          <button className={`tab ${timeRange === "years" ? "active" : ""}`} onClick={() => setTimeRange("years")}>
            Years
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="bookings-chart">
          <div className="chart-header">
            <div className="chart-icon">📦</div>
            <h3>NUMBER OF BOOKINGS PER WEEK</h3>
          </div>

          <div className="donut-chart">
            <div className="donut-center">
              <div className="donut-label">Week 8 2018</div>
              <div className="donut-total">Total: 21</div>
            </div>
          </div>

          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color light-blue"></div>
              <div className="legend-label">11</div>
            </div>
            <div className="legend-item">
              <div className="legend-color blue"></div>
              <div className="legend-label">1</div>
            </div>
            <div className="legend-item">
              <div className="legend-color orange"></div>
              <div className="legend-label">3</div>
            </div>
            <div className="legend-item">
              <div className="legend-color light-orange"></div>
              <div className="legend-label">6</div>
            </div>
            <div className="legend-item">
              <div className="legend-color green"></div>
              <div className="legend-label">0</div>
            </div>
          </div>

          <div className="line-chart">
            {/* Line chart visualization would go here */}
            {/* This would typically be implemented with a charting library */}
          </div>
        </div>

        <div className="most-used-room">
          <div className="chart-header">
            <div className="chart-icon">👥</div>
            <h3>Most Used Room</h3>
          </div>
          <div className="room-usage-content">{/* Room usage data would go here */}</div>
        </div>

        <div className="trendline">
          <h3>Trendline</h3>
          <div className="trendline-chart">
            {/* Trendline chart visualization would go here */}
            {/* This would typically be implemented with a charting library */}
          </div>
        </div>
      </div>
    </div>
  )
}
