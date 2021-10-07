import React, { useState } from 'react'
import {
    Button,
    Form, 
    FormGroup,
    FormControl,
    FormLabel,
    FormCheck
} from 'react-bootstrap'

export default function CreateTeam() {
    const initialFieldValues = {
        name: '',
        contactEmail: '',
        owner: ''
    }

    var [values, setValues] = useState(initialFieldValues)

    return (
        <div>
            <h1>Create your team</h1>
            <Form>
                <FormGroup className="mb-3" controlId="formBasicEmail">
                    <FormLabel>Email address</FormLabel>
                    <FormControl type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </FormGroup>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" />
                </Form.Group>

                <FormGroup className="mb-3" controlId="formBasicCheckbox">
                    <FormCheck type="checkbox" label="Check me out" />
                </FormGroup>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}
