import React, { useState, useRef, useEffect } from "react";
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
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

import { Form } from "react-bootstrap";

import { useAuth } from "../../logic/context/AuthContext";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import swal from '@sweetalert/with-react'
import projectMembersService from "../../services/projectMembers.service";
import { projectFirestore } from "../../firebase";
import BreadCrumb from "../components/BreadCrumb";
import { toast, ToastContainer } from "react-toastify";
import teamMemberServices from "../../services/team.member.services";
import teamService from "../../../services/team.service";

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
  const teamNameref = useRef();
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
  
  const [value, setValue] = useState();

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
  

  const update = () => {
    try {
      teamService.editTeam(teamNameref.current.value, teamID);
      projectMembersService.editTeamMembers(teamNameref.current.value, teamID);
    } catch (e) {
      toast.error("Something went wrong!");
    } finally {
      toast.success("EDIT SUCCESS");
      setTimeout(function() {
        history.push("/myTeam");
      }, 5000);
    }
  };

  
  function deleteTeam() {
    // teamService.deleteTeam(teamID);
    // projectMembersService.deleteTeam(teamID);
    // history.push("/myTeam");
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        setTimeout(function() {
          teamService.deleteTeam(teamID);
          projectMembersService.deleteTeam(teamID);
          teamMemberServices.deleteproject(teamID);
          history.push("/myTeam");
        }, 1000);
      }
    });
  }
  
  function showTeamMembers() {
    history.push("/myTeam/gallery/teamMembers");
  }

  function archiveTeam() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Archive it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Archived!",
          "Your team has been move to Archive .",
          "success"
        );
        teamService.ArchiveTeam(teamID);
        projectMembersService.ArchiveTeam(teamID);
        history.push("/");
      }
    });
  }

  function Settings() {return <div>
      { currentUserRole === "admin" && (
            <>
              <Card style={{ width: "19rem" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    EDIT TEAM NAME
                  </Typography>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      defaultValue={value}
                      ref={teamNameref}
                    />
                    <Form.Text className="text-muted">
                      Edit your team name
                    </Form.Text>
                  </Form.Group>
                  <Button variant="contained" onClick={update}>
                    UPDATE
                  </Button>
                </CardContent>
              </Card>
              <br></br>
              <Card style={{ width: "19rem" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    DELETE THIS TEAM
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Once you delete a team, there is no going back. Please be
                    certain.
                  </Typography>
                  <Button variant="contained" onClick={deleteTeam}>
                    DELETE
                  </Button>
                </CardContent>
              </Card>
              <br></br>
              <Card style={{ width: "19rem" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    ARCHIVE THIS TEAM
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mark this team as archived
                  </Typography>
                  <Button variant="contained" onClick={archiveTeam}>
                    ARCHIVE
                  </Button>
                </CardContent>
              </Card>
            </>
      )}
    </div>
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
          <IconButton color="inherit" onClick={JoinTeam}>
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
