import React, { useState } from 'react'
import './LoadAnnotationsPopup.scss'
import {AppState} from "../../../store";
import {connect} from "react-redux";
import { updateActiveLabelType, updateImageData, updateLabelNames} from "../../../store/labels/actionCreators";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {useDropzone} from "react-dropzone";
import {ImageData, LabelName} from "../../../store/labels/types";
import {AcceptedFileType} from "../../../data/enums/AcceptedFileType";
import {PopupActions} from "../../../logic/actions/PopupActions";
import { ImporterSpecData } from '../../../data/ImporterSpecData';
import { LabelType } from '../../../data/enums/LabelType';
import { AnnotationFormatType } from '../../../data/enums/AnnotationFormatType';
import { ImportFormatData } from '../../../data/ImportFormatData';
import { projectFirestore } from '../../../firebase';

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
    const db = projectFirestore.collection("ANNOTATIONS");

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
        console.log("Loading file...")
        let data;
        
        var docRef = projectFirestore
        .collection("ANNOTATIONS")
        .doc("lXk8j3LeWwX0NoIpw8Uy");

        docRef
        .get()
        .then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data().data);
                data = doc.data().data
                var datastring = JSON.stringify(data);
                let dataFile = new File([datastring], "data.json", {
                        type: "application/json"
                });
                console.log(dataFile)
                let dataFile2 = new File([data], "data.json", {
                        type: "application/json"
                });
                console.log(dataFile2)

            //     acceptedFiles[0] = dataFile
            //     console.log(acceptedFiles);
            // const importer = new (ImporterSpecData[formatType])([labelType])
            // console.log(importer)
            // console.log(formatType);
            // console.log(labelType);
            // importer.import(acceptedFiles, onAnnotationLoadSuccess, onAnnotationsLoadFailure);
            } else {
                console.log("No such document!");
            }
        })
        .catch((error) => {
            console.log("Error getting document:", error);
        });
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
                <button onClick={loadJSON}>LOAD</button>
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