import React, { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../../../firebase";
import { Link, useHistory } from "react-router-dom";
import { Modal, Tabs, Tab, Form } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";
import projectMembersService from "../../../services/projectMembers.service";
import Swal from "sweetalert2";
import TeamMembers from "../../Team/TeamMembers";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import teamMemberServices from "../../../services/team.member.services";

function FolderList() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [teamName, setTeamName] = useState();
  const [modalShow, setModalShow] = React.useState(false);
  const teamID = localStorage.getItem("currentTeamID");
  const history = useHistory();
  const currentUserRole = localStorage.getItem("currentUserRole");
  const teamNameref = useRef();
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

  const [value, setValue] = useState();

  useEffect(() => {
    getValue();
    const getPostsFromFirebase = [];
    const subscriber = projectFirestore
      // .collection("FolderImages")
      // .collection('teams').doc('JviFAFCWPy0VPJFeCBPZ').collection('FolderImages').doc('HceEccV4vOIkrNX4CYeB')
      .doc(`TEAM/${teamID}`)
      .collection("FOLDERS")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(),
            key: doc.id, // `id` given to us by Firebase
          });
        });
        setPosts(getPostsFromFirebase);
        setLoading(false);
        console.log(posts);
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
          teamMemberServices.deleteproject(teamID);
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
          setValue(doc.data().name);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  const update = () => {
    try {
      teamService.editTeam(teamNameref.current.value, teamID);
      projectMembersService.editTeamMembers(teamNameref.current.value, teamID);
    } catch (e) {
      toast.error("Something went wrong!");
    } finally {
      toast.success("EDIT SUCCESS");
      setTimeout(function() {
        history.push("/myTeam");
      }, 5000);
    }
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

    console.log(value);
    console.log(handleChange);

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

  console.log(value);
  return (
    <>
      <ToastContainer />

      <Tabs
        defaultActiveKey="projects"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="projects" title="Projects">
          {currentUserRole === "admin" && (
            <Link
              to={`/Addfolder`}
              style={cardLink}
              className="col-lg-3 col-md-4 col-sm-12 mb-3"
            >
              {/* <Card border="dark" style={createTeam} className="h-100">
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title>Create Project</Card.Title>
                </Card.Body>
              </Card> */}
              <Button variant="contained">Create Project</Button>
            </Link>
          )}
          <div className="row mt-3">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link
                  to={`/myTeam/gallery/folder`}
                  onClick={() => saveAs(post.key)}
                  key={post.key}
                  style={cardLink}
                  className="col-lg-3 col-md-4 col-sm-12 mb-3"
                >
                  {/* <Card  className="h-100">
                    <Card.Body className="d-flex align-items-center justify-content-center">
                      <Card.Title>{post.name}</Card.Title>
                    </Card.Body>
                  </Card> */}
                  <Card className="d-flex align-items-center justify-content-center h-100">
                    <CardContent>
                      <Typography variant="h5" component="h2">
                        {post.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <h6>No Project yet</h6>
            )}
          </div>
        </Tab>
        <Tab eventKey="teamMembers" title="Team Members">
          <TeamMembers></TeamMembers>
        </Tab>

        <Tab eventKey="settings" title="Settings">
          {/* <Nav className="justify-content-center"> */}

          {currentUserRole === "admin" && (
            // <NavItem>
            //   <NavLink>
            //     <Button
            //       color="primary"
            //       round
            //       outline
            //       onClick={() => {
            //         setModalShow(true);
            //         getValue();
            //       }}
            //     >
            //       <svg
            //         xmlns="http://www.w3.org/2000/svg"
            //         width="16"
            //         height="16"
            //         fill="currentColor"
            //         class="bi bi-pen"
            //         viewBox="0 0 16 16"
            //       >
            //         <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
            //       </svg>
            //     </Button>
            //   </NavLink>
            // </NavItem>
            <>
              <Card style={{ width: "19rem" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    EDIT TEAM NAME
                  </Typography>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Control
                      type="text"
                      defaultValue={value}
                      ref={teamNameref}
                    />
                    <Form.Text className="text-muted">
                      Edit your team name
                    </Form.Text>
                  </Form.Group>
                  <Button variant="contained" onClick={update}>
                    UPDATE
                  </Button>
                </CardContent>
              </Card>
              <br></br>
              <Card style={{ width: "19rem" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    DELETE THIS TEAM
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Once you delete a team, there is no going back. Please be
                    certain.
                  </Typography>
                  <Button variant="contained" onClick={deleteTeam}>
                    DELETE
                  </Button>
                </CardContent>
              </Card>
              <br></br>
              <Card style={{ width: "19rem" }}>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    ARCHIVE THIS TEAM
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mark this team as archived
                  </Typography>
                  <Button variant="contained" onClick={deleteTeam}>
                    ARCHIVE
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* {currentUserRole === "admin" && (
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
            )} */}

          {/* </Nav> */}
        </Tab>
      </Tabs>

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
    </>
  );
}

export default FolderList;
