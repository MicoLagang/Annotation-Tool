import React from "react";
import useFirestore from "../hooks/useFirestore";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useImage } from "../../../logic/context/imageContext";
function ImageGrid() {
  const { docs } = useFirestore("PROJECT");
  const { imagesData, setImagesData } = useImage();

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "200px",
  };

  function showSelectedImage(url) {
    console.log(url);
    setImagesData(url);
  }

  return (
    <>
      <div className="row">
        {docs &&
          docs.map((doc) => (
            <Link
              to="/tool"
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
                onClick={() => showSelectedImage(doc.url)}
              ></Card>
            </Link>
          ))}
      </div>
    </>
  );
}

export default ImageGrid;
