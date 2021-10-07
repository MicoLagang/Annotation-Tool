import React, { useState } from 'react';
import './MainView.scss';
import { TextButton } from "../Common/TextButton/TextButton";
import classNames from 'classnames';
import { ISize } from "../../interfaces/ISize";
import { ImageButton } from "../Common/ImageButton/ImageButton";
import { ISocialMedia, SocialMediaData } from "../../data/info/SocialMediaData";
import { EditorFeatureData, IEditorFeature } from "../../data/info/EditorFeatureData";
import { Tooltip } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import withStyles from "@material-ui/core/styles/withStyles";
import ImagesDropZone from "./ImagesDropZone/ImagesDropZone";
import { useAuth } from '../../logic/context/AuthContext'
import { useHistory } from 'react-router-dom'

const MainView: React.FC = () => {
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

    const [projectInProgress, setProjectInProgress] = useState(true);
    const [projectCanceled, setProjectCanceled] = useState(false);

    const startProject = () => {
        setProjectInProgress(true);
    };

    const endProject = () => {
        setProjectInProgress(false);
        setProjectCanceled(true);
    };

    const getClassName = () => {
        return classNames(
            "MainView", {
            "InProgress": projectInProgress,
            "Canceled": !projectInProgress && projectCanceled
        }
        );
    };

    const DarkTooltip = withStyles(theme => ({
        tooltip: {
            backgroundColor: "#171717",
            color: "#ffffff",
            boxShadow: theme.shadows[1],
            fontSize: 11,
            maxWidth: 120
        },
    }))(Tooltip);

    const getSocialMediaButtons = (size: ISize) => {
        return SocialMediaData.map((data: ISocialMedia, index: number) => {
            return <DarkTooltip
                key={index}
                disableFocusListener
                title={data.tooltipMessage}
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                placement="left"
            >
                <div>
                    <ImageButton
                        buttonSize={size}
                        image={data.imageSrc}
                        imageAlt={data.imageAlt}
                        href={data.href}
                    />
                </div>
            </DarkTooltip>
        });
    };

    const getEditorFeatureTiles = () => {
        return EditorFeatureData.map((data: IEditorFeature) => {
            return <div
                className="EditorFeaturesTiles"
                key={data.displayText}
            >
                <div
                    className="EditorFeaturesTilesWrapper"
                >
                    <img
                        draggable={false}
                        alt={data.imageAlt}
                        src={data.imageSrc}
                    />
                    <div className="EditorFeatureLabel">
                        {data.displayText}
                    </div>
                </div>
            </div>
        });
    };

    return (
        <div className={getClassName()}>
            <div className="Slider" id="lower">
                <div className="TriangleVertical">
                    <div className="TriangleVerticalContent" />
                </div>
            </div>

            <div className="Slider" id="upper">
                <div className="TriangleVertical">
                    <div className="TriangleVerticalContent" />
                </div>
            </div>

            <div className="LeftColumn">
                <div className={"LogoWrapper"}>
                    <img
                        draggable={false}
                        alt={"main-logo"}
                        src={"ico/ilabel-white.png"}
                    />
                </div>
                <div className="EditorFeaturesWrapper">
                    {getEditorFeatureTiles()}
                </div>
                <div className="TriangleVertical">
                    <div className="TriangleVerticalContent" />
                </div>
                <TextButton
                    label={"Profile"}
                    onClick={handleLogout}
                />
                {projectInProgress && <TextButton
                    label={"Log Out"}
                    onClick={handleLogout}
                />}
            </div>
            <div className="RightColumn">
                <div />
                <ImagesDropZone />
                <div className="SocialMediaWrapper">
                    {getSocialMediaButtons({ width: 30, height: 30 })}
                </div>
                {!projectInProgress && <TextButton
                    label={"Get Started"}
                    onClick={startProject}
                />}
                {!projectInProgress && <TextButton
                    label={"Log Out"}
                    onClick={handleLogout}
                />}
            </div>
        </div>
    );
};

export default MainView;