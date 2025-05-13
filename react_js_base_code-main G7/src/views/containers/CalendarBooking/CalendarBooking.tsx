import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./CalendarBooking.css";

export function CalendarBooking() {
  const [selectedRoom, setSelectedRoom] = useState("Room 1");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [calendarEvents, setCalendarEvents] = useState<any[]>([
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
  ]);

  useEffect(() => {
    if (selectedDate) {
      setCalendarEvents((prevEvents) => [
        ...prevEvents.filter((event) => event.id !== "selected-date"),
        {
          id: "selected-date",
          start: selectedDate,
          display: "background",
          backgroundColor: "#ffcc00",
        },
      ]);
    } else {
      setCalendarEvents((prevEvents) => prevEvents.filter((event) => event.id !== "selected-date"));
    }
  }, [selectedDate]);

  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
  };

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

    alert(`Room booked: ${selectedRoom} on ${date} from ${startTime} to ${endTime}${isRecurring ? " (recurring)" : ""}`);
  };

  const rooms = ["Room 1", "Room 2", "Room 3", "Conference Hall"];

  return (
    <div className="calendar-booking-container">
      <main className="calendar-booking-mainContent">
        <section className="calendar-booking-calendarSection">
          <div className="calendar-booking-sectionTitle">Calendar</div>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            height="auto"
            selectable
            dayMaxEvents
            events={calendarEvents}
            dateClick={handleDateClick}
          />
        </section>
        <aside className="calendar-booking-bookingSection">
          <div className="calendar-booking-roomHeader">
            <h2 className="calendar-booking-roomTitle">{selectedRoom}</h2>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="calendar-booking-roomSelect"
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
            className="calendar-booking-roomImage"
          />
          <label className="calendar-booking-toggleLabel">
            <input
              id="recurring"
              name="recurring"
              type="checkbox"
              className="calendar-booking-checkbox"
            />
            <span>Recurring Booking</span>
          </label>
          <form id="bookingForm" onSubmit={handleSubmit} className="calendar-booking-form">
            <label htmlFor="date" className="calendar-booking-label">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="calendar-booking-input"
            />

            <label className="calendar-booking-label">Time</label>
            <div className="calendar-booking-timeInputs">
              <input
                id="startTime"
                name="startTime"
                type="time"
                required
                className="calendar-booking-input"
              />
              <span className="calendar-booking-timeSeparator">--</span>
              <input
                id="endTime"
                name="endTime"
                type="time"
                required
                className="calendar-booking-input"
              />
            </div>

            <button type="submit" className="calendar-booking-submitButton">
              Book
            </button>
          </form>
        </aside>
      </main>
    </div>
  );
}