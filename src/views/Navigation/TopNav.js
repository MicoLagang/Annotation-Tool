
import React, { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuth } from "../../logic/context/AuthContext";
import { useHistory } from "react-router-dom";

export default function TopNav() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.pushState("/login");
    } catch (error) {
      setError(error.message);
    }
  }
  return (
    <Navbar
      className="mb-3"
      collapseOnSelect
      expand="lg"
      bg="dark"
      variant="dark"
    >
      <Container>
        <Navbar.Brand href="/">Ilabel</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/tool">Tool</Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title={currentUser.email} id="collasible-nav-dropdown">
              <NavDropdown.Item href="/update-profile">
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item href="/teams">My Teams</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}