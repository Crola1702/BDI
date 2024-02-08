import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { FormattedMessage } from "react-intl";
import { Container, NavDropdown, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { notifySuccess } from "../utils/notifications";

function YemboNavbar() {
  const navigate = useNavigate();

  const loggedIn = () => {
    return sessionStorage.getItem("token") ? true : false;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    notifySuccess("Logged out successfully");
    navigate("/");
  };

  const renderNavbarOptions = () => {
    if (loggedIn()) {
      return (
        <>
          <Col className="col-md-6 d-flex justify-content-center">
            <Nav className="mx-auto w-75 d-flex align-items-center">
              <Button
                variant="success"
                href="/create-post"
                className="align-items-center w-100 vh-75"
                style={{
                  minHeight: "2.5",
                  maxHeight: "3em",
                  minWidth: "13em",
                  maxWidth: "20em",
                }}
              >
                <strong>
                  <FormattedMessage id="CreatePost" />
                </strong>
              </Button>
            </Nav>
          </Col>
          <Col className="col-md-6 d-flex justify-content-end">
            <NavDropdown
              title={
                <>
                  {sessionStorage.getItem("username")}
                </>
              }
              style={{ fontSize: "1.5em" }}
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="/profile">
                <FormattedMessage id="Profile" />
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FormattedMessage id="Logout" />
              </NavDropdown.Item>
            </NavDropdown>
          </Col>
        </>
      );
    } else {
      return (
        <Col className="col-md-12 d-flex justify-content-end">
          <Nav className="ml-auto">
            <Button variant="success" href="/login">
              <FormattedMessage id="Login" />
            </Button>
          </Nav>
        </Col>
      );
    }
  };

  return (
    <Navbar collapseOnSelect expand="md" bg="primary" variant="dark">
      <Container>
        <Col className="col-md-4">
          <Navbar.Brand href="/">
            <img
              alt="Yembo Logo"
              src="yembo-logo.png"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
        </Col>
        <Col className="col-md-8">
          <div className="d-flex justify-content-end">
            <Navbar.Toggle aria-controls="offcanvasNavbar" />
          </div>
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbar"
            placement="end"
          >
            <Offcanvas.Header closeButton />
            <Offcanvas.Body>{renderNavbarOptions()}</Offcanvas.Body>
          </Navbar.Offcanvas>
        </Col>
      </Container>
    </Navbar>
  );
}

export default YemboNavbar;
