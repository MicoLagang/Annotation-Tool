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
  let totalImages = 0;

  // const { name } = useParams()
  // const {teamID} = useParams()
  // const {folderID} = useParams()
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const folderID = localStorage.getItem("currentImagesFolderID");
  const folderName = localStorage.getItem("currentImagesFolderName");

  const types = ["image/png", "image/jpeg"];

  const handleChange = (e) => {
    // let selected = e.target.files[0];

    // if (selected && types.includes(selected.type)) {
    //   setFile(selected);
    //   setError('');
    // } else {
    //   setFile(null);
    //   setError('Please select an image file (png or jpg)');
    // }

    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  async function fetchTotalImages() {
    console.log("fetching data...");
    // fetch from totalImages from database and save to variable
    await projectFirestore
      .collection("TEAM")
      .doc("mJqj0HFsZgwxFuRWQWUo")
      .collection("FOLDERS")
      .doc("vkf9ymWrj2xLMgmldoMg")
      .collection("IMAGESFOLDER")
      .doc("d49gZ8nEnHumZ18NzNjQ")
      .get()
      .then((snapshot) => {
        totalImages = snapshot.data().totalImages;
        console.log(totalImages);
      });
  }
  fetchTotalImages();

  async function handleUpload() {
    const promises = [];
    images.map((image) => {
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
          console.log(totalImages);
          const url = await uploadTask.getDownloadURL();
          const createdAt = timestamp();
          const name = `${folderName}_${totalImages}`;
          // const newTotalImages = totalImagessss + 1;
          // totalImages = totalImages + 1;
          // console.log(totalImages);

          const data = {
            createdAt: createdAt,
            url: url,
            name: name,
          };
          console.log(data);

          await collectionRef.add(data);
          setUrl((prevState) => [...prevState, url]);
          // await projectStorage
          //   .ref(image.name)
          //   .getDownloadURL()
          //   .then((urls) => {
          //     setUrl((prevState) => [...prevState, urls]);
          //   });

          //   await collectionRef.add({ url, createdAt });
          // fetchTotalImages();
        }
      );
    });

    // next update the total images in database
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
