import React, { useState } from "react";
import Title from "./comps/Title";
import AddFolder from "./comps/AddFolder";
import UploadForm from "./comps/UploadForm";
import ImageGrid from "./comps/ImageGrid";
import Modal from "./comps/Modal";
import FolderList from "./comps/FolderList";
import { useParams } from "react-router-dom";
import "./index.css";
import TopNav from "../Navigation/TopNav";
import { Container } from "react-bootstrap";

function App() {
  const [selectedImg, setSelectedImg] = useState(null);
  const { teamID } = useParams();
  return (
    <>
      <TopNav />
      <Container>
        <Title />
        <UploadForm />

        <ImageGrid setSelectedImg={setSelectedImg} />

        {/* { selectedImg && (
        <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} />
      )} */}

        {console.log(selectedImg)}
        {/* {console.log(setSelectedImg)} */}
      </Container>
    </>
  );
}

export default App;
