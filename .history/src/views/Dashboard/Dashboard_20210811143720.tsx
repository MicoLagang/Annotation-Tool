import React from 'react'
import TeamList from '../Team/TeamList'

export default function Dashboard() {
    return (
        <div className="row">
            <div className="col-md-4">
                <TeamList></TeamList>
            </div>
            <div className="col-md-12">
                Contents Here
            </div>
        </div>
    )
}

