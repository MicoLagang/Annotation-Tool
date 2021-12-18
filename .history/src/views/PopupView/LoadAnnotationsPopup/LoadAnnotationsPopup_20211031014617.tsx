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
import { LabelType } from '../../../data/enums/LabelType';
import { AnnotationFormatType } from '../../../data/enums/AnnotationFormatType';
import { ImportFormatData } from '../../../data/ImportFormatData';
import { ImporterSpecData } from '../../../data/ImporterSpecData';
import { projectFirestore } from '../../../firebase';
import { Timer } from '@material-ui/icons';

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
    
    const timer = ms => new Promise(res => setTimeout(res, ms))

    // const importerSpecData = require('../../../data/ImporterSpecData');

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
        // console.log("Loading file...")
        // let data;
        
        // var docRef = projectFirestore
        // .collection("ANNOTATIONS")
        // .doc("nb8DAwn1DHfP6QrrgWMM");

        // docRef
        // .get()
        // .then((doc) => {
        //     if (doc.exists) {
        //         console.log("Document data:", doc.data().data);
        //         data = doc.data().data
        //         // var datastring = JSON.stringify(data);
                
        //         // console.log("Data String:", datastring);
        //         let dataFile = new File([data], "data.json", {
        //                 type: "application/json"
        //         });

        //         acceptedFiles[0] = dataFile
        //         console.log(acceptedFiles);
                  
        //         const importer = new (ImporterSpecData[resolveFormatType(LabelType.POLYGON)])([LabelType.POLYGON])
        //         console.log(importer)
        //         importer.import(acceptedFiles, onAnnotationLoadSuccess, onAnnotationsLoadFailure);
        //         console.log(loadedLabelNames.length)
        //         onAccept();
        //     } else {
        //         console.log("No such document!");
        //     }
        // })
        // .catch((error) => {
        //     console.log("Error getting document:", error);
        // });

           console.log("Loading file...")
        let data = []
        let folderID = localStorage.getItem("currentImagesFolderID")

        var docRef = projectFirestore
        .collection("ANNOTATIONS")
            .where("folderID", "==", folderID)
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                data.push({
                    ...doc.data(), //spread operator
                    key: doc.id, // id given to us by Firebase
                });
                });
                console.log("Document data:", data[0].data);
                // let dataJSON = data[0].data().data
                // var datastring = JSON.stringify(data);
                
                // console.log("Data String:", datastring);
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
                {/* <input {...getInputProps()} /> */}
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"ico/box-opened.png"}
                />
                <p className="extraBold">Load the saved annotations for this images?</p>
                <button onClick={loadJSON}>LOAD</button>
            </>;
        }
    }

    return(
        <GenericYesNoPopup
            title={"Load Annotations"}
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
)(LoadAnnotationsPopup);