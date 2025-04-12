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
          <h2>Sign In</h2>
          <div>
            <form className="login-form">
              <input type="text" placeholder="Email"></input><br />
              <input type="password" placeholder="Password"></input>
              <p>Forgot Password? <button onClick={handleClickToChangePass}>Click Here</button></p>
              <button type="submit" onClick={handleClickToDashboard}>Sign In</button>
            </form>
          </div>
          <div>
            <p>Don't have an account? <i>Sign Up</i></p>
          </div>
        </div>
        <div className="login-box-right">
          <img src='login-pic.jpg' alt='loginpic'></img>
        </div>
      </div>
    </div>
  );
};
