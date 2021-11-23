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
import BreadCrumb from '../components/BreadCrumb'
import TopNav from '../Navigation/TopNav'

export default function Dashboard() {


    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const [teamsObjects, setTeamsObjects] = useState(0)
    var [currentId, setCurrentId] = useState("")

    localStorage.setItem("currentUserEmail", currentUser.email);

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
            window.localStorage.clear();
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
            email: currentUser.email
        }
        console.log(member)
        console.log(currentUser)
        projectMembersService.create(member)
    }

      localStorage.clear();

  


    return (
        <>
            <TopNav></TopNav>
            <Container>
                <TeamList />
            </Container>
        </>
    )
}

