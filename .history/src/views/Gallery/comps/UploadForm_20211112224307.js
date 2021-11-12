import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import { projectFirestore } from "../../../firebase";
import { projectStorage, timestamp } from "../../../firebase";
import { motion } from "framer-motion";
import { Refresh } from "@material-ui/icons";
import { useParams, useHistory } from "react-router-dom";
import { folder } from "jszip";
import teamService from "../../../services/team.service";

const UploadForm = () => {
  const [file, setFile] = useState();
  // const [totalImages, setTotalImages] = useState(0);
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const history = useHistory();
  let totalImages = 1;

  // const { name } = useParams()
  // const {teamID} = useParams()
  // const {folderID} = useParams()
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const folderID = localStorage.getItem("currentImagesFolderID");
  const folderName = localStorage.getItem("currentImagesFolderName");

  const types = ["image/png", "image/jpeg"];

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
    fetchTotalImages();
  };

  function updatetotalImages(value) {
    projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .update({
        totalImages: value,
      })
      .then(() => {
        console.log("Updated Total Images from firebase is: " + totalImages);
      })
      .catch(() => {});
  }

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
    const promises = [];
    await images.map((image) => {
      const uploadTask = projectStorage.ref(image.name);
      const collectionRef = projectFirestore
        .collection("TEAM")
        .doc(teamID)
        .collection("FOLDERS")
        .doc(name)
        .collection("IMAGESFOLDER")
        .doc(folderID)
        .collection("IMAGES");
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
          updatetotalImages(totalImages);
          const url = await uploadTask.getDownloadURL();
          const createdAt = timestamp();
          const name = `${folderName}_${totalImages}`;
          totalImages = totalImages + 1;
          console.log(name);

          const data = {
            createdAt: createdAt,
            url: url,
            name: name,
          };

          await collectionRef.add(data);
          setUrl((prevState) => [...prevState, url]);
        }
      );
    });
  }

  function deleteFolder() {
    teamService.deleteFolder(teamID, name, folderID);
    history.push("/imagesfolder");
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
      <input type="file" multiple onChange={handleChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={fetchTotalImages}>Fetch TotalImages</button>
      <button onClick={deleteFolder}>Delete This Folder</button>
      <br />

      <br />
    </div>
  );
};

export default UploadForm;
