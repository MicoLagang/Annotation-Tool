import React, { useState } from 'react';
import './App.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Container, Nav, Navbar, NavDropdown, Row, Card } from 'react-bootstrap'
import EditorView from "./views/EditorView/EditorView";
import MainView from "./views/MainView/MainView";
import { ProjectType } from "./data/enums/ProjectType";
import { AppState } from "./store";
import { connect } from "react-redux";
import PopupView from "./views/PopupView/PopupView";
import MobileMainView from "./views/MobileMainView/MobileMainView";
import { ISize } from "./interfaces/ISize";
import { Settings } from "./settings/Settings";
import { SizeItUpView } from "./views/SizeItUpView/SizeItUpView";
import { PlatformModel } from "./staticModels/PlatformModel";
import classNames from "classnames";
import SignUp from './views/Authentication/SignUp';
import LogIn from './views/Authentication/LogIn';
import ForgotPassword from './views/Authentication/ForgotPassword';
import UpdateProfile from './views/Profile/UpdateProfile';
import { AuthProvider, useAuth } from './logic/context/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './views/PrivateRoutes/PrivateRoute'
import Dashboard from './views/Dashboard/Dashboard';
import CreateTeam from './views/Team/CreateTeam';
import Tool from './views/Tool/Tool';
import TeamList from './views/Team/TeamList';
import { Link, useHistory } from 'react-router-dom'


interface IProps {
    projectType: ProjectType;
    windowSize: ISize;
    ObjectDetectorLoaded: boolean;
    PoseDetectionLoaded: boolean;
}

const App: React.FC<IProps> = ({ projectType, windowSize, ObjectDetectorLoaded, PoseDetectionLoaded }) => {


    const [error, setError] = useState('')
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError('')

        try {
            await logout()
            history.pushState('/login')
        } catch (error) {
            setError(error.message)
        }
    }

    const selectRoute = () => {
        if (!!PlatformModel.mobileDeviceData.manufacturer && !!PlatformModel.mobileDeviceData.os)
            return <MobileMainView />;
        if (!projectType)
            return <MainView />;
        else {
            if (windowSize.height < Settings.EDITOR_MIN_HEIGHT || windowSize.width < Settings.EDITOR_MIN_WIDTH) {
                return <SizeItUpView />;
            } else {
                return <EditorView />;
            }
        }
    };

    return (
        <Router>
            <AuthProvider>
                <Switch>

                    <Container className="mt-5 d-flex justify-content-center" style={{ minHeight: "100vh" }}>
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                            <PrivateRoute path="/update-profile" component={UpdateProfile} />
                            <Route path="/signup" component={SignUp} />
                            <Route path="/login" component={LogIn} />
                            <Route path="/forgot-password" component={ForgotPassword} />
                        </div>
                    </Container>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Container>
                            <Navbar.Brand href="#home">Ilabel</Navbar.Brand>
                            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                            <Navbar.Collapse id="responsive-navbar-nav">
                                <Nav className="me-auto">
                                    <Nav.Link href="/tool">Tool</Nav.Link>
                                </Nav>
                                <Nav>
                                    <NavDropdown title={currentUser.email} id="collasible-nav-dropdown">
                                        <NavDropdown.Item href="/update-profile">Profile</NavDropdown.Item>
                                        <NavDropdown.Item href="/teams">My Teams</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    <PrivateRoute exact path="/" component={Dashboard} />
                    <PrivateRoute exact path="/tool" component={Tool} />
                    <PrivateRoute exact path="/teams" component={TeamList} />
                    <PrivateRoute exact path="/new" component={CreateTeam} />
                </Switch>
            </AuthProvider>
        </Router>
    );
};

const mapStateToProps = (state: AppState) => ({
    projectType: state.general.projectData.type,
    windowSize: state.general.windowSize,
    ObjectDetectorLoaded: state.ai.isObjectDetectorLoaded,
    PoseDetectionLoaded: state.ai.isPoseDetectorLoaded
});

export default connect(
    mapStateToProps
)(App);
