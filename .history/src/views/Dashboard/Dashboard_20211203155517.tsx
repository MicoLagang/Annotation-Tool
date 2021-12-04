import React from 'react'
import { Container } from 'react-bootstrap'
import TeamList from '../Team/TeamList'
import { useAuth } from '../../logic/context/AuthContext'
import TopNav from '../Navigation/TopNav'

export default function Dashboard() {
    const { currentUser, logout } = useAuth()

    localStorage.setItem("currentUserEmail", currentUser.email);
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

