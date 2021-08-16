import React, { Component } from "react";
import teamService from '../../services/team.service';

export default class Team extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeContactEmail = this.onChangeContactEmail.bind(this);
    this.updateOwner = this.updateOwner.bind(this);
    this.updateTeam = this.updateTutorial.bind(this);
    this.deleteTeam = this.deleteTutorial.bind(this);

    this.state = {
      currentTeam: {
        key: null,
        name: '',
        contactEmail: '',
        owner: '',
      },
      message: "",
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { team } = nextProps;
    if (prevState.currentTeam.key !== team.key) {
      return {
        currentTeam: team,
        message: ""
      };
    }

    return prevState.currentTeam;
  }

  componentDidMount() {
    this.setState({
        currentTeam: this.props.tutorial,
    });
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function (prevState) {
      return {
        currentTeam: {
          ...prevState.currentTeam,
          name: name,
        },
      };
    });
  }

  onChangeContactEmail(e) {
    const contactEmail = e.target.value;

    this.setState((prevState) => ({
      currentTeam: {
        ...prevState.currentTeam,
        contactEmail: contactEmail,
      },
    }));
  }

  updateOwner(status) {
    teamService.update(this.state.currentTeam.key, {
      owner: status,
    })
      .then(() => {
        this.setState((prevState) => ({
          currentTeam: {
            ...prevState.currentTeam,
            owner: status,
          },
          message: "The status was updated successfully!",
        }));
      })
      .catch((e) => {
        console.log(e);
      });
  }

  updateTutorial() {
    const data = {
        name: this.state.currentTeam.name,
        contactEmail: this.state.currentTeam.contactEmail,
    };

    teamService.update(this.state.currentTeam.key, data)
      .then(() => {
        this.setState({
          message: "The tutorial was updated successfully!",
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  deleteTutorial() {
    teamService.delete(this.state.currentTeam.key)
      .then(() => {
        this.props.refreshList();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const { currentTeam } = this.state;

    return (
      <div>
        <h4>Tutorial</h4>
        {currentTeam ? (
          <div className="edit-form">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={currentTeam.name}
                  onChange={this.onChangeName}
                />
              </div>
              <div className="form-group">
                <label htmlFor="contactEmail">Contact Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="contactEmail"
                  value={currentTeam.contactEmail}
                  onChange={this.onChangeContactEmail}
                />
              </div>

              <div className="form-group">
                <label htmlFor="owner">Owner</label>
                <input
                  type="text"
                  className="form-control"
                  id="owner"
                  value={currentTeam.owner}
                  onChange={this.onChangeOwner}
                />
              </div>
            </form>

            {/* {currentTeam.published ? (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(false)}
              >
                UnPublish
              </button>
            ) : (
              <button
                className="badge badge-primary mr-2"
                onClick={() => this.updatePublished(true)}
              >
                Publish
              </button>
            )} */}

            <button
              className="badge badge-danger mr-2"
              onClick={this.deleteTeam}
            >
              Delete
            </button>

            <button
              type="submit"
              className="badge badge-success"
              onClick={this.updateTeam}
            >
              Update
            </button>
            <p>{this.state.message}</p>
          </div>
        ) : (
          <div>
            <br />
            <p>Please click on a Tutorial...</p>
          </div>
        )}
      </div>
    );
  }
}