import { useNavigate } from 'react-router';
import { PATHS } from '../../../constant';

export const Login = () => {
  <link href="https://fonts.googleapis.com/css2?family=Inter&amp;display=swap" rel="stylesheet"/>

  const { pathname } = window.location;
  const navigate = useNavigate();

  const handleClickToHomePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.HOMEPAGE.path);
    }
  };
  
  const handleClickToChangePass = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.FORGOTPASSWORD.path);
    }
  };
  
  const handleClickToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === PATHS.LOGIN.path) {
      navigate(PATHS.REGISTER.path);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', backgroundColor: "#56697F" }}>
      <div style={{ height: "600px", width: "860px", display: "grid", gridTemplateColumns: "1fr 1fr", border: "none", borderRadius: "10px", padding: '20px', margin: '20px', backgroundColor: 'white', gap: '20px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'}}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px"}}>
          <h1 style={{ textAlign: "left", color: "#593F62", marginTop: 0 }}>Sign In</h1>
          <div>
            <form style={{ display: 'flex', flexDirection: 'column'}}>
              <div style={{ position: 'relative', marginBottom: '20px', width: '250px', alignSelf: 'center' }}>
                <label style={{ display: 'block', position: 'relative'}}>
                  <span style={{ position: 'absolute', top: '-4px', left: '10px', fontWeight: 'bold', fontStyle: 'bold', color: '#333', backgroundColor: 'white', padding: '0 5px',  pointerEvents: 'none'}}>Email</span>
                  <input type="text" style={{ margin: '10px 0', padding: '8px', width: "250px", border: "1px solid #ccc", borderRadius: "5px", alignSelf: "center", fontSize: '1em', outline: 'none', boxSizing: 'border-box' }}/>
                </label>
              </div>
              <div style={{ position: 'relative', marginBottom: '20px', width: '250px', alignSelf: 'center' }}>
                <label style={{ display: 'block', position: 'relative'}}>
                  <span style={{ position: 'absolute', top: '-4px', left: '10px', fontWeight: 'bold', fontStyle: 'bold', color: '#333', backgroundColor: 'white', padding: '0 5px',  pointerEvents: 'none'}}>Password</span>
                  <input type="password" style={{ margin: '10px 0',padding: '8px', width: "250px", border: "1px solid #ccc", borderRadius: "5px", alignSelf: "center", fontSize: '1em', outline: 'none', boxSizing: 'border-box' }}/>
                </label>
                <p>Forgot Password? <button onClick={handleClickToChangePass} style={{ fontStyle: 'italic', background: 'none', border: 'none', color: '#593F62', cursor: 'pointer', fontSize: '0.9em', padding: '0' }}>Click Here</button></p>
              </div>
              <button type="submit" onClick={handleClickToHomePage} style={{ fontFamily: 'Poppins, sans-serif', alignSelf: 'center', marginTop: '30px', padding: '10px 30px', backgroundColor: '#593F62', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '1.2em' }}>Sign In</button>
            </form>
          </div>
          <div className="login-sign-up">
            <p style={{ marginBottom: 0 }}>Don't have an account? <button onClick={handleClickToRegister} style={{ fontStyle: 'italic', background: 'none', border: 'none', color: '#593F62', cursor: 'pointer', fontSize: '0.9em', padding: '0' }}>Sign Up</button></p>
          </div>
        </div>
        <div style={{ height: '94%', paddingLeft: '20px'}}>
          <img src="loginpic.jpg" alt="loginpic" style={{ width: "100%", height: '100%', borderRadius: '10px' }}/>
        </div>
      </div>
    </div>
  );
};