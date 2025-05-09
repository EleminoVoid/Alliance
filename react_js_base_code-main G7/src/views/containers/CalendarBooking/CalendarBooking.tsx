import React, { useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

export function CalendarBooking() {
  useEffect(() => {
    // Initialization logic if needed
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const date = (form.elements.namedItem("date") as HTMLInputElement).value;
    const startTime = (form.elements.namedItem("startTime") as HTMLInputElement).value;
    const endTime = (form.elements.namedItem("endTime") as HTMLInputElement).value;
    const isRecurring = (form.elements.namedItem("recurring") as HTMLInputElement).checked;

    if (!date || !startTime || !endTime) {
      alert("Please fill in all fields.");
      return;
    }
    if (startTime >= endTime) {
      alert("End time must be after start time.");
      return;
    }

    alert("Booking logic handled here.");
  };

  return (
    <div className="marshal-container">
    

      <main className="main-content">
        <section className="calendar-section">
          <div className="section-title">Calendar</div>
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
          />
        </section>
        <aside className="booking-section">
          <h2>Room 1</h2>
          <img
            src="https://storage.googleapis.com/a1aa/image/05f97f0f-f572-4254-819e-d8de80ea65ac.jpg"
            alt="Office room"
            className="room-image"
          />
          <label className="toggle-label">
            <input id="recurring" name="recurring" type="checkbox" />
            <span>Recurring Booking</span>
          </label>
          <form id="bookingForm" onSubmit={handleSubmit}>
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" required />

            <label>Time</label>
            <div className="time-inputs">
              <input id="startTime" name="startTime" type="time" required />
              <span>--</span>
              <input id="endTime" name="endTime" type="time" required />
            </div>

            <button type="submit">Book</button>
          </form>
        </aside>
      </main>
    </div>
  );
}
