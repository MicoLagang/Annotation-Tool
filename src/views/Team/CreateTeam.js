import React, { Component,useState } from 'react'
import { Form } from 'react-bootstrap'
import { Button } from '@material-ui/core'
import teamService from '../../../src/services/team.service';
import projectMembersService from '../../../src/services/projectMembers.service';
import { Link } from 'react-router-dom'
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import { useAuth } from '../../logic/context/AuthContext';
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { projectFirestore } from '../../firebase';

export default class CreateTeam extends Component {

 
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeContactEmail = this.onChangeContactEmail.bind(this);
        this.onChangeOwner = this.onChangeOwner.bind(this);
        this.saveTeam = this.saveTeam.bind(this);
        this.createTeam = this.createTeam.bind(this);
        this.status = this.statusChange.bind(this);
        this.key = this.keyChange.bind(this)

        this.teamID = this.setTeamID.bind(this)

        var randomstring = require("random-key");
        this.state = {
            name: '',
            contactEmail: '',
            owner: '',
            status: '',
            key: randomstring.generate(7),
            submitted: false,
            teamID:'',
        };

    

       
    }

    componentDidMount(props) {
        const id = props.UserID;

    }

    setTeamID(e){
        this.setState({
            key: e.target.value
        })
    }

    keyChange(e){
        this.setState({
            key: e.target.value
        })
    }

    statusChange(e){
        this.setState({
            status: e.target.value
        })
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

    componentDidMount() {
        const options = {
            headers: {
                'Authorization': localStorage.getItem('api_key'),
                'content-type': 'application/json'
            }
        };
        axios.get(`urlLink/${this.props.match.params.UserID}` , options)
            .then((response) => {
                console.log(response);
            });
    }
    

    saveTeam() {

        // const { currentUser, logout } = useAuth();

        

        const data = {
            name: this.state.name,
            contactEmail: this.state.contactEmail,
            owner: this.state.owner,
            status: this.state.status,
            TeamCode: this.state.key,
        };
    

        const member = {
            role : "admin"  ,
            uid  : this.props.match.params.UserID,
            TeamCode: this.state.key,
            projectID : "",
            TeamName:this.state.name,
            Status: "true",
        }


        teamService.create(data)
          .then((res) => {
            
            member.projectID = res.id
            
            console.log("Created new item successfully!");

            projectMembersService.create(member)
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
                    {/* <button className="btn btn-success w-100" href="/" onClick={this.createTeam}>
                      Back
                    </button> */}
                    <Link to="/">Back</Link>
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


                        <Form.Group className="mb-3">
                            <Form.Control 
                                type="hidden"
                                className="form-control"
                                id="owner"
                                required
                                onChange={this.keyChange}
                                value={this.state.key}
                                placeholder="Organization or Owner"
                                name="owner"/>
                        </Form.Group>

                        
                        <div className="form-row">
                                <div className="form-group col-md-5">
                                
                                    <select className="form-control"  onChange={this.status} >
                                        {/* <option selected>Status</option> */}
                                        <option value="Private">Private</option>
                                        <option value="Public">Public</option>
                                    </select>
                                </div>
                            </div>

                        <br></br>
                        
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
 