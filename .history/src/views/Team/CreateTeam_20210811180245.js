import React, { useState } from 'react'
import { Button, Form, Card } from 'react-bootstrap'

export default function CreateTeam() {
    const initialFieldValues = {
        name: 'Test',
        contactEmail: 'Email',
        owner: ''
    }

    var [values, setValues] = useState(initialFieldValues)

    return (
        <>
                    <h2 className="text-center mb-4">Create your team</h2>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Control type="text" placeholder="Team account name" value={values.name} />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control type="email" placeholder="Contact Email" value={values.email}/>
                        </Form.Group>
                        
                        <Button variant="primary" className="w-100" type="submit">
                            Submit
                        </Button>
                    </Form>
        </>
    )
}
