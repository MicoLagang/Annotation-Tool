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
        projectFirestore.collection("PROJECTMEMBERS").collection("APPLE")
        // projectFirestore.doc(`PROJECTMEMBERS/${"SOyTv4lWcyBBJCxksqlN"}`).collection("APPLE")
        console.log("apple")
    }

    return (
        <>

            <div className="w-100 text-center mt-2">
                {/* <Link to="/">Cancel</Link> */}
                <button onClick={handleSubmit}>update</button>
            </div>
        </>
    )
}
