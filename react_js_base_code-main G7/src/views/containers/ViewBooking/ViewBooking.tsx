import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../constant";
import "./ViewBooking.css";

interface Room {
  id: string;
  name: string;
  floor: string;
}

interface Booking {
  id: string;
  userId: string | number | null;
  roomId: string;
  startDate: string;
  endDate: string;
  type: "single" | "recurring";
}

function groupRecurringBookings(bookings: Booking[]) {
  const singles: Booking[] = [];
  const recurringGroups: {
    key: string;
    roomId: string;
    userId: string | number | null;
    type: "recurring";
    dates: string[];
    startDate: string;
    endDate: string;
    weekdays: string[];
    sampleBooking: Booking;
  }[] = [];

  const recurringMap: Record<string, any> = {};

  bookings.forEach((b) => {
    if (b.type === "single") {
      singles.push(b);
    } else {
      const key = `${b.userId}_${b.roomId}_${b.type}`;
      if (!recurringMap[key]) {
        recurringMap[key] = {
          key,
          roomId: b.roomId,
          userId: b.userId,
          type: "recurring",
          dates: [],
          weekdays: [],
          sampleBooking: b,
        };
      }
      recurringMap[key].dates.push(b.startDate);
      recurringMap[key].weekdays.push(
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
          new Date(b.startDate).getDay()
        ]
      );
    }
  });

  Object.values(recurringMap).forEach((group: any) => {
    group.dates.sort();
    group.startDate = group.dates[0];
    group.endDate = group.dates[group.dates.length - 1];
    // Remove duplicate weekdays and sort by week order
    group.weekdays = Array.from(new Set(group.weekdays)).sort(
      (a, b) =>
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(a) -
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(b)
    );
    recurringGroups.push(group);
  });

  return { singles, recurringGroups };
}

