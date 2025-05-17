import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom";
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
  userId: string
  roomId: string
  startDate: string
  endDate: string
  type: "single" | "recurring"
}

export const CalendarBooking = () => {
  const { id: roomIdFromUrl } = useParams<{ id: string }>();
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [selectedRoom, setSelectedRoom] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [showTimeView, setShowTimeView] = useState<boolean>(false)
  const [isRecurring, setIsRecurring] = useState<boolean>(false)
  const [recurringStartDate, setRecurringStartDate] = useState<string>("");
  const [recurringEndDate, setRecurringEndDate] = useState<string>("");
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [calendarKey, setCalendarKey] = useState<number>(0)
  const [sidebarHeight, setSidebarHeight] = useState<string>("auto")

  const calendarRef = useRef<any>(null)
  const timeViewRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)

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
        setRooms(data);
        if (roomIdFromUrl && data.some((room: Room) => room.id === roomIdFromUrl)) {
          setSelectedRoom(roomIdFromUrl);
        } else if (data.length > 0) {
          setSelectedRoom(data[0].id);
        }
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error)
        toast.error("Failed to load rooms data")
      });

    // Fetch bookings
    fetch("http://localhost:3000/bookings")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to fetch bookings")
      return response.json()
    })
    .then((data) => {
      // Flatten bookings
      const flatBookings: Booking[] = [];
      data.forEach((entry: any) => {
        // If entry has numeric keys, it's a group (recurring or batch)
        const keys = Object.keys(entry).filter(k => !isNaN(Number(k)));
        if (keys.length > 0) {
          keys.forEach(k => {
            flatBookings.push(entry[k]);
          });
        } else {
          // Single booking object
          flatBookings.push(entry);
        }
      });
      setBookings(flatBookings);
    })
    .catch((error) => {
      console.error("Error fetching bookings:", error)
      toast.error("Failed to load bookings data")
    })
  }, [roomIdFromUrl])

  // Update sidebar height when recurring toggle changes
  useEffect(() => {
    // Allow time for DOM to update
    const timer = setTimeout(() => {
      if (sidebarRef.current) {
        // Force a reflow to ensure the sidebar height is calculated correctly
        setSidebarHeight(`${sidebarRef.current.scrollHeight}px`)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isRecurring, selectedWeekdays])

  // Handle resize when time view is toggled
  useEffect(() => {
    // Force calendar to re-render when time view is toggled
    setCalendarKey((prev) => prev + 1)

    // Allow time for DOM to update
    const timer = setTimeout(() => {
      if (calendarRef.current?.getApi) {
        const api = calendarRef.current.getApi()
        api.updateSize()
      }

      if (timeViewRef.current?.getApi) {
        const api = timeViewRef.current.getApi()
        api.updateSize()
      }

      if (sidebarRef.current) {
        // Force a reflow to ensure the sidebar height is calculated correctly
        setSidebarHeight(`${sidebarRef.current.scrollHeight}px`)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [showTimeView, selectedDate])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (calendarRef.current?.getApi) {
        const api = calendarRef.current.getApi()
        api.updateSize()
      }

      if (timeViewRef.current?.getApi) {
        const api = timeViewRef.current.getApi()
        api.updateSize()
      }

      if (sidebarRef.current) {
        // Force a reflow to ensure the sidebar height is calculated correctly
        setSidebarHeight(`${sidebarRef.current.scrollHeight}px`)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
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
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const startTime = (form.elements.namedItem("startTime") as HTMLInputElement)?.value;
    const endTime = (form.elements.namedItem("endTime") as HTMLInputElement)?.value;

    if (!selectedRoom || !startTime || !endTime || (isRecurring && (!recurringStartDate || !recurringEndDate || selectedWeekdays.length === 0))) {
      toast.error("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time.");
      setIsLoading(false);
      return;
    }

    if (isRecurring && new Date(recurringStartDate) > new Date(recurringEndDate)) {
      toast.error("Recurring end date must be after start date.");
      setIsLoading(false);
      return;
    }

    // Always read the userId from localStorage
    const userId = localStorage.getItem("userId") || "1";

    let allBookings: Omit<Booking, "id">[] = [];

    // Helper to check for overlap
    function isOverlap(startA: string, endA: string, startB: string, endB: string) {
      return startA < endB && endA > startB;
    }

    // Prepare new booking(s) for overlap check
    let newBookingTimes: { date: string, start: string, end: string }[] = [];

    if (isRecurring && selectedWeekdays.length > 0) {
      const weekdayMap: Record<string, number> = {
        "Su": 0, "M": 1, "T": 2, "W": 3, "Th": 4, "F": 5, "S": 6
      };
      const selectedWeekdayNumbers = selectedWeekdays.map(day => weekdayMap[day]);
      const start = new Date(recurringStartDate);
      const end = new Date(recurringEndDate);
      let current = new Date(start);

      while (current <= end) {
        if (selectedWeekdayNumbers.includes(current.getDay())) {
          const dateStr = current.toISOString().slice(0, 10);
          newBookingTimes.push({
            date: dateStr,
            start: startTime,
            end: endTime
          });
          allBookings.push({
            userId,
            roomId: selectedRoom,
            startDate: `${dateStr}T${startTime}:00`,
            endDate: `${dateStr}T${endTime}:00`,
            type: "recurring"
          });
        }
        current.setDate(current.getDate() + 1);
      }
    } else {
      newBookingTimes = [{
        date: selectedDate,
        start: startTime,
        end: endTime
      }];
      allBookings = [
        {
          userId,
          roomId: selectedRoom,
          startDate: `${selectedDate}T${startTime}:00`,
          endDate: `${selectedDate}T${endTime}:00`,
          type: "single"
        }
      ];
    }

    // Check for overlap with existing bookings for the same room
    const hasOverlap = newBookingTimes.some(newBooking => {
      return bookings.some(existing => {
        if (existing.roomId !== selectedRoom) return false;
        // Get date and times for existing booking
        let existingDate = (existing as any).date || existing.startDate?.slice(0, 10);
        let existingStart = (existing as any).startTime || existing.startDate?.slice(11, 16);
        let existingEnd = (existing as any).endTime || existing.endDate?.slice(11, 16);
        if (!existingDate || !existingStart || !existingEnd) return false;
        if (existingDate !== newBooking.date) return false;
        return isOverlap(
          `${existingDate}T${existingStart}`,
          `${existingDate}T${existingEnd}`,
          `${newBooking.date}T${newBooking.start}`,
          `${newBooking.date}T${newBooking.end}`
        );
      });
    });

    if (hasOverlap) {
      toast.error("There is already a booking for this room within the selected time period.");
      setIsLoading(false);
      return;
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
          throw new Error("Failed to create booking");
        }
        return response.json();
      })
      .then(() => {
        setBookings((prev) => [...prev, ...allBookings.map((b, i) => ({ ...b, id: `${Date.now()}-${i}` }))]);
        toast.success(
          `Room booked: ${selectedRoom} ${isRecurring ? " (recurring)" : ""}`
        );
        form.reset();
        setSelectedWeekdays([]);
        setIsRecurring(false);
        setRecurringStartDate("");
        setRecurringEndDate("");
      })
      .catch((error) => {
        console.error("Error creating booking:", error);
        toast.error("Failed to create booking. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Helper to get all dates for recurring bookings
  function getRecurringDates(startDate: string, endDate: string, weekdays: number[]) {
    const dates: string[] = [];
    let current = new Date(startDate);
    const end = new Date(endDate);
    while (current <= end) {
      if (weekdays.includes(current.getDay())) {
        dates.push(current.toISOString().slice(0, 10));
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  // Map bookings to FullCalendar events
  const formattedEvents = bookings.flatMap((booking) => {
    if (booking.type === "single") {
      // For single bookings, use date/startTime/endTime
      const date = (booking as any).date || booking.startDate?.slice(0, 10);
      const startTime = (booking as any).startTime || booking.startDate?.slice(11, 16);
      const endTime = (booking as any).endTime || booking.endDate?.slice(11, 16);
      if (!date || !startTime || !endTime) return [];
      return [{
        id: booking.id,
        title: "Booking",
        start: `${date}T${startTime}`,
        end: `${date}T${endTime}`,
        color: '#604b66',
        extendedProps: {
          userId: booking.userId,
          roomId: booking.roomId,
          type: booking.type,
        },
      }];
    } else if (booking.type === "recurring") {
      // For recurring, generate events for each matching weekday
      const startDate = (booking as any).startDate?.slice(0, 10);
      const endDate = (booking as any).endDate?.slice(0, 10);
      const startTime = (booking as any).startTime || booking.startDate?.slice(11, 16);
      const endTime = (booking as any).endTime || booking.endDate?.slice(11, 16);
      const weekdays = (booking as any).weekdays || [1,2,3,4,5,6,0]; // fallback: all days
      if (!startDate || !endDate || !startTime || !endTime) return [];
      const dates = getRecurringDates(startDate, endDate, weekdays);
      return dates.map(date => ({
        id: `${booking.id}-${date}`,
        title: "🔄 Recurring Booking",
        start: `${date}T${startTime}`,
        end: `${date}T${endTime}`,
        color: '#604b66',
        extendedProps: {
          userId: booking.userId,
          roomId: booking.roomId,
          type: booking.type,
        },
      }));
    }
    return [];
  });

  // Get the selected room data
  const selectedRoomData = rooms.find((room) => room.id === selectedRoom)

  // Filter events for the time view
  const filteredEvents = formattedEvents.filter((event) => {
    const eventDate = event.start ? event.start.toString().slice(0, 10) : "";
    return (
      event.extendedProps.roomId === selectedRoom &&
      eventDate === selectedDate
    );
  });

  // Handle closing the time view
  const handleCloseTimeView = () => {
    setShowTimeView(false)
    // Force calendar to re-render after closing time view
    setTimeout(() => {
      if (calendarRef.current?.getApi) {
        const api = calendarRef.current.getApi()
        api.updateSize()
      }
    }, 300)
  }

  return (
    <div className={`calendar-booking-container ${showTimeView ? "show-time-view" : ""}`} ref={containerRef}>
      <ToastContainer />

      <div className={`calendar-booking-main ${showTimeView ? "shifted" : ""}`}>
        <FullCalendar
          ref={calendarRef}
          key={`calendar-${calendarKey}`}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          dateClick={handleDateClick}
          events={formattedEvents.filter(event => event.extendedProps.roomId === selectedRoom)} // <-- Only show selected room
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
            <button className="calendar-booking-close-btn" onClick={handleCloseTimeView}>
              ×
            </button>
          </div>
          <FullCalendar
            ref={timeViewRef}
            key={`timeview-${calendarKey}`}
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

      <aside className="calendar-booking-rightSidebar" ref={sidebarRef} style={{ minHeight: sidebarHeight }}>
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
            src={
              selectedRoomData.image
                ? selectedRoomData.image.startsWith("/") || selectedRoomData.image.startsWith("http")
                  ? selectedRoomData.image
                  : "/" + selectedRoomData.image
                : "/placeholder.svg"
            }
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
                  id="start-date"
                  name="start-date"
                  type="date"
                  required
                  value={recurringStartDate}
                  onChange={(e) => setRecurringStartDate(e.target.value)}
                  className="calendar-booking-input"
                />
              </div>
              <div>
                <label htmlFor="end-date" className="calendar-booking-label">
                  End Date
                </label>
                <input
                  id="end-date"
                  name="end-date"
                  type="date"
                  required
                  value={recurringEndDate}
                  onChange={(e) => setRecurringEndDate(e.target.value)}
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
