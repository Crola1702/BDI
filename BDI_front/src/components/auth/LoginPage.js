import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import LoginCard from "./LoginCard";
import RegisterCard from "./RegisterCard";

import jwt from "jwt-decode";

import { postData } from "../../utils/requests";
import { Container } from "react-bootstrap";
import { FormattedMessage, useIntl } from "react-intl";

import { useNavigate } from "react-router-dom";

import { notifySuccess, notifyError } from "../../utils/notifications";

function LoginPage() {
  const intl = useIntl();
  const navigate = useNavigate();

  function loginCb(data) {
    if (data.statusCode === 401) {
      notifyError("Invalid username or password");
      return;
    }

    if (!data.token) {
      notifyError("Error logging in");
      return;
    }

    sessionStorage.setItem("token", data.token);

    let decodedToken = jwt(data.token);

    sessionStorage.setItem("username", decodedToken.username);
    sessionStorage.setItem("userId", decodedToken.sub);

    notifySuccess("Logged in successfully")
    
    navigate("/");
  }

  function registerCb(data) {
    if (data.id) {
      notifySuccess("Registered successfully");
    }
  }

  function handleLogin(username_prop, password_prop) {
    if (!username_prop || !password_prop) {
      notifyError("Username or password is empty");
      return;
    }

    postData(loginCb, "users/login/", {
      username: username_prop,
      password: password_prop,
    });
  }

  function handleRegister(username_prop, password_prop, confirmPassword_prop) {
    if (!username_prop || !password_prop || !confirmPassword_prop) {
      notifyError("Username or password is empty");
      return;
    }

    if (password_prop !== confirmPassword_prop) {
      notifyError("Passwords do not match");
      return;
    }

    postData(registerCb, "users/", {
      username: username_prop,
      password: password_prop,
      role: "admin",
      verifiedUser: true,
      approvedForSale: true,
    }).then(() => {
      handleLogin(username_prop, password_prop);
    });
  }

  return (
    <Container>
      <h1 className="text-center">
        <FormattedMessage id="auth.title" />
      </h1>
      <br />

      <Tabs defaultActiveKey="login" id="auth-tab" fill>
        <Tab eventKey="login" title={intl.formatMessage({ id: "LogIn" })}>
          <div className="d-flex justify-content-center p-5">
            <LoginCard className="me-auto" submitHandler={handleLogin} />
          </div>
        </Tab>
        <Tab eventKey="register" title={intl.formatMessage({ id: "Register" })}>
          <div className="d-flex justify-content-center p-5">
            <br />
            <RegisterCard submitHandler={handleRegister} />
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default LoginPage;
