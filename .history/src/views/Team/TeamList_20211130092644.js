import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase";
import { Link } from "react-router-dom";
import { useAuth } from "../../logic/context/AuthContext";
import projectMembersService from "../../services/projectMembers.service";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
});

const FolderList = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { currentUser, logout } = useAuth();
  const uid = localStorage.getItem("currentUserUID");

  const classes = useStyles();

  const createTeam = {
    backgroundColor: "#FFD803",
  };

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };

  var rand = require("random-key");
  rand.generate(7);

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriber = projectFirestore
      .collection("TEAM")
      .where("status", "==", "Public")
      .where("isArchive", "==", false)
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

  function saveAs(post) {
    console.log(post);
    localStorage.setItem("currentTeamID", post.projectID);
    localStorage.setItem("currentTeamName", post.TeamName);
    console.log(post.projectID);
  }

  localStorage.setItem("currentUserUID", currentUser.uid);
  return (
    <>
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              to={`/myTeam/gallery`}
              onClick={() => saveAs(post)}
              key={post.key}
              style={cardLink}
              className="col-lg-3 col-md-4 col-sm-12 mb-3"
            >
              {/* <Card border="dark" className="h-100">
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title>
                    {post.name}

                    <h6 align="center">{post.TeamCode}</h6>
                  </Card.Title>
                </Card.Body>
              </Card> */}

              <Card className="d-flex align-items-center justify-content-center h-100">
                <CardContent>
                  <Typography variant="h5" component="h2">
                    {post.name}
                  </Typography>
                  <Typography color="textSecondary">{post.TeamCode}</Typography>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <h6>No Team yet</h6>
        )}
      </div>
    </>
  );
};

export default FolderList;
