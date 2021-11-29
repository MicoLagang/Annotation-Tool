import React, { useState, useEffect } from "react";
import Box from "@material-ui/core/Box";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

export default function SwipeableTemporaryDrawer() {
  const [open, setOpen] = usetState(false);

  const list = (anchor) => (
    <List style={{ width: 250 }} onClick={() => setOpen(false)}>
      {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
        <ListItem button key={text}>
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open</Button>
      <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
        {list()}
      </Drawer>
    </div>
  );
}

// import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
// import { useAuth } from "../../logic/context/AuthContext";
// import { useHistory } from "react-router-dom";
// import firebaseDb from "../../firebase";
// import Swal from "sweetalert2";
// import projectMembersService from "../../services/projectMembers.service";
// import { projectFirestore } from "../../firebase";

// import BreadCrumb from "../components/BreadCrumb";

// export default function TopNav() {
//   const [error, setError] = useState("");
//   const { currentUser, logout } = useAuth();
//   const history = useHistory();
//   var [currentId, setCurrentId] = useState("");
//   const teamID = localStorage.getItem("currentTeamID");
//   const [loading, setLoading] = useState(true);
//   const [posts, setPosts] = useState([]);
//   localStorage.setItem("currentUserEmail", currentUser.email);

//   const createTeam = {
//     backgroundColor: "#272343",
//   };

//   const alert = {
//     color: "red",
//   };

//   async function handleLogout() {
//     try {
//       await logout();
//       window.localStorage.clear();
//       history.pushState("/login");
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   function a(value, UID, teamName,isArchive) {
//     const member = {
//       role: "member",
//       uid: currentUser.uid,
//       TeamCode: value,
//       projectID: UID,
//       TeamName: teamName,
//       Status: "false",
//       email: currentUser.email,
//       isArchive:isArchive,
//     };
//     projectMembersService.create(member);
//   }

//   function JoinTeam() {
//     Swal.fire({
//       title: "Join Team",
//       input: "text",
//       inputPlaceholder: "Enter Team Code",
//       confirmButtonText: `JOIN`,
//     }).then((result) => {
//       console.log(result);
//       if (result.value == "") {
//         result.isConfirmed = false;
//       }
//       /* Read more about isConfirmed, isDenied below */

//       if (result.isConfirmed) {
//         projectFirestore
//           .collection("TEAM")
//           .where("TeamCode", "==", result.value)
//           .get()
//           .then((props) => {
//             props.forEach((doc) => {
//               a(result.value, doc.id, doc.data().name,doc.data().isArchive);
//             });
//           })
//           .catch((error) => {
//             console.log("Error getting documents: ", error);
//           });
//         Swal.fire("Success!", "", "success");
//       }
//     });
//   }

//   return (
//     <>
//       <Navbar collapseOnSelect expand="md" style={createTeam} variant="dark">
//         <Container>
//           <Navbar.Brand href="/">Ilabel</Navbar.Brand>
//           <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//           <Navbar.Collapse id="responsive-navbar-nav">
//             <Nav className="me-auto">
//               <Nav.Link href="/tool">Tool</Nav.Link>
//               <Nav.Link href={`/myTeam`}>My Team</Nav.Link>
//               <Nav.Link onClick={JoinTeam}>Join Team</Nav.Link>
//             </Nav>
//             <Nav>
//               <Nav.Link></Nav.Link>
//               <Nav.Link
//                 // onClick={JoinTeam}
//                 id="collasible-nav"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="16"
//                   height="16"
//                   fill="currentColor"
//                   class="bi bi-bell"
//                   viewBox="0 0 16 16"
//                 >
//                   <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
//                 </svg>
//               </Nav.Link>
//               <NavDropdown
//                 title={currentUser.email}
//                 id="collasible-nav-dropdown"
//               >
//                 <NavDropdown.Item href="/update-profile">
//                   Profile
//                 </NavDropdown.Item>
//                 <NavDropdown.Item href="/archive">Archive Team</NavDropdown.Item>
//                 <NavDropdown.Divider />
//                 <NavDropdown.Item onClick={handleLogout}>
//                   Logout
//                 </NavDropdown.Item>
//               </NavDropdown>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       <Container>
//         <BreadCrumb />
//       </Container>
//     </>
//   );
// }
