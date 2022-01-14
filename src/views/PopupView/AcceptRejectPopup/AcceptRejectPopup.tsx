import React, { useState } from 'react'
import './AcceptRejectPopup.scss'
import {AppState} from "../../../store";
import {connect} from "react-redux";
import { updateActiveLabelType, updateImageData, updateLabelNames} from "../../../store/labels/actionCreators";
import {GenericYesNoPopup} from "../GenericYesNoPopup/GenericYesNoPopup";
import {useDropzone} from "react-dropzone";
import {ImageData, LabelName} from "../../../store/labels/types";
import {AcceptedFileType} from "../../../data/enums/AcceptedFileType";
import {PopupActions} from "../../../logic/actions/PopupActions";
import { LabelType } from '../../../data/enums/LabelType';
import { AnnotationFormatType } from '../../../data/enums/AnnotationFormatType';
import { ImportFormatData } from '../../../data/ImportFormatData';
import { ImporterSpecData } from '../../../data/ImporterSpecData';
import { projectFirestore } from '../../../firebase';
import { Button } from '@material-ui/core';

interface IProps {
    activeLabelType: LabelType,
    updateImageData: (imageData: ImageData[]) => any,
    updateLabelNames: (labels: LabelName[]) => any,
    updateActiveLabelType: (activeLabelType: LabelType) => any
}

const AcceptRejectPopup: React.FC<IProps> = (
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
    const [loadedLabelNames, setLoadedLabelNames] = useState([]);
    const [loadedImageData, setLoadedImageData] = useState([]);
    const [annotationsLoadedError, setAnnotationsLoadedError] = useState(null);
    const db = projectFirestore.collection("ANNOTATIONS");

    async function onAccept() {

        if (loadedLabelNames.length !== 0 && loadedImageData.length !== 0) {
            updateImageData(loadedImageData);
            updateLabelNames(loadedLabelNames);
            updateActiveLabelType(labelType);
            PopupActions.close();
        }
    };

    async function onReject() {
        PopupActions.close();
    };

    const loadJSON = () => {
        console.log("Loading file...")
        let data = []
        let folderID = localStorage.getItem("currentImagesFolderID")

        projectFirestore.collection("ANNOTATIONS").where("folderID", "==", folderID)
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    data.push({
                        ...doc.data(),
                        key: doc.id,
                    });
                });
                if(data[0]) {

                    console.log("Document data:", data[0].data);
    
                    let dataFile = new File([data[0].data], "data.json", {
                            type: "application/json"
                    });
    
                    acceptedFiles[0] = dataFile
                    console.log(acceptedFiles);
                      
                    const importer = new (ImporterSpecData[resolveFormatType(LabelType.POLYGON)])([LabelType.POLYGON])
                    console.log(importer)
                    importer.import(acceptedFiles, onAnnotationLoadSuccess, onAnnotationsLoadFailure);
                    console.log(loadedLabelNames.length)
                    onAccept();

                } else {
                    alert('No saved annotation data');
                    onReject();
                }
                
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
        if (!!annotationsLoadedError) {
            console.log(annotationsLoadedError.message)
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"ico/box-opened.png"}
                />
                <p className="extraBold">Annotation import was unsuccessful</p>
                <p className="extraBold">{annotationsLoadedError.message}</p>
                <button onClick={loadJSON}>LOAD AGAIN</button>
            </>;
        } else if (loadedImageData.length !== 0 && loadedLabelNames.length !== 0) {
            return <>
                <img
                    draggable={false}
                    alt={"uploaded"}
                    src={"ico/box-closed.png"}
                />
                <p className="extraBold">Annotation ready for import</p>
                After import you will lose
                all your current annotations
            </>;
        } else {
            return <>
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"ico/box-opened.png"}
                />
                <p className="extraBold">Load the saved annotations for this images?</p>
                <Button variant="contained" onClick={loadJSON}>Load</Button>
            </>;
        }
    }

    return(
        <GenericYesNoPopup
            title={"Accept or Reject Annotation"}
            renderContent={renderContent}
            acceptLabel={"Open"}
            disableAcceptButton={acceptedFiles.length < 1}
            onAccept={loadJSON}
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
)(AcceptRejectPopup);