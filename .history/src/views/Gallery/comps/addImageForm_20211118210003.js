import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ImageGrid from "./ImageGrid";
import Title from "./Title";
import UploadForm from "./UploadForm";
import useStorage from "../hooks/useStorage";
import { Card, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import TopNav from "../../Navigation/TopNav";
import {
  projectFirestore,
  firebase,
  projectStorage,
  timestamp,
} from "../../../firebase";
import { Form } from "react-bootstrap";
import { Button } from "@material-ui/core";
import { motion } from "framer-motion";
import { useAuth } from "../../../logic/context/AuthContext";

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
  const { currentUser, logout } = useAuth();

  const ImagesDescription = useRef();
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

  function handleUpload() {
    fetchTotalImages();
    const promises = [];
    images.map(async (image) => {
      const uploadTask = projectStorage.ref(image.name);
      const increment = firebase.firestore.FieldValue.increment(1);
      const collectionRef = projectFirestore
        .collection("TEAM")
        .doc(teamID)
        .collection("FOLDERS")
        .doc(name)
        .collection("IMAGESFOLDER")
        .doc(folderID)
        .collection("IMAGES")
        .doc();

      const counterRef = projectFirestore
        .collection("TEAM")
        .doc(teamID)
        .collection("FOLDERS")
        .doc(name)
        .collection("IMAGESFOLDER")
        .doc(folderID);

      promises.push(uploadTask);

      uploadTask.put(image).on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },

        async () => {
          const url = await uploadTask.getDownloadURL();
          const createdAt = timestamp();
          const name = `${folderName}_${totalImages}`;
          const description = ImagesDescription.current.value;
          const email = currentUser.email;
          console.log(name);
          console.log(currentUser);

          const batch = projectFirestore.batch();
          batch.set(collectionRef, {
            url,
            createdAt,
            name,
            description,
            email,
          });
          batch.set(counterRef, { totalImages: increment }, { merge: true });

          batch.commit();
          totalImages = totalImages + 1;
          // collectionRef.add({ url, createdAt, name });
          setUrl((prevState) => [...prevState, url]);
        }
      );
    });

    history.push("/myTeam/gallery/folder/imagesfolder/galleryimagesfolder");
  }

  return (
    <>
      {/* <TopNav/> */}
      <div className="submit-form">
        <h2 className="text-center mb-4">Upload Images</h2>
        <motion.div
          className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: progress + "%" }}
        ></motion.div>
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
              ref={ImagesDescription}
              placeholder="Description"
              name="owner"
            />
          </Form.Group>

          <Button
            variant="contained"
            color="primary"
            className="w-100"
            onClick={handleUpload}
          >
            Upload
          </Button>
        </Form>
      </div>
    </>
  );
}
