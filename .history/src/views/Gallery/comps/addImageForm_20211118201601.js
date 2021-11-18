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

export default function AddImageForm(post) {
  // const {teamID} = useParams()
  //   const { name } = useParams()

  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const history = useHistory();
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  let totalImages = 0;

  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const folderID = localStorage.getItem("currentImagesFolderID");
  const folderName = localStorage.getItem("currentImagesFolderName");
  const currentUserRole = localStorage.getItem("currentUserRole");

  const types = ["image/png", "image/jpeg"];

  const foldername = useRef();
  const createTeam = {
    backgroundColor: "#FFD803",
  };

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
    fetchTotalImages();
  };

  async function fetchTotalImages() {
    console.log("fetching data...");
    await projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .get()
      .then((snapshot) => {
        totalImages = snapshot.data().totalImages;
        console.log("Total Images from firebase is: " + totalImages);
      });
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
      {/* <TopNav/> */}
      <div className="submit-form">
        <h2 className="text-center mb-4">Upload Images</h2>
        <Form>
          {/* <div>{teamID}</div> */}
          <Form.Group controlId="formFileMultiple" className="mb-3">
            <Form.Label>Multiple files input example</Form.Label>
            <Form.Control type="file" multiple onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              className="form-control"
              id="folderName"
              required
              //   onChange={foldername}
              ref={foldername}
              placeholder="Description"
              name="owner"
            />
          </Form.Group>

          <Button variant="contained" color="primary" className="w-100">
            Upload
          </Button>
        </Form>
      </div>
    </>
  );
}
