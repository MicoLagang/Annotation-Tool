import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase";
import { Link } from "react-router-dom";
// import { Card } from "react-bootstrap";
import { useAuth } from "../../logic/context/AuthContext";
import projectMembersService from "../../services/projectMembers.service";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const FolderList = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { currentUser, logout } = useAuth();
  const uid = localStorage.getItem("currentUserUID");

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
    localStorage.setItem("currentTeamID", ID);
    projectMembersService.getRole(uid, ID);
    console.log(ID);
  }

  localStorage.setItem("currentUserUID", currentUser.uid);
  return (
    <>
      <div className="row">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              to={`/myTeam/gallery`}
              onClick={() => saveAs(post.key)}
              key={post.key}
              style={cardLink}
              className="col-lg-3 col-md-4 col-sm-12 mb-3"
            >
              <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {post.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {post.TeamCode}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>

              {/* <Card border="dark" className="h-100">
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title>
                    {post.name}

                    <h6 align="center">{post.TeamCode}</h6>
                  </Card.Title>
                </Card.Body>
              </Card> */}
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
