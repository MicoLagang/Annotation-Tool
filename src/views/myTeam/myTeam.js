import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase";
import { Link, useParams } from "react-router-dom";
import {  Container } from "react-bootstrap";
import TopNav from "../Navigation/TopNav";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import projectMembersService from "../../services/projectMembers.service";

const FolderList = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [posts1, setPosts1] = useState([]);
  // const {uid} = useParams()
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

  // console.log(rand.generate(5))

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriber = projectFirestore
      .collection("TEAMMEMBERS")
      .where("uid", "==", uid)
      .where("Status", "==", "true")
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // `id` given to us by Firebase
          });
        });
        setPosts(getPostsFromFirebase);
        setLoading(false);
        console.log(uid);
        console.log(getPostsFromFirebase);
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

  localStorage.removeItem("currentUserRole");
  localStorage.removeItem("currentTeamID");

  return (
    // <div className="container">
    //   <Link to="/new">
    //     <h1>CREATE TEAM</h1>
    //   </Link>
    //   <h5>TEAM LIST:</h5>

    //   <ul className="list-group">
    //   {posts.length > 0 ? (
    //     posts.map((post) =>
    //      <Link
    //     to={`/gallery/${post.key}`}

    //     key={post.key}>
    //     {post.name}</Link>
    //     )
    //   ) : (
    //     <h6>No folder yet</h6>
    //   )}

    //   </ul>

    // </div>

    <>
      {/* 
<div className="container">
      <Link to="/new">
        <h1>CREATE TEAM</h1>
      </Link>
      <h5>TEAM LIST:</h5>
      
      <ul className="list-group">
      {posts.length > 0 ? (
        posts.map((post) =>
         <Link 
        to={`/gallery/${post.key}`} 

        key={post.key}> 
        {post.name}</Link>
        )
      ) : (
        <h6>No folder yet</h6>
      )}

      </ul>



    </div> */}

      <TopNav />

      <Container>
        <br></br>
        <br></br>
        <div className="row">
          <Link
            to="/new"
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-3"
          >
            {/* <Card style={createTeam} className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Card.Title>Create Team</Card.Title>
              </Card.Body>
            </Card> */}
            <Card style={createTeam} className="d-flex align-items-center justify-content-center h-100">
                <CardContent>
                  <Typography variant="h5" component="h2">
                    Create Team
                  </Typography>
                </CardContent>
              </Card>
          </Link>

          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                to={`/myTeam/gallery`}
                // to={`/gallery/${uid}`}
                key={post.key}
                onClick={() => saveAs(post.projectID)}
                style={cardLink}
                className="col-lg-3 col-md-4 col-sm-12 mb-3"
              >
                {/* <Card className="d-flex align-items-center justify-content-center h-100">
                  <Card.Body className="d-flex align-items-center justify-content-center">
                    <Card.Title>
                      {post.TeamName}
                      <h6 align="center">{post.TeamCode}</h6>
                    </Card.Title>
                  </Card.Body>
                </Card> */}
                <Card className="d-flex align-items-center justify-content-center h-100">
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {post.TeamName}
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
      </Container>
    </>
  );
};

export default FolderList;
