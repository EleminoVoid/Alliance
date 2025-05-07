import { useNavigate } from 'react-router';
import { PATHS } from '../../../constant';
import './Login.css';

export const Login = () => {
  const { pathname } = window.location;
  const navigate = useNavigate();

  const handleClickToDashboard = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.DASHBOARD.path);
    }
  };
  
  const handleClickToChangePass = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.FORGOTPASSWORD.path);
    }
  };

  return (
    <div className="wrapper">
      <div className="login-container">
        <div className="login-box-left">
          <h2>Sign In</h2>
          <div>
            <form className="login-form">
              <div className="input-group">
                <input type="text" id="Email" placeholder=" " />
                <label htmlFor="Email">Email</label>
              </div>
              <div className="input-group">
                <input type="password" id="Password" placeholder=" " />
                <label htmlFor="Password">Password</label>
              </div>
              <p className="forgot-password">
                Forgot Password? <button onClick={handleClickToChangePass}>Click Here</button>
              </p>
              <button type="submit" onClick={handleClickToDashboard}>Sign In</button>
            </form>
          </div>
          <div className="signup-prompt">
            <p>Don't have an account? <span className="signup-link">Sign Up</span></p>
          </div>
        </div>
        <div className="login-box-right">
          <img src='login-pic.jpg' alt='login' />
        </div>
      </div>
    </div>
  );
};