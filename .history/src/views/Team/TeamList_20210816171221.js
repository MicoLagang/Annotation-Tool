import React, { Component } from 'react'
import teamService from '../../services/team.service';

import Team from './Team';

export default class TeamList extends Component {
    constructor(props) {
        super(props);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveTeam = this.setActiveTeam.bind(this);
        this.removeAllTeams = this.removeAllTeams.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
    
        this.state = {
          teams: [],
          currentTeam: null,
          currentIndex: -1,
        };
    }

    componentDidMount() {
        teamService.getAll().on("value", this.onDataChange);
    }
    
    componentWillUnmount() {
        teamService.getAll().off("value", this.onDataChange);
    }
    
    onDataChange(items) {
        let teams = [];
    
        items.forEach((item) => {
          let key = item.key;
          let data = item.val();
          console.log(data)
          teams.push({
            key: key,
            name: data.name,
            contactEmail: data.contactEmail,
            owner: data.owner
          });
        });
    
        this.setState({
            teams: teams,
        });
    }
    
    refreshList() {
        this.setState({
          currentTeam: null,
          currentIndex: -1,
        });
    }
    
    setActiveTeam(team, index) {
        this.setState({
          currentTeam: team,
          currentIndex: index,
        });
    }
    
    removeAllTeams() {
        teamService.deleteAll()
          .then(() => {
            this.refreshList();
          })
          .catch((e) => {
            console.log(e);
          });
    }
    
    render() {
        const { teams, currentTeam, currentIndex } = this.state;
    
        return (
          <div className="list row">
            <div className="col-md-6">
              <h4>Teams List</h4>
    
              <ul className="list-group">
                {teams &&
                  teams.map((team, index) => (
                    <li
                      className={
                        "list-group-item " +
                        (index === currentIndex ? "active" : "")
                      }
                      onClick={() => this.setActiveTeam(team, index)}
                      key={index}
                    >
                      {team.title}
                    </li>
                  ))}
              </ul>
    
              <button
                className="m-3 btn btn-sm btn-danger"
                onClick={this.removeAllTeams}
              >
                Remove All
              </button>
            </div>
            <div className="col-md-6">
              {currentTeam ? (
                <Team
                  team={currentTeam}
                  refreshList={this.refreshList}
                />
              ) : (
                <div>
                  <br />
                  <p>Please click on a Tutorial...</p>
                </div>
              )}
            </div>
          </div>
        );
      }
}
