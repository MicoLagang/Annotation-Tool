import React, { useState, useEffect } from 'react'
import { Col, Container, Nav, Navbar, NavDropdown, Row, Card } from 'react-bootstrap'
import TeamList from '../Team/TeamList'
import { useAuth } from '../../logic/context/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import CreateTeam from '../Team/CreateTeam'
import firebaseDb from '../../firebase'
import Swal from "sweetalert2";  
import projectMembersService from '../../services/projectMembers.service'
import { projectFirestore } from '../../firebase'
import Member from '../AddMembers/Member'

export default function Dashboard() {

    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const [teamsObjects, setTeamsObjects] = useState(0)
    var [currentId, setCurrentId] = useState("")

    // const [projectID, setProjectID] = useState("");

    // useEffect(() => {
    //     firebaseDb.ref('teams').on('value', snapshot => {
    //         if (snapshot.val() != null)
    //             setTeamsObjects({
    //                 ...snapshot.val()
    //             })
    //     })
    // }, [])






    const createTeam = {
        backgroundColor: "#272343",
      };

      const alert = {
        // backgroundColor: "#272343",
        color : "red",
      };



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

    // const member = {
    //     role : "member"  ,
    //     uid  : currentUser.uid,
    //     TeamCode: "",
    //     TeamProjectID: "",
    // }

    // projectFirestore.collection("PROJECTMEMBERS").where("Status", "==","true")
    // .get().then((props) => {

    //     props.forEach((doc) => {
            

    //     });
        
    // })
    // .catch((error) => {
    //     console.log("Error getting documents: ", error);
    // });   





    function a(value,UID,teamName){

        const member = {
            role : "member"  ,
            uid  : currentUser.uid,
            TeamCode: value,
            projectID: UID,
            TeamName: teamName,
            Status: "false",
        }
        console.log(member)

        projectMembersService.create(member)
    }





 

      function JoinTeam(){


        Swal.fire({  
            title: 'Join Team',
            input: 'text',
            inputPlaceholder: 'Enter Team Code',
            confirmButtonText: `JOIN`, 
        }).then((result) => {  
            /* Read more about isConfirmed, isDenied below */  
            if (result.isConfirmed) {    

                
                projectFirestore.collection("PROJECT").where("TeamCode", "==",result.value)
                .get().then((props) => {
            
                    props.forEach((doc) => {
            
                        a(result.value,doc.id,doc.data().name)

                    });
                    
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });    

                // a.member.TeamCode = result.value;

                // a(result.value)      
        
                // console.log(member.TeamProjectID)   
                Swal.fire('Success!', '', 'success')  
            } 
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
                            <Nav.Link href={`myTeam/${currentUser.uid}`}>My Team</Nav.Link>
                        </Nav>
                        <Nav>
                        <Nav.Link></Nav.Link>
                        <Nav.Link 
                        // onClick={JoinTeam} 
                        id="collasible-nav">

                        {/* <img
            alt="logo"
            src="https://www.kindpng.com/picc/m/169-1699400_svg-png-icon-free-android-notification-icon-png.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          /> */}    
          NOTIF
                            <a style={alert}></a>
                            
                        </Nav.Link>
                            <NavDropdown title={currentUser.email} id="collasible-nav-dropdown">
                                
                                <NavDropdown.Item href="/update-profile">Profile</NavDropdown.Item>
                                <NavDropdown.Item href="/teams">My Teams</NavDropdown.Item>
                                <NavDropdown.Item onClick={JoinTeam}>Join Project</NavDropdown.Item>                     
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
                        {/* <Col>
                        <Row>
                            <Col><TeamList></TeamList></Col>
                            <Col><Link to="/new">New</Link></Col>
                        </Row>
                        {
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
                            }
                    </Col> */}
                        <Col xs={10}>
                            {/* <CreateTeam {...({ addOrEdit, currentId, teamsObjects })} /> */}
                            <TeamList />
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

