import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import { projectFirestore } from "../../../firebase";
import { projectStorage, timestamp } from "../../../firebase";
import { motion } from "framer-motion";
import { Refresh } from "@material-ui/icons";
import { useParams, useHistory } from "react-router-dom";
import { folder } from "jszip";
import teamService from "../../../services/team.service";
import firebase from "firebase/app";
import Swal from "sweetalert2";

const UploadForm = () => {
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
          console.log(name);

          const batch = projectFirestore.batch();
          batch.set(collectionRef, { url, createdAt, name });
          batch.set(counterRef, { totalImages: increment }, { merge: true });
          batch.commit();
          totalImages = totalImages + 1;
          // collectionRef.add({ url, createdAt, name });
          setUrl((prevState) => [...prevState, url]);
        }
      );
    });
  }

  function deleteFolder() {
    teamService.deleteFolder(teamID, name, folderID);
    history.push("/myTeam/gallery/folder/imagesfolder");
  }

  function imagePopup() {
    Swal.fire({
      title: "Join Team",
      input: "text",
      inputPlaceholder: "Enter Team Code",
      confirmButtonText: `JOIN`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
    });
  }

  //   const handleChange = (e) => {
  //     for (let i = 0; i < e.target.files.length; i++) {
  //         const newImage = e.target.files[i];
  //         console.log(newImage)
  //         newImage["id"] = Math.random();
  //         setFile((prevState) => [...prevState, newImage]);
  //     }
  // };

  return (
    // <form>
    //   {/* <label> */}
    //     <input type="file" multiple onChange={handleChange} />
    //     {/* <span>+</span> */}
    //   {/* </label> */}
    //   <div className="output">
    //     { file && <div>{ file.name }</div> }
    //     { file && <ProgressBar file={file} setFile={setFile} /> }
    //   </div>

    // </form>
    <div>
      <motion.div
        className="progress-bar"
        initial={{ width: 0 }}
        animate={{ width: progress + "%" }}
      ></motion.div>
      <br />
      <br />
      <input type="file" multiple onChange={imagePopup} />
      <button onClick={handleUpload}>Upload</button>
      {currentUserRole === "admin" && (
        <button onClick={deleteFolder}>Delete This Folder</button>
      )}
      <br />

      <br />
    </div>
  );
};

export default UploadForm;
