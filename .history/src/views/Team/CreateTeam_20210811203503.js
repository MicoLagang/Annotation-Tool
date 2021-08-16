import React, { useState, useRef } from 'react'
import { Button, Form, Card } from 'react-bootstrap'

export default function CreateTeam() {
    const initialFieldValues = {
        name: '',
        contactEmail: '',
        owner: ''
    }

    var [values, setValues] = useState(initialFieldValues)

    const handleInputChange = e => {
        var {name, value} = e.target
        setValues({
            ...values,
            [name]: value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();

    }

    return (
        <>
            <h2 className="text-center mb-4">Create your team</h2>
            <Form onSubmit="handleSubmit">
                <Form.Group className="mb-3">
                    <Form.Control type="text" placeholder="Team account name" name="name"
                        value={values.name} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Control type="email" placeholder="Contact Email" name="contactEmail"
                    value={values.contactEmail}
                    onChange={handleInputChange}/>
                </Form.Group>
                
                <Button variant="primary" className="w-100" type="submit">
                    Submit
                </Button>
            </Form>
        </>
    )
}
