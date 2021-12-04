import React, { useRef } from "react";
import { Container, Form } from "react-bootstrap";
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
      toast.success("Project Created Successfully");
      setTimeout(function() {
        history.push("/myTeam/gallery");
      }, 3000);
    }
  }

  return (
    <>
      <TopNav></TopNav>

      <Container
        className="mt-5 d-flex justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="submit-form w-100" style={{ maxWidth: "350px" }}>
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
        </div>
      </Container>
    </>
  );
}
