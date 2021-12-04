import React, { useEffect, useState, useRef } from "react";
import { Container, Modal, Tabs, Tab, Form } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import TopNav from "../../Navigation/TopNav";
import { projectFirestore } from "../../../firebase";
import projectMembersService from "../../../services/projectMembers.service";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";
import ImagesFolder from "../comps/ImagesFolder";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
import Swal from "sweetalert2";

export default function TestTeam(post) {
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const currentUserRole = localStorage.getItem("currentUserRole");
  const uid = localStorage.getItem("currentUserUID");
  const history = useHistory();
  const [modalShow, setModalShow] = React.useState(false);
  const [value, setValue] = useState();
  const projectNameref = useRef();

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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        setTimeout(function() {
          teamService.deleteProject(teamID, name);
          history.push("/myTeam/gallery");
        }, 2000);
      }
    });
  }

  useEffect(() => {
    getValue();
  }, [loading]); // empty dependencies array => useEffect only called once

  function getValue() {
    var docRef = projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setUpdata(doc.data());
          setValue(doc.data().name);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  const update = () => {
    projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .update({
        name: projectNameref.current.value,
      })
      .then(() => {
        toast.success("EDIT SUCCESS");
        setTimeout(function() {
          history.push("/myTeam/gallery");
        }, 5000);
      })
      .catch(() => {
        toast.error("Something went wrong!");
      });
  };

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
        .collection("TEAM")
        .doc(teamID)
        .collection("FOLDERS")
        .doc(name)
        .update({
          name: role,
        })
        .then(() => {
          toast.success("EDIT SUCCESS");
          setTimeout(function() {
            history.push("/myTeam/gallery");
          }, 2000);
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
    <>
      <TopNav />

      <Container>
        <ToastContainer />
        <Tabs
          defaultActiveKey="images"
          transition={false}
          id="noanim-tab-example"
          className="mb-3"
        >
          <Tab eventKey="images" title="Images">
            <ImagesFolder></ImagesFolder>

            <MyVerticallyCenteredModal
              show={modalShow}
              onHide={() => setModalShow(false)}
              daata={updata}
            />
          </Tab>
          <Tab eventKey="settings" title="Settings">
            {currentUserRole === "admin" && (
              <Card style={{ width: "19rem" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    EDIT PROJECT NAME
                  </Typography>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      defaultValue={value}
                      ref={projectNameref}
                    />
                    <Form.Text className="text-muted">
                      Edit your project name
                    </Form.Text>
                  </Form.Group>
                  <Button variant="contained" onClick={update}>
                    UPDATE
                  </Button>
                </CardContent>
              </Card>
            )}
            <br></br>
            {currentUserRole === "admin" && (
              <Card style={{ width: "19rem" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    DELETE THIS PROJECT
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Once you delete a project, there is no going back. Please be
                    certain.
                  </Typography>
                  <Button variant="contained" onClick={deleteProject}>
                    DELETE
                  </Button>
                </CardContent>
              </Card>
            )}
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}
