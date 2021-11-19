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
    console.log(imagesID);
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

  function clearSelection() {
    setImagesURL([]);
    setImagesID([]);
    setImagesName([]);
  }

  function addImage(doc) {
    console.log(imagesURL.length);
    if (imagesURL.length == 0) {
      setImagesURL([...imagesURL, doc.url]);
      setImagesID([...imagesID, doc.id]);
      console.log(imagesURL);
      console.log(imagesID);
      break;
    }
    for (let i = 0; i < imagesURL.length; i++) {
      if (doc.url == imagesURL[i]) {
        const tempArray = imagesURL.filter((element) => element != doc.url);
        setImagesURL(tempArray);
        console.log(imagesURL);
        break;
      } else {
        setImagesURL([...imagesURL, doc.url]);
        console.log(imagesURL);
      }
    }

    for (let i = 0; i < imagesID.length; i++) {
      if (doc.id == imagesID[i]) {
        const tempArray = imagesID.filter((element) => element != doc.id);
        setImagesID(tempArray);
        console.log(imagesID);
        break;
      } else {
        setImagesID([...imagesID, doc.id]);
        console.log(imagesID);
      }
    }
  }

  function annotateFolder() {
    let arr = [];
    docs.map((doc) => {
      arr.push(doc);
    });
    console.log(arr);
    setImagesData(arr);
  }

  function isActive(doc) {
    for (let i = 0; i < imagesURL.length; i++) {
      if (doc.url == imagesURL[i]) {
        return true;
      } else {
        continue;
      }
    }
  }

  return (
    <>
      <ToastContainer />
      {currentUserRole !== "contributor" && (
        <div>
          {imagesURL.length > 0 && (
            <div>
              <p>Selected: {imagesID.length}</p>
              {/* <Link to="/tool" onClick={() => showSelectedImage()}>
                Annotate
              </Link> */}
              <br></br>
              <Link onClick={() => deleteSelectedImage()}>Delete</Link>
              <Link onClick={() => clearSelection()}>Clear</Link>
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
                    border="primary"
                    className="h-100"
                    style={{
                      backgroundImage: `url(${doc.url})`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      border: isActive(doc) ? "4px solid" : "",
                    }}
                    onClick={() => addImage(doc)}
                  ></Card>
                  <p className="text-center">{doc.name}</p>
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
                <p className="text-center">{doc.name}</p>
              </Link>
            ))}
        </div>
      )}
    </>
  );
}

export default ImageGrid;
