import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ImageGrid from "./ImageGrid";
import Title from "./Title";
import UploadForm from "./UploadForm";
import useStorage from "../hooks/useStorage";
import { Card, Container, Modal, Button } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import TopNav from "../../Navigation/TopNav";
import { projectFirestore } from "../../../firebase";
import projectMembersService from "../../../services/projectMembers.service";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";

export default function TestTeam(post) {
  // const { name } = useParams()
  // const {teamID} = useParams()
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const currentUserRole = localStorage.getItem("currentUserRole");
  const uid = localStorage.getItem("currentUserUID");
  const history = useHistory();
  const [modalShow, setModalShow] = React.useState(false);
  const currentUserRole = localStorage.getItem("currentUserRole");

  projectMembersService.getRole(uid, teamID);

  const createTeam = {
    backgroundColor: "#FFD803",
  };

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };

  const [updata, setUpdata] = useState({
    data: {
      role: "",
      status: "",
    },
    uid: "",
  });

  function deleteProject() {
    teamService.deleteProject(teamID, name);
    history.push("/gallery");
    // console.log(teamID)
    // console.log(name)
  }

  function getValue() {
    var docRef = projectFirestore
      .collection("PROJECT")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setUpdata(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  function MyVerticallyCenteredModal(props) {
    const { daata } = props;
    console.log(props);
    const [value, setValue] = useState({
      uid: daata.uid,
      role: daata.name,
      // teamID: daata.TeamCode,
      status: daata.Status,
      key: daata.key,
    });

    const { uid, role, status, key } = value;

    const handleChange = (uid) => (e) => {
      e.preventDefault();
      setValue({ ...value, [uid]: e.target.value });
    };

    // console.log(teamID)

    const update = () => {
      projectFirestore
        .collection("PROJECT")
        .doc(teamID)
        .collection("FOLDERS")
        .doc(name)
        .update({
          name: role,
        })
        .then(() => {
          toast.success("EDIT SUCCESS");
          setTimeout(function() {
            history.push("/gallery");
          }, 5000);
        })
        .catch(() => {
          toast.error("Something went wrong!");
        });
    };

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <TextField
            id="teamID"
            value={teamID}
            onChange={handleChange("teamID")}
            margin="normal"
            // placeholder="Email Adress"
            type="text"
            fullWidth
            disabled
          /> */}

          <TextField
            id="Role"
            value={role}
            onChange={handleChange("role")}
            margin="normal"
            // placeholder="Email Adress"
            type="text"
            fullWidth
          />

          <Button
            onClick={update}
            // variant="contained"
            color="secondary"
            size="large"
          >
            Edit
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    //     <div>
    // <Title/>
    //     {/* <input
    //         type="file"
    //         multiple
    //     /> */}
    // <UploadForm/>
    //   <ImageGrid setSelectedImg={setSelectedImg} />
    //         {/* <h2>Team { name }</h2>
    //         <h1>HELLO PO YAWAA TESt</h1> */}
    //     </div>

    <>
      <TopNav />
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <br></br>
      <br></br>
      <br></br>
      <br></br>

      <Container>
        <ToastContainer />
        {currentUserRole === "admin" && (
          <button onClick={deleteProject}>delete</button>
        )}{" "}
        {currentUserRole === "admin" && (
          <button
            onClick={() => {
              setModalShow(true);
              getValue();
            }}
          >
            edit
          </button>
        )}
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          daata={updata}
        />
        <div className="row d-flex align-items-center justify-content-center">
          <Link
            to={`/imagesfolder`}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-3"
          >
            <Card border="dark" style={createTeam} className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Card.Title>Images</Card.Title>
              </Card.Body>
            </Card>
          </Link>

          <Link
            to={`/teamMembers`}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-3"
          >
            <Card border="dark" style={createTeam} className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Card.Title>Team Members</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        </div>
      </Container>
    </>
  );
}
