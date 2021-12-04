import React, { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../../../firebase";
import { Link, useHistory } from "react-router-dom";
import { Modal, Tabs, Tab, Form, Container } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";
import projectMembersService from "../../../services/projectMembers.service";
import Swal from "sweetalert2";
import TeamMembers from "../../Team/TeamMembers";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import teamMemberServices from "../../../services/team.member.services";

function TeamSettings() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [teamName, setTeamName] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const teamID = localStorage.getItem("currentTeamID");
  const history = useHistory();
  const currentUserRole = localStorage.getItem("currentUserRole");
  const teamNameref = useRef();
  const TeamCollection = projectFirestore.collection("TEAM").doc(teamID);

  const createTeam = {
    backgroundColor: "#FFD803",
  };

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };

  const [updata, setUpdata] = useState({
    data: {
      role: "",
      status: "",
    },
    uid: "",
  });

  const [value, setValue] = useState();

  function deleteTeam() {
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
    return ( <div>
        <div className="justify-content-md-center">
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
            </div>
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
        </div>
    )
}

export default TeamSettings;