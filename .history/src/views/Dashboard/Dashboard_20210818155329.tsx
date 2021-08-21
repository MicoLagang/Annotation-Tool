import React, { useState, useEffect } from 'react'
import { Col, Container, Nav, Navbar, NavDropdown, Row, Card } from 'react-bootstrap'
import TeamList from '../Team/TeamList'
import { useAuth } from '../../logic/context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import CreateTeam from '../Team/CreateTeam'
import firebaseDb from '../../firebase'

export default function Dashboard() {
    const [teamsObjects, setTeamsObjects] = useState(0)
    var [currentId, setCurrentId] = useState("")

    useEffect(() => {
        firebaseDb.ref('teams').on('value', snapshot => {
            if (snapshot.val() != null)
                setTeamsObjects({
                    ...snapshot.val()
                })
        })
    }, [])

    const addOrEdit = obj => {
        if (currentId == '')
            firebaseDb.ref('teams').push(
                obj,
                err => {
                    if (err)
                        console.log(err)
                    else
                        setCurrentId('')
                }
            )
        else
            firebaseDb.ref(`teams/${currentId}`).set(
                obj,
                err => {
                    if (err)
                        console.log(err)
                    else
                        setCurrentId('')
                }
            )
    }

    return (
        <>
            <div>
                <Container fluid="lg">
                    <Row>
                        <Col>
                            <Row>
                                {/* <Col><TeamList></TeamList></Col> */}
                                {/* <Col><Link to="/new">New</Link></Col> */}
                            </Row>
                            {/* {
                                Object.keys(teamsObjects).map(id => {
                                    return (
                                        <Row>
                                            <Card body onClick={() => { setCurrentId(id) }}
                                            >
                                                {teamsObjects[id].name}
                                            </Card>
                                        </Row>
                                    )
                                })
                            } */}
                        </Col>
                        <Col xs={10}>
                            {/* <CreateTeam {...({ addOrEdit, currentId, teamsObjects })} /> */}
                            <TeamList></TeamList>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

