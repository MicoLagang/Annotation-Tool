import React, { useState, useRef } from 'react'
import { Button, Form, Card } from 'react-bootstrap'
import {firebase} from '../../firebase'

export default function CreateTeam() {
    const [title, setTitle] = useState('');

  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };
  const createTodo = () => {
    const todoRef = firebase.database().ref('Todo');
    const todo = {
      title,
      complete: false,
    };

    todoRef.push(todo);
  };
  return (
    <div>
      <input type="text" onChange={handleOnChange} value={title} />
      <button onClick={createTodo}>Add Todo</button>
    </div>
  );
    // const nameRef = useRef()
    // const contactEmailRef = useRef()
    // const [error, setError] = useState('')
    // const [loading, setLoading] = useState(false)

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     const teamRef = firebase.database().ref('Team');
    //     const teamDetails = {
    //         name: nameRef.current.value,
    //         contactEmail: contactEmailRef.current.value
    //     }
    //     teamRef.push(teamDetails)
    // }

    // return (
    //     <>
    //         <h2 className="text-center mb-4">Create your team</h2>
    //         <Form onSubmit={handleSubmit}>
    //             <Form.Group className="mb-3">
    //                 <Form.Control type="text" placeholder="Team account name" ref={nameRef} />
    //             </Form.Group>

    //             <Form.Group className="mb-3">
    //                 <Form.Control type="email" placeholder="Contact Email" ref={contactEmailRef}/>
    //             </Form.Group>
                
    //             <Button variant="primary" className="w-100" type="submit">
    //                 Submit
    //             </Button>
    //         </Form>
    //     </>
    // )
}




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
    //     e.preventDefault();

    // }