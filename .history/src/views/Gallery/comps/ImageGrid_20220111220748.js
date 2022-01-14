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
// import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import SettingsIcon from "@material-ui/icons/Settings";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

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
import PersonIcon from "@material-ui/icons/Person";
import EjectIcon from "@material-ui/icons/Eject";

import { Card, Row, Col, Container } from "react-bootstrap";
import projectMembersService from "../../../services/projectMembers.service";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
    maxWidth: "100%",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const styles = {
  media: {
    height: 0,
    paddingTop: "200px",
    backgroundPosition: "right",
  },
  card: {
    position: "relative",
    marginBottom: "30px",
  },
  overlay: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    color: "white",
  },
  buttons: {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "white",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "500",
    lineHeight: "2.75rem",
  },
  text: {
    fontSize: "1rem",
  },
};

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
  const currentUserName = localStorage.getItem("currentUserName");
  const [isRejected, setIsRejected] = useState(false);
  let data = [];
  let annotationData;
  const [imageFolderData, setImageFolderData] = useState({});
  const [imageFolderName, setImageFolderName] = useState("");
  const [totalImages, setTotalImages] = useState(0);
  let annotatedCounter = 0;
  let disableSubmitAnnotation = true;
  const [totalAnnotated, setTotalAnnotated] = useState(0);

  const [isSubmitted, setisSubmitted] = useState();
  const [isAccepted, setisAccepted] = useState();

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [imageInfo, setImageInfo] = useState();
  const [AnnotatorEmail, setAnnotatorEmail] = useState([]);

  const [bgcolor, setBgColor] = useState("");
  const [status, setStatus] = useState("");

  const chip = {
    backgroundColor: `${bgcolor}`,
    paddingBottom: "0px !important",
    fontSize: "14px",
    color: "white",
  };

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
    const getPostsFromFirebase = [];
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
          //gets the data of the image folder
          setisSubmitted(doc.data().isSubmitted);
          setisAccepted(doc.data().isAccepted);

          if (doc.data().isRejected) {
            setStatus("Rejected");
            setBgColor("#c92d39");
          } else if (doc.data().isSubmitted) {
            setStatus("Pending");
            setBgColor("#fcc438");
          } else if (doc.data().isAccepted || doc.data().isCompleted) {
            setStatus("Completed");
            setBgColor("#82bb53");
          }

          setImageFolderData(doc.data());
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

    projectFirestore
      .collection("TEAMMEMBERS")
      .where("projectID", "==", teamID)
      .where("role", "==", "annotator")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // id given to us by Firebase
          });
        });
        setAnnotatorEmail(getPostsFromFirebase);
      });
    getAnnotationData();
  }, [imageInfo]);

  const getImageFolderData = () => {
    teamService.getImageFolderData(teamID, name, folderID).then((data) => {
      setIsRejected(data.data().isRejected);
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
        if (data.length > 0) {
          let parseData = JSON.parse(data[0].data);
          setAnnotatedImagesArray([parseData.images]);
        }
      });
  }

  function evaluateFolder() {
    Swal.fire({
      title: "Are you sure to evaluate annotation?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        // teamService.evaluateAnnotation(teamID, name, folderID);
        teamService.evaluateAnnotation(teamID, name, folderID);
        Swal.fire("Success!", "", "success").then(() => {
          window.location.reload(false);
        });
      } else if (result.isDenied) {
        Swal.fire("Action is cancelled", "", "info");
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

      // Checks if the images is annotated and only loads what is not annotated
      // if (isRejected && currentUserRole === "annotator") {
      //   if (!isAnnotated(doc)) {
      //     console.log(doc);
      //     arr.push(doc);
      //   }
      // } else {arr.push(doc);}
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
    if (annotatedImagesArray) {
      for (let i = 0; i < annotatedImagesArray.length; i++) {
        for (let index = 0; index < annotatedImagesArray[i].length; index++) {
          const SliceImageName = annotatedImagesArray[i][index].file_name
            .split(".")
            .filter((item) => item);
          if (doc.name == SliceImageName[0]) {
            annotatedCounter = annotatedCounter + 1;
            return true;
          } else {
            disableSubmitAnnotation = true;
            continue;
          }
        }
      }
      console.log(annotatedCounter);
      console.log(disableSubmitAnnotation);
    } else console.log("no records");
  }

  async function acceptReject(doc) {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });

    if (text) {
      Swal.fire(text);
    }
  }

  function deleteFolder() {
    Swal.fire({
      title: "Are you sure to delete this folder?",
      timer: 5000,
      showDenyButton: true,
      confirmButtonText: "yes",
      denyButtonText: "no",
    }).then((result) => {
      if (result.isConfirmed) {
        teamService.deleteFolder(teamID, name, folderID);
        Swal.fire("Annotation Successfully Submitted!", "", "success").then(
          () => {
            history.push("/myTeam/gallery/folder");
          }
        );
      } else if (result.isDenied) {
        Swal.fire("Submission Cancelled", "", "info");
      }
    });
  }

  function submitAnnotation() {
    Swal.fire({
      title: "Are you sure to submit annotation?",
      timer: 5000,
      showDenyButton: true,
      confirmButtonText: "yes",
      denyButtonText: "no",
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
      confirmButtonText: "yes",
      denyButtonText: "no",
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
            currentUserName
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
      confirmButtonText: "yes",
      denyButtonText: "no",
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

  async function assignAnnotator() {
    var options = {};
    AnnotatorEmail.map((post) => (options[post.email] = post.email));

    const { value: role } = await Swal.fire({
      title: "Assign Annotator",
      input: "select",
      inputOptions: options,
      inputPlaceholder: "Select Annotator",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value) {
            console.log("if");
            console.log(value);
            resolve();
          } else {
            console.log("else");
            resolve("You need to select role");
          }
          // resolve();
        });
      },
    });

    if (role) {
      projectFirestore
        .collection("TEAM")
        .doc(teamID)
        .collection("FOLDERS")
        .doc(name)
        .collection("IMAGESFOLDER")
        .doc(folderID)
        .update({
          AssignAnnotator: role,
        })
        .then(() => {
          Swal.fire(`This Folder is now assigned to ${role}`).then(() => {
            window.location.reload(false);
          });
        })
        .catch(() => {});
    }
  }

  const handlePopoverOpen = (event, doc) => {
    setImageInfo(doc);
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

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

      <Card style={styles.card}>
        <CardMedia
          // image={"https://gstatic.com/classroom/themes/Psychology.jpg"}
          image={"/images/imagecard.png"}
          style={styles.media}
        />
        <div style={styles.overlay}>
          <Typography style={styles.title}>{imageFolderData.name}</Typography>
          <Typography style={styles.text}>
            Images: {imageFolderData.totalImages - 1}
          </Typography>
          <Typography style={styles.text}>
            Annotated: {annotatedCounter}
          </Typography>
        </div>
        <div style={styles.buttons}>
          <>
            <Chip style={chip} label={status} />
          </>
        </div>
      </Card>

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
                        Annotate Folder
                      </Button>
                      {isSubmitted === false &&
                        disableSubmitAnnotation === false && (
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
                      <>
                        <Button
                          className="text-capitalize"
                          startIcon={<PersonIcon />}
                          onClick={() => assignAnnotator()}
                        >
                          Assign Annotator
                        </Button>

                        <Button
                          className="text-capitalize"
                          startIcon={<EditIcon />}
                          onClick={() => annotateFolder()}
                        >
                          Annotate Folder
                        </Button>
                      </>
                    )}

                    {isAccepted == true && (
                      <Button
                        className="text-capitalize"
                        startIcon={<EjectIcon />}
                        onClick={() => evaluateFolder()}
                      >
                        Re-evaluate Folder
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
              <>
                {isRejected && currentUserRole === "annotator"
                  ? docs.map(
                      (doc) =>
                        !isAnnotated(doc) && (
                          <>
                            <div
                              style={cardLink}
                              className="col-lg-3 col-md-4 col-sm-6 mb-3"
                              onClick={() => addImage(doc)}
                            >
                              <Card
                                key={doc.id}
                                border={`${
                                  isAnnotated(doc) ? "success" : "danger"
                                }`}
                                className="h-100"
                                style={{
                                  backgroundImage: `url(${doc.url})`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundPosition: "center",
                                  backgroundSize: "cover",
                                  borderStyle: "solid",
                                  borderWidth: "3px",
                                  // border: isActive(doc) ? "4px solid" : "",
                                }}
                              >
                                <InfoOutlinedIcon
                                  style={{
                                    color: "white",
                                    border: "1px black",
                                  }}
                                  aria-owns={
                                    open ? "mouse-over-popover" : undefined
                                  }
                                  aria-haspopup="true"
                                  onMouseEnter={(event) =>
                                    handlePopoverOpen(event, doc)
                                  }
                                  onMouseLeave={handlePopoverClose}
                                  className="m-3"
                                />

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
                                  {imageInfo && (
                                    <>
                                      <p>Name: {imageInfo.name}</p>
                                      <p>
                                        Description: {imageInfo.description}
                                      </p>
                                      <p>Uploaded by: {imageInfo.uploader}</p>
                                      <p>Validated by: {imageInfo.validated}</p>
                                    </>
                                  )}
                                </Popover>
                              </Card>
                            </div>
                          </>
                        )
                    )
                  : docs.map((doc) => (
                      <>
                        <div
                          style={cardLink}
                          className="col-lg-3 col-md-4 col-sm-6 mb-3"
                          // onClick={() => addImage(doc)}
                          onClick={() => acceptReject(doc)}
                        >
                          <Card
                            key={doc.id}
                            border={`${
                              isAnnotated(doc) ? "success" : "danger"
                            }`}
                            className="h-100"
                            style={{
                              backgroundImage: `url(${doc.url})`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              borderStyle: "solid",
                              borderWidth: "3px",
                              border: isActive(doc) ? "4px solid" : "",
                            }}
                          >
                            <InfoOutlinedIcon
                              style={{ color: "white", border: "1px black" }}
                              aria-owns={
                                open ? "mouse-over-popover" : undefined
                              }
                              aria-haspopup="true"
                              onMouseEnter={(event) =>
                                handlePopoverOpen(event, doc)
                              }
                              onMouseLeave={handlePopoverClose}
                              className="m-3"
                            />

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
                              {imageInfo && (
                                <>
                                  <p>Name: {imageInfo.name}</p>
                                  <p>Description: {imageInfo.description}</p>
                                  <p>Uploaded by: {imageInfo.uploader}</p>
                                  <p>Validated by: {imageInfo.validated}</p>
                                </>
                              )}
                            </Popover>
                          </Card>
                        </div>
                      </>
                    ))}
              </>
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
                    className="col-lg-3 col-md-4 col-sm-6 mb-3"
                    onClick={() => addImage(doc)}
                  >
                    <Card
                      key={doc.id}
                      border={`${isAnnotated(doc) ? "success" : "danger"}`}
                      className="h-100"
                      style={{
                        backgroundImage: `url(${doc.url})`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        borderStyle: "solid",
                        borderWidth: "3px",
                        // border: isActive(doc) ? "4px solid" : "",
                      }}
                    >
                      <InfoOutlinedIcon
                        style={{ color: "white", border: "1px black" }}
                        aria-owns={open ? "mouse-over-popover" : undefined}
                        aria-haspopup="true"
                        onMouseEnter={(event) => handlePopoverOpen(event, doc)}
                        onMouseLeave={handlePopoverClose}
                        className="m-3"
                      />

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
                        {imageInfo && (
                          <>
                            <p>Name: {imageInfo.name}</p>
                            <p>Description: {imageInfo.description}</p>
                            <p>Uploaded by: {imageInfo.uploader}</p>
                            <p>Validated by: {imageInfo.validated}</p>
                          </>
                        )}
                      </Popover>
                    </Card>
                  </div>
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
