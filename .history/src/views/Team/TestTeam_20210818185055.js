import React from 'react'
import { useParams } from 'react-router-dom'

export default function TestTeam() {
    const { name } = useParams()
    return (
        <div>
            <h2>Team { name }</h2>
        </div>
    )
}
