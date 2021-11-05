// import React from 'react';
// import useFirestore from '../hooks/useFirestore';
// import { motion } from 'framer-motion';
// import { Card, Container } from "react-bootstrap";
// import { Link , useHistory} from 'react-router-dom'
// const ImageGrid = ({ setSelectedImg }) => {

//   const history = useHistory()
//   const { docs } = useFirestore('PROJECT');
//   // history.push("/tool")

//   const cardLink = {
//     color: "#000000",
//     textDecoration: "none",
//     height: "200px",
//   };

//   return (
//     // <div className="img-grid">
// <>
//     <div className="row">
//       {docs && docs.map(doc => (

//         <Link
//         // to="/tool"
//         // to={`/tool/${doc.url}`}
//         to={{
//           pathname: `/tool`,
//           state: {
//             url: doc.url,
//           },
//         }}

//         style={cardLink}
//         className="col-lg-3 col-md-4 col-sm-12 mb-3"
//       >

//         <Card
//                  key={doc.id}
//           border="dark"
//           className="h-100"
//           style={{
//             backgroundImage: `url(${doc.url})`,
//             backgroundRepeat: "no-repeat",
//             backgroundPosition: "center",
//             backgroundSize: "cover",

//           }}
//           // onClick={() => setSelectedImg(doc.url)}
//         ></Card>
//       </Link>
//       ))}
//       </div>
//           {/* <div className="row">
//       {docs && docs.map(doc => (

//         <motion.div className="img-wrap" key={doc.id}
//           layout
//           whileHover={{ opacity: 1 }}s
//           onClick={() => setSelectedImg(doc.url)}
//         >
//           <motion.img src={doc.url} alt="uploaded pic"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 1 }}
//           />
//         </motion.div>
//       ))}
//     </div> */}
//     </>

//   )
// }

// export default ImageGrid;

import React, { useState } from "react";
import useFirestore from "../hooks/useFirestore";
import { Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useImage } from "../../../logic/context/imageContext";
import { projectFirestore } from "../../../firebase";

function ImageGrid() {
  const { docs } = useFirestore("PROJECT");
  const { imagesData, setImagesData } = useImage();

  const [imagesURL, setImagesURL] = useState([]);
  const currentUserRole = localStorage.getItem("currentUserRole");

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
    if (imagesURL.length == 0) {
      setImagesURL([...imagesURL, doc.url]);
      return;
    }
    for (let i = 0; i < imagesURL.length; i++) {
      if (doc.url == imagesURL[i]) {
        const tempArray = imagesURL.filter((element) => element != doc.url);
        setImagesURL(tempArray);
        return;
      } else {
        setImagesURL([...imagesURL, doc.url]);
      }
    }
  }

  function removeImage(doc) {
    const tempArray = imagesURL.filter((element) => element.url !== doc.url);
    console.log(tempArray);
    setImagesURL(tempArray);
  }

  var docRef = projectFirestore
    .collection("ANNOTATIONS")
    .doc("24ul5NguzlVppt0TXgjU");

  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log("Document data:", doc.data().data);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    .catch((error) => {
      console.log("Error getting document:", error);
    });

  return (
    <>
      {currentUserRole !== "contributor" && (
        <div>
          {imagesURL.length > 0 && (
            <div>
              <p>Selected: {imagesURL.length}</p>
              <Link to="/tool" onClick={() => showSelectedImage()}>
                Annotate
              </Link>
            </div>
          )}

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
        </div>
      )}

      {currentUserRole === "contributor" && (
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
      )}
      {/* <Link to="/tool" onClick={() => showSelectedImage()}>
        Annotate
      </Link> */}
      {/* <div className="row">
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
      </div> */}
    </>
  );
}

export default ImageGrid;
