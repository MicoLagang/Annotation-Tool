import React, { useState, useEffect } from "react";
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
  const [annotatedImagesArray, setAnnotatedImagesArray] = useState([]);

  const currentUserRole = localStorage.getItem("currentUserRole");
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const folderID = localStorage.getItem("currentImagesFolderID");
  let data = [];
  let annotationData;

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "200px",
  };

  const cardsStyle = {};

  useEffect(() => {
    getAnnotationData();
  }, []);

  function getAnnotationData() {
    projectFirestore
      .collection("ANNOTATIONS")
      .where("folderID", "==", folderID)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          data.push({
            ...doc.data(), //spread operator
            key: doc.id, // id given to us by Firebase
          });
        });
        console.log(data.length);
        if (data.length > 0) {
          let parseData = JSON.parse(data[0].data);
          setAnnotatedImagesArray([parseData.images]);
        }
      });
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
    console.log(doc);
    if (imagesURL.length == 0) {
      setImagesURL([...imagesURL, doc.url]);
      setImagesID([...imagesID, doc.id]);
      return;
    }
    for (let i = 0; i < imagesURL.length; i++) {
      if (doc.url == imagesURL[i]) {
        const tempArray = imagesURL.filter((element) => element != doc.url);
        setImagesURL(tempArray);
        break;
      } else {
        setImagesURL([...imagesURL, doc.url]);
      }
    }

    for (let i = 0; i < imagesID.length; i++) {
      if (doc.id == imagesID[i]) {
        const tempArray = imagesID.filter((element) => element != doc.id);
        setImagesID(tempArray);
        break;
      } else {
        setImagesID([...imagesID, doc.id]);
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

  function isAnnotated(doc) {
    console.log("--------------------");
    if (annotatedImagesArray) {
      for (let i = 0; i < annotatedImagesArray.length; i++) {
        for (let index = 0; index < annotatedImagesArray[i].length; index++) {
          const SliceImageName = annotatedImagesArray[i][index].file_name
            .split(".")
            .filter((item) => item);
          if (doc.name == SliceImageName[0]) {
            console.log("match");
            return true;
          } else {
            console.log("did not...");
            continue;
          }
        }
      }
    } else console.log("no records");
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
                  <div class="flip-box">
                    <div class="flip-box-inner">
                      <div class="flip-box-front">
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
                      </div>
                      <div class="flip-box-back px-2">
                        <p>Name: {doc.name}</p>
                        <p>Description: {doc.description}</p>
                        <p>Uploaded by: {doc.email}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-center">{doc.name}</p>
                  {isAnnotated(doc) ? (
                    <p className="text-center">Annotated</p>
                  ) : (
                    <p></p>
                  )}
                </Link>
                // <div class="flip-box">
                //   <div class="flip-box-inner">
                //     <div class="flip-box-front">
                //       <Link
                //         // to="/tool"
                //         style={cardLink}
                //         className="col-lg-3 col-md-4 col-sm-12 mb-3"
                //       >
                //         <Card
                //           key={doc.id}
                //           border="primary"
                //           className="h-100"
                //           style={{
                //             backgroundImage: `url(${doc.url})`,
                //             backgroundRepeat: "no-repeat",
                //             backgroundPosition: "center",
                //             backgroundSize: "cover",
                //             border: isActive(doc) ? "4px solid" : "",
                //           }}
                //           onClick={() => addImage(doc)}
                //         ></Card>
                //         <p className="text-center">{doc.name}</p>
                //         {isAnnotated(doc) ? (
                //           <p className="text-center">Annotated</p>
                //         ) : (
                //           <p></p>
                //         )}
                //       </Link>
                //     </div>
                //     <div class="flip-box-back">
                //       <h2>Paris</h2>
                //       <p>What an amazing city</p>
                //     </div>
                //   </div>
                // </div>
              ))}
          </div>
        </div>
      )}

      {currentUserRole === "contributor" && (
        <div className="row">
          {docs &&
            docs.map((doc) => (
              // <Link
              //   // to="/tool"
              //   style={cardLink}
              //   className="col-lg-3 col-md-4 col-sm-12 mb-3"
              // >
              //   <Card
              //     key={doc.id}
              //     border="dark"
              //     className="h-100"
              //     style={{
              //       backgroundImage: `url(${doc.url})`,
              //       backgroundRepeat: "no-repeat",
              //       backgroundPosition: "center",
              //       backgroundSize: "cover",
              //     }}
              //     onClick={() => addImage(doc)}
              //   ></Card>
              //   <p className="text-center">{doc.name}</p>
              //   {isAnnotated(doc) ? (
              //     <p className="text-center">Annotated</p>
              //   ) : (
              //     <p></p>
              //   )}
              // </Link>
              <div class="flip-box">
                <div class="flip-box-inner">
                  <div class="flip-box-front"></div>
                  <div class="flip-box-back">
                    <h2>Paris</h2>
                    <p>What an amazing city</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}

export default ImageGrid;
