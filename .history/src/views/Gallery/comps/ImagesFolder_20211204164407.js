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
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";

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

  const addButton = {
    color: "#000000",
    textDecoration: "none",
    height: "50px",
  };

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriber = projectFirestore
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
    <>
      <Container>
        {userRole === "admin" && posts.length > 0 && (
          <Link
            to={`/createimagesfolder`}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-5"
          >
            <Button>
              <AddIcon /> <b>Create Images Folder</b>
            </Button>
          </Link>
        )}
        {userRole === "contributor" && posts.length > 0 && (
          <Link
            to={`/createimagesfolder`}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-5"
          >
            <Button>
              <AddIcon /> <b>Create Images Folder</b>
            </Button>
          </Link>
        )}

        <div className="row mt-3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                to={`/myTeam/gallery/folder/imagesfolder`}
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

                    {post.isCompleted && userRole == "admin" ? (
                      <Typography color="textSecondary">pending</Typography>
                    ) : (
                      <Typography color="textSecondary"></Typography>
                    )}
                    {post.isAccepted &&
                    !post.isCompleted &&
                    !post.isRejected &&
                    userRole == "admin" ? (
                      <Typography color="textSecondary">Completed</Typography>
                    ) : (
                      <Typography color="textSecondary"></Typography>
                    )}

                    {post.isCompleted && userRole == "contributor" ? (
                      <Typography color="textSecondary">pending</Typography>
                    ) : (
                      <Typography color="textSecondary"></Typography>
                    )}
                    {post.isAccepted &&
                    !post.isCompleted &&
                    !post.isRejected &&
                    userRole == "contributor" ? (
                      <Typography color="textSecondary">Completed</Typography>
                    ) : (
                      <Typography color="textSecondary"></Typography>
                    )}

                    {post.isCompleted && userRole == "validator" ? (
                      <Typography color="textSecondary">pending</Typography>
                    ) : (
                      <Typography color="textSecondary"></Typography>
                    )}
                    {post.isAccepted &&
                    !post.isCompleted &&
                    !post.isRejected &&
                    userRole == "validator" ? (
                      <Typography color="textSecondary">Completed</Typography>
                    ) : (
                      <Typography color="textSecondary"></Typography>
                    )}

                    {post.isCompleted && userRole == "annotator" ? (
                      <Typography color="textSecondary">sending</Typography>
                    ) : (
                      <Typography color="textSecondary"></Typography>
                    )}
                    {!post.isAccepted &&
                    !post.isCompleted &&
                    post.isRejected &&
                    userRole == "annotator" ? (
                      <Typography color="textSecondary">rejected</Typography>
                    ) : (
                      <Typography color="textSecondary"></Typography>
                    )}
                    {post.isAccepted &&
                    !post.isCompleted &&
                    !post.isRejected &&
                    userRole == "annotator" ? (
                      <Typography color="textSecondary">Completed</Typography>
                    ) : (
                      <Typography color="textSecondary"></Typography>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <>
              <Container className="d-flex justify-content-center mb-5">
                <div className="w-100" style={{ maxWidth: "400px" }}>
                  <img className="w-100" src="/images/empty.png" alt="image" />
                  <h4 className="text-center">No folder yet</h4>
                  {userRole === "admin" && (
                    <Button
                      className="w-100 text-capitalize"
                      style={addButton}
                      href="/createimagesfolder"
                      color="primary"
                    >
                      Create one now
                    </Button>
                  )}
                  {userRole === "contributor" && (
                    <Button
                      className="w-100 text-capitalize"
                      style={addButton}
                      href="/createimagesfolder"
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
