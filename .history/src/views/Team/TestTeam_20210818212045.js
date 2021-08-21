import React from 'react'
import { useParams } from 'react-router-dom'
import teamService from '../../services/team.service'

export default function TestTeam() {
    const { id } = useParams()
    const { data: team, error, isPending } = useFetch(teamService.getOnce().on("value", this.onDataChange))

    return (
        <div>
            {/* <h2>Team { team.name }</h2> */}
            { team }
        </div>
    )
}
