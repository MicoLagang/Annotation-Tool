import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import AddIcon from "@material-ui/icons/Add";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";

import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useAuth } from "../../logic/context/AuthContext";
import { useHistory } from "react-router-dom";
import firebaseDb from "../../firebase";
import Swal from "sweetalert2";
import projectMembersService from "../../services/projectMembers.service";
import { projectFirestore } from "../../firebase";

import BreadCrumb from "../components/BreadCrumb";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function TopNav() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();
  var [currentId, setCurrentId] = useState("");
  const teamID = localStorage.getItem("currentTeamID");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  localStorage.setItem("currentUserEmail", currentUser.email);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const createTeam = {
    backgroundColor: "#272343",
  };

  const alert = {
    color: "red",
  };

  const itemList = [
    {
      text: "My Team",
      link: () => history.push("/myTeam"),
    },
    {
      text: "Annotation Tool",
      link: () => history.push("/tool"),
    },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const list = () => (
    <List style={{ width: drawerWidth }} onClick={() => setOpen(false)}>
      {itemList.map((item, index) => {
        const { text, link } = item;
        return (
          <ListItem button key={text} onClick={link}>
            <ListItemText primary={text}></ListItemText>
          </ListItem>
        );
      })}
    </List>
  );

  async function handleLogout() {
    try {
      await logout();
      window.localStorage.clear();
      history.pushState("/login");
    } catch (error) {
      console.log(error);
    }
  }

  function a(value, UID, teamName, isArchive) {
    const member = {
      role: "member",
      uid: currentUser.uid,
      TeamCode: value,
      projectID: UID,
      TeamName: teamName,
      Status: "false",
      email: currentUser.email,
      isArchive: isArchive,
    };
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
      if (result.value == "") {
        result.isConfirmed = false;
      }
      /* Read more about isConfirmed, isDenied below */

      if (result.isConfirmed) {
        projectFirestore
          .collection("TEAM")
          .where("TeamCode", "==", result.value)
          .get()
          .then((props) => {
            props.forEach((doc) => {
              a(result.value, doc.id, doc.data().name, doc.data().isArchive);
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
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => history.push("/")}
          >
            Ilabel
          </Typography>
          <IconButton color="inherit" onClick={JoinTeam}>
            <AddIcon />
          </IconButton>
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => history.push("/update-profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => history.push("/archive")}>
                Archive Team
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer open={open} anchor={"left"} onClose={handleDrawerClose}>
        {list()}
      </Drawer>
    </Box>
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
// const [error, setError] = useState("");
// const { currentUser, logout } = useAuth();
// const history = useHistory();
// var [currentId, setCurrentId] = useState("");
// const teamID = localStorage.getItem("currentTeamID");
// const [loading, setLoading] = useState(true);
// const [posts, setPosts] = useState([]);
// localStorage.setItem("currentUserEmail", currentUser.email);

// const createTeam = {
//   backgroundColor: "#272343",
// };

// const alert = {
//   color: "red",
// };

// async function handleLogout() {
//   try {
//     await logout();
//     window.localStorage.clear();
//     history.pushState("/login");
//   } catch (error) {
//     console.log(error);
//   }
// }

// function a(value, UID, teamName,isArchive) {
//   const member = {
//     role: "member",
//     uid: currentUser.uid,
//     TeamCode: value,
//     projectID: UID,
//     TeamName: teamName,
//     Status: "false",
//     email: currentUser.email,
//     isArchive:isArchive,
//   };
//   projectMembersService.create(member);
// }

// function JoinTeam() {
//   Swal.fire({
//     title: "Join Team",
//     input: "text",
//     inputPlaceholder: "Enter Team Code",
//     confirmButtonText: `JOIN`,
//   }).then((result) => {
//     console.log(result);
//     if (result.value == "") {
//       result.isConfirmed = false;
//     }
//     /* Read more about isConfirmed, isDenied below */

//     if (result.isConfirmed) {
//       projectFirestore
//         .collection("TEAM")
//         .where("TeamCode", "==", result.value)
//         .get()
//         .then((props) => {
//           props.forEach((doc) => {
//             a(result.value, doc.id, doc.data().name,doc.data().isArchive);
//           });
//         })
//         .catch((error) => {
//           console.log("Error getting documents: ", error);
//         });
//       Swal.fire("Success!", "", "success");
//     }
//   });
// }

//   return (
//     <>
// <Navbar collapseOnSelect expand="md" style={createTeam} variant="dark">
//   <Container>
//     <Navbar.Brand href="/">Ilabel</Navbar.Brand>
//     <Navbar.Toggle aria-controls="responsive-navbar-nav" />
//     <Navbar.Collapse id="responsive-navbar-nav">
//       <Nav className="me-auto">
//         <Nav.Link href="/tool">Tool</Nav.Link>
//         <Nav.Link href={`/myTeam`}>My Team</Nav.Link>
//         <Nav.Link onClick={JoinTeam}>Join Team</Nav.Link>
//       </Nav>
//       <Nav>
//         <Nav.Link></Nav.Link>
//         <Nav.Link
//           // onClick={JoinTeam}
//           id="collasible-nav"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             width="16"
//             height="16"
//             fill="currentColor"
//             class="bi bi-bell"
//             viewBox="0 0 16 16"
//           >
//             <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
//           </svg>
//         </Nav.Link>
//         <NavDropdown
//           title={currentUser.email}
//           id="collasible-nav-dropdown"
//         >
//           <NavDropdown.Item href="/update-profile">
//             Profile
//           </NavDropdown.Item>
//           <NavDropdown.Item href="/archive">Archive Team</NavDropdown.Item>
//           <NavDropdown.Divider />
//           <NavDropdown.Item onClick={handleLogout}>
//             Logout
//           </NavDropdown.Item>
//         </NavDropdown>
//       </Nav>
//     </Navbar.Collapse>
//   </Container>
// </Navbar>

//       <Container>
//         <BreadCrumb />
//       </Container>
//     </>
//   );
// }
