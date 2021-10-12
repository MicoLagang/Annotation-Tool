import React, { useEffect, useState } from "react";
import {projectFirestore} from '../../firebase';
import { Link ,useParams} from 'react-router-dom'
import { Card, Container, Table } from "react-bootstrap";
import TopNav from "../Navigation/TopNav";

const FolderList = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const {teamID} = useParams()
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
      .collection("PROJECTMEMBERS").where("projectID","==",teamID)
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


    <>


<TopNav/>


    


<Container>
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>User ID</th>
      <th>Team Code</th>
      <th>Role</th>
      <th>Action</th>
    </tr>
  </thead>
  {posts.length > 0 ? (
        posts.map((post) =>
  <tbody>
    <tr>
        <td>{post.uid}</td>
      <td>{post.TeamCode}</td>
      <td>{post.role}</td>
      <td>

      <Link
        to={`/addMember/${post.uid}`} 
      >
        EDIT
         </Link>
      </td>
    </tr>
  </tbody>

        )
        ): (
          <h6>No Team yet</h6>
        )}

</Table>
</Container>

  </>
  );
};

export default FolderList;


