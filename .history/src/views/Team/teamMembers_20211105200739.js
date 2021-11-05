import React, { useEffect, useState } from "react";
import {projectFirestore} from '../../firebase';
import { Link ,useParams} from 'react-router-dom'
import { Card, Container, Table, Modal,Button,Form } from "react-bootstrap";
import TopNav from "../Navigation/TopNav";
import Swal from "sweetalert2";  
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { TextField } from "@material-ui/core";
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const FolderList = () => {

  const [modalShow, setModalShow] = React.useState(false);

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  // const {teamID} = useParams()
  const teamID = localStorage.getItem('currentTeamID')

  const [updata, setUpdata] = useState({
    data :{
      role:'',
      status:'',
    },
    uid:''
  })
  const createTeam = {
    backgroundColor: "#FFD803",
  };
  
  const cardLink = {
    color: "#000000",
    textDecoration: "none",
    height: "130px",
  };

  var rand = require("random-key");
  rand.generate(7);

  // console.log(rand.generate(5))

  useEffect(() => {
    const getPostsFromFirebase = [];
    const subscriber = projectFirestore
      .collection("PROJECTMEMBERS").where("projectID","==",teamID)
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

  function MyVerticallyCenteredModal(props) {

    const {daata} = props
    const [value,setValue] = useState({
      uid: daata.uid,
      role: daata.role,
      teamID: daata.TeamCode,
      status: daata.Status,
      key: daata.key
    });

    const {uid,role,teamID,status,key} = value
    
    const handleChange = (uid) => (e) => {
      e.preventDefault();
      setValue({...value, [uid]: e.target.value})
    }


    const update = () =>{

      projectFirestore.collection('PROJECTMEMBERS').doc(daata.key).update({
        Status:"true",
        role: role,
      }).then(() => {
        
        toast.success("User had been accepted")
        setTimeout(function() {
          window.location.reload()
        }, 5000);
       
      }).catch(()=>{
        toast.error("Something went wrong!")
      })
    }
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>


        <TextField
                id="teamID"
        
                value={teamID}
                onChange={handleChange('teamID')}
                margin="normal"
                // placeholder="Email Adress"
                type="text"
                fullWidth
                disabled
              />    

        <TextField
                id="Role"
        
                value={role}
                onChange={ handleChange('role')}
                margin="normal"
                // placeholder="Email Adress"
                type="text"
                fullWidth
              />
             
          <Button
                    onClick={update}
                    // variant="contained"
                    color="secondary"
                    size="large"
                  >
                    Accept
                  </Button>
          
        
     
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }


  
  



  return (


    <>


<TopNav/>


    


<Container>
        <Table striped bordered hover>
  <thead>
    <tr>
      <th>User ID</th>
      <th>Team Code</th>
      <th>Role</th>
      <th>Action</th>
    </tr>
  </thead>
  {posts.length > 0 ? (
        posts.map((post) =>
  <tbody>
    <tr>
        <td>{post.uid}</td>
      <td>{post.TeamCode}</td>
      <td>{post.role}</td>
      <td>
      {/* <Link
        to={`/addMember/${post.uid}`} 
      >
        EDIT
         </Link> */}
 
         
     <Button variant="primary" 
     onClick={() => {
       setUpdata(post)
      setModalShow(true)
     }}
     
     >
        ACCEPT
      </Button>
     
      <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        daata={updata}
      /> 
      </td>
    </tr>
  </tbody>

        )
        ): (
          <h6>No Team yet</h6>
        )}

</Table>
</Container>
<ToastContainer/>
  </>
  );
};

export default FolderList;

