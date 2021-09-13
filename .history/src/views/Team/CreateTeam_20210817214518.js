import React, { Component } from 'react'
import { Button, Form } from 'react-bootstrap'
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
        let data = {
            name: this.state.name,
            contactEmail: this.state.contactEmail,
            owner: this.state.owner
        };
    
        teamService.create(data)
          .then(() => {
            console.log("Created new item successfully!");
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
        });
    }

    render() {
        return (
            <div className="submit-form">
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
                        
                        <Button onClick={this.saveTeam} variant="primary" className="w-100" type="submit">
                            Create
                        </Button>
                    </Form>
                </div>
            </div>
        );
      
    }
}
 