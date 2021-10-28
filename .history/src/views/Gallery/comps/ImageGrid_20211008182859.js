import React, { useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useImage } from "../../../logic/context/imageContext";
function ImageGrid() {
  const { docs } = useFirestore("PROJECT");
  const { imagesData, setImagesData } = useImage();

  const [imagesURL, setImagesURL] = useState([]);

  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "200px",
  };

  function showSelectedImage() {
    console.log(imagesURL);
    setImagesData(imagesURL);
  }

  function addImage(doc) {
    console.log("Add image function...");
    console.log(doc.url);
    for (let i = 0; i < imagesURL.length; i++) {
      console.log("lopping index: " + i);
      if (doc.url == imagesURL[i]) {
        console.log(imagesURL);
        const tempArray = imagesURL.filter((element) => element != doc.url);
        console.log(tempArray);
        setImagesURL(tempArray);
        return;
      } else {
        setImagesURL([...imagesURL, doc.url]);
        console.log(imagesURL);
      }
    }
  }

  function removeImage(doc) {
    const tempArray = imagesURL.filter((element) => element.url !== doc.url);
    console.log(tempArray);
    setImagesURL(tempArray);
  }

  return (
    <>
      <p>Selected: {imagesURL.length}</p>
      <Link to="/tool" onClick={() => showSelectedImage()}>
        Annotate
      </Link>
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
