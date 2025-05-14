import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

export const Homepage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [featuredRooms, setFeaturedRooms] = useState<any[]>([]);

  // Example API call for featured rooms
  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        const response = await axios.get("http://localhost:3000/featured-rooms");
        setFeaturedRooms(response.data);
      } catch (error) {
        console.error("Error fetching featured rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, []);

  // Example booking function
  const handleQuickBook = async (roomId: string) => {
    try {
      await axios.post("http://localhost:3000/quick-book", { roomId });
      navigate("/confirmation");
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
<<<<<<< Updated upstream
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="home-nav">
        <h1>MARSHAL</h1>
        <div className="nav-links">
          <span>Home</span>
          <button onClick={() => navigate("/rooms")}>View Rooms</button>
          <button onClick={() => navigate("/calendar")}>Calendar</button>
          <button onClick={() => navigate("/login")}>Sign In</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h2>Manage your work and meeting room facility</h2>
          <div className="hero-brand">
            <span>with</span>
            <strong>MARSHAL</strong>
          </div>
          <button 
            className="cta-button"
            onClick={() => navigate("/booking")}
          >
            Book A Room
          </button>

          {/* Optional: Display featured rooms from API */}
          {!loading && featuredRooms.length > 0 && (
            <div className="featured-rooms">
              <h3>Featured Rooms</h3>
              <div className="room-list">
                {featuredRooms.map(room => (
                  <div key={room.id} className="room-card">
                    <h4>{room.name}</h4>
                    <button onClick={() => handleQuickBook(room.id)}>
                      Quick Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Motivational Section */}
      <section className="motivational-section">
        <p>Optimize your workspace. Elevate your productivity.</p>
      </section>
=======
    <div className="homepage-container">
      {/* <div className="homepage-center"> */}
        <img src="homepage-pic.webp" alt="homepage-pic" className="homepage-backgroundImage" />
        <div className="homepage-overlay"></div>
        <div className="homepage-textContainer">
          <h1 className="homepage-title">Manage your work and meeting room facility</h1>
          <p className="homepage-subtitle">with</p>
          <h1 className="homepage-mainTitle">MARSHAL</h1>
        {/* </div> */}
      </div>
      <Link href="/viewRooms" underline="none" className="homepage-link">
        <button
          className="homepage-button"
          onMouseOver={(e) => {
            e.currentTarget.classList.add("homepage-buttonHover");
          }}
          onMouseOut={(e) => {
            e.currentTarget.classList.remove("homepage-buttonHover");
          }}
        >
          Book A Room
        </button>
      </Link>
>>>>>>> Stashed changes
    </div>
  );
};