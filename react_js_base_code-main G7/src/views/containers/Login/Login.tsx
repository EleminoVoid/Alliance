import { useNavigate } from 'react-router';
import { PATHS } from '../../../constant';
import './Login.css'

export const Login = () => {
  const { pathname } = window.location;
  let navigate = useNavigate();

  const handleClickToDashboard = () => {
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.DASHBOARD.path);
    }
  };
  
  const handleClickToChangePass = () => {
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.FORGOTPASSWORD.path);
    }
  };

  return (
    <div className="wrapper">
      <div className="login-container">
        <div className="login-box-left">
          <h1>Sign In</h1>
          <div>
            <form className="login-form">
              <div className="input-container">
                <label>
                  <span>Email</span>
                  <input type="text" />
                </label>
              </div>
              <div className="input-container">
                <label>
                  <span>Password</span>
                  <input type="password" />
                </label>
                <p>Forgot Password? <button onClick={handleClickToChangePass}>Click Here</button></p>
              </div>
              <button type="submit" onClick={handleClickToDashboard}>Sign In</button>
            </form>
          </div>
          <div className="sign-up">
            <p>Don't have an account? <button>Sign Up</button></p>
          </div>
        </div>
        <div className="login-box-right">
          <img src='loginpic.jpg' alt='loginpic'></img>
        </div>
      </div>
    </div>
  );
};
