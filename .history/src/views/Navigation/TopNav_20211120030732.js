import React, { useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuth } from "../../logic/context/AuthContext";
import { useHistory } from "react-router-dom";
import firebaseDb from "../../firebase";
import Swal from "sweetalert2";
import projectMembersService from "../../services/projectMembers.service";
import { projectFirestore } from "../../firebase";

import BreadCrumb from "../components/BreadCrumb";

export default function TopNav() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  var [currentId, setCurrentId] = useState("");

  localStorage.setItem("currentUserEmail", currentUser.email);

  const createTeam = {
    backgroundColor: "#272343",
  };

  const alert = {
    color: "red",
  };

  async function handleLogout() {
    try {
      await logout();
      window.localStorage.clear();
      history.pushState("/login");
    } catch (error) {
      console.log(error);
    }
  }

  function a(value, UID, teamName) {
    const member = {
      role: "member",
      uid: currentUser.uid,
      TeamCode: value,
      projectID: UID,
      TeamName: teamName,
      Status: "false",
      email: currentUser.email,
    };
    console.log(member);
    console.log(currentUser);
    projectMembersService.create(member);
  }

  function JoinTeam() {
    Swal.fire({
      title: "Join Team",
      input: "text",
      inputPlaceholder: "Enter Team Code",
      confirmButtonText: `JOIN`,
    }).then((result) => {
      console.log(result);
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        projectFirestore
          .collection("TEAM")
          .where("TeamCode", "==", result.value)
          .get()
          .then((props) => {
            props.forEach((doc) => {
              a(result.value, doc.id, doc.data().name);
            });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
        Swal.fire("Success!", "", "success");
      }
    });
  }

  return (
    <>
      <Navbar collapseOnSelect expand="xl" style={createTeam} variant="dark">
        <Container>
          <Navbar.Brand href="#home">Ilabel</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/tool">Tool</Nav.Link>
              <Nav.Link href={`/myTeam`}>My Team</Nav.Link>
              <Nav.Link onClick={JoinTeam}>Join Project</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link></Nav.Link>
              <Nav.Link
                // onClick={JoinTeam}
                id="collasible-nav"
              >
                NOTIF
                <a style={alert}></a>
              </Nav.Link>
              <NavDropdown
                title={currentUser.email}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item href="/update-profile">
                  Profile
                </NavDropdown.Item>
                {/* <NavDropdown.Item href="/teams">My Teams</NavDropdown.Item>
                <NavDropdown.Item onClick={JoinTeam}>
                  Join Project
                </NavDropdown.Item> */}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <BreadCrumb />
      </Container>
    </>
  );
}
