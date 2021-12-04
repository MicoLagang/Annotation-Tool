import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import { Button } from "@material-ui/core";
import { projectFirestore } from "../../../firebase";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export default function AddFolder() {
  const teamID = localStorage.getItem("currentTeamID");
  const foldername = useRef();
  const history = useHistory();

  function saveData() {
    const data = {
      teamName: foldername.current.value,
      teamID: teamID,
    };

    if (foldername.current.value) {
      projectFirestore
        .collection("TEAM")
        .doc(teamID)
        .collection("FOLDERS")
        .add({ name: foldername.current.value });
      toast.success("LOADING PLEASE WAIT");
      setTimeout(function() {
        history.push("/myTeam/gallery");
      }, 5000);
    }
  }

  return (
    <div className="submit-form">
      <h2 className="text-center mb-4">Create your Project</h2>
      <ToastContainer />
      <Form>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            className="form-control"
            id="folderName"
            required
            //   onChange={foldername}
            ref={foldername}
            placeholder="Project Name"
            name="owner"
          />
        </Form.Group>

        <Button
          onClick={saveData}
          variant="contained"
          color="primary"
          className="w-100"
        >
          Create
        </Button>
      </Form>
    </div>
  );
}
