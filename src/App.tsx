// import React from 'react';
// import './App.scss';
// import "bootstrap/dist/css/bootstrap.min.css";
// import EditorView from "./views/EditorView/EditorView";
// import MainView from "./views/MainView/MainView";
// import { ProjectType } from "./data/enums/ProjectType";
// import { AppState } from "./store";
// import { connect } from "react-redux";
// import PopupView from "./views/PopupView/PopupView";
// import MobileMainView from "./views/MobileMainView/MobileMainView";
// import { ISize } from "./interfaces/ISize";
// import { Settings } from "./settings/Settings";
// import { SizeItUpView } from "./views/SizeItUpView/SizeItUpView";
// import { PlatformModel } from "./staticModels/PlatformModel";
// import classNames from "classnames";
// import SignUp from './views/Authentication/SignUp';
// import LogIn from './views/Authentication/LogIn';
// import ForgotPassword from './views/Authentication/ForgotPassword';
// import UpdateProfile from './views/Profile/UpdateProfile';
// import { Container } from 'react-bootstrap'
// import { AuthProvider } from './logic/context/AuthContext';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import PrivateRoute from './views/PrivateRoutes/PrivateRoute'
// import Dashboard from './views/Dashboard/Dashboard';
// import CreateTeam from './views/Team/CreateTeam';

import React from 'react';
import './App.scss';
import "bootstrap/dist/css/bootstrap.min.css";
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
import { Container } from 'react-bootstrap'
import { AuthProvider } from './logic/context/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import PrivateRoute from './views/PrivateRoutes/PrivateRoute'
import Dashboard from './views/Dashboard/Dashboard';
import CreateTeam from './views/Team/CreateTeam';
// import Tool from './views/Tool/Tool';
// import TestTeam from './views/Team/TestTeam';
import Team from './views/Team/Team';
import Project from './views/Project/Project';
import Gallery from '../src/views/Gallery/gallery'
// import FolderImages from './views/Gallery/comps/FolderImages';

import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import Themes from "./themes";
import * as serviceWorker from "./serviceWorker";
import { LayoutProvider } from "./context/LayoutContext";
import { UserProvider } from "./context/UserContext";

import Header from "./views/components/Header/Header"
import Layout from './views/components/Layout/Layout';


interface IProps {
    projectType: ProjectType;
    windowSize: ISize;
    ObjectDetectorLoaded: boolean;
    PoseDetectionLoaded: boolean;
}

const App: React.FC<IProps> = ({ projectType, windowSize, ObjectDetectorLoaded, PoseDetectionLoaded }) => {


    return (
        // <Router>
        //     <AuthProvider>
        //         <Switch>
        //             <PrivateRoute exact path="/" component={Dashboard} />
        //             <PrivateRoute exact path="/tool" component={MainView} />
        //             <Container fluid="md" className="mt-5 d-flex justify-content-center" style={{ minHeight: "100vh" }}>
        //                 <div className="w-100" style={{ maxWidth: '400px' }}>
        //                     <PrivateRoute exact path="/new" component={CreateTeam} />
        //                     <PrivateRoute path="/update-profile" component={UpdateProfile} />
        //                     <Route path="/signup" component={SignUp} />
        //                     <Route path="/login" component={LogIn} />
        //                     <Route path="/forgot-password" component={ForgotPassword} />
        //                 </div>
        //             </Container>
        //         </Switch>
        //     </AuthProvider>
        // </Router>
        <LayoutProvider>
        <UserProvider>
          <ThemeProvider theme={Themes.default}>
            <CssBaseline />
                <Router>
                <AuthProvider>
                    <Switch>
                        {/* <PrivateRoute exact path="/" component={Dashboard} /> */}
                        <PrivateRoute exact path="/" component={Layout} />
                        <PrivateRoute exact path="/" component={Header} />
                        {/* <PrivateRoute exact path="/tool" component={Tool} /> */}
                        <PrivateRoute exact path="/gallery/:teamID" component={Gallery} />
                        <PrivateRoute exact path="/project" component={Project} />
                        {/* <Route exact path="/team/:name"> <TestTeam></TestTeam> </Route> */}
                        {/* <Route exact path="/folder/:name/:teamID"> <FolderImages></FolderImages> </Route> */}
                        <Route exact path="/team/:name"> <Team></Team> </Route>
                        <Container className="mt-5 d-flex justify-content-center" style={{ minHeight: "100vh" }}>
                            <div className="w-100" style={{ maxWidth: '400px' }}>
                                <PrivateRoute exact path="/new" component={CreateTeam} />
                                <PrivateRoute path="/update-profile" component={UpdateProfile} />
                                <Route path="/signup" component={SignUp} />
                                <Route path="/login" component={LogIn} />
                                <Route path="/forgot-password" component={ForgotPassword} />
                            </div>
                        </Container>
                    </Switch>
                </AuthProvider>
            </Router>
          </ThemeProvider>
        </UserProvider>
      </LayoutProvider>
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
