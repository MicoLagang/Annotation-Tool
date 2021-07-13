import React from 'react';
import './App.scss';
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
import Dashboard from './views/Dashboard/Dashboard';
import { Container } from 'react-bootstrap'
import { AuthProvider } from './logic/context/AuthContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'


interface IProps {
    projectType: ProjectType;
    windowSize: ISize;
    ObjectDetectorLoaded: boolean;
    PoseDetectionLoaded: boolean;
}

const App: React.FC<IProps> = ({ projectType, windowSize, ObjectDetectorLoaded, PoseDetectionLoaded }) => {
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
        <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <Router>
                    <AuthProvider>
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route path="/signup" component={SignUp} />
                        </Switch>
                    </AuthProvider>
                </Router>
            </div>
        </Container>
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
