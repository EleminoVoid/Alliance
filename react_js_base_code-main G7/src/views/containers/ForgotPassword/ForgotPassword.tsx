import { useNavigate } from "react-router";
import { PATHS } from "../../../constant";
import "./ForgotPassword.css";

export const ForgotPassword = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();

  const handleClick = () => {
    if (pathname === PATHS.FORGOTPASSWORD.path) {
      navigate(PATHS.LOGIN.path);
    }
  };

  return (
    <div className="forgot-password-wrapper">
      <div className="forgot-password-container">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <form className="forgot-password-form">
          <div className="forgot-password-inputContainer">
            <label>
              <span className="forgot-password-label">New Password</span>
              <input type="password" className="forgot-password-input" />
            </label>
          </div>
          <div className="forgot-password-inputContainer">
            <label>
              <span className="forgot-password-label">Confirm Password</span>
              <input type="password" className="forgot-password-input" />
            </label>
          </div>
          <button
            type="submit"
            onClick={handleClick}
            className="forgot-password-submitButton"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};
