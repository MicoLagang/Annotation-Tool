import React, { useEffect, useState } from "react";
import { projectFirestore } from "../../firebase";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../logic/context/AuthContext";
import projectMembersService from "../../services/projectMembers.service";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TopNav from "../Navigation/TopNav";
import { Container } from "react-bootstrap";
import Swal from "sweetalert2";
import teamService from "../../services/team.service";
import { mdiWindowShutter } from "@mdi/js";

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
});

const ArchiveTeam = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const { currentUser, logout } = useAuth();
  const uid = localStorage.getItem("currentUserUID");
  const history = useHistory();
  const classes = useStyles();

  const createTeam = {
    backgroundColor: "#d3d3d3",
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
      .collection("TEAMMEMBERS")
      .where("uid", "==", uid)
      .where("isArchive", "==", true)
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

  function unArchive(key) {
    Swal.fire({
      title: "Restore Team?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        teamService.unArchiveTeam(key);
        projectMembersService.unArchiveTeam(key);
        Swal.fire("Restored!", "Your team has been Restored.", "success").then(
          () => {
            history.push("myTeam");
          }
        );
      }
    });
  }

  localStorage.setItem("currentUserUID", currentUser.uid);
  return (
    <>
      <TopNav />
      <Container>
        <div className="row">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link
                onClick={() => unArchive(post.projectID)}
                style={cardLink}
                className="col-lg-3 col-md-4 col-sm-12 mb-3"
              >
                <Card
                  className="d-flex align-items-center justify-content-center h-100"
                  style={createTeam}
                >
                  <CardContent>
                    <Typography variant="h5" component="h2">
                      {post.TeamName}
                    </Typography>
                    <Typography color="textSecondary">
                      {post.TeamCode}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <h6>No Archive Team yet</h6>
          )}
        </div>
      </Container>
    </>
  );
};

export default ArchiveTeam;
