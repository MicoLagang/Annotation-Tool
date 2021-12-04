import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import MuiAppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import { ListItemIcon } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";

import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import AddIcon from "@material-ui/icons/Add";
import GroupIcon from "@material-ui/icons/Group";
import BuildIcon from "@material-ui/icons/Build";
import SettingsIcon from "@material-ui/icons/Settings";

import { useAuth } from "../../logic/context/AuthContext";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import swal from '@sweetalert/with-react'
import projectMembersService from "../../services/projectMembers.service";
import { projectFirestore } from "../../firebase";
import FolderList from "../Gallery/comps/FolderList"

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  localStorage.setItem("currentUserEmail", currentUser.email);
  let currentTeamName = localStorage.getItem("currentTeamName");
  const currentUserRole = localStorage.getItem("currentUserRole");
  const [bgcolor, setBgColor] = useState("");
  const style = {
    backgroundColor: `${bgcolor}`,
    paddingBottom: "0px !important",
    fontSize: "14px",
    color: "white",
  };

  const createTeam = {
    backgroundColor: "#272343",
  };

  const alert = {
    color: "red",
  };

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

  useEffect(() => {
    if (currentUserRole == "admin") return setBgColor("#c92d39");
    else if (currentUserRole == "validator") return setBgColor("#834187");
    else if (currentUserRole == "annotator") return setBgColor("#fcc438");
    else if (currentUserRole == "contributor") return setBgColor("#82bb53");
  }, []);

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

  function DisplaySettings() {
    swal( <FolderList/> )
  }

  const itemList = [
    {
      text: "My Team",
      icon: <GroupIcon />,
      link: () => history.push("/myTeam"),
    },
    {
      text: "Annotation Tool",
      icon: <BuildIcon />,
      link: () => history.push("/tool"),
    },
  ];

  const list = () => (
    <List style={{ width: drawerWidth }} onClick={() => setOpen(false)}>
      {itemList.map((item, index) => {
        const { text, icon, link } = item;
        return (
          <ListItem button key={text} onClick={link}>
            {icon && <ListItemIcon>{icon}</ListItemIcon>}
            <ListItemText primary={text}></ListItemText>
          </ListItem>
        );
      })}
    </List>
  );

  const topNavChangeableLinks = () => (
    <>
      {currentTeamName ? (
        <>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => history.push("/myTeam/gallery")}
          >
            {currentTeamName}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button className="text-capitalize" color="inherit" href="/myTeam/gallery">
            Projects
          </Button>
          <Button  className="text-capitalize" color="inherit" href="/myTeam/gallery/teamMembers">
            Team Members
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          {currentUserRole && <Chip style={style} label={currentUserRole} />}
          <IconButton color="inherit" onClick={DisplaySettings}>
            <SettingsIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1 }}
            onClick={() => history.push("/")}
          >
            Ilabel
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton color="inherit" onClick={JoinTeam}>
            <AddIcon />
          </IconButton>
        </>
      )}
    </>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }} className="mb-4">
        <AppBar position="static" open={open}>
          <Toolbar>
            <IconButton
              onClick={handleDrawerOpen}
              edge="start"
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {topNavChangeableLinks()}

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
          </Toolbar>
        </AppBar>
        <Drawer open={open} anchor={"left"} onClose={handleDrawerClose}>
          {list()}
        </Drawer>
      </Box>
      {/* <Container className="mt-3">
        <BreadCrumb />
      </Container> */}
    </>
  );
}
