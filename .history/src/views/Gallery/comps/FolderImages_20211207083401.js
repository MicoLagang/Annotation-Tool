import React, { useEffect, useState, useRef } from "react";
import { Container, Modal, Tabs, Tab, Form } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import TopNav from "../../Navigation/TopNav";
import { projectFirestore } from "../../../firebase";
import projectMembersService from "../../../services/projectMembers.service";
import teamService from "../../../services/team.service";
import { toast, ToastContainer } from "react-toastify";
import ImagesFolder from "../comps/ImagesFolder";
import Swal from "sweetalert2";

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

export default function TestTeam(post) {
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const [selectedImg, setSelectedImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const currentUserRole = localStorage.getItem("currentUserRole");
  const currentTeamName = localStorage.getItem("currentTeamName");
  const uid = localStorage.getItem("currentUserUID");
  const history = useHistory();
  const [modalShow, setModalShow] = React.useState(false);
  const [value, setValue] = useState();
  const projectNameref = useRef();

  projectMembersService.getRole(uid, teamID);

  const styles = {
    media: {
      height: 0,
      paddingTop: "200px",
    },
    card: {
      position: "relative",
      marginBottom: "30px",
    },
    overlay: {
      position: "absolute",
      bottom: "20px",
      left: "20px",
      color: "white",
    },
    title: {
      fontSize: "2rem",
      fontWeight: "500",
      lineHeight: "2.75rem",
    },
    text: {
      fontSize: "1rem",
    },
  };

  const [updata, setUpdata] = useState({
    data: {
      role: "",
      status: "",
    },
    uid: "",
  });

  useEffect(() => {
    getValue();
  }, [loading]); // empty dependencies array => useEffect only called once

  function getValue() {
    var docRef = projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          setUpdata(doc.data());
          setValue(doc.data().name);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }

  const card = () => {
    return (
      <Card style={styles.card}>
        <CardMedia
          image={"https://gstatic.com/classroom/themes/Psychology.jpg"}
          style={styles.media}
        />
        <div style={styles.overlay}>
          <Typography style={styles.title}>{updata.name}</Typography>
          <Typography style={styles.text}>{currentTeamName}</Typography>
        </div>
      </Card>
    );
  };

  return (
    <>
      <ToastContainer />
      <TopNav />

      <Container>
        {card()}

        <ImagesFolder></ImagesFolder>
      </Container>
    </>
  );
}
