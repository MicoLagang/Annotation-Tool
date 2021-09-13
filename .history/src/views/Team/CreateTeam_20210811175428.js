import React, { useState } from 'react'
import { Button, Form } from 'react-bootstrap'

export default function CreateTeam() {
    const initialFieldValues = {
        name: '',
        contactEmail: '',
        owner: ''
    }

    var [values, setValues] = useState(initialFieldValues)

    return (
        <>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Create your team</h2>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Team account name</Form.Label>
                            <Form.Control type="text" placeholder="Team account name" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contact Email</Form.Label>
                            <Form.Control type="email" placeholder="Contact Email" />
                        </Form.Group>
                        
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}
