import React, { useState } from 'react'
import './LoadAnnotationsPopup.scss'
import {AppState} from "../../../store";
import {connect} from "react-redux";
import {addImageData, updateActiveLabelType, updateImageData, updateLabelNames} from "../../../store/labels/actionCreators";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {useDropzone} from "react-dropzone";
import {ImageData, LabelName} from "../../../store/labels/types";
import {AcceptedFileType} from "../../../data/enums/AcceptedFileType";
import {PopupActions} from "../../../logic/actions/PopupActions";
import { ImporterSpecData } from '../../../data/ImporterSpecData';
import { LabelType } from '../../../data/enums/LabelType';
import { AnnotationFormatType } from '../../../data/enums/AnnotationFormatType';
import { ImportFormatData } from '../../../data/ImportFormatData';

interface IProps {
    activeLabelType: LabelType,
    updateImageData: (imageData: ImageData[]) => any,
    updateLabelNames: (labels: LabelName[]) => any,
    updateActiveLabelType: (activeLabelType: LabelType) => any
}

const LoadAnnotationsPopup: React.FC<IProps> = (
    {
        activeLabelType,
        updateImageData,
        updateLabelNames,
        updateActiveLabelType
    }) => {
    const resolveFormatType = (labelType: LabelType): AnnotationFormatType => {
        const possibleImportFormats = ImportFormatData[labelType]
        return possibleImportFormats.length === 1 ? possibleImportFormats[0].type : null
    }
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        accept: AcceptedFileType.IMAGE
    });

    const [labelType, setLabelType] = useState(activeLabelType);
    const [formatType, setFormatType] = useState(resolveFormatType(activeLabelType));
    const [loadedLabelNames, setLoadedLabelNames] = useState([]);
    const [loadedImageData, setLoadedImageData] = useState([]);
    const [annotationsLoadedError, setAnnotationsLoadedError] = useState(null);

    const onAccept = () => {
        if (loadedLabelNames.length !== 0 && loadedImageData.length !== 0) {
            updateImageData(loadedImageData);
            updateLabelNames(loadedLabelNames);
            updateActiveLabelType(labelType);
            PopupActions.close();
        }
    };

    const onReject = () => {
        PopupActions.close();
    };

    const loadJSON = () => {
        // Fetch the Json file here from database and console log it
        let acceptedFiles

        const importer = new (ImporterSpecData[formatType])([labelType])
        importer.import(acceptedFiles, onAnnotationLoadSuccess, onAnnotationsLoadFailure);
    }

    const onAnnotationLoadSuccess = (imagesData: ImageData[], labelNames: LabelName[]) => {
        setLoadedLabelNames(labelNames);
        setLoadedImageData(imagesData);
        setAnnotationsLoadedError(null);
    }

    const onAnnotationsLoadFailure = (error?:Error) => {
        setLoadedLabelNames([]);
        setLoadedImageData([]);
        setAnnotationsLoadedError(error);
    };

    const renderContent = () => {
        return(<div className="LoadMoreImagesPopupContent">
            <div {...getRootProps({className: 'DropZone'})}>
                <p className="extraBold">Load the saved annotations for this images?</p>
            </div>
        </div>);
    };

    return(
        <GenericYesNoPopup
            title={"Load Annotations"}
            renderContent={renderContent}
            acceptLabel={"Load"}
            // disableAcceptButton={acceptedFiles.length < 1}
            onAccept={onAccept}
            rejectLabel={"Cancel"}
            onReject={onReject}
        />
    );
};

const mapDispatchToProps = {
    updateImageData,
    updateLabelNames,
    updateActiveLabelType
};

const mapStateToProps = (state: AppState) => ({
    activeLabelType: state.labels.activeLabelType,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoadAnnotationsPopup);