import React from 'react';
import useFirestore from '../hooks/useFirestore';
import { motion } from 'framer-motion';
import { Card, Container } from "react-bootstrap";
import { Link } from 'react-router-dom'
const ImageGrid = ({ setSelectedImg }) => {
  
  const { docs } = useFirestore('PROJECT');

  console.log(ImageGrid)
  console.log(docs)
  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "200px",
  };




  return (
    // <div className="img-grid">
<>
    <div className="row">
      {docs && docs.map(doc => (
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
        ></Card>
      </Link>
      ))}
      </div>
    </>
 

    
  )
}

export default ImageGrid;