import React, { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TopNav from "../../Navigation/TopNav";
import { projectFirestore } from "../../../firebase";
import projectMembersService from "../../../services/projectMembers.service";
import { ToastContainer } from "react-toastify";
import ImagesFolder from "../comps/ImagesFolder";

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import SettingsIcon from "@material-ui/icons/Settings";
import { useImage } from "../../../logic/context/imageContext";

export default function TestTeam(post) {
  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const [loading, setLoading] = useState(true);
  const currentTeamName = localStorage.getItem("currentTeamName");
  const currentUserRole = localStorage.getItem("currentUserRole");
  const uid = localStorage.getItem("currentUserUID");
  const { imagesData, setImagesData } = useImage();

  projectMembersService.getRole(uid, teamID);

  const styles = {
    media: {
      height: 0,
      paddingTop: "200px",
      backgroundPosition: 'right'
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
    buttons: {
      position: "absolute",
      top: "5px",
      right: "5px",
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
    // setImagesData(null)
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
                // image={"https://gstatic.com/classroom/themes/Psychology.jpg"}
                image={"/images/foldercard.png"}
                style={styles.media}
              />
              <div style={styles.overlay}>
                <Typography style={styles.title}>{updata.name}</Typography>
                <Typography style={styles.text}>{currentTeamName}</Typography>
              </div>
              <div style={styles.buttons}>
                <>
                  {currentUserRole === "admin" && (
                    <Button
                      color="inherit"
                      href="/myTeam/gallery/folder/settings"
                    >
                      <SettingsIcon /> Settings
                    </Button>
                  )}
                </>
              </div>
            </Card>
    );
  };

  return (
    <>
      {/* <ToastContainer /> */}
      <TopNav />

      <Container>
        {card()}

        <ImagesFolder></ImagesFolder>
      </Container>
    </>
  );
}