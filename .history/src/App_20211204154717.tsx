
import React from 'react';
import './App.scss';
import "bootstrap/dist/css/bootstrap.min.css";
import { ProjectType } from "./data/enums/ProjectType";
import { AppState } from "./store";
import { connect } from "react-redux";
import { ISize } from "./interfaces/ISize";
import SignUp from './views/Authentication/SignUp';
import LogIn from './views/Authentication/LogIn';
import ForgotPassword from './views/Authentication/ForgotPassword';
import UpdateProfile from './views/Profile/UpdateProfile';
import { Container } from 'react-bootstrap'
import { AuthProvider } from './logic/context/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './views/PrivateRoutes/PrivateRoute'
import Dashboard from './views/Dashboard/Dashboard';
import CreateTeam from './views/Team/CreateTeam';
import Tool from './views/Tool/Tool';
import Team from './views/Team/Team';
import Project from './views/Project/Project';
import Gallery from '../src/views/Gallery/gallery'
import FolderImages from './views/Gallery/comps/FolderImages';

import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import Themes from "./themes";
import { UserProvider } from "./context/UserContext";

import AddFolder from './views/Gallery/comps/AddFolder';
import AddFolderpic from "./views/Gallery/comps/AddFolderpic"
import UploadImagesGallery from './views/Gallery/UploadImagesGallery'

import myTeam from './views/myTeam/myTeam'
import myProject from './views/myProject/myProject'
import TeamMembers from './views/Team/TeamMembers';
import AddMember from './views/Team/AddMember';
import { ImageProvider } from './logic/context/imageContext';
import AddImageForm from './views/Gallery/comps/AddImageForm';
import ArchiveTeam from './views/Team/ArchiveTeam';
import TeamSettings from './views/Gallery/comps/TeamSettings';

interface IProps {
    projectType: ProjectType;
    windowSize: ISize;
    ObjectDetectorLoaded: boolean;
    PoseDetectionLoaded: boolean;
}

const App: React.FC<IProps> = ({ projectType, windowSize, ObjectDetectorLoaded, PoseDetectionLoaded }) => {


    return (
        <UserProvider>
            <ThemeProvider theme={Themes.default}>
                <CssBaseline />
                <Router>
                    <AuthProvider>
                        <ImageProvider>
                            <Switch>

                                <PrivateRoute exact path="/" component={Dashboard} />
                                <PrivateRoute exact path="/new" component={CreateTeam} />
                                <PrivateRoute exact path="/tool" component={Tool} />
                                <PrivateRoute exact path="/archive" component={ArchiveTeam} />
                                <PrivateRoute exact path="/project" component={Project} />
                                <PrivateRoute exact path="/update-profile" component={UpdateProfile} />
                                <PrivateRoute exact path="/UploadImage" component={AddImageForm} />
                                <PrivateRoute exact path="/myProject" component={myProject} />
                                <PrivateRoute exact path="/myTeam" component={myTeam} />
                                <PrivateRoute exact path="/Addfolder" component={AddFolder} />
                                <PrivateRoute exact path="/myTeam/gallery" component={Gallery} />
                                <PrivateRoute exact path="/myTeam/gallery/teamMembers" component={TeamMembers} />
                                <PrivateRoute exact path="/myTeam/gallery/folder" component={FolderImages} />
                                <PrivateRoute exact path="/myTeam/gallery/folder/teamMembers" component={TeamMembers} />
                                <PrivateRoute exact path="/myTeam/gallery/settings" component={TeamSettings} />
                                <PrivateRoute exact path="/myTeam/gallery/folder/imagesfolder" component={UploadImagesGallery} />
                                <PrivateRoute exact path="/myTeam/gallery/folder/imagesfolder/galleryimagesfolder" component={UploadImagesGallery} />
                                <PrivateRoute exact path="/team/:name" component={Team} />

                                <Container className="mt-5 d-flex justify-content-center" style={{ minHeight: "100vh" }}>
                                    <div className="w-100" style={{ maxWidth: '400px' }}>
                                        <PrivateRoute path="/addMember/:UserID" component={AddMember} />
                                        <PrivateRoute exact path="/createimagesfolder" component={AddFolderpic} />

                                        <Route path="/signup" component={SignUp} />
                                        <Route path="/login" component={LogIn} />
                                        <Route path="/forgot-password" component={ForgotPassword} />
                                    </div>
                                </Container>

                            </Switch>
                        </ImageProvider>
                    </AuthProvider>
                </Router>
            </ThemeProvider>
        </UserProvider>
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
