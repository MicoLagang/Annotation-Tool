import React from 'react'
import './SaveAnnotationsPopup.scss'
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {addImageData} from "../../../store/labels/actionCreators";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {useDropzone} from "react-dropzone";
import {ImageData} from "../../../store/labels/types";
import {AcceptedFileType} from "../../../data/enums/AcceptedFileType";
import {PopupActions} from "../../../logic/actions/PopupActions";

interface IProps {
    addImageData: (imageData: ImageData[]) => any;
}

const SaveAnnotationsPopup: React.FC<IProps> = ({addImageData}) => {
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: AcceptedFileType.IMAGE
    });

    const onAccept = () => {
        alert("Images are saved!")
    };

    const onReject = () => {
        PopupActions.close();
    };

    const renderContent = () => {
        return(<div className="LoadMoreImagesPopupContent">
            <div {...getRootProps({className: 'DropZone'})}>
                <p className="extraBold">The following images <br/> will be saved in COCO format. <br/> Procced?</p>
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={"Save Annotations"}
            renderContent={renderContent}
            acceptLabel={"Get"}
            // disableAcceptButton={acceptedFiles.length < 1}
            onAccept={onAccept}
            rejectLabel={"Cancel"}
            onReject={onReject}
        />
    );
};

const mapDispatchToProps = {
    addImageData
};

const mapStateToProps = (state: AppState) => ({});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SaveAnnotationsPopup);