"use client"
import { useNavigate } from "react-router"
import { PATHS } from "../../../constant"

export const ForgotPassword = () => {
  const { pathname } = window.location
  const navigate = useNavigate()

  const handleClick = () => {
    if (pathname === PATHS.FORGOTPASSWORD.path) {
      navigate(PATHS.LOGIN.path)
    }
  }

  return (
    <div
      style={{
        padding: "0",
        backgroundColor: "#56697F",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: window.innerWidth < 768 ? "90%" : "500px",
          border: "none",
          borderRadius: "10px",
          padding: "30px",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            margin: "0 0 40px 0",
            color: "#593F62",
            fontSize: "1.5em",
          }}
        >
          Forgot Password
        </h2>
        <div
          style={{
            display: "flex",
            alignSelf: "center",
            width: "100%",
          }}
        >
          <form
            className="forgot-form-content"
            style={{
              width: "100%",
            }}
          >
            <div
              style={{
                position: "relative",
                marginBottom: "20px",
                width: "100%",
              }}
            >
              <label
                style={{
                  display: "block",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "10px",
                    fontSize: "0.9em",
                    fontWeight: "bold",
                    color: "#333",
                    backgroundColor: "white",
                    padding: "0 5px",
                    pointerEvents: "none",
                  }}
                >
                  New Password
                </span>
                <input
                  type="password"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #333",
                    borderRadius: "5px",
                    fontSize: "1em",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    color: "#333",
                  }}
                />
              </label>
            </div>
            <div
              style={{
                position: "relative",
                marginBottom: "20px",
                width: "100%",
              }}
            >
              <label
                style={{
                  display: "block",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "-10px",
                    left: "10px",
                    fontSize: "0.9em",
                    fontWeight: "bold",
                    color: "#333",
                    backgroundColor: "white",
                    padding: "0 5px",
                    pointerEvents: "none",
                  }}
                >
                  Confirm Password
                </span>
                <input
                  type="password"
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #333",
                    borderRadius: "5px",
                    fontSize: "1em",
                    outline: "none",
                    boxSizing: "border-box",
                    backgroundColor: "#fff",
                    color: "#333",
                  }}
                />
              </label>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                marginTop: "20px",
              }}
            >
              <button
                type="submit"
                onClick={handleClick}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#593F62",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1em",
                  transition: "background-color 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4e3b52")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#593F62")}
              >
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
