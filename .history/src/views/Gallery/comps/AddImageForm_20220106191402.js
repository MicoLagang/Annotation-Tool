import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import ImageGrid from "./ImageGrid";
import Title from "./Title";
import UploadForm from "./UploadForm";
import useStorage from "../hooks/useStorage";
import { Container } from "react-bootstrap";
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

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    marginBottom: "20px",
  },
  details: {
    flex: "1 0 auto",
  },
  cover: {
    minWidth: 110,
  },
  content: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "15rem",
  },
}));

export default function AddImageForm(post) {
  const classes = useStyles();
  const theme = useTheme();

  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState([]);
  const [uploadedImageName, setUploadedImageName] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(true);
  const history = useHistory();
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  let totalImages = 0;

  let uploadedImages = 0;

  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const folderID = localStorage.getItem("currentImagesFolderID");
  const folderName = localStorage.getItem("currentImagesFolderName");
  const currentUserRole = localStorage.getItem("currentUserRole");
  const currentUserName = localStorage.getItem("currentUserName");

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
      console.log(newImage);
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

  async function handleUpload() {
    setShowUploadForm(false);
    await fetchTotalImages();
    const promises = [];
    const length = images.length;
    images.map(async (image, index) => {
      const increment = firebase.firestore.FieldValue.increment(1);
      const uploadTask = projectStorage.ref(
        `${new Date().getTime()}_${image.name}`
      );
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
          const uploader = currentUserName;
          console.log(name);
          console.log(currentUser);

          const batch = projectFirestore.batch();
          batch.set(collectionRef, {
            url,
            createdAt,
            name,
            description,
            email,
            uploader,
          });
          batch.set(counterRef, { totalImages: increment }, { merge: true });

          batch.commit();
          totalImages = totalImages + 1;
          uploadedImages = uploadedImages + 1;
          // collectionRef.add({ url, createdAt, name });
          setUrl((prevState) => [...prevState, url]);
          setUploadedImageName((prevState) => [
            ...prevState,
            { url: url, name: image.name },
          ]);

          console.log(uploadedImages);
          console.log(images.length);
        }
      );
    });
  }

  return (
    <>
      <TopNav />
      <Container
        className="mt-5 d-flex justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "350px" }}>
          <h2 className="text-center mb-4">Upload Images</h2>
          {/* <motion.div
              className="progress-bar"
              initial={{ width: 0 }}
              animate={{ width: progress + "%" }}
            ></motion.div> */}

          <div className="submit-form">
            <Form>
              <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Control
                  type="file"
                  accept="image/x-png,image/jpeg"
                  multiple
                  onChange={handleChange}
                  style={{ color: "black" }}
                />
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

              {showUploadForm && (
                <Button
                  variant="contained"
                  color="primary"
                  className="w-100"
                  onClick={handleUpload}
                >
                  Upload
                </Button>
              )}
            </Form>
          </div>

          {uploadedImageName.map((item, i) => (
            <Card className={classes.root}>
              <CardMedia
                className={classes.cover}
                image={item.url}
                title={item.name}
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography noWrap variant="caption" color="textSecondary">
                    {item.name}
                  </Typography>
                </CardContent>
                <motion.div
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: progress + "%" }}
                ></motion.div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </>
  );
}
