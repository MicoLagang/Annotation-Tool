import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MailIcon from "@material-ui/icons/Mail";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window } = props;
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Responsive drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
        <Typography paragraph>
          Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
          ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
          elementum integer enim neque volutpat ac tincidunt. Ornare suspendisse
          sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat
          mauris. Elementum eu facilisis sed odio morbi. Euismod lacinia at quis
          risus sed vulputate odio. Morbi tincidunt ornare massa eget egestas
          purus viverra accumsan in. In hendrerit gravida rutrum quisque non
          tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant
          morbi tristique senectus et. Adipiscing elit duis tristique
          sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
          eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla
          posuere sollicitudin aliquam ultrices sagittis orci a.
        </Typography>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;

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
