import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import TeamList from '../Team/TeamList'

export default function Dashboard() {
    return (
        <Container>
            <Row>
                <Col><TeamList></TeamList></Col>
                <Col xs={8}>Contents Here</Col>
            </Row>
        </Container>
    )
}

