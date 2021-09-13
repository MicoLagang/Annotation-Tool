import React, { useState, useRef } from 'react'
import { Button, Form, Card } from 'react-bootstrap'
import firebase from '../../firebase'

const CreateTeam = (props) => {
    const [name , setName] = useState();
  const [age , setAge] = useState();
      
  // Push Function
  const Push = () => {
    firebase.ref("user").set({
      name : 'name',
      age : 'age',
    }).catch(alert);
  }
  
  return (
    <div className="App" style={{marginTop : 250}}>
      <center>
      <input placeholder="Enter your name" value={name} />
      <br/><br/>
      <input placeholder="Enter your age" value={age} />
      <br/><br/> 
      <button onClick={Push}>PUSH</button>
      </center>
    </div>
  );
    // const initialFieldValues = {
    //     name: '',
    //     contactEmail: '',
    //     owner: ''
    // }

    // var [values, setValues] = useState(initialFieldValues)

    // const handleInputChange = e => {
    //     var {name, value} = e.target
    //     setValues({
    //         ...values,
    //         [name]: value
    //     })
    // }

    // const handleSubmit = e => {
    //     // e.preventDefault();
    //     // props.addOrEdit(values)
    //     firebase.database().ref('Users/').set({
    //         email: 'saefase',
    //         fname: 'asefsd',
    //         lname: 'sefase'
    //     }).then((data)=>{
    //         //success callback
    //         console.log('data ' , data)
    //     }).catch((error)=>{
    //         //error callback
    //         console.log('error ' , error)
    //     })
    // }

    // return (
    //     <>
    //         <h2 className="text-center mb-4">Create your team</h2>
    //         <Form onSubmit={handleSubmit}>
    //             <Form.Group className="mb-3">
    //                 <Form.Control type="text" placeholder="Team account name" name="name"
    //                     value={values.name} onChange={handleInputChange} />
    //             </Form.Group>

    //             <Form.Group className="mb-3">
    //                 <Form.Control type="email" placeholder="Contact Email" name="contactEmail"
    //                 value={values.contactEmail}
    //                 onChange={handleInputChange}/>
    //             </Form.Group>
                
    //             <Button variant="primary" className="w-100" type="submit">
    //                 Submit
    //             </Button>
    //         </Form>
    //     </>
    // )
}

export default CreateTeam;
