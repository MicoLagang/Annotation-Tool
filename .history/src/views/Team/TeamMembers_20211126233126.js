import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase";
import { Link, useParams } from "react-router-dom";
import { Card, Container, Table, Modal, Button, Form } from "react-bootstrap";
import TopNav from "../Navigation/TopNav";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextField } from "@material-ui/core";
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const TeamMembers = () => {
  const [modalShow, setModalShow] = React.useState(false);

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const teamID = localStorage.getItem("currentTeamID");
  const currentUserRole = localStorage.getItem("currentUserRole");

  var rand = require("random-key");
  rand.generate(7);

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriber = projectFirestore
      .collection("TEAMMEMBERS")
      .where("projectID", "==", teamID)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(getPostsFromFirebase);
          getPostsFromFirebase.push({
            ...doc.data(), //spread operator
            key: doc.id, // `id` given to us by Firebase
          });
        });
        setPosts(getPostsFromFirebase);
        console.log(posts);
        setLoading(false);
      });

    // return cleanup function
    return () => subscriber();
  }, [loading]); // empty dependencies array => useEffect only called once

  if (loading) {
    return <h1>loading firebase data...</h1>;
  }

  async function openModal(post) {
    const { value: role } = await Swal.fire({
      title: "Update User Role",
      input: "select",
      inputOptions: {
        contributor: "Contributor",
        annotator: "Annotator",
        validator: "Validator",
      },
      inputPlaceholder: "Select Role",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          console.log(value);
          if (value) {
            console.log("if");
            resolve();
          } else {
            console.log("else");
            resolve("You need to select role");
          }
          // resolve();
        });
      },
    });

    if (role) {
      projectFirestore
        .collection("TEAMMEMBERS")
        .doc(post.key)
        .update({
          Status: "true",
          role: role,
        })
        .then(() => {
          Swal.fire(`User role update to ${role}`);
          setTimeout(function() {
            window.location.reload();
          }, 3000);
        })
        .catch(() => {});
    }
  }

  return (
    <>
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Email</th>
              <th>Role</th>
              {currentUserRole === "admin" && <th>Action</th>}
            </tr>
          </thead>
          {posts.length > 0 ? (
            posts.map((post) => (
              <tbody>
                <tr>
                  <td>{post.uid}</td>
                  <td>{post.email}</td>
                  <td>{post.role}</td>
                  {currentUserRole === "admin" && (
                    <td>
                      <Button
                        disabled
                        variant="primary"
                        onClick={() => {
                          openModal(post);
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  )}
                </tr>
              </tbody>
            ))
          ) : (
            <h6>No Team yet</h6>
          )}
        </Table>
      </Container>
      <ToastContainer />
    </>
  );
};

export default TeamMembers;
