import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../../firebase";
import { Link } from "react-router-dom";
import FolderImages from "./FolderImages";
import { useParams } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import TopNav from "../../Navigation/TopNav";
const FolderList = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  // const {teamID} = useParams()
  const teamID = localStorage.getItem("currentTeamID");

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
      .doc(`PROJECT/${teamID}`)
      .collection("FOLDERS")
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
    localStorage.setItem("currentProjectID", ID);
  }

  return (
    // <div className="container">
    //   <h1>Folder:</h1>

    //   <ul className="list-group">
    //   {posts.length > 0 ? (
    //     posts.map((post) =>
    //      <Link
    //     to={`/folder/${post.key}/${teamID}`}

    //     key={post.key}>
    //     {post.name} </Link>
    //     )
    //   ) : (
    //     <h6>No folder yet</h6>
    //   )}

    //   </ul>

    // </div>

    <>
      <br></br>

      <button>delete</button>
      <div className="row">
        <Link
          to={`/Addfolder`}
          style={cardLink}
          className="col-lg-3 col-md-4 col-sm-12 mb-3"
        >
          <Card border="dark" style={createTeam} className="h-100">
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Card.Title>Create Project</Card.Title>
            </Card.Body>
          </Card>
        </Link>

        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              to={`/folder`}
              onClick={() => saveAs(post.key)}
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
          ))
        ) : (
          <h6>No Project yet</h6>
        )}
      </div>
    </>
  );
};

export default FolderList;
