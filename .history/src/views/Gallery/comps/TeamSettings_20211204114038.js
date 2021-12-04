import React, { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../../../firebase";
import { useHistory } from "react-router-dom";
import { Form, Container } from "react-bootstrap";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";
import projectMembersService from "../../../services/projectMembers.service";
import teamMemberServices from "../../../services/team.member.services";
import TopNav from "../../Navigation/TopNav";
import Swal from "sweetalert2";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";

function TeamSettings() {
  const teamID = localStorage.getItem("currentTeamID");
  const history = useHistory();
  const teamNameref = useRef();

  const [updata, setUpdata] = useState({
    data: {
      role: "",
      status: "",
    },
    uid: "",
  });

  const [value, setValue] = useState();

  useEffect(() => {
    getValue();
  }, []);

  function getValue() {
    var docRef = projectFirestore.collection("TEAM").doc(teamID);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setUpdata(doc.data());
          setValue(doc.data().name);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

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
        history.push("/myTeam");
      }
    });
  }
  return (
    <>
      <TopNav></TopNav>
      <ToastContainer />
      <Container
        className="mt-5 d-flex justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "350px" }}>
          <Card style={{ width: "100%" }}>
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
            </CardContent>
            <CardActions>
              <Button
                color="primary"
                className="text-capitalize"
                onClick={update}
              >
                Update
              </Button>
            </CardActions>
          </Card>
          <br></br>
          <Card style={{ width: "100%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                ARCHIVE THIS TEAM
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Mark this team as archived.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                color="primary"
                className="text-capitalize"
                onClick={archiveTeam}
              >
                Archive
              </Button>
            </CardActions>
          </Card>
          <br></br>
          <Card style={{ width: "100%" }}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                DELETE THIS TEAM
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Once you delete a team, there is no going back. Please be
                certain.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                color="secondary"
                className="text-capitalize"
                onClick={deleteTeam}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        </div>
      </Container>
    </>
  );
}

export default TeamSettings;
