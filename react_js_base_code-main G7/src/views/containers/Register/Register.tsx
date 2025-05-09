import { useNavigate } from 'react-router';
import { PATHS } from '../../../constant';
import './Register.css';

export const Register = () => {
  const { pathname } = window.location;
  let navigate = useNavigate();

  const handleRegister = () => {
    if (pathname === PATHS.REGISTER.path) {
      navigate(PATHS.LOGIN.path);
    }
  };

  const handleClickToLogin = () => {
    if (pathname === PATHS.REGISTER.path) {
        navigate(PATHS.LOGIN.path);
    }
  };

  return (
    
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-box-left">
          <img src="registerpic.jpg" alt="registerpic" />
        </div>
        <div className="register-box-right">
          <h1>Sign Up</h1>
          <form className="register-form">
            <div className="register-input-container">
              <label>
                <span>Email</span>
                <input type="email" />
              </label>
            </div>
            <div className="register-input-container">
              <label>
                <span>Username</span>
                <input type="text" />
              </label>
            </div>
            <div className="register-input-container">
              <label>
                <span>Password</span>
                <input type="password" />
              </label>
            </div>
            <button type="submit" onClick={handleRegister}>Sign Up</button>
          </form>
          <p className="register-sign-in">
            Have an account? <button onClick={handleClickToLogin}>Sign In</button>
          </p>
        </div>
      </div>
    </div>
  );
};