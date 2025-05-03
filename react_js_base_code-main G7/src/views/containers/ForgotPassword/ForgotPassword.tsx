import { useNavigate } from 'react-router';
import { PATHS } from '../../../constant';
import './ForgotPassword.css';

export const ForgotPassword = () => {
  const { pathname } = window.location;
  let navigate = useNavigate();

  const handleClick = () => {
    if (pathname === PATHS.FORGOTPASSWORD.path) {
      navigate(PATHS.LOGIN.path);
    }
  };

  return (
    <div className="forgot-wrapper">
      <div className="forgot-container">
          <h2>Forgot Password</h2>
          <div className="forgot-form">
            <form className="forgot-form-content">
              <div className="forgot-input-container">
                <label>
                  <span>New Password</span>
                  <input type="password" />
                </label>
              </div>
              <div className="forgot-input-container">
                <label>
                  <span>Confirm Password</span>
                  <input type="password" />
                </label>
              </div>
              <button type="submit" onClick={handleClick}>Change Password</button>
            </form>
          </div>
      </div>
    </div>
  );
};