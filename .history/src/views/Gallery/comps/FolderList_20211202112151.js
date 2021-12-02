import React, { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../../../firebase";
import { Link, useHistory } from "react-router-dom";
import { Modal, Tabs, Tab, Form } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
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
  function archiveTeam() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Archive it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Archived!",
          "Your team has been move to Archive .",
          "success"
        );
        teamService.ArchiveTeam(teamID);
        projectMembersService.ArchiveTeam(teamID);
        history.push("/");
      }
    });
  }

  console.log(value);
  return (
    <>
      <ToastContainer />

      {currentUserRole === "admin" && (
        <Link
          to={`/Addfolder`}
          style={cardLink}
          className="col-lg-3 col-md-4 col-sm-12 mb-3"
        >
          <Button className="font-weight-bold"><AddIcon/> Create Project</Button>
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
      

      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        daata={updata}
      />
    </>
  );
}

export default FolderList;
