import { useNavigate } from "react-router";
import { PATHS } from "../../../constant";

export const ForgotPassword = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();

  const handleClick = () => {
    if (pathname === PATHS.FORGOTPASSWORD.path) {
      navigate(PATHS.LOGIN.path);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Forgot Password</h2>
        <form style={styles.form}>
          <div style={styles.inputContainer}>
            <label>
              <span style={styles.label}>New Password</span>
              <input type="password" style={styles.input} />
            </label>
          </div>
          <div style={styles.inputContainer}>
            <label>
              <span style={styles.label}>Confirm Password</span>
              <input type="password" style={styles.input} />
            </label>
          </div>
          <button
            type="submit"
            onClick={handleClick}
            style={styles.submitButton}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4e3b52")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#593F62")}
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "0",
    backgroundColor: "#56697F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100%",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    width: window.innerWidth < 768 ? "90%" : "500px",
    border: "none",
    borderRadius: "10px",
    padding: "30px",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    margin: "0 0 40px 0",
    color: "#593F62",
    fontSize: "1.5em",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    position: "relative",
    marginBottom: "20px",
    width: "100%",
  },
  label: {
    display: "block",
    position: "relative",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "5px",
    backgroundColor: "white",
    padding: "0 5px",
    pointerEvents: "none",
    top: "-10px",
    left: "10px",
    fontSize: "0.9em",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #333",
    borderRadius: "5px",
    fontSize: "1em",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#fff",
    color: "#333",
  },
  submitButton: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#593F62",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1em",
    transition: "background-color 0.2s ease",
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
};
