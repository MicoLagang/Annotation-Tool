// import React, { Component } from 'react'
// import { Form } from 'react-bootstrap'
// import { Button } from '@material-ui/core'
// import teamService from '../../../services/folder.service';
// import { Link } from 'react-router-dom'
// import { projectFirestore } from '../../../firebase';
// import { useState, useEffect } from 'react';


// export default class AddFolder extends Component {

//     constructor(props) {


        
//         super(props);

//         this.onChangefolderName = this.onChangefolderName.bind(this);
//         this.saveFolder = this.saveFolder.bind(this);
//         this.createFolder = this.createFolder.bind(this);

//         this.state = {


//             folderName: '',
//             submitted: false,
//         };


//     }

//     onChangefolderName(e) {
//         this.setState({
//             folderName: e.target.value,
//         });
//     }

//     saveFolder() {
//         const data = {
//             folderName: this.state.folderName,
//         };
    
//         teamService.create(data)
//           .then(() => {
//             console.log("Folder Created Successfuly!");
//             this.setState({
//                 submitted: true,
//             });
//           })
//           .catch((e) => {
//             console.log(e);
//           });
   
          
//     }
    
//     createFolder() {
//         this.setState({
//             folderName: '',
//             submitted: false,
//         });
//     }

//     render() {
//         return (
//             <div className="submit-form">
//                 {this.state.submitted ? (
//                     <div>
//                     <h4 className="text-center mb-4">Folder Created Successfuly!</h4>
//                     {/* <button className="btn btn-success w-100" href="/" onClick={this.createTeam}>
//                       Back
//                     </button> */}
//                     <Link to="/">Back</Link>
//                   </div>
//                 ) : (
//                     <div>
//                     <h2 className="text-center mb-4">Create Folder</h2>
//                     <Form >
              
//                     <div>{this.props.folderid}</div>

//                         <Form.Group className="mb-3">
//                             <Form.Control 
//                                 type="text"
//                                 className="form-control"
//                                 id="folderName"
//                                 required
//                                 onChange={this.onChangefolderName}
//                                 value={this.state.folderName}
//                                 placeholder="Create Folder"
//                                 name="owner"/>
//                         </Form.Group>
        
//                         <Button onClick={this.saveFolder} variant="contained" color="primary" className="w-100">
//                             Create
//                         </Button>
//                     </Form>
//                 </div>
//                 )}
//             </div>
//         );
      
//     }
// }
 

import React, { useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { Button } from '@material-ui/core'
import { projectFirestore } from '../../../firebase';
import { useParams } from 'react-router-dom'

export default function AddFolder() {

    const {teamID} = useParams()
    const foldername = useRef()

    function saveData(){
        console.log('yawa');
        console.log(foldername.current.value)
        projectFirestore.collection('PROJECT').doc(teamID).collection('FOLDERS').add({name:foldername.current.value});
        // window.location.reload(false);
        
    console.log(teamID)
    console.log(foldername.current.value)
    };


    return (
        <div className="submit-form"> 
           <h2 className="text-center mb-4">Create your Project</h2>
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
                                              placeholder="Project Name"
                                              name="owner"/>
                                      </Form.Group>
                      
                                      <Button onClick={saveData} variant="contained" color="primary" className="w-100">
                                          Create
                                      </Button>
                                  </Form>
        </div>
    )
}
