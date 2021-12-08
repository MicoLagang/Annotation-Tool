import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ImageGrid from "./ImageGrid";
import Title from "./Title";
import UploadForm from "./UploadForm";
import useStorage from "../hooks/useStorage";
import { Card, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import TopNav from "../../Navigation/TopNav";
import { projectFirestore } from "../../../firebase";
import { Form } from "react-bootstrap";
import { Button } from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";

export default function TestTeam(post) {
  // const {teamID} = useParams()
  //   const { name } = useParams()
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const history = useHistory();
  const [double, setDouble] = useState(false);

  const foldername = useRef();
  const createTeam = {
    backgroundColor: "#FFD803",
  };

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };

  function saveData() {
    if (foldername.current.value) {
      setDouble(true);
      projectFirestore
        .collection("TEAM")
        .doc(teamID)
        .collection("FOLDERS")
        .doc(name)
        .collection("IMAGESFOLDER")
        .add({
          name: foldername.current.value,
          totalImages: 1,
          isAccepted: false,
          isSubmitted: false,
          isCompleted: false,
          isRejected: false,
        });
      toast.success("Folder Created Successfully");
      setTimeout(function() {
        history.push("/myTeam/gallery/folder");
      }, 5000);
    }
    setDouble(true);
  }

  return (
    //     <div>
    // <Title/>
    //     {/* <input
    //         type="file"
    //         multiple
    //     /> */}
    // <UploadForm/>
    //   <ImageGrid setSelectedImg={setSelectedImg} />
    //         {/* <h2>Team { name }</h2>
    //         <h1>HELLO PO YAWAA TESt</h1> */}
    //     </div>

    <>
      <TopNav />
      <Container
        className="mt-5 d-flex justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <ToastContainer />
        <div className="submit-form">
          <h2 className="text-center mb-4">Create Images Folder</h2>
          <Form>
            {/* <div>{teamID}</div> */}
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                className="form-control"
                id="folderName"
                required
                //   onChange={foldername}
                ref={foldername}
                placeholder="Name"
                name="owner"
              />
            </Form.Group>

            <Button
              disabled={double}
              onClick={() => {
                saveData();
              }}
              variant="contained"
              color="primary"
              className="w-100"
            >
              Create
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
}
