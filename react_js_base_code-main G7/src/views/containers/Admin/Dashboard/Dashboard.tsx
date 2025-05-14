import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import "./Dashboard.css";

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  amenities: string[];
  image: string;
}

interface Booking {
  id: string;
  roomId: string;
  startDate: string;
  type: "single" | "recurring";
}

const COLORS = [
  '#8883d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
];

export const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("months"); // Default to months
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [mostUsedRoom, setMostUsedRoom] = useState<Room | null>(null);
  const [bookingPercentages, setBookingPercentages] = useState<Record<string, number>>({});
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes] = await Promise.all([
          axios.get<Room[]>("http://localhost:3000/rooms"),
          axios.get<Booking[]>("http://localhost:3000/bookings")
        ]);

        setRooms(roomsRes.data);
        setBookings(bookingsRes.data);
        calculateMostUsedRoom(roomsRes.data, bookingsRes.data);
        const counts = calculateBookingPercentages(bookingsRes.data);
        setBookingCounts(counts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const calculateMostUsedRoom = (rooms: Room[], bookings: Booking[]) => {
    const roomUsage: Record<string, number> = {};
    
    bookings.forEach((booking) => {
      roomUsage[booking.roomId] = (roomUsage[booking.roomId] || 0) + 1;
    });

    if (Object.keys(roomUsage).length === 0) {
      setMostUsedRoom(null);
      return;
    }

    const mostUsedRoomId = Object.keys(roomUsage).reduce((a, b) =>
      roomUsage[a] > roomUsage[b] ? a : b
    );
    setMostUsedRoom(rooms.find((r) => r.id === mostUsedRoomId) || null);
  };

  const calculateBookingPercentages = (bookings: Booking[]) => {
    const totalBookings = bookings.length;
    const percentages: Record<string, number> = {};
    const counts: Record<string, number> = {};
    
    if (totalBookings === 0) {
      setBookingPercentages({});
      return {};
    }

    bookings.forEach((booking) => {
      percentages[booking.roomId] = (percentages[booking.roomId] || 0) + (1 / totalBookings) * 100;
      counts[booking.roomId] = (counts[booking.roomId] || 0) + 1;
    });
    
    setBookingPercentages(percentages);
    return counts;
  };

  const prepareMonthlyBookings = () => {
    const monthlyCounts: Record<string, number> = {};

    bookings.forEach(booking => {
      const date = new Date(booking.startDate);
      const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyCounts[monthYear] = (monthlyCounts[monthYear] || 0) + 1;
    });

    return Object.entries(monthlyCounts)
      .map(([month, count]) => ({
        month,
        bookings: count,
        monthDisplay: new Date(month + '-01').toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        })
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const monthlyBookingsData = prepareMonthlyBookings();

  const pieChartData = rooms
    .map((room) => ({
      id: room.id,
      name: room.name,
      percentage: parseFloat((bookingPercentages[room.id] || 0).toFixed(2)),
      count: bookingCounts[room.id] || 0,
    }))
    .filter(item => item.count > 0); // Only include rooms with bookings

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h1>Room Management - Stats</h1>
        <div className="time-range-tabs">
          {["days", "weeks", "months", "years"].map((range) => (
            <button
              key={range}
              className={`tab ${timeRange === range ? "active" : ""}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="bookings-chart">
          <div className="chart-header">
            <div className="chart-icon">📦</div>
            <h3>BOOKINGS PER ROOM</h3>
          </div>
          <div className="chart-container">
            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart margin={{ top: 20, right: 20, bottom: 80, left: 20 }}>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage, count }) => 
                      `${name}\n${count} booking${count !== 1 ? 's' : ''}\n(${percentage}%)`
                    }
                    outerRadius={120}
                    innerRadius={60}
                    dataKey="percentage"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    wrapperStyle={{ paddingTop: '40px' }}
                    formatter={(value, entry, index) => {
                      const data = pieChartData[index];
                      return `${data.name}: ${data.count} (${data.percentage}%)`;
                    }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string, props: any) => [
                      `${props.payload.count} booking${props.payload.count !== 1 ? 's' : ''}`,
                      `${props.payload.name} (${value}%)`
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-message">
                <p>No booking data available for any rooms.</p>
              </div>
            )}
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
                  {mostUsedRoom.amenities?.join(", ") || "No amenities listed"}
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
          <div className="chart-header">
            <div className="chart-icon">📈</div>
            <h3>Monthly Bookings</h3>
          </div>
          <div className="trendline-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyBookingsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthDisplay" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} bookings`, 'Bookings']}
                  labelFormatter={(month) => `Month: ${month}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;