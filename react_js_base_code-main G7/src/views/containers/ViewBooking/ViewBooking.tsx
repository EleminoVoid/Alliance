import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../constant";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ViewBooking.css";
import { getBookings, getRooms, getRoomAmenitiesList, deleteBooking, deleteRecurringBooking } from "../../../api";
import { useAuth } from "../../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { getErrorMessage } from "../../../utils/error";
import { amenityLabel } from '../../../utils/format';
import "react-toastify/dist/ReactToastify.css";

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
    const weekOrder = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    group.weekdays = Array.from(new Set(group.weekdays as string[])).sort((a: string, b: string) => weekOrder.indexOf(a) - weekOrder.indexOf(b));
    recurringGroups.push(group as any);
  });

  return { singles, recurringGroups };
}

export const ViewBookings: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All Users");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const userId = auth.user?.id || auth.user?.Id;
      try {
        // Fetch bookings and rooms
        const [bookingsData, roomsData] = await Promise.all([getBookings(), getRooms()]);

        // Normalize booking data to handle PascalCase from C# backend
        const normalizedBookings: Booking[] = (bookingsData || []).map((booking: any) => ({
          id: booking.id || booking.Id,
          userId: booking.userId || booking.UserId || "",
          roomId: booking.roomId || booking.RoomId || "",
          startDate: booking.startDate || booking.StartDate || "",
          endDate: booking.endDate || booking.EndDate || "",
          type: (booking.type || booking.Type || "single") as "single" | "recurring"
        }));

        // Normalize room data
        const normalizedRooms: any[] = (roomsData || []).map((room: any) => ({
          id: room.id || room.Id,
          name: room.name || room.Name || "",
          floor: room.floor || room.Floor || "",
          amenities: room.amenities || room.Amenities || []
        }));

        // Fetch amenities per room to ensure consistent presentation
        try {
          const amenitiesResults = await Promise.all(
            normalizedRooms.map((r) =>
              getRoomAmenitiesList(r.id).then((list: any) => list || []).catch((err) => {
                console.error(`Failed to fetch amenities for room ${r.id}:`, err);
                return r.amenities || [];
              })
            )
          );

          const roomsWithAmenities = normalizedRooms.map((r, i) => ({ ...r, amenities: amenitiesResults[i] }));

          const userBookings = normalizedBookings.filter(
            (b) => String(b.userId) === String(userId)
          );

          setBookings(userBookings);
          setRooms(roomsWithAmenities as Room[]);
        } catch (err) {
          console.error('Error fetching room amenities:', err);
          const userBookings = normalizedBookings.filter((b) => String(b.userId) === String(userId));
          setBookings(userBookings);
          setRooms(normalizedRooms as Room[]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        const msg = getErrorMessage(error, "Error loading bookings");
        toast.error(msg);
      }
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

  const handleDeleteBooking = async (bookingId: string, bookingType?: "single" | "recurring") => {
    // Use a custom toast to confirm deletion so UI is consistent with other messages
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <p style={{ marginBottom: 12 }}>Are you sure you want to delete this booking?</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <button
              onClick={() => {
                closeToast();
                confirmDelete(bookingId, bookingType);
              }}
              style={{ padding: "6px 12px", backgroundColor: "#dc2626", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
            >
              Delete
            </button>
            <button
              onClick={closeToast}
              style={{ padding: "6px 12px", backgroundColor: "#6b7280", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeButton: false }
    );
  };

  const confirmDelete = async (bookingId: string, bookingType?: "single" | "recurring") => {
    console.log("Deleting booking with ID:", bookingId, "Type:", bookingType);

    try {
      let result;

      // Use appropriate delete endpoint based on booking type
      if (bookingType === "recurring") {
        result = await deleteRecurringBooking(bookingId);
        console.log("Delete recurring result:", result);
      } else {
        result = await deleteBooking(bookingId);
        console.log("Delete single result:", result);
      }

      // Update local state to remove the deleted booking(s)
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      toast.success("Booking deleted successfully!");
    } catch (err: any) {
      console.error("Error deleting booking:", err);
      const msg = getErrorMessage(err, "Error deleting booking. Please try again.");
      toast.error(msg);
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

  const getRoomAmenities = (roomId: string) => {
    const room: any = rooms.find((r) => r.id === roomId);
    return (room && Array.isArray(room.amenities)) ? room.amenities : [];
  };

  const getWeekdayLabel = (dateString: string) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const { singles, recurringGroups } = groupRecurringBookings(bookings);

  return (
    <div className="view-bookings-container">
      <ToastContainer />
      <div className="view-bookings-header">
        <h1 className="view-bookings-title">Your Bookings</h1>
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
                <th className="table-header">Edit</th>
                <th className="table-header">Delete</th>
              </tr>
            </thead>
            <tbody>
              {/* Render single bookings */}
              {singles.map((booking) => (
                <tr key={booking.id} className="table-row">
                  <td className="table-cell">
                    <div className="room-info-line">{getRoomInfo(booking.roomId)}</div>
                    <div className="amenity-pills">
                      {getRoomAmenities(booking.roomId).map((a: any, i: number) => (
                        <span key={`${booking.roomId}-amen-${i}`} className="amenity-pill">{amenityLabel(a)}</span>
                      ))}
                    </div>
                  </td>
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
                      <EditIcon style={{ color: "green" }} />
                    </button>
                  </td>
                  <td className="table-cell">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteBooking(booking.id, booking.type)}
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
                      <DeleteIcon style={{ color: "red" }} />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Render recurring booking groups */}
              {recurringGroups.map((group) => (
                <tr key={group.key} className="table-row">
                  <td className="table-cell">
                    <div className="room-info-line">{getRoomInfo(group.roomId)}</div>
                    <div className="amenity-pills">
                      {getRoomAmenities(group.roomId).map((a: any, i: number) => (
                        <span key={`${group.roomId}-amen-${i}`} className="amenity-pill">{amenityLabel(a)}</span>
                      ))}
                    </div>
                  </td>
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
                    {formatTimeRange(group.sampleBooking.startDate, group.sampleBooking.endDate)}
                  </td>
                  <td className="table-cell">
                    <button
                      className="edit-button"
                      onClick={() => handleEditBooking(group.sampleBooking.id)}
                    >
                      <EditIcon style={{ color: "green" }} />
                    </button>
                  </td>
                  <td className="table-cell">
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteBooking(group.sampleBooking.id, "recurring")}
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
                      <DeleteIcon style={{ color: "red" }} />
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
                  <div className="room-info-line">{getRoomInfo(booking.roomId)}</div>
                  <div className="amenity-pills mobile">
                    {getRoomAmenities(booking.roomId).map((a: any, i: number) => (
                      <span key={`${booking.roomId}-m-amen-${i}`} className="amenity-pill">{amenityLabel(a)}</span>
                    ))}
                  </div>
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
                  onClick={() => handleDeleteBooking(booking.id, booking.type)}
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


