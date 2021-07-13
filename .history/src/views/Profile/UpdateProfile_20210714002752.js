import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from '../../logic/context/AuthContext'
import { Link, useHistory } from "react-router-dom"

export default function UpdateProfile() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser }  = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        try {
            setError('')
            setLoading(true)
            // await signup(emailRef.current.value, passwordRef.current.value)
            history.push("/")
        } catch (error) {
            setError(error.message)
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Update Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email" className="mb-3">
                            <Form.Control type="email" ref={emailRef} defaultValue={currentUser.email} required />
                        </Form.Group>
                        <Form.Group id="password" className="mb-3">
                            <Form.Control placeholder="Leave blank to keep the same" type="password" ref={passwordRef}/>
                        </Form.Group>
                        <Form.Group id="password-confirm" className="mb-4">
                            <Form.Control placeholder="Leave blank to keep the same" type="password" ref={passwordConfirmRef}/>
                        </Form.Group>
                        <Button disabled={loading} className="w-100" type="submit">Update</Button>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Link to="/">Cancel</Link>
            </div>
        </>
    )
}
