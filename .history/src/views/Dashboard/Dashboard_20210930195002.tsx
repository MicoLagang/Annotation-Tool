import React, { useState, useEffect } from 'react'
import { Col, Container, Nav, Navbar, NavDropdown, Row, Card } from 'react-bootstrap'
import TeamList from '../Team/TeamList'
import { useAuth } from '../../logic/context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import CreateTeam from '../Team/CreateTeam'
import firebaseDb from '../../firebase'
import Swal from "sweetalert2";  

export default function Dashboard() {
    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

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

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.pushState('/login')
        } catch (error) {
            // setError(error.message)
        }
    }

    const createTeam = {
        backgroundColor: "#272343",
      };

      function JoinTeam(){
        Swal.fire({  
            title: 'Join Team',
            input: 'text',
            inputPlaceholder: 'Enter Team Code'
          });
      }

    return (
        <>
            <Navbar collapseOnSelect expand="xl" style={createTeam} variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Ilabel</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/tool">Tool</Nav.Link>
                            <Nav.Link href="/gallery">Gallery</Nav.Link>
                        </Nav>
                        <Nav>
                            <NavDropdown title={currentUser.email} id="collasible-nav-dropdown">
                                <NavDropdown.Item href="/update-profile">Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/teams">My Teams</NavDropdown.Item>
                                <NavDropdown.Item onClick={JoinTeam}>Join Project</NavDropdown.Item>
                                {/* <NavDropdown.Item href="/teams">Join Project</NavDropdown.Item> */}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>
                <Container>
                    <Row>
                        
                        <Col xs={10}>
                            <TeamList></TeamList>
                        </Col>
                        
                    </Row>
                </Container>
            </div>
        </>
    )
}

