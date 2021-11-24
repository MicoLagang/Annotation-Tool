import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { projectFirestore } from "../../../firebase";
import ImageGrid from "./ImageGrid";
import Title from "./Title";
import UploadForm from "./UploadForm";
import useStorage from "../hooks/useStorage";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import TopNav from "../../Navigation/TopNav";
import Button from "@material-ui/core/Button";
import Card  from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export default function TestTeam() {
  // const { name } = useParams()
  // const {teamID} = useParams()
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);
  const userRole = localStorage.getItem("currentUserRole");
  const createTeam = {
    backgroundColor: "#FFD803",
  };

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriber = projectFirestore
      // .collection("FolderImages")
      // .collection('teams').doc('JviFAFCWPy0VPJFeCBPZ').collection('FolderImages').doc('HceEccV4vOIkrNX4CYeB')
      .doc(`TEAM/${teamID}`)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
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
    localStorage.setItem("currentImagesFolderID", ID.key);
    localStorage.setItem("currentImagesFolderName", ID.name);
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

    //

    //     </div>

    <>
      <Container>
        {userRole === "admin" && (
          <Link
            to={`/createimagesfolder`}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-5"
          >
            {/* <Card border="dark" style={createTeam} className="h-100">
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title>Create Images Folder</Card.Title>
                </Card.Body>
              </Card> */}

            <Button variant="contained">Create Images Folder</Button>
          </Link>
        )}
        {userRole === "contributor" && (
          <Link
            to={`/createimagesfolder`}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-5"
          >
            {/* <Card border="dark" style={createTeam} className="h-100">
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title>Create Images Folder</Card.Title>
                </Card.Body>
              </Card> */}
            <Button variant="contained">Create Images Folder</Button>
          </Link>
        )}
        <div className="row mt-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                to={`/myTeam/gallery/folder/imagesfolder/galleryimagesfolder`}
                onClick={() => saveAs(post)}
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
            <h6>No Images folder yet</h6>
          )}
        </div>
      </Container>
    </>
  );
}
