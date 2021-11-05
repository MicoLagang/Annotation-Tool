import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase";
import { Link } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import CreateTeam from "./CreateTeam";
import { useAuth } from "../../logic/context/AuthContext";

const FolderList = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { currentUser, logout } = useAuth();

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
      .collection("PROJECT")
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
  }

  localStorage.setItem("currentUserUID", currentUser.uid);

  // const rememberMe = localStorage.getItem('currentUserUID');
  // console.log(rememberMe)
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


      <

    </div> */}

      <br></br>
      <button>delete</button>
      <button>edit</button>
      <br></br>
      <br></br>
      <div className="row">
        <Link
          // to="/new/"
          to={`/new`}
          style={cardLink}
          className="col-lg-3 col-md-4 col-sm-12 mb-3"
        >
          <Card border="dark" style={createTeam} className="h-100">
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Card.Title>Create Team</Card.Title>
            </Card.Body>
          </Card>
        </Link>

        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              // to={`/gallery/${post.key}`}
              to={`/gallery`}
              // to={`/gallery/${currentUser.uid}`}
              onClick={() => saveAs(post.key)}
              key={post.key}
              style={cardLink}
              className="col-lg-3 col-md-4 col-sm-12 mb-3"
            >
              {/* {localStorage.setItem("currentGalleryUid", post.key)} */}
              <Card border="dark" className="h-100">
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Card.Title>
                    {post.name}

                    <h6 align="center">{post.TeamCode}</h6>
                  </Card.Title>
                </Card.Body>
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
