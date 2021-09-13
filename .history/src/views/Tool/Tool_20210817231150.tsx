import React from 'react';
import '../../App.scss';
import EditorView from "../EditorView/EditorView";
import MainView from "../MainView/MainView";
import { ProjectType } from "../../data/enums/ProjectType";
import { AppState } from "../../store";
import { connect } from "react-redux";
import PopupView from "../PopupView/PopupView";
import MobileMainView from "../MobileMainView/MobileMainView";
import { ISize } from "../../interfaces/ISize";
import { Settings } from "../../settings/Settings";
import { SizeItUpView } from "../SizeItUpView/SizeItUpView";
import { PlatformModel } from "../../staticModels/PlatformModel";
import classNames from "classnames";

interface IProps {
    projectType: ProjectType;
    windowSize: ISize;
    ObjectDetectorLoaded: boolean;
    PoseDetectionLoaded: boolean;
}

const Tool: React.FC<IProps> = ({ projectType, windowSize, ObjectDetectorLoaded, PoseDetectionLoaded }) => {
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
        <div className={classNames("App", { "AI": ObjectDetectorLoaded || PoseDetectionLoaded })}
            draggable={false}
        >
            {selectRoute()}
            <PopupView />
        </div>
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
)(Tool);