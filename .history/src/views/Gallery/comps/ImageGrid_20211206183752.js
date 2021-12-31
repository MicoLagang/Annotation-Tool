import React, { useState, useEffect } from "react";
import useFirestore from "../hooks/useFirestore";
import { Link, useParams, useHistory } from "react-router-dom";
import { useImage } from "../../../logic/context/imageContext";
import { projectFirestore } from "../../../firebase";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2/dist/sweetalert2.js";

import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import PageviewIcon from "@material-ui/icons/Pageview";
import CheckIcon from "@material-ui/icons/Check";
import FilterIcon from "@material-ui/icons/Filter";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

import { Card, Row, Col, Container } from "react-bootstrap";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
    maxWidth: "100%",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

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

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "200px",
  };

  const addButton = {
    color: "#000000",
    textDecoration: "none",
    height: "50px",
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

  const handlePopoverOpen = (event) => {
    console.log("open");
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    console.log("close");
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  function popOverContainer(doc) {
    console.log(doc);
  }

  return (
    <>
      <ToastContainer />

      <div>
        <Button
          className="text-capitalize"
          href="/myTeam/gallery/folder"
          color="primary"
          startIcon={<ArrowBackIcon />}
        >
          Back to folders
        </Button>
      </div>

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
                  <Row>
                    <Col></Col>

                    <Col md="auto">
                      <Button
                        className="text-capitalize"
                        startIcon={<EditIcon />}
                        onClick={() => annotateFolder()}
                      >
                        Annotate This Folder
                      </Button>
                      {isSubmitted === false && (
                        <Button
                          className="m-2"
                          startIcon={<ArrowUpwardIcon />}
                          onClick={() => submitAnnotation()}
                        >
                          Submit Annotation
                        </Button>
                      )}
                    </Col>
                  </Row>
                </>
              )}

              {currentUserRole === "validator" && (
                <>
                  {docs.length > 0 && (
                    <>
                      <Row>
                        <Col>
                          <Button
                            className="m-2"
                            startIcon={<PageviewIcon />}
                            onClick={() => annotateFolder()}
                          >
                            View Annotation
                          </Button>
                        </Col>

                        <Col md="auto">
                          {isAccepted === false && (
                            <>
                              {isSubmitted === true && (
                                <>
                                  <Button
                                    className="m-2"
                                    startIcon={<CheckIcon />}
                                    onClick={() => acceptAnnotaion(docs)}
                                  >
                                    Accept Annotation
                                  </Button>
                                  <Button
                                    className="m-2"
                                    color="secondary"
                                    startIcon={<FilterIcon />}
                                    onClick={() => rejectAnnotation()}
                                  >
                                    Validate Annotation
                                  </Button>
                                </>
                              )}
                            </>
                          )}
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}

              {currentUserRole === "admin" && (
                <Row>
                  <Col>
                    {docs.length > 0 && (
                      <Button
                        className="text-capitalize"
                        href="/UploadImage"
                        color="primary"
                        startIcon={<AddIcon />}
                      >
                        Add Image
                      </Button>
                    )}
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

          <Divider variant="middle" />

          <div className="row mt-3">
            {docs.length > 0 ? (
              docs.map((doc) => (
                <>
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
                    >
                      <Card.Footer>
                        <InfoOutlinedIcon
                          aria-owns={open ? "mouse-over-popover" : undefined}
                          aria-haspopup="true"
                          onMouseEnter={handlePopoverOpen}
                          onMouseLeave={handlePopoverClose}
                          className="mx-3"
                        />
                      </Card.Footer>
                    </Card>
                  </div>
                  {popOverContainer(doc)}
                </>
              ))
            ) : (
              <Container className="d-flex justify-content-center mb-5">
                <div className="w-100" style={{ maxWidth: "400px" }}>
                  <img
                    className="w-100"
                    src="/images/no-image.png"
                    alt="image"
                  />
                  <h4 className="text-center">No image uploaded yet</h4>

                  {currentUserRole === "admin" && (
                    <Button
                      className="w-100 text-capitalize"
                      style={addButton}
                      href="/UploadImage"
                      color="primary"
                    >
                      Upload image now
                    </Button>
                  )}
                </div>
              </Container>
            )}
          </div>
        </div>
      )}

      {currentUserRole === "contributor" && (
        <>
          {docs.length > 0 && (
            <Button
              className="text-capitalize"
              href="/UploadImage"
              color="primary"
              startIcon={<AddIcon />}
            >
              Add Image
            </Button>
          )}

          <Divider variant="middle" />

          <div className="row mt-3">
            {docs.length > 0 ? (
              docs.map((doc) => (
                <>
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
                    >
                      <Card.Footer>
                        <InfoOutlinedIcon
                          aria-owns={open ? "mouse-over-popover" : undefined}
                          aria-haspopup="true"
                          onMouseEnter={handlePopoverOpen}
                          onMouseLeave={handlePopoverClose}
                          className="mx-3"
                        />
                      </Card.Footer>
                    </Card>
                  </div>
                  <Popover
                    id="mouse-over-popover"
                    className={classes.popover}
                    classes={{
                      paper: classes.paper,
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                  >
                    <p>Name: {doc.name}</p>
                    <p>Description: {doc.description}</p>
                    <p>Uploaded by: {doc.email}</p>
                    <p>Validated by: {doc.validated}</p>
                    {isAnnotated(doc) ? (
                      <p className="text-center">Annotated</p>
                    ) : (
                      <p className="text-center">Not Annotated</p>
                    )}
                  </Popover>
                </>
              ))
            ) : (
              <Container className="d-flex justify-content-center mb-5">
                <div className="w-100" style={{ maxWidth: "400px" }}>
                  <img
                    className="w-100"
                    src="/images/no-image.png"
                    alt="image"
                  />
                  <h4 className="text-center">No image uploaded yet</h4>
                  {currentUserRole === "contributor" && (
                    <Button
                      className="w-100 text-capitalize"
                      style={addButton}
                      href="/UploadImage"
                      color="primary"
                    >
                      Upload image now
                    </Button>
                  )}
                </div>
              </Container>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default ImageGrid;