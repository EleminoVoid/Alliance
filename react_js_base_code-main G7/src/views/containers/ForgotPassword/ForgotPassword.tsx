import { useNavigate } from 'react-router';
import { PATHS } from '../../../constant';
import './ForgotPassword.css'

export const ForgotPassword = () => {
  const { pathname } = window.location;
  let navigate = useNavigate();

  const handleClick = () => {
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.DASHBOARD.path);
    }
  };
  
  return (
    <div className="wrapper">
      <div className="login-container">
          <h2>Forgot Password</h2><br />
          <div>
            <form className="login-form">
              <input type="password" placeholder="New Password"></input><br />
              <input type="password" placeholder="Confirm Password"></input><br />
              <button type="submit" onClick={handleClick}>Change Password</button>
            </form>
          </div>
      </div>
    </div>
  );
};
