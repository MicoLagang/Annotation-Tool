import React, { useState,useEffect } from 'react';
import { useParams } from 'react-router-dom'
import {projectFirestore} from '../../../firebase';
import ImageGrid from './ImageGrid'
import Title from './Title'
import UploadForm from './UploadForm'
import useStorage from '../hooks/useStorage';
import { Card, Container } from "react-bootstrap";
import { Link } from 'react-router-dom'
import TopNav from '../../Navigation/TopNav';

export default function TestTeam() {
    const { name } = useParams()
    const {teamID} = useParams()
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const createTeam = {
        backgroundColor: "#FFD803",
      };
      
      const cardLink = {
        color: "#000000",
        textDecoration: "none",
        height: "130px",
      };

      useEffect(() => {
        const getPostsFromFirebase = [];
        const subscriber = projectFirestore
          // .collection("FolderImages")
          // .collection('teams').doc('JviFAFCWPy0VPJFeCBPZ').collection('FolderImages').doc('HceEccV4vOIkrNX4CYeB')
          .doc(`PROJECT/${teamID}`).collection('FOLDERS').doc(name).collection('IMAGESFOLDER')
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              getPostsFromFirebase.push({
                ...doc.data(), //spread operator
                key: doc.id, // `id` given to us by Firebase
              });
            });
            setPosts(getPostsFromFirebase);
            setLoading(false);
          });
    
        // return cleanup function
        return () => subscriber();
      }, [loading]); // empty dependencies array => useEffect only called once
    
      if (loading) {
        return <h1>loading firebase data...</h1>;
      }

    return (
    //     <div>

    // <Title/>
    //     {/* <input 
    //         type="file"
    //         multiple
        
    //     /> */}
    // <UploadForm/>

    //   <ImageGrid setSelectedImg={setSelectedImg} />
    //         {/* <h2>Team { name }</h2>

    //         <h1>HELLO PO YAWAA TESt</h1> */}

    //     </div>

    <>

<TopNav></TopNav>
<br></br>

<Container>
    <div className="row">
      <Link
        to={`/createimagesfolder/${name}/${teamID}`} 
        style={cardLink}
        className="col-lg-3 col-md-4 col-sm-12 mb-3"
      >
        <Card border="dark" style={createTeam} className="h-100">
          <Card.Body className="d-flex align-items-center justify-content-center">
            <Card.Title>Create Images Folder</Card.Title>
          </Card.Body>
        </Card>
      </Link>

      {posts.length > 0 ? (
        posts.map((post) =>
          <Link
          to={`/galleryimagesfolder/${name}/${post.key}/${teamID}`} 
          key={post.key}
            style={cardLink}
            className="col-lg-3 col-md-4 col-sm-12 mb-3"
          >
            {/* {name} */}
            {/* {post.key} */}
            <Card border="dark" className="h-100">
              <Card.Body className="d-flex align-items-center justify-content-center">
                <Card.Title>{post.name}</Card.Title>
              </Card.Body>
            </Card>
          </Link>
        )
        ): (
          <h6>No Images folder yet</h6>
        )}
      </div>
  </Container>
    </>


    )
}
