import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./CalendarBooking.css";

interface Room {
  id: string;
  name: string;
  image: string;
}

interface Booking {
  id: string;
  title: string;
  start: string;
  end: string;
  roomId: string;
}

export function CalendarBooking() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("room-1");
  const [selectedDate, setSelectedDate] = useState<string>("2025-05-14");
  const [calendarEvents, setCalendarEvents] = useState<Booking[]>([
    {
      id: "1",
      title: "Team Meeting",
      start: "2025-05-14T10:00:00",
      end: "2025-05-14T11:00:00",
      roomId: "room-1",
    },
    {
      id: "2",
      title: "Project Review",
      start: "2025-05-14T14:00:00",
      end: "2025-05-14T15:30:00",
      roomId: "room-2",
    },
    {
      id: "3",
      title: "Client Presentation",
      start: "2025-05-14T09:00:00",
      end: "2025-05-14T10:30:00",
      roomId: "room-1",
    },
    {
      id: "4",
      title: "Weekly Sync",
      start: "2025-05-15T13:00:00",
      end: "2025-05-15T14:00:00",
      roomId: "room-2",
    },
    {
      id: "5",
      title: "Brainstorming Session",
      start: "2025-05-15T11:00:00",
      end: "2025-05-15T12:30:00",
      roomId: "room-1",
    },
  ]);
  const [recurringDays, setRecurringDays] = useState<string[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/rooms").then((response) => {
      setRooms(response.data);
      if (response.data.length > 0) {
        setSelectedRoom(response.data[0].id);
      }
    });

    axios.get("http://localhost:3000/bookings").then((response) => {
      setCalendarEvents((prev) => [...prev, ...response.data]);
    });
  }, []);

  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
  };

  const handleRecurringDayToggle = (day: string) => {
    setRecurringDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const date = (form.elements.namedItem("date") as HTMLInputElement)?.value;
    const startTime = (form.elements.namedItem("startTime") as HTMLInputElement)?.value;
    const endTime = (form.elements.namedItem("endTime") as HTMLInputElement)?.value;

    if (!date || !startTime || !endTime) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (startTime >= endTime) {
      toast.error("End time must be after start time.");
      return;
    }

    const newBooking = {
      id: Date.now().toString(),
      title: "New Booking",
      start: `${date}T${startTime}`,
      end: `${date}T${endTime}`,
      roomId: selectedRoom,
    };

    const recurringBookings = recurringDays.map((day) => ({
      ...newBooking,
      id: `${newBooking.id}-${day}`,
      start: `${day}T${startTime}`,
      end: `${day}T${endTime}`,
    }));

    const allBookings = [newBooking, ...recurringBookings];

    axios.post("http://localhost:3000/bookings", allBookings).then(() => {
      setCalendarEvents((prev) => [...prev, ...allBookings]);
      alert("Booking successfully created!");
    });

    toast.success(
      `Room booked: ${selectedRoom} on ${date} from ${startTime} to ${endTime}${
        recurringDays.length > 0 ? " (recurring)" : ""
      }`
    );
  };

  const selectedRoomData = rooms.find((room) => room.id === selectedRoom);

  return (
    <div className="calendar-booking-container">
      <ToastContainer />
      
      <aside className="calendar-booking-leftSidebar">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="500px"
          dateClick={handleDateClick}
          headerToolbar={{
            left: "",
            center: "title",
            right: "prev,next",
          }}
        />
      </aside>

      <main className="calendar-booking-mainContent">
        <section className="calendar-booking-calendarSection">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            height="auto"
            selectable
            events={calendarEvents.filter((event) => {
              const eventDate = event.start ? event.start.slice(0, 10) : "";
              return event.roomId === selectedRoom && eventDate === selectedDate;
            })}
            headerToolbar={{
              left: "",
              center: "title",
              right: "",
            }}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            validRange={{
              start: selectedDate || undefined,
              end: selectedDate || undefined,
            }}
          />
        </section>
      </main>

      <aside className="calendar-booking-rightSidebar">
        <div className="calendar-booking-roomHeader">
          <h2 className="calendar-booking-roomTitle">
            {selectedRoomData?.name || "Select a Room"}
          </h2>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="calendar-booking-roomSelect"
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>

        {selectedRoomData?.image && (
          <img
            src={selectedRoomData.image}
            alt={selectedRoomData.name}
            className="calendar-booking-roomImage"
          />
        )}

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

          <label className="calendar-booking-label">Recurring Days</label>
          <div className="calendar-booking-recurringDays">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(
              (day) => (
                <label key={day} className="calendar-booking-recurringDay">
                  <input
                    type="checkbox"
                    value={day}
                    checked={recurringDays.includes(day)}
                    onChange={() => handleRecurringDayToggle(day)}
                  />
                  {day}
                </label>
              )
            )}
          </div>

          <button type="submit" className="calendar-booking-submitButton">
            Book
          </button>
        </form>
      </aside>
    </div>
  );
}