export const ViewBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All Users");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");
      // Fetch bookings and rooms
      const [bookingsRes, roomsRes] = await Promise.all([
        fetch("http://localhost:3000/bookings"),
        fetch("http://localhost:3000/rooms"),
      ]);
      const bookingsData = await bookingsRes.json();
      const roomsData: Room[] = await roomsRes.json();

      // Flatten bookings (handle objects with numeric keys)
      const flatBookings: Booking[] = [];
      bookingsData.forEach((entry: any) => {
        const keys = Object.keys(entry).filter((k) => !isNaN(Number(k)));
        if (keys.length > 0) {
          keys.forEach((k) => {
            flatBookings.push({ ...entry[k], id: entry[k].id || entry.id });
          });
        } else if (entry.roomId) {
          flatBookings.push(entry);
        }
      });

      // Only show bookings for the current user
      const userBookings = flatBookings.filter(
        (b) => String(b.userId) === String(userId)
      );

      setBookings(userBookings);
      setRooms(roomsData);
    };

    fetchData();

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleEditBooking = (bookingId: string) => {
    navigate(PATHS.EDIT_BOOKINGS.path.replace(":id", bookingId));
  };

  // Delete booking handler
  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await fetch(`http://localhost:3000/bookings/${bookingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete booking");
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      alert("Error deleting booking.");
    }
  };

  const formatDateRange = (booking: Booking) => {
    const startDate = new Date(booking.startDate);
    const formattedStart = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
    if (booking.type === "single" || !booking.endDate) {
      return formattedStart;
    }
    const endDate = new Date(booking.endDate);
    const formattedEnd = `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;
    return `${formattedStart} - ${formattedEnd}`;
  };

  const formatTimeRange = (startDate: string, endDate: string) => {
    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      let hour = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    };
    return `${formatTime(startDate)} - ${formatTime(endDate)}`;
  };

  const getRoomInfo = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    return room ? `${room.floor} - ${room.name}` : roomId;
  };

  const getWeekdayLabel = (dateString: string) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const { singles, recurringGroups } = groupRecurringBookings(bookings);

  return (
    <div className="view-bookings-container">
      <div className="view-bookings-header">
        <h1 className="view-bookings-title">Your Bookings</h1>
        <div className="view-bookings-filter">
          <button
            className={`filter-tab ${
              activeFilter === "All Users" ? "active" : ""
            }`}
            onClick={() => setActiveFilter("All Users")}
          >
            All Users
            <span className="filter-count">{bookings.length}</span>
          </button>
        </div>
      </div>

      {!isMobile ? (
        <div className="table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th className="table-header">Room</th>
                <th className="table-header">Type</th>
                <th className="table-header">Date/s</th>
                <th className="table-header">Time</th>
                <th className="table-header"></th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {/* Render single bookings */}
              {singles.map((booking) => (
                <tr key={booking.id} className="table-row">
                  <td className="table-cell">{getRoomInfo(booking.roomId)}</td>
                  <td className="table-cell">One-time</td>
                  <td className="table-cell">
                    {getWeekdayLabel(booking.startDate)}{" "}
                    {formatDateRange(booking)}
                  </td>
                  <td className="table-cell">
                    {formatTimeRange(booking.startDate, booking.endDate)}
                  </td>
                  <td className="table-cell">
                    <button
                      className="edit-button"
                      onClick={() => handleEditBooking(booking.id)}
                    >
                      Edit booking
                    </button>
                  </td>
                  <td className="table-cell">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteBooking(booking.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="#d9534f"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm2 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6z" />
                        <path
                          fillRule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zm-3-1a.5.5 0 0 0-.5-.5h-3A.5.5 0 0 0 7 2h2a.5.5 0 0 0 .5-.5zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
              {/* Render recurring booking groups */}
              {recurringGroups.map((group) => (
                <tr key={group.key} className="table-row">
                  <td className="table-cell">{getRoomInfo(group.roomId)}</td>
                  <td className="table-cell">
                    <span style={{ color: "#604b66", }}>
                       Recurring
                    </span>
                  </td>
                  <td className="table-cell">
                    {group.weekdays.join(", ")}{" "}
                    {formatDateRange({
                      ...group.sampleBooking,
                      startDate: group.startDate,
                      endDate: group.endDate,
                    })}
                  </td>
                  <td className="table-cell">
                    {formatTimeRange(group.startDate, group.endDate)}
                  </td>
                  <td className="table-cell">
                    <button
                      className="edit-button"
                      onClick={() => handleEditBooking(group.sampleBooking.id)}
                    >
                      Edit booking
                    </button>
                  </td>
                  <td className="table-cell">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteBooking(group.sampleBooking.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Delete"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="#d9534f"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm2 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6z" />
                        <path
                          fillRule="evenodd"
                          d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zm-3-1a.5.5 0 0 0-.5-.5h-3A.5.5 0 0 0 7 2h2a.5.5 0 0 0 .5-.5zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mobile-bookings">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="mobile-booking-card">
                <div className="mobile-booking-header">
                  <span>{getRoomInfo(booking.roomId)}</span>
                </div>
                <div className="mobile-booking-details">
                  <div>
                    <span className="detail-label">Type</span>
                    <span className="detail-value">
                      {booking.type === "recurring" ? (
                        <>
                          <span style={{ color: "#604b66", fontWeight: "bold" }}>
                            🔄 Recurring
                          </span>
                        </>
                      ) : (
                        "One-time"
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="detail-label">Time</span>
                    <span className="detail-value">
                      {formatTimeRange(booking.startDate, booking.endDate)}
                    </span>
                  </div>
                  <div>
                    <span className="detail-label">Date/s</span>
                    <span className="detail-value">
                      {getWeekdayLabel(booking.startDate)}{" "}
                      {formatDateRange(booking)}
                    </span>
                  </div>
                </div>
                <button
                  className="edit-button"
                  onClick={() => handleEditBooking(booking.id)}
                >
                  Edit booking
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteBooking(booking.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    marginLeft: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#d9534f"
                    viewBox="0 0 16 16"
                  >
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6zm2 .5a.5.5 0 0 1 .5-.5.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6z" />
                    <path
                      fillRule="evenodd"
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2h3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3a1 1 0 0 1 1 1zm-3-1a.5.5 0 0 0-.5-.5h-3A.5.5 0 0 0 7 2h2a.5.5 0 0 0 .5-.5zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118z"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <div className="no-bookings">No bookings found</div>
          )}
        </div>
      )}
    </div>
  );
};


