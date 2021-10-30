import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from '../../logic/context/AuthContext'
import { Link, useHistory,useParams } from "react-router-dom"
import { projectFirestore } from '../../firebase'

export default function AddMember() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updatePassword, updateEmail }  = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()



    const{UserID} = useParams()


    function handleSubmit(e){
        // projectFirestore.collection("PROJECTMEMBERS").collection("APPLE")
        // projectFirestore.doc(`PROJECTMEMBERS/${"SOyTv4lWcyBBJCxksqlN"}`).collection("APPLE")
        // projectFirestore.collection("PROJECTMEMBERS").doc("ZCEyhEpWEilvOg5sdXpl").update({
        //     Status: "a",
  
        // })

        console.log("update naka maka join na")

 
    }

    return (
        <>
                    <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit()}>
                        <Form.Group id="email" className="mb-3">
                            <Form.Control type="email" ref={emailRef} defaultValue={UserID} readOnly />
                        </Form.Group>
       
                        <div className="form-row">
                                <div className="form-group col-md-12" >
                                
                                    <select className="form-control" >
                                        <option selected>Status</option>
                                        <option value="true">Accept</option>
                                        <option value="false">Reject</option>
                                    </select>
                                </div>
                            </div>

                        <br></br>
                        <div className="form-row">
                                <div className="form-group col-md-12">
                                
                                    <select className="form-control" >
                                        <option selected>Role</option>
                                        <option value="Private">Annotator</option>
                                        <option value="Public">Collaborator</option>
                                        <option value="Public">Validator</option>
                                    </select>
                                </div>
                            </div>

                        <br></br>
                        <Button disabled={loading}  className="w-100" type="submit">Update</Button>
                    </Form>
                </Card.Body>
            </Card>
        {/* <button onClick={handleSubmit}>asd</button> */}

        {/* <form>
            <button onClick={handleSubmit}>submit</button>
        </form> */}

            <div className="w-100 text-center mt-2">
                {/* <Link to="/">Cancel</Link> */}
                
            </div>
        </>
    )
}
