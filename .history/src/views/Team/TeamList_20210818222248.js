import React, { Component } from 'react'
import teamService from '../../services/team.service';
import { Link } from 'react-router-dom'

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
          <div className="row">
            <div className="col">
              <h4>Teams List</h4>
            </div>
            <div className="col">
              <Link to="/new">New</Link>
            </div>
          </div>

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
                  {team.name}
                </li>
              ))
            }
          </ul>
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
              <p>No team to display</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}




{/* <Link to={`/team/${team.key}`}>
                  <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveTeam(team, index)}
                  key={index}
                >
                  {team.name}
                </li>
                </Link> */}