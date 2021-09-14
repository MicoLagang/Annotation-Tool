import React, { useEffect, useState , useRef} from "react";
import { useParams } from 'react-router-dom'
import ImageGrid from './ImageGrid'
import Title from './Title'
import UploadForm from './UploadForm'
import useStorage from '../hooks/useStorage';
import { Card, Container } from "react-bootstrap";
import { Link } from 'react-router-dom'
import TopNav from '../../Navigation/TopNav';
import {projectFirestore} from '../../../firebase';
import { Form } from 'react-bootstrap'
import { Button } from '@material-ui/core'

export default function TestTeam(post) {
    const { name } = useParams()
    const [selectedImg, setSelectedImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const {teamID} = useParams()
    const foldername = useRef()
    const createTeam = {
        backgroundColor: "#FFD803",
      };
      
      const cardLink = {
        color: "#000000",
        textDecoration: "none",
        height: "130px",
      };

      function saveData(){
        console.log('yawa');
        console.log(foldername.current.value)
        projectFirestore.collection('PROJECT').doc(teamID).collection('FOLDERS').doc(name).collection('IMAGESFOLDER').add({name:foldername.current.value});
        // window.location.reload(false);
        
    console.log(teamID)
    console.log(foldername.current.value)
    };

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
    {/* <TopNav/> */}
    <div className="submit-form"> 
             <Form >
              
              {/* <div>{teamID}</div> */}
                                       <Form.Group className="mb-3">
                                           <Form.Control 
                                              type="text"
                                              className="form-control"
                                              id="folderName"
                                              required
                                            //   onChange={foldername}
                                            ref={foldername}
                                              placeholder="Create Folder"
                                              name="owner"/>
                                      </Form.Group>
                      
                                      <Button onClick={saveData} variant="contained" color="primary" className="w-100">
                                          Create
                                      </Button>
                                  </Form>
        </div>
    </>
    )
}