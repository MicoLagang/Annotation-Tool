import React from "react";
import useFirestore from "../hooks/useFirestore";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useImage } from "../../../logic/context/imageContext";
function ImageGrid() {
  const { docs } = useFirestore("PROJECT");
  const { imagesData, setImagesData } = useImage();

  let imagesURL = [
    "https://firebasestorage.googleapis.com/v0/b/ilabel…=media&token=2ecfdc55-5455-45ca-88b1-1ba1fee0f580",
    "https://firebasestorage.googleapis.com/v0/b/ilabel…=media&token=b61f1ba2-5478-41e8-8bb3-4ebaebd7000d",
  ];

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "200px",
  };

  function showSelectedImage(doc) {
    console.log(doc);
    setImagesData(imagesURL);
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
                onClick={() => showSelectedImage(doc)}
              ></Card>
            </Link>
          ))}
      </div>
    </>
  );
}

export default ImageGrid;
