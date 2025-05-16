"use client"

import type React from "react"
import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./CalendarBooking.css"

interface Room {
  id: string
  name: string
  image: string
}

interface Booking {
  id: string
  userId: number
  roomId: string
  startDate: string
  endDate: string
  type: "single" | "recurring"
}

export function CalendarBooking() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [showTimeView, setShowTimeView] = useState<boolean>(false)
  const [isRecurring, setIsRecurring] = useState<boolean>(false)
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch rooms and bookings from db.json
  useEffect(() => {
    // Fetch rooms
    fetch("http://localhost:3000/rooms")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch rooms")
        }
        return response.json()
      })
      .then((data) => {
        setRooms(data)
        if (data.length > 0) {
          setSelectedRoom(data[0].id)
        }
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error)
        toast.error("Failed to load rooms data")
      })

    // Fetch bookings
    fetch("http://localhost:3000/bookings")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch bookings")
        }
        return response.json()
      })
      .then((data) => {
        setBookings(data)
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error)
        toast.error("Failed to load bookings data")
      })
  }, [])

  // Handle date click in the calendar
  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr)
    setShowTimeView(true)
  }

  // Toggle weekday selection for recurring bookings
  const handleWeekdayToggle = (day: string) => {
    setSelectedWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  // Handle booking submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const form = e.currentTarget
    const startTime = (form.elements.namedItem("startTime") as HTMLInputElement)?.value
    const endTime = (form.elements.namedItem("endTime") as HTMLInputElement)?.value

    if (!selectedDate || !startTime || !endTime) {
      toast.error("Please fill in all fields.")
      setIsLoading(false)
      return
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time.")
      setIsLoading(false)
      return
    }

    const userId = localStorage.getItem("userId") ? Number.parseInt(localStorage.getItem("userId") as string) : 1 // Default to user 1 if not logged in

    // Create the base booking
    const newBooking: Omit<Booking, "id"> = {
      userId,
      roomId: selectedRoom,
      startDate: `${selectedDate}T${startTime}:00`,
      endDate: `${selectedDate}T${endTime}:00`,
      type: isRecurring ? "recurring" : "single",
    }

    // If recurring, create bookings for selected weekdays
    let allBookings = []

    if (isRecurring && selectedWeekdays.length > 0) {
      // For simplicity, we'll use the same date but mark it as recurring
      // In a real app, you'd generate actual dates for each weekday
      allBookings = selectedWeekdays.map((day, index) => ({
        ...newBooking,
        id: `${Date.now()}-${index}`,
        type: "recurring",
      }))
    } else {
      allBookings = [
        {
          ...newBooking,
          id: Date.now().toString(),
        },
      ]
    }

    // Post bookings to the server
    fetch("http://localhost:3000/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(allBookings),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create booking")
        }
        return response.json()
      })
      .then(() => {
        setBookings((prev) => [...prev, ...allBookings])
        toast.success(
          `Room booked: ${selectedRoom} on ${selectedDate} from ${startTime} to ${endTime}${
            isRecurring ? " (recurring)" : ""
          }`,
        )

        // Reset form
        form.reset()
        setSelectedWeekdays([])
      })
      .catch((error) => {
        console.error("Error creating booking:", error)
        toast.error("Failed to create booking. Please try again.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  // Format bookings for FullCalendar
  const formattedEvents = bookings.map((booking) => ({
    id: booking.id,
    title: booking.type === "recurring" ? "🔄 Recurring Booking" : "Booking",
    start: booking.startDate,
    end: booking.endDate,
    extendedProps: {
      userId: booking.userId,
      roomId: booking.roomId,
      type: booking.type,
    },
  }))

  // Get the selected room data
  const selectedRoomData = rooms.find((room) => room.id === selectedRoom)

  // Filter events for the time view
  const filteredEvents = formattedEvents.filter((event) => {
    const eventDate = event.start ? event.start.toString().slice(0, 10) : ""
    return event.extendedProps.roomId === selectedRoom && eventDate === selectedDate
  })

  return (
    <div className={`calendar-booking-container ${showTimeView ? "show-time-view" : ""}`}>
      <ToastContainer />

      <div className={`calendar-booking-main ${showTimeView ? "shifted" : ""}`}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          dateClick={handleDateClick}
          events={formattedEvents}
          headerToolbar={{
            left: "",
            center: "title",
            right: "prev,next",
          }}
          dayCellClassNames={(arg) => {
            return arg.dateStr === selectedDate ? "selected-date" : ""
          }}
        />
      </div>

      {showTimeView && (
        <div className="calendar-booking-time-view">
          <div className="calendar-booking-time-header">
            <h2>Schedule for {selectedDate}</h2>
            <button className="calendar-booking-close-btn" onClick={() => setShowTimeView(false)}>
              ×
            </button>
          </div>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            height="auto"
            selectable
            events={filteredEvents}
            headerToolbar={false}
            slotDuration="00:30:00"  
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            initialDate={selectedDate}
          />
        </div>
      )}

      <aside className="calendar-booking-rightSidebar">
        <div className="calendar-booking-roomHeader">
          <h2 className="calendar-booking-roomTitle">{selectedRoomData?.name || "Select a Room"}</h2>
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
            src={selectedRoomData.image || "/placeholder.svg"}
            alt={selectedRoomData.name}
            className="calendar-booking-roomImage"
          />
        )}

        <form id="bookingForm" onSubmit={handleSubmit} className="calendar-booking-form">
         <div className="calendar-booking-recurring-toggle">
            <label className="calendar-booking-toggle">
              <span className="calendar-booking-toggle-label">Recurring Booking</span>
              <input type="checkbox" checked={isRecurring} onChange={() => setIsRecurring(!isRecurring)} />
              <span className="calendar-booking-toggle-slider"></span>
            </label>
          </div>
          
          {isRecurring && (
            <div className="calendar-booking-weekday-buttons">
              {["M", "T", "W", "Th", "F", "S", "Su"].map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`calendar-booking-weekday-button ${selectedWeekdays.includes(day) ? "selected" : ""}`}
                  onClick={() => handleWeekdayToggle(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          )}

         
        

          {!isRecurring && (
              <div>
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
          </div>
          )}

           {isRecurring && (
            <>
              <div>
                <label htmlFor="start-date" className="calendar-booking-label">
                  Start Date
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
              </div>
              <div>
                <label htmlFor="end-date" className="calendar-booking-label">
                  End Date
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
              </div>
            </>
          )}


          <div>
            <label className="calendar-booking-label">Time</label>
            <div className="calendar-booking-timeInputs">
              <div className="calendar-booking-timeInputs">
              <input 
                id="startTime" 
                name="startTime" 
                type="time" 
                required 
                className="calendar-booking-input" 
                step="1800"
                min="08:00"
                max="19:30"
              />
              <span className="calendar-booking-timeSeparator">--</span>
              <input 
                id="endTime" 
                name="endTime" 
                type="time" 
                required 
                className="calendar-booking-input" 
                step="1800"
                min="08:30"
                max="20:00"
              />
            </div>
            </div>
          </div>

          

          <button type="submit" className="calendar-booking-submitButton" disabled={isLoading}>
            {isLoading ? "Booking..." : "Book"}
          </button>
        </form>
      </aside>
    </div>
  )
}
