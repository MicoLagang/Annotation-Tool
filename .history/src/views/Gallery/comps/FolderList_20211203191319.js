import React, { useEffect, useRef, useState } from "react";
import { projectFirestore } from "../../../firebase";
import { Link, useHistory } from "react-router-dom";
import { Container } from 'react-bootstrap'
import AddIcon from '@material-ui/icons/Add';
import { ToastContainer } from "react-toastify";
import Button from "@material-ui/core/Button";
// import Card from "@material-ui/core/Card";
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TopNav from "../../Navigation/TopNav";


import { Card } from "react-bootstrap";

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

  const styles = {
   media: {
      height: 0,
      paddingTop: '56.25%' // 16:9
   },
   card: {
      position: 'relative',
   },
   overlay: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      color: 'black',
      backgroundColor: 'white'
   }
}

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
    return <h1>loading firebase data...</h1>;
  }

  function saveAs(ID) {
    localStorage.setItem("currentProjectID", ID);
  }

  const card = () => {
    return <Card className="bg-dark text-white mb-4">
                <Card.Img src="https://gstatic.com/classroom/themes/Psychology.jpg" alt="Card image" />
                <Card.ImgOverlay>
                  <Card.Title>Test</Card.Title>
                </Card.ImgOverlay>
              </Card>
  }

  function getValue() {
    var docRef = projectFirestore.collection("TEAM").doc(teamID);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setUpdata(doc.data());
          console.log(updata)
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
      <TopNav/>
      <Container>

      {card()}

      {currentUserRole === "admin" && (
        <Link
          to={`/Addfolder`}
          style={cardLink}
          className="col-lg-3 col-md-4 col-sm-12 mb-3"
        >
          <Button><AddIcon/> <b>Create Project</b></Button>
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
              <Container className="mt-5 d-flex justify-content-center">
                <div className="w-100" style={{ maxWidth: '400px' }}>
                  <img className="w-100" src="/images/empty.png" alt="image" />
                  <h4 className="text-center">No project yet</h4>
                  <p className="text-center">Create one now</p>
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