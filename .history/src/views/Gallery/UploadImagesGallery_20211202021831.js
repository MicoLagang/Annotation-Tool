import React, { useState } from "react";
import Title from "./comps/Title";
import UploadForm from "./comps/UploadForm";
import ImageGrid from "./comps/ImageGrid";
import Modal from "./comps/Modal";
import { useParams } from "react-router-dom";
import "./index.css";
import TopNav from "../Navigation/TopNav";
import { Container } from "react-bootstrap";

function App() {
  const [selectedImg, setSelectedImg] = useState(null);
  const { teamID } = useParams();
  const currentUserRole = localStorage.getItem("currentUserRole");

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };
  return (
    <>
      <TopNav />
      <Container>

        {currentUserRole == "admin" && <UploadForm />}
        {currentUserRole == "contributor" && <UploadForm />}

        <ImageGrid setSelectedImg={setSelectedImg} />

        {selectedImg && (
          <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} />
        )}

        {console.log(selectedImg)}
      </Container>
    </>
  );
}

export default App;
