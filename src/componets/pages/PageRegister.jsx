import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegistrationMutation } from "../../redux/api";
import { logIn } from "../../redux/slice/authSlice";
import "./PageRegister.css";

function validateLogin(login) {
  return login.length > 0;
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateRepeatPassword(password, repeatPassword) {
  return password === repeatPassword;
}

export default function PageRegister(prop) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [repeatPasswordError, setRepeatPasswordError] = useState(false);
  const [loginQuery] = useLoginMutation();
  const [registrationMutation] = useRegistrationMutation();
  const [selectLog, selectOnLog] = useState(false);
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onReg = async () => {
      setLoading(true);
      try {
          const response = await registrationMutation({ login, password });
          if (response.data.createUser !== null) {
              const res = await loginQuery({ login, password });
              setLoading(false);
              if (res.data) {
                  dispatch(logIn(res.data.login));
                  setLogin('');
                  setPassword('');
                  navigate("/");
              }
          }
      } catch (error) {
          console.error('Помилка авторизації', error);
          setLoading(false);
      }
  };

  const onLogin = async () => {
      setLoading(true);
      try {
          const response = await loginQuery({ login, password });
          setLoading(false);
          if (response.data) {
              dispatch(logIn(response.data.login));
              setLogin('');
              setPassword('');
              navigate("/");
          }
      } catch (error) {
          console.error('Помилка авторизації', error);
          setLoading(false);
      }
  };

  // Validation
  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectLog) {
      if (validateLogin(login) && validatePassword(password)) {
        onLogin(login, password);
      } else {
        setLoginError(!validateLogin(login));
        setPasswordError(!validatePassword(password));
      }
    } else {
      if (validateLogin(login) && validatePassword(password) && validateRepeatPassword(password, repeatPassword)) {
        onReg(login, password);
      }
      else {
        setLoginError(!validateLogin(login));
        setPasswordError(!validatePassword(password));
        setRepeatPasswordError(!validateRepeatPassword(password, repeatPassword));
      }
    }
  };

  const handleLoginChange = (e) => {
    const value = e.target.value;
    setLogin(value);
    if (validateLogin(value)) {
      setLoginError(false);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (validatePassword(value)) {
      setPasswordError(false);
    }
  };

  const handleRepeatPasswordChange = (e) => {
    const value = e.target.value;
    setRepeatPassword(value);
    if (validateRepeatPassword(password, value)) {
      setRepeatPasswordError(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="text-center" style={{ margin: "32px 16px" }}>
          <h1>{selectLog ? "Authorization" : "Registration"}</h1>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-container">
            <input
              type="text"
              name="login"
              placeholder="Login"
              value={login}
              onChange={handleLoginChange}
              className="input"
            />
            {loginError && (
              <span className="error-message">Login cannot be empty</span>
            )}
          </div>
          <div className="input-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className="input"
            />
            {passwordError && (
              <span className="error-message">
                The password must be at least 6 characters long
              </span>
            )}
          </div>
          {!selectLog && (
            <div className="input-container">
              <input
                type={showRepeatPassword ? "text" : "password"}
                name="repeatPassword"
                placeholder="Repeat the password"
                value={repeatPassword}
                onChange={handleRepeatPasswordChange}
                className="input"
              />
              {repeatPasswordError && (
                <span className="error-message">Passwords do not match</span>
              )}
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  setShowRepeatPassword(!showRepeatPassword);
                }}
                className="toggle-button"
              >
                {showPassword || showRepeatPassword ? "Hide" : "Show"}
              </button>
            </div>
          )}
          <button type="submit" className="button">
            {selectLog ? "Log in" : "Register"}
          </button>
          <div className="text-center">
            Already have an account?{" "}
            {!selectLog ? (
              <button
                onClick={() => selectOnLog(true)}
                className="toggle-button"
              >
                Sign in
              </button>
            ) : (
              <button
                onClick={() => selectOnLog(false)}
                className="toggle-button"
              >
                Register
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
