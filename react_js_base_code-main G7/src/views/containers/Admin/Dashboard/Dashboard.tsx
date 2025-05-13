import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("weeks");
  const [rooms, setRooms] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [mostUsedRoom, setMostUsedRoom] = useState<any>(null);
  const [bookingsPerRoom, setBookingsPerRoom] = useState<any>({});
  const [bookingPercentages, setBookingPercentages] = useState<any>({});

  // Array of distinct color class names for legend coloring
  const legendColors = [
    "light-blue",
    "blue",
    "orange",
    "light-orange",
    "green",
    "purple",
    "pink",
    "teal",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const roomsRes = await axios.get("http://localhost:3000/rooms");
        const bookingsRes = await axios.get("http://localhost:3000/bookings");

        setRooms(roomsRes.data);
        setBookings(bookingsRes.data);

        calculateMostUsedRoom(roomsRes.data, bookingsRes.data);
        calculateBookingsPerRoom(roomsRes.data, bookingsRes.data);
        calculateBookingPercentages(bookingsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateMostUsedRoom = (rooms: any[], bookings: any[]) => {
    const roomUsage: any = {};
    bookings.forEach((booking) => {
      const roomId = booking.roomId;
      roomUsage[roomId] = (roomUsage[roomId] || 0) + 1;
    });
    if (Object.keys(roomUsage).length === 0) {
      setMostUsedRoom(null);
      return;
    }
    const mostUsedRoomId = Object.keys(roomUsage).reduce((a, b) =>
      roomUsage[a] > roomUsage[b] ? a : b
    );
    const room = rooms.find((r) => r.id === mostUsedRoomId);
    setMostUsedRoom(room);
  };

  const calculateBookingsPerRoom = (rooms: any[], bookings: any[]) => {
    const bookingsCount: any = {};
    rooms.forEach((room) => {
      bookingsCount[room.id] = bookings.filter(
        (booking) => booking.roomId === room.id
      ).length;
    });
    setBookingsPerRoom(bookingsCount);
  };

  const calculateBookingPercentages = (bookings: any[]) => {
    const totalBookings = bookings.length;
    const percentages: any = {};
    bookings.forEach((booking) => {
      const roomId = booking.roomId;
      percentages[roomId] = (percentages[roomId] || 0) + 1 / totalBookings * 100;
    });
    setBookingPercentages(percentages);
  };

  // Prepare data for the Pie chart
  const pieChartData = rooms.map((room) => {
    const roomId = room.id;
    const percentage = bookingPercentages[roomId] || 0;
    return {
      name: room.name,
      value: percentage,
    };
  });

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>Room Management - Stats</h1>
        <div className="time-range-tabs">
          <button
            className={`tab ${timeRange === "days" ? "active" : ""}`}
            onClick={() => setTimeRange("days")}
          >
            Days
          </button>
          <button
            className={`tab ${timeRange === "weeks" ? "active" : ""}`}
            onClick={() => setTimeRange("weeks")}
          >
            Weeks
          </button>
          <button
            className={`tab ${timeRange === "months" ? "active" : ""}`}
            onClick={() => setTimeRange("months")}
          >
            Months
          </button>
          <button
            className={`tab ${timeRange === "years" ? "active" : ""}`}
            onClick={() => setTimeRange("years")}
          >
            Years
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="bookings-chart">
          <div className="chart-header">
            <div className="chart-icon">📦</div>
            <h3>NUMBER OF BOOKINGS PER ROOM</h3>
          </div>

          <div className="donut-chart">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={legendColors[index % legendColors.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  payload={pieChartData.map((item, index) => ({
                    id: item.name,
                    type: "square",
                    value: item.name,
                    color: legendColors[index % legendColors.length],
                  }))}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="most-used-room">
          <div className="chart-header">
            <div className="chart-icon">👥</div>
            <h3>Most Used Room</h3>
          </div>
          <div className="room-usage-content">
            {mostUsedRoom ? (
              <div>
                <h4>{mostUsedRoom.name}</h4>
                <p>Capacity: {mostUsedRoom.capacity}</p>
                <p>Description: {mostUsedRoom.description}</p>
                <p>
                  Amenities:{" "}
                  {mostUsedRoom.amenities && mostUsedRoom.amenities.join(", ")}
                </p>
                <img
                  src={mostUsedRoom.image}
                  alt={mostUsedRoom.name}
                  style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                />
              </div>
            ) : (
              <p>No booking data available.</p>
            )}
          </div>
        </div>

        <div className="trendline">
          <h3>Trendline (Bookings Per Month)</h3>
          <div className="trendline-chart">
            <ul>
              {Object.entries(bookingsPerRoom)
                .sort(
                  ([a], [b]) =>
                    new Date(a + " 1") - new Date(b + " 1")
                )
                .map(([month, count]) => (
                  <li key={month}>
                    {month}: {count} bookings
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
