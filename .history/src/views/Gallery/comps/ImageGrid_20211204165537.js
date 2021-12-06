import React, { useState, useEffect } from "react";
import useFirestore from "../hooks/useFirestore";
import { Link, useParams, useHistory } from "react-router-dom";
import { useImage } from "../../../logic/context/imageContext";
import { projectFirestore } from "../../../firebase";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.js";

import Box from "@material-ui/core/Box";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";

import { Card, Row, Col } from "react-bootstrap";

function ImageGrid() {
  const { docs } = useFirestore("TEAM");
  const { imagesData, setImagesData } = useImage();
  const history = useHistory();

  const [imagesID, setImagesID] = useState([]);
  const [imagesURL, setImagesURL] = useState([]);
  const [imagesName, setImagesName] = useState([]);
  const [annotatedImagesArray, setAnnotatedImagesArray] = useState([]);

  const currentUserRole = localStorage.getItem("currentUserRole");
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const folderID = localStorage.getItem("currentImagesFolderID");
  const userEmail = localStorage.getItem("currentUserEmail");
  let data = [];
  let annotationData;
  let imageFolderData;
  const [imageFolderName, setImageFolderName] = useState("");
  const [totalImages, setTotalImages] = useState(0);
  const [totalAnnotatedImages, setTotalAnnotatedImages] = useState(0);
  let counter = 0;
  const [isSubmitted, setisSubmitted] = useState();
  const [isAccepted, setisAccepted] = useState();

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "200px",
  };

  useEffect(() => {
    var docRef = projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          setisSubmitted(doc.data().isSubmitted);
          setisAccepted(doc.data().isAccepted);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
    getAnnotationData();
    getImageFolderData();
  }, []);

  const getImageFolderData = () => {
    teamService.getImageFolderData(teamID, name, folderID).then((data) => {
      console.log(data.data().name);
      setImageFolderName(data.data().name);
      setTotalImages(data.data().totalImages - 1);
    });

    return;
  };

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
    history.push("/tool");
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
            counter = counter + 1;
            console.log(counter);
            return true;
          } else {
            continue;
          }
        }
        if (i == annotatedImagesArray.length) {
          console.log("last");
        }
      }
    } else console.log("no records");
  }

  function deleteFolder() {
    teamService.deleteFolder(teamID, name, folderID);
    history.push("/myTeam/gallery/folder");
  }

  function submitAnnotation() {
    Swal.fire({
      title: "Are you sure to submit annotation?",
      timer: 5000,
      showDenyButton: true,
      confirmButtonText: "Submit",
      denyButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        teamService.submitAnnotation(teamID, name, folderID);
        Swal.fire("Annotation Successfully Submitted!", "", "success").then(
          () => {
            window.location.reload(false);
          }
        );
      } else if (result.isDenied) {
        Swal.fire("Submission Cancelled", "", "info");
      }
    });
  }

  async function acceptAnnotaion(doc) {
    Swal.fire({
      title: "Are you sure to accept the submitted annotation?",
      showDenyButton: true,
      confirmButtonText: "Accept",
      denyButtonText: "Cancel",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        teamService.acceptAnnotaion(teamID, name, folderID);
        for (let index = 0; index < doc.length; index++) {
          teamService.isValidated(
            teamID,
            name,
            folderID,
            doc[index].id,
            userEmail
          );
        }
        Swal.fire("Annotation Data Accepted Successfully!", "", "success").then(
          () => {
            window.location.reload(false);
          }
        );
      } else if (result.isDenied) {
        Swal.fire("Action is cancelled", "", "info");
      }
    });
  }

  function rejectAnnotation() {
    Swal.fire({
      title: "Are you sure to reject the submitted annotation?",
      showDenyButton: true,
      confirmButtonText: "Reject",
      denyButtonText: "Cancel",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        teamService.rejectAnnotation(teamID, name, folderID);
        Swal.fire("Annotation is rejected!", "", "success").then(() => {
          window.location.reload(false);
        });
      } else if (result.isDenied) {
        Swal.fire("Action is cancelled", "", "info");
      }
    });
  }

  return (
    <>
      <ToastContainer />
      {getImageFolderData()}
      {currentUserRole !== "contributor" && (
        <div>
          {imagesURL.length > 0 ? (
            <>
              {imagesURL.length > 0 && currentUserRole === "admin" && (
                <div>
                  <Button className="m-2" color="primary">
                    {imagesID.length} image selected
                  </Button>
                  <Button
                    className="m-2"
                    variant="contained"
                    color="secondary"
                    onClick={() => deleteSelectedImage()}
                  >
                    Delete
                  </Button>
                  <Button
                    className="m-2"
                    variant="outlined"
                    onClick={() => clearSelection()}
                  >
                    Clear
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              {currentUserRole === "annotator" && docs.length > 0 && (
                <>
                  <Button
                    className="m-2"
                    variant="contained"
                    onClick={() => annotateFolder()}
                  >
                    Annotate This Folder
                  </Button>
                  {isSubmitted === false && (
                    <Button
                      className="m-2"
                      variant="contained"
                      onClick={() => submitAnnotation()}
                    >
                      Submit Annotation
                    </Button>
                  )}
                </>
              )}

              {currentUserRole === "validator" && (
                <>
                  {docs.length > 0 && (
                    <>
                      <Button
                        className="m-2"
                        variant="contained"
                        onClick={() => annotateFolder()}
                      >
                        View Annotation
                      </Button>

                      {isAccepted === false && (
                        <>
                          {isSubmitted === true && (
                            <>
                              <Button
                                className="m-2"
                                variant="contained"
                                onClick={() => acceptAnnotaion(docs)}
                              >
                                Accept Annotation
                              </Button>
                              <Button
                                className="m-2"
                                variant="contained"
                                onClick={() => rejectAnnotation()}
                              >
                                Reject Annotation
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {currentUserRole === "admin" && (
                <Row>
                  <Col>
                    <Button
                      className="text-capitalize"
                      href="/UploadImage"
                      color="primary"
                      startIcon={<AddIcon />}
                    >
                      Add Image
                    </Button>
                  </Col>

                  <Col md="auto">
                    <Box sx={{ flexGrow: 1 }} />
                    {docs.length > 0 && (
                      <Button
                        className="text-capitalize"
                        startIcon={<EditIcon />}
                        onClick={() => annotateFolder()}
                      >
                        Annotate This Folder
                      </Button>
                    )}

                    <Button
                      color="secondary"
                      className="text-capitalize"
                      startIcon={<DeleteIcon />}
                      onClick={deleteFolder}
                    >
                      Delete Folder
                    </Button>
                  </Col>
                </Row>
              )}
            </>
          )}

          <div className="row mt-3">
            {docs.length > 0 ? (
              docs.map((doc) => (
                <div
                  style={cardLink}
                  className="col-lg-3 col-md-4 col-sm-12 mb-3"
                  onClick={() => addImage(doc)}
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
                  ></Card>
                </div>
                // <Link
                //   style={cardLink}
                //   className="col-lg-3 col-md-4 col-sm-12 mb-3"
                // >
                //   <div class="flip-box" onClick={() => addImage(doc)}>
                //     <div class="flip-box-inner">
                //       <div class="flip-box-front">
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
                //         ></Card>
                //       </div>
                //       <div class="flip-box-back p-3">
                //         <p>Description: {doc.description}</p>
                //         <p>Uploaded by: {doc.email}</p>
                //         <p>Validated by: {doc.validated}</p>
                //         {isAnnotated(doc) ? (
                //           <p className="text-center">Annotated</p>
                //         ) : (
                //           <p className="text-center">Not Annotated</p>
                //         )}
                //       </div>
                //     </div>
                //   </div>

                //   <p className="text-center">{doc.name}</p>
                // </Link>
              ))
            ) : (
              <p>No Image Uploaded Yet</p>
            )}
          </div>
        </div>
      )}

      {currentUserRole === "contributor" && (
        <>
          <Button
            className="text-capitalize"
            href="/UploadImage"
            color="primary"
            startIcon={<AddIcon />}
          >
            Add Image
          </Button>
          <div className="row">
            {docs.length > 0 ? (
              docs.map((doc) => (
                <Link
                  // to="/tool"
                  style={cardLink}
                  className="col-lg-3 col-md-4 col-sm-12 mb-3"
                >
                  <div class="flip-box" onClick={() => addImage(doc)}>
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
                        ></Card>
                      </div>
                      <div class="flip-box-back p-3">
                        <p>Description: {doc.description}</p>
                        <p>Uploaded by: {doc.email}</p>
                        {isAnnotated(doc) ? (
                          <p className="text-center">Annotated</p>
                        ) : (
                          <p className="text-center">Not Annotated</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-center">{doc.name}</p>
                </Link>
              ))
            ) : (
              <p>No Image Uploaded Yet</p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ImageGrid;
