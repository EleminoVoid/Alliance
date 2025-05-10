"use client"

import type React from "react"
import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"

export function CalendarBooking() {
  const [selectedRoom, setSelectedRoom] = useState("Room 1")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>("") // State for the selected date

  useEffect(() => {
    // Initialization logic if needed
  }, [])

  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr) 
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const date = (form.elements.namedItem("date") as HTMLInputElement).value
    const startTime = (form.elements.namedItem("startTime") as HTMLInputElement).value
    const endTime = (form.elements.namedItem("endTime") as HTMLInputElement).value
    const isRecurring = (form.elements.namedItem("recurring") as HTMLInputElement).checked

    if (!date || !startTime || !endTime) {
      alert("Please fill in all fields.")
      return
    }
    if (startTime >= endTime) {
      alert("End time must be after start time.")
      return
    }

    alert(`Room booked: ${selectedRoom} on ${date} from ${startTime} to ${endTime}${isRecurring ? " (recurring)" : ""}`)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const rooms = ["Room 1", "Room 2", "Room 3", "Conference Hall"]

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#eef7f8",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
          flexDirection: window.innerWidth < 768 ? "column" : "row",
        }}
      >
        <section
          style={{
            flex: 2,
            padding: "1rem",
            backgroundColor: "white",
            border: "1px solid #ccc",
            marginRight: window.innerWidth < 768 ? "0" : "1rem",
            marginBottom: window.innerWidth < 768 ? "1rem" : "0",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              fontSize: "1.5rem",
              textAlign: "center",
              backgroundColor: "#b1cddd",
              padding: "0.5rem 0",
              fontWeight: 500,
              marginBottom: "1rem",
              borderRadius: "4px",
            }}
          >
            Calendar
          </div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            selectable
            dayMaxEvents
            events={[
              {
                id: "1",
                title: "Team Meeting",
                start: new Date().toISOString().slice(0, 10),
                color: "#6b4f6d",
              },
              {
                id: "2",
                title: "Project Review",
                start: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().slice(0, 10),
                color: "#6b4f6d",
              },
            ]}
            dateClick={handleDateClick} 
          />
        </section>
        <aside
          style={{
            flex: 1,
            backgroundColor: "#f5f7f8",
            borderLeft: window.innerWidth < 768 ? "none" : "1px solid #ccc",
            padding: "1.5rem",
            textAlign: "center",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <h2 style={{ fontSize: "1.3rem", margin: 0 }}>{selectedRoom}</h2>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              style={{
                padding: "0.4rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "white",
              }}
            >
              {rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>
          <img
            src="https://storage.googleapis.com/a1aa/image/05f97f0f-f572-4254-819e-d8de80ea65ac.jpg"
            alt="Office room"
            style={{
              width: "100%",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
              marginBottom: "1rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              justifyContent: "center",
              marginBottom: "1rem",
              fontSize: "0.95rem",
            }}
          >
            <input
              id="recurring"
              name="recurring"
              type="checkbox"
              style={{
                width: "16px",
                height: "16px",
                accentColor: "#604b66",
              }}
            />
            <span>Recurring Booking</span>
          </label>
          <form
            id="bookingForm"
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: "0.75rem",
              textAlign: "left",
            }}
          >
            <label htmlFor="date" style={{ fontWeight: 500 }}>
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              style={{
                padding: "0.4rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                width: "100%",
              }}
            />

            <label style={{ fontWeight: 500 }}>Time</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <input
                id="startTime"
                name="startTime"
                type="time"
                required
                style={{
                  padding: "0.4rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
              <span style={{ fontWeight: "bold" }}>--</span>
              <input
                id="endTime"
                name="endTime"
                type="time"
                required
                style={{
                  padding: "0.4rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  width: "100%",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: "#604b66",
                color: "white",
                padding: "0.6rem",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                marginTop: "0.5rem",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4e3b52")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#604b66")}
            >
              Book
            </button>
          </form>
        </aside>
      </main>
    </div>
  )
}