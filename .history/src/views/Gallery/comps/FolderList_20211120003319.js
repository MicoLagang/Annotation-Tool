import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../../firebase";
import { Link, useHistory } from "react-router-dom";
import { Modal, Card } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";
import projectMembersService from "../../../services/projectMembers.service";
import { Button, Nav, NavItem, NavLink } from "reactstrap";

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
    teamService.deleteTeam(teamID);
    projectMembersService.deleteTeam(teamID);
    // await toast.success("Team Deleted");
    history.push("/myTeam");
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
      <br></br>
      <i class="bi bi-bag-x-fill">a</i>
      <i class="bi bi-123">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-123"
          viewBox="0 0 16 16"
        >
          <path d="M2.873 11.297V4.142H1.699L0 5.379v1.137l1.64-1.18h.06v5.961h1.174Zm3.213-5.09v-.063c0-.618.44-1.169 1.196-1.169.676 0 1.174.44 1.174 1.106 0 .624-.42 1.101-.807 1.526L4.99 10.553v.744h4.78v-.99H6.643v-.069L8.41 8.252c.65-.724 1.237-1.332 1.237-2.27C9.646 4.849 8.723 4 7.308 4c-1.573 0-2.36 1.064-2.36 2.15v.057h1.138Zm6.559 1.883h.786c.823 0 1.374.481 1.379 1.179.01.707-.55 1.216-1.421 1.21-.77-.005-1.326-.419-1.379-.953h-1.095c.042 1.053.938 1.918 2.464 1.918 1.478 0 2.642-.839 2.62-2.144-.02-1.143-.922-1.651-1.551-1.714v-.063c.535-.09 1.347-.66 1.326-1.678-.026-1.053-.933-1.855-2.359-1.845-1.5.005-2.317.88-2.348 1.898h1.116c.032-.498.498-.944 1.206-.944.703 0 1.206.435 1.206 1.07.005.64-.504 1.106-1.2 1.106h-.75v.96Z" />
        </svg>
      </i>
      <Nav className="justify-content-center">
        {currentUserRole === "admin" && (
          <NavItem>
            <NavLink>
              <Button color="primary" round outline onClick={deleteTeam}>
                Delete
              </Button>
            </NavLink>
          </NavItem>
        )}
        <NavItem>
          <NavLink href="#">Link</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">Another Link</NavLink>
        </NavItem>
        <NavItem>
          <NavLink disabled href="#">
            Disabled Link
          </NavLink>
        </NavItem>
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
        {currentUserRole === "admin" && (
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
        )}

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
