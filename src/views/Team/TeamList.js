import React, { useEffect, useState } from "react";
import {projectFirestore} from '../../firebase';
import { Link } from 'react-router-dom'
import { Card, Container } from "react-bootstrap";


const FolderList = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

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
<br></br>
<br></br>
    <div className="row">
      <Link
        to="/new"
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
        posts.map((post) =>
          <Link
          to={`/gallery/${post.key}`} 
          key={post.key}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-3"
          >
            <Card border="dark" className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Card.Title>{post.name}</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        )
        ): (
          <h6>No Team yet</h6>
        )}
      
    </div>
  </>
  );
};

export default FolderList;


