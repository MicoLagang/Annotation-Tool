import React, { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../../../firebase";
import { Link, useHistory } from "react-router-dom";
import { Container } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import { ToastContainer } from "react-toastify";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TopNav from "../../Navigation/TopNav";
import { CircularProgress } from "@material-ui/core";
import FileCopyIcon from '@material-ui/icons/FileCopy';

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
  const addButton = {
    color: "#000000",
    textDecoration: "none",
    height: "50px",
  };

  const styles = {
    media: {
      height: 0,
      paddingTop: "200px",
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
    title: {
      fontSize: "2rem",
      fontWeight: "500",
      lineHeight: "2.75rem",
    },
    text: {
      fontSize: "1rem",
    },
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
            key: doc.id, // id given to us by Firebase
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
    return <div style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
                <CircularProgress/>
            </div>
  }

  function saveAs(ID) {
    localStorage.setItem("currentProjectID", ID);
  }

  

  // const card = () => {
  //   return (
  //     <Card style={styles.card}>
  //       <CardMedia
  //         image={"https://gstatic.com/classroom/themes/Psychology.jpg"}
  //         style={styles.media}
  //       />
  //       <div style={styles.overlay}>
  //         <Typography style={styles.title}>{updata.name}</Typography>
  //         <Typography style={styles.text}>{updata.TeamCode} <Button onClick={() =>  {
  //           navigator.clipboard.writeText(updata.TeamCode)
  //           console.log('Team Code')
  //         }}>  <FileCopyIcon/> </Button> </Typography>
  //       </div>
  //     </Card>
  //   );
  // };

  function getValue() {
    var docRef = projectFirestore.collection("TEAM").doc(teamID);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
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

  console.log(value);
  return (
    <>
      <ToastContainer />
      <TopNav />

      <Container>
      <Card style={styles.card}>
        <CardMedia
          image={"https://gstatic.com/classroom/themes/Psychology.jpg"}
          style={styles.media}
        />
        <div style={styles.overlay}>
          <Typography style={styles.title}>{updata.name}</Typography>
          <Typography style={styles.text}>{updata.TeamCode} <Button onClick={() =>  {
            navigator.clipboard.writeText(updata.TeamCode)
            console.log('Team Code')
          }}>  <FileCopyIcon/> </Button> </Typography>
        </div>
      </Card>

        {currentUserRole === "admin" && posts.length > 0 && (
          <Link
            to={`/Addfolder`}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-3"
          >
            <Button>
              <AddIcon /> <b>Create Project</b>
            </Button>
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
            <>
              <Container className="d-flex justify-content-center mb-5">
                <div className="w-100" style={{ maxWidth: "400px" }}>
                  <img className="w-100" src="/images/empty.png" alt="image" />
                  <h4 className="text-center">No project yet</h4>
                  {currentUserRole === "admin" && (
                    <Button
                      className="w-100 text-capitalize"
                      style={addButton}
                      href="/Addfolder"
                      color="primary"
                    >
                      Create one now
                    </Button>
                  )}
                </div>
              </Container>
            </>
          )}
        </div>
      </Container>
    </>
  );
}

export default FolderList;
