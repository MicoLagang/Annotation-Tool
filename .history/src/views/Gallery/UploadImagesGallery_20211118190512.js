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
import { Link } from "react-router-dom";

function App() {
  const [selectedImg, setSelectedImg] = useState(null);
  const { teamID } = useParams();

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };
  return (
    <>
      <TopNav />
      {/* <Container> */}
      <Title />
      <UploadForm />

      <ImageGrid setSelectedImg={setSelectedImg} />

      {selectedImg && (
        <Modal selectedImg={selectedImg} setSelectedImg={setSelectedImg} />
        //   <Link
        //   to={`/tool`}
        //   style={cardLink}
        //   className="col-lg-3 col-md-4 col-sm-12 mb-3"
        // />
      )}

      {/* <div>{teamID}</div> */}

      {/* <AddFolder /> */}
      {/* <FolderList/> */}

      {console.log(selectedImg)}
      {/* {console.log(setSelectedImg)} */}
      {/* </Container> */}
    </>
  );
}

export default App;
