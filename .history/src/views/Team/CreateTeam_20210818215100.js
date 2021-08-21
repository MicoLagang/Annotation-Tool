import React, { Component } from 'react'
import { Form } from 'react-bootstrap'
import { Button } from '@material-ui/core'
import teamService from '../../services/team.service';

export default class CreateTeam extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeContactEmail = this.onChangeContactEmail.bind(this);
        this.onChangeOwner = this.onChangeOwner.bind(this);
        this.saveTeam = this.saveTeam.bind(this);
        this.createTeam = this.createTeam.bind(this);

        this.state = {
            name: '',
            contactEmail: '',
            owner: '',
            submitted: false,
        };
    }

    onChangeName(e) {
        this.setState({
            name: e.target.value,
        });
    }

    onChangeContactEmail(e) {
        this.setState({
            contactEmail: e.target.value,
        });
    }

    onChangeOwner(e) {
        this.setState({
            owner: e.target.value,
        });
    }

    saveTeam() {
        const data = {
            name: this.state.name,
            contactEmail: this.state.contactEmail,
            owner: this.state.owner
        };
    
        teamService.create(data)
          .then(() => {
            console.log("Created new item successfully!");
            this.setState({
                submitted: true,
            });
          })
          .catch((e) => {
            console.log(e);
          });
    }
    
    createTeam() {
        this.setState({
            name: '',
            contactEmail: '',
            owner: '',
            submitted: false,
        });
    }

    render() {
        return (
            <div className="submit-form">
                {this.state.submitted ? (
                    <div>
                    <h4 className="text-center mb-4">You submitted successfully!</h4>
                    <button className="btn btn-success w-100" onClick={this.createTeam}>
                      Add
                    </button>
                  </div>
                ) : (
                    <div>
                    <h2 className="text-center mb-4">Create your team</h2>
                    <Form >
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                onChange={this.onChangeName}
                                value={this.state.name}
                                placeholder="Team account name"
                                name="name"/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="email"
                                className="form-control"
                                id="contactEmail"
                                required
                                onChange={this.onChangeContactEmail}
                                value={this.state.contactEmail}
                                placeholder="Contact Email"
                                name="contactEmail"/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="text"
                                className="form-control"
                                id="owner"
                                required
                                onChange={this.onChangeOwner}
                                value={this.state.owner}
                                placeholder="Organization or Owner"
                                name="owner"/>
                        </Form.Group>
                        
                        <Button onClick={this.saveTeam} variant="contained" color="primary" className="w-100">
                            Create
                        </Button>
                    </Form>
                </div>
                )}
            </div>
        );
      
    }
}
 