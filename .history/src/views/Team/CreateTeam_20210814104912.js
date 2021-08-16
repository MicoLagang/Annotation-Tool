import React, { Component } from 'react'
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
        let data = {
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
                    <h4>You submitted successfully!</h4>
                    <button className="btn btn-success" onClick={this.createTeam}>
                    Add
                    </button>
                </div>
                ) : (
                <div>
                    <h2 className="text-center mb-4">Create your team</h2>
                    <Form onSubmit={this.saveTeam}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="text"
                                className="form-control"
                                id="name"
                                required
                                value={this.state.name}
                                onChange={this.onChangeName}
                                name="name"/>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="email"
                                className="form-control"
                                id="contactEmail"
                                required
                                value={this.state.contactEmail}
                                onChange={this.onChangeContactEmail}
                                name="contactEmail"/>
                        </Form.Group>
                        
                        <Button variant="primary" className="w-100" type="submit">
                            {props.currentId==''?"Create":"Update"}
                        </Button>
                    </Form>
                </div>
                )}
            </div>
        );
      
    }
}
 