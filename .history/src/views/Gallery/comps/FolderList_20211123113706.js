import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../../firebase";
import { Link, useHistory } from "react-router-dom";
import { Modal, Card, Tabs, Tab } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";
import projectMembersService from "../../../services/projectMembers.service";
import { Button, Nav, NavItem, NavLink } from "reactstrap";
import Swal from "sweetalert2";

const FolderList = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [teamName, setTeamName] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const teamID = localStorage.getItem("currentTeamID");
  const history = useHistory();
  const currentUserRole = localStorage.getItem("currentUserRole");

  const TeamCollection = projectFirestore.collection("TEAM").doc(teamID);

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

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriber = projectFirestore
      // .collection("FolderImages")
      // .collection('teams').doc('JviFAFCWPy0VPJFeCBPZ').collection('FolderImages').doc('HceEccV4vOIkrNX4CYeB')
      .doc(`TEAM/${teamID}`)
      .collection("FOLDERS")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // `id` given to us by Firebase
          });
        });
        setPosts(getPostsFromFirebase);
        setLoading(false);
      });

    // return cleanup function
    return () => subscriber();
  }, [loading]); // empty dependencies array => useEffect only called once

  if (loading) {
    return <h1>loading firebase data...</h1>;
  }

  function saveAs(ID) {
    localStorage.setItem("currentProjectID", ID);
  }

  function deleteTeam() {
    // teamService.deleteTeam(teamID);
    // projectMembersService.deleteTeam(teamID);
    // history.push("/myTeam");
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
          teamService.deleteTeam(teamID);
          projectMembersService.deleteTeam(teamID);
          history.push("/myTeam");
        }, 1000);
      }
    });
  }

  function getValue() {
    var docRef = projectFirestore.collection("TEAM").doc(teamID);

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
      TeamCollection.update({
        name: role,
      })
        .then(() => {
          toast.success("EDIT SUCCESS");
          setTimeout(function() {
            history.push("/myTeam");
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

  function showTeamMembers() {
    history.push("/myTeam/gallery/teamMembers");
  }

  return (
    <>
      <ToastContainer />

      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Home">
          tab 1
        </Tab>
        <Tab eventKey="settings" title="Settings">
          tab 2
        </Tab>
      </Tabs>

      <Nav className="justify-content-center">
        {currentUserRole === "admin" && (
          <NavItem>
            <NavLink href="/addfolder">
              <Button color="primary" round outline>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-folder-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="m.5 3 .04.87a1.99 1.99 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2zm5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19c-.24 0-.47.042-.683.12L1.5 2.98a1 1 0 0 1 1-.98h3.672z" />
                  <path d="M13.5 10a.5.5 0 0 1 .5.5V12h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V13h-1.5a.5.5 0 0 1 0-1H13v-1.5a.5.5 0 0 1 .5-.5z" />
                </svg>
              </Button>
            </NavLink>
          </NavItem>
        )}
        {currentUserRole === "admin" && (
          <NavItem>
            <NavLink>
              <Button
                color="primary"
                round
                outline
                onClick={() => {
                  setModalShow(true);
                  getValue();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-pen"
                  viewBox="0 0 16 16"
                >
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
                </svg>
              </Button>
            </NavLink>
          </NavItem>
        )}

        {currentUserRole === "admin" && (
          <NavItem>
            <NavLink>
              <Button color="primary" round outline onClick={showTeamMembers}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-table"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
                </svg>
              </Button>
            </NavLink>
          </NavItem>
        )}
        {currentUserRole === "admin" && (
          <NavItem>
            <NavLink>
              <Button color="primary" round outline onClick={deleteTeam}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                  <path
                    fill-rule="evenodd"
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                  />
                </svg>
              </Button>
            </NavLink>
          </NavItem>
        )}
        {currentUserRole === "admin" && (
          <NavItem>
            <NavLink>
              <Button color="primary" round outline onClick={showTeamMembers}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-table"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" />
                </svg>
              </Button>
            </NavLink>
          </NavItem>
        )}
      </Nav>

      {/* {currentUserRole === "admin" && (
        <button onClick={deleteTeam}>delete</button>
      )}
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
      {currentUserRole === "admin" && (
        <Button color="primary" onClick={showTeamMembers}>
          Team Members
        </Button>
      )} */}

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        daata={updata}
      />

      <br></br>
      <br></br>

      <div className="row">
        {/* {currentUserRole === "admin" && (
          <Link
            to={`/Addfolder`}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-3"
          >
            <Card border="dark" style={createTeam} className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Card.Title>Create Project</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        )} */}

        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              to={`/myTeam/gallery/folder`}
              onClick={() => saveAs(post.key)}
              key={post.key}
              style={cardLink}
              className="col-lg-3 col-md-4 col-sm-12 mb-3"
            >
              <Card border="dark" className="h-100">
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title>{post.name}</Card.Title>
                </Card.Body>
              </Card>
            </Link>
          ))
        ) : (
          <h6>No Project yet</h6>
        )}
      </div>
    </>
  );
};

export default FolderList;
