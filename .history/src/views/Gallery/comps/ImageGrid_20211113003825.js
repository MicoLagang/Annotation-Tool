// import React from 'react';
// import useFirestore from '../hooks/useFirestore';
// import { motion } from 'framer-motion';
// import { Card, Container } from "react-bootstrap";
// import { Link , useHistory} from 'react-router-dom'
// const ImageGrid = ({ setSelectedImg }) => {

//   const history = useHistory()
//   const { docs } = useFirestore('PROJECT');
//   // history.push("/tool")

//   const cardLink = {
//     color: "#000000",
//     textDecoration: "none",
//     height: "200px",
//   };

//   return (
//     // <div className="img-grid">
// <>
//     <div className="row">
//       {docs && docs.map(doc => (

//         <Link
//         // to="/tool"
//         // to={`/tool/${doc.url}`}
//         to={{
//           pathname: `/tool`,
//           state: {
//             url: doc.url,
//           },
//         }}

//         style={cardLink}
//         className="col-lg-3 col-md-4 col-sm-12 mb-3"
//       >

//         <Card
//                  key={doc.id}
//           border="dark"
//           className="h-100"
//           style={{
//             backgroundImage: `url(${doc.url})`,
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             backgroundSize: "cover",

//           }}
//           // onClick={() => setSelectedImg(doc.url)}
//         ></Card>
//       </Link>
//       ))}
//       </div>
//           {/* <div className="row">
//       {docs && docs.map(doc => (

//         <motion.div className="img-wrap" key={doc.id}
//           layout
//           whileHover={{ opacity: 1 }}s
//           onClick={() => setSelectedImg(doc.url)}
//         >
//           <motion.img src={doc.url} alt="uploaded pic"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1 }}
//           />
//         </motion.div>
//       ))}
//     </div> */}
//     </>

//   )
// }

// export default ImageGrid;

import React, { useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useImage } from "../../../logic/context/imageContext";
import { projectFirestore } from "../../../firebase";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";

function ImageGrid() {
  const { docs } = useFirestore("TEAM");
  const { imagesData, setImagesData } = useImage();

  const [imagesID, setImagesID] = useState([]);
  const [imagesURL, setImagesURL] = useState([]);
  const [imagesName, setImagesName] = useState([]);
  const currentUserRole = localStorage.getItem("currentUserRole");
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const folderID = localStorage.getItem("currentImagesFolderID");

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "200px",
  };

  function showSelectedImage() {
    console.log(imagesURL);
    setImagesData(imagesURL);
  }

  async function deleteSelectedImage() {
    if (imagesID.length == 0) {
      teamService.deleteImages(teamID, name, folderID, imagesID[0]);
    } else {
      for (let index = 0; index < imagesID.length; index++) {
        await teamService.deleteImages(teamID, name, folderID, imagesID[index]);
      }
      setImagesID([]);
      setImagesURL([]);
      toast.success("Images deleted successfully");
    }
  }

  function addImage(doc) {
    if (imagesURL.length == 0) {
      setImagesURL([...imagesURL, doc.url]);
      setImagesID([...imagesID, doc.id]);
      setImagesName([...imagesID, doc.name]);
      console.log(doc);
      return;
    }
    for (let i = 0; i < imagesURL.length; i++) {
      if (doc.url == imagesURL[i]) {
        const tempArray = imagesURL.filter((element) => element != doc.url);
        setImagesURL(tempArray);
        return;
      } else {
        setImagesURL([...imagesURL, doc.url]);
      }
    }

    for (let i = 0; i < imagesID.length; i++) {
      if (doc.id == imagesID[i]) {
        const tempArray = imagesID.filter((element) => element != doc.id);
        setImagesID(tempArray);
        return;
      } else {
        setImagesID([...imagesID, doc.id]);
      }
    }

    for (let i = 0; i < imagesName.length; i++) {
      if (doc.name == imagesName[i]) {
        const tempArray = imagesName.filter((element) => element != doc.name);
        setImagesName(tempArray);
        return;
      } else {
        setImagesName([...imagesName, doc.name]);
      }
    }
  }

  function annotateFolder() {
    let arr = [];
    docs.map((doc) => {
      arr.push(doc.url);
    });
    console.log(arr);
    setImagesData(arr);
  }

  return (
    <>
      <ToastContainer />
      {currentUserRole !== "contributor" && (
        <div>
          {imagesURL.length > 0 && (
            <div>
              <p>Selected: {imagesURL.length}</p>
              <Link to="/tool" onClick={() => showSelectedImage()}>
                Annotate
              </Link>
              <br></br>
              <Link onClick={() => deleteSelectedImage()}>Delete</Link>
            </div>
          )}

          <Link to="/tool" onClick={() => annotateFolder()}>
            Annotate This Folder
          </Link>

          <div className="row">
            {docs &&
              docs.map((doc) => (
                <Link
                  // to="/tool"
                  style={cardLink}
                  className="col-lg-3 col-md-4 col-sm-12 mb-3"
                >
                  <Card
                    key={doc.id}
                    border="dark"
                    className="h-100"
                    style={{
                      backgroundImage: `url(${doc.url})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                    onClick={() => addImage(doc)}
                  ></Card>
                </Link>
              ))}
          </div>
        </div>
      )}

      {currentUserRole === "contributor" && (
        <div className="row">
          {docs &&
            docs.map((doc) => (
              <Link
                // to="/tool"
                style={cardLink}
                className="col-lg-3 col-md-4 col-sm-12 mb-3"
              >
                <Card
                  key={doc.id}
                  border="dark"
                  className="h-100"
                  style={{
                    backgroundImage: `url(${doc.url})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                  onClick={() => addImage(doc)}
                ></Card>
              </Link>
            ))}
        </div>
      )}
    </>
  );
}

export default ImageGrid;
