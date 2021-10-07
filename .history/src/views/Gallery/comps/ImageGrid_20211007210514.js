import React, { useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useImage } from "../../../logic/context/imageContext";
function ImageGrid() {
  const { docs } = useFirestore("PROJECT");
  const { imagesData, setImagesData } = useImage();

  const [imagesURL, setImagesURL] = useState([""]);

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "200px",
  };

  function showSelectedImage(doc) {
    console.log(imagesURL);
    setImagesData(imagesURL);
  }

  function addImage(doc) {
    console.log(imagesURL.length);
    if (imagesURL.length == 0) {
      setImagesURL([...imagesURL, doc.url]);
    }
    setImagesURL([...imagesURL, doc.url]);
    console.log(imagesURL);
  }

  return (
    <>
      <Link to="/tool">Annotate</Link>
      <div className="row">
        {docs &&
          docs.map((doc) => (
            <Link
              // to="/tool"
              style={cardLink}
              className="col-lg-3 col-md-4 col-sm-12 mb-3"
            >
              <Card
                key={doc.id}
                border="dark"
                className="h-100"
                style={{
                  backgroundImage: `url(${doc.url})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
                onClick={() => addImage(doc)}
              ></Card>
            </Link>
          ))}
      </div>
    </>
  );
}

export default ImageGrid;
