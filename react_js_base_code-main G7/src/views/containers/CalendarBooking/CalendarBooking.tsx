import type React from "react"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./CalendarBooking.css"
import { getRooms, getBookings, addBooking, addRecurringBooking } from "../../../api"; interface Room {
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
  const auth = useAuth();
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
  const [startTimeState, setStartTimeState] = useState<string>("");
  const [endTimeState, setEndTimeState] = useState<string>("");

  const calendarRef = useRef<any>(null)
  const timeViewRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sidebarRef = useRef<HTMLElement>(null)

  // Fetch rooms and bookings
  useEffect(() => {
    // Fetch rooms
    getRooms()
      .then((data: any[]) => {
        // Normalize room data to handle PascalCase from C# backend
        const normalizedRooms = (data || []).map((room: any) => ({
          id: room.id || room.Id,
          name: room.name || room.Name || "",
          image: room.image || room.Image || ""
        }));
        setRooms(normalizedRooms);

        const firstRoomId = normalizedRooms[0]?.id;
        if (roomIdFromUrl && normalizedRooms.some((room: Room) => room.id === roomIdFromUrl)) {
          setSelectedRoom(roomIdFromUrl);
        } else if (firstRoomId) {
          setSelectedRoom(firstRoomId);
        }
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error)
        toast.error("Failed to load rooms data")
      });

    // Fetch bookings
    getBookings()
      .then((data: any[]) => {
        console.log("Raw bookings from API:", data);
        // Normalize booking data to handle PascalCase from C# backend
        const normalizedBookings = (data || []).map((booking: any) => ({
          id: booking.id || booking.Id,
          userId: booking.userId || booking.UserId || "",
          roomId: booking.roomId || booking.RoomId || "",
          startDate: booking.startDate || booking.StartDate || "",
          endDate: booking.endDate || booking.EndDate || "",
          type: booking.type || booking.Type || "single"
        }));
        console.log("Normalized bookings:", normalizedBookings);
        setBookings(normalizedBookings);
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

  // Helper to check if selected date/time is in the past
  function isDateTimeInPast(date: string, time: string) {
    if (!date || !time) return false;
    const selected = new Date(`${date}T${time}:00`);
    const now = new Date();
    return selected < now;
  }

  // Handle booking submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
  // prefer controlled state values for start/end time (fall back to form inputs if needed)
  const startTime = startTimeState || (form.elements.namedItem("startTime") as HTMLInputElement)?.value;
  const endTime = endTimeState || (form.elements.namedItem("endTime") as HTMLInputElement)?.value;

    // --- Add this block for single booking ---
    if (!isRecurring) {
      if (isDateTimeInPast(selectedDate, startTime)) {
        toast.error("You cannot book a time in the past.");
        setIsLoading(false);
        return;
      }
    }

    // --- Add this block for recurring booking ---
    if (isRecurring) {
      // Check if any selected recurring date/time is in the past
      const weekdayMap: Record<string, number> = {
        "Su": 0, "M": 1, "T": 2, "W": 3, "Th": 4, "F": 5, "S": 6
      };
      const selectedWeekdayNumbers = selectedWeekdays.map(day => weekdayMap[day]);
      const dates = getRecurringDates(recurringStartDate, recurringEndDate, selectedWeekdayNumbers);
      const now = new Date();
      const hasPast = dates.some(date => {
        const dt = new Date(`${date}T${startTime}:00`);
        return dt < now;
      });
      if (hasPast) {
        toast.error("Recurring booking includes a date/time in the past.");
        setIsLoading(false);
        return;
      }
    }

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

    // Read current user id from AuthContext
    const userId = auth.user?.id || auth.user?.Id || "1";

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

    // Post bookings to the server using the appropriate API
    if (isRecurring) {
      // Map weekday abbreviations to numbers (0=Sunday, 6=Saturday)
      const weekdayMap: Record<string, number> = {
        "Su": 0, "M": 1, "T": 2, "W": 3, "Th": 4, "F": 5, "S": 6
      };
      const selectedDays = selectedWeekdays.map(day => weekdayMap[day]);

      const recurringPayload = {
        userId,
        roomId: selectedRoom,
        startDate: `${recurringStartDate}T${startTime}:00`,
        endDate: `${recurringStartDate}T${endTime}:00`,
        recurrenceEndDate: `${recurringEndDate}T00:00:00`,
        type: "recurring",
        selectedDays
      };

      addRecurringBooking(recurringPayload)
        .then((data: any) => {
          // Even if we get an error response, the booking might have been saved
          // Check if it's a serialization error (500) but booking was successful
          toast.success("Recurring booking created successfully!");
          // Refresh bookings to get the latest data
          return getBookings();
        })
        .then((bookingsData: any[]) => {
          const normalizedBookings = (bookingsData || []).map((booking: any) => ({
            id: booking.id || booking.Id,
            userId: booking.userId || booking.UserId || "",
            roomId: booking.roomId || booking.RoomId || "",
            startDate: booking.startDate || booking.StartDate || "",
            endDate: booking.endDate || booking.EndDate || "",
            type: booking.type || booking.Type || "single"
          }));
          setBookings(normalizedBookings);
          form.reset();
          setStartTimeState("");
          setEndTimeState("");
          setStartTimeState("");
          setEndTimeState("");
          setSelectedWeekdays([]);
          setIsRecurring(false);
          setRecurringStartDate("");
          setRecurringEndDate("");
        })
        .catch((error) => {
          console.error("Error creating recurring booking:", error);
          // Check if it's a 500 error (serialization issue) - booking might still be saved
          if (error.message?.includes("500") || error.message?.includes("Internal Server Error")) {
            toast.warning("Booking may have been created. Refreshing...");
            // Try to refresh bookings anyway
            getBookings().then((bookingsData: any[]) => {
              const normalizedBookings = (bookingsData || []).map((booking: any) => ({
                id: booking.id || booking.Id,
                userId: booking.userId || booking.UserId || "",
                roomId: booking.roomId || booking.RoomId || "",
                startDate: booking.startDate || booking.StartDate || "",
                endDate: booking.endDate || booking.EndDate || "",
                type: booking.type || booking.Type || "single"
              }));
              setBookings(normalizedBookings);
            });
          } else {
            toast.error("Failed to create recurring booking. Please try again.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Single booking
      const singlePayload = {
        userId,
        roomId: selectedRoom,
        startDate: `${selectedDate}T${startTime}:00`,
        endDate: `${selectedDate}T${endTime}:00`,
        type: "single",
        createdBy: userId
      };

      addBooking(singlePayload)
        .then((data: any) => {
          // Even if we get an error response, the booking might have been saved
          // Check if it's a serialization error (500) but booking was successful
          toast.success("Booking created successfully!");
          // Refresh bookings to get the latest data
          return getBookings();
        })
        .then((bookingsData: any[]) => {
          const normalizedBookings = (bookingsData || []).map((booking: any) => ({
            id: booking.id || booking.Id,
            userId: booking.userId || booking.UserId || "",
            roomId: booking.roomId || booking.RoomId || "",
            startDate: booking.startDate || booking.StartDate || "",
            endDate: booking.endDate || booking.EndDate || "",
            type: booking.type || booking.Type || "single"
          }));
          setBookings(normalizedBookings);
          form.reset();
        })
        .catch((error) => {
          console.error("Error creating booking:", error);
          // Check if it's a 500 error (serialization issue) - booking might still be saved
          if (error.message?.includes("500") || error.message?.includes("Internal Server Error")) {
            toast.warning("Booking may have been created. Refreshing...");
            // Try to refresh bookings anyway
            getBookings().then((bookingsData: any[]) => {
              const normalizedBookings = (bookingsData || []).map((booking: any) => ({
                id: booking.id || booking.Id,
                userId: booking.userId || booking.UserId || "",
                roomId: booking.roomId || booking.RoomId || "",
                startDate: booking.startDate || booking.StartDate || "",
                endDate: booking.endDate || booking.EndDate || "",
                type: booking.type || booking.Type || "single"
              }));
              setBookings(normalizedBookings);
            });
          } else {
            toast.error("Failed to create booking. Please try again.");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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
    console.log("Processing booking:", booking);
    if (booking.type === "single") {
      // For single bookings, use startDate and endDate directly
      if (!booking.startDate || !booking.endDate) {
        console.log("Missing dates for single booking:", booking);
        return [];
      }
      console.log("Creating single event:", { start: booking.startDate, end: booking.endDate });
      return [{
        id: booking.id,
        title: "Booking",
        start: booking.startDate,
        end: booking.endDate,
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
      const weekdays = (booking as any).weekdays || [1, 2, 3, 4, 5, 6, 0]; // fallback: all days
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

  // Handle selecting a time slot in the time view (prefill start/end times)
  const handleTimeSelect = (info: any) => {
    try {
      const startDateObj: Date = info.start;
      const iso = startDateObj.toISOString();
      const datePart = iso.slice(0, 10);
      const timePart = iso.slice(11, 16);
      setSelectedDate(datePart);
      setStartTimeState(timePart);

      // set end time to 30 minutes after start by default, but ensure not beyond 2 hours / 20:00
      const d = new Date(startDateObj);
      d.setMinutes(d.getMinutes() + 30);
      const endMin = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      const d2 = new Date(startDateObj);
      d2.setMinutes(d2.getMinutes() + 120);
      const candidate = `${String(d2.getHours()).padStart(2, "0")}:${String(d2.getMinutes()).padStart(2, "0")}`;
      const endMax = candidate > "20:00" ? "20:00" : candidate;
      // default end to endMin
      setEndTimeState(endMin > endMax ? endMax : endMin);
      // show time view if not already
      setShowTimeView(true);
    } catch (err) {
      console.error("Error handling time select:", err);
    }
  };

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
          validRange={{
            start: new Date().toISOString().slice(0, 10) // disables days before today
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
            select={handleTimeSelect}
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
                ? selectedRoomData.image.startsWith("data:") || selectedRoomData.image.startsWith("/") || selectedRoomData.image.startsWith("http")
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
                min={new Date().toISOString().slice(0, 10)}
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
                  min={new Date().toISOString().slice(0, 10)}
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
                  min={new Date().toISOString().slice(0, 10)}
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
                  value={startTimeState}
                  onChange={(e) => {
                    const v = e.target.value;
                    setStartTimeState(v);
                    // compute new end min (30min after start) and max (2 hours after start, capped at 20:00)
                    const addMinutes = (time: string, mins: number) => {
                      if (!time) return "";
                      const [hh, mm] = time.split(":").map(Number);
                      const d = new Date();
                      d.setHours(hh, mm + mins, 0, 0);
                      const H = String(d.getHours()).padStart(2, "0");
                      const M = String(d.getMinutes()).padStart(2, "0");
                      return `${H}:${M}`;
                    };

                    const clampTime = (time: string, min: string, max: string) => {
                      if (!time) return min;
                      if (time < min) return min;
                      if (time > max) return max;
                      return time;
                    };

                    const endMin = addMinutes(v, 30);
                    const endMaxCandidate = addMinutes(v, 120);
                    const globalEndMax = "20:00";
                    const endMax = endMaxCandidate && endMaxCandidate > globalEndMax ? globalEndMax : endMaxCandidate;

                    // If current end time is outside allowed range, adjust it
                    if (endTimeState) {
                      const adjusted = clampTime(endTimeState, endMin || "08:30", endMax || globalEndMax);
                      setEndTimeState(adjusted);
                    } else {
                      // default end time to endMin when start selected
                      setEndTimeState(endMin || "08:30");
                    }
                  }}
                />
                <span className="calendar-booking-timeSeparator">--</span>
                <input
                  id="endTime"
                  name="endTime"
                  type="time"
                  required
                  className="calendar-booking-input"
                  step="1800"
                  min={startTimeState ? (() => {
                    // 30 minutes after start
                    const [hh, mm] = startTimeState.split(":").map(Number);
                    const d = new Date(); d.setHours(hh, mm + 30, 0, 0);
                    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                  })() : "08:30"}
                  max={startTimeState ? (() => {
                    // 2 hours after start, capped at 20:00
                    const [hh, mm] = startTimeState.split(":").map(Number);
                    const d = new Date(); d.setHours(hh, mm + 120, 0, 0);
                    const candidate = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
                    return candidate > "20:00" ? "20:00" : candidate;
                  })() : "20:00"}
                  value={endTimeState}
                  onChange={(e) => setEndTimeState(e.target.value)}
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
