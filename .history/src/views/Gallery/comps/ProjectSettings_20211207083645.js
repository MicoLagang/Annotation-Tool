import React, { useEffect, useState, useRef } from "react";
import { Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { projectFirestore } from "../../../firebase";
import projectMembersService from "../../../services/projectMembers.service";
import teamService from "../../../services/team.service";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

function ProjectSettings() {
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const [loading, setLoading] = useState(true);
  const currentUserRole = localStorage.getItem("currentUserRole");
  const uid = localStorage.getItem("currentUserUID");
  const history = useHistory();
  const [value, setValue] = useState();
  const projectNameref = useRef();

  projectMembersService.getRole(uid, teamID);

  useEffect(() => {
    getValue();
  }, [loading]); // empty dependencies array => useEffect only called once

  function getValue() {
    var docRef = projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setUpdata(doc.data());
          setValue(doc.data().name);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  function deleteProject() {
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
          teamService.deleteProject(teamID, name);
          history.push("/myTeam/gallery");
        }, 2000);
      }
    });
  }

  const update = () => {
    projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .update({
        name: projectNameref.current.value,
      })
      .then(() => {
        toast.success("EDIT SUCCESS");
        setTimeout(function() {
          history.push("/myTeam/gallery");
        }, 5000);
      })
      .catch(() => {
        toast.error("Something went wrong!");
      });
  };

  return (
    <>
      {currentUserRole === "admin" && (
        <Card style={{ width: "19rem" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              EDIT PROJECT NAME
            </Typography>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                defaultValue={value}
                ref={projectNameref}
              />
              <Form.Text className="text-muted">
                Edit your project name
              </Form.Text>
            </Form.Group>
            <Button variant="contained" onClick={update}>
              UPDATE
            </Button>
          </CardContent>
        </Card>
      )}
      <br></br>
      {currentUserRole === "admin" && (
        <Card style={{ width: "19rem" }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              DELETE THIS PROJECT
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Once you delete a project, there is no going back. Please be
              certain.
            </Typography>
            <Button variant="contained" onClick={deleteProject}>
              DELETE
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default ProjectSettings;
