import React, { useState } from "react";
import './ImagesFromCloud.scss';
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { TextButton } from "../../Common/TextButton/TextButton";
import { ImageData } from "../../../store/labels/types";
import { connect } from "react-redux";
import { addImageData, updateActiveImageIndex } from "../../../store/labels/actionCreators";
import { AppState } from "../../../store";
import { ProjectType } from "../../../data/enums/ProjectType";
import { PopupWindowType } from "../../../data/enums/PopupWindowType";
import { updateActivePopupType, updateProjectData } from "../../../store/general/actionCreators";
import { AcceptedFileType } from "../../../data/enums/AcceptedFileType";
import { ProjectData } from "../../../store/general/types";
import { ImageDataUtil } from "../../../utils/ImageDataUtil";
import { storage } from "../../../firebase"
import { gapi } from 'gapi-script';

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    addImageData: (imageData: ImageData[]) => any;
    updateProjectData: (projectData: ProjectData) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    projectData: ProjectData;
}

const ImagesFromCloud: React.FC<IProps> = ({ updateActiveImageIndex, addImageData, updateProjectData, updateActivePopupType, projectData }) => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: AcceptedFileType.IMAGE
    } as DropzoneOptions);

    const startEditor = (projectType: ProjectType) => {
        if (acceptedFiles.length > 0) {
            updateProjectData({
                ...projectData,
                type: projectType
            });
            updateActiveImageIndex(0);
            addImageData(acceptedFiles.map((fileData: File) => ImageDataUtil.createImageDataFromFileData(fileData)));
            updateActivePopupType(PopupWindowType.INSERT_LABEL_NAMES);
            acceptedFiles.map((fileData: File) => console.log(fileData))
        }
    };




    const [isLoadingGoogleDriveApi, setIsLoadingGoogleDriveApi] = useState(false);
    const [isFetchingGoogleDriveFiles, setIsFetchingGoogleDriveFiles] = useState(false);
    const [listDocumentsVisibility, setListDocumentsVisibility] = useState(false);
    const [signedInUser, setSignedInUser] = useState('');
    const [documents, setDocuments] = useState([]);


    // Array of API discovery doc URLs for APIs
    const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    const SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

    const handleClientLoad = () => {
        gapi.load('client:auth2', initClient);
    };

    const initClient = () => {
        setIsLoadingGoogleDriveApi(true);
        gapi.client
            .init({
                apiKey: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
                clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES,
            })
            .then(
                function () {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                    // Handle the initial sign-in state.
                    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                },
                function (error) { }
            );
    };

    /**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
    const updateSigninStatus = (isSignedIn) => {
        if (isSignedIn) {
            // Set the signed in user
            setSignedInUser(gapi.auth2.getAuthInstance().currentUser.je.Qt);
            setIsLoadingGoogleDriveApi(false);
            // list files if user is authenticated
            listFiles();
        } else {
            // prompt user to sign in
            //   handleAuthClick();
        }
    };

    /**
    * List files.
    */
    const listFiles = (searchTerm = null) => {
        setIsFetchingGoogleDriveFiles(true);
        gapi.client.drive.files
            .list({
                pageSize: 10,
                fields: 'nextPageToken, files(id, name, mimeType, modifiedTime)',
                q: searchTerm,
            })
            .then(function (response) {
                setIsFetchingGoogleDriveFiles(false);
                setListDocumentsVisibility(true);
                const res = JSON.parse(response.body);
                setDocuments(res.files);
            });
    };

    /**
     *  Sign in the user upon button click.
     */
    const handleAuthClick = (event) => {
        gapi.auth2.getAuthInstance().signIn();
    };




    // test to upload
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            newImage["id"] = Math.random();
            console.log(newImage)
            setImages((prevState) => [...prevState, newImage]);
        }
    };

    const handleUpload = () => {
        const promises = [];
        images.map((image) => {
            console.log('uploading images...')
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    setProgress(progress);
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    await storage
                        .ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then((urls) => {
                            setUrls((prevState) => [...prevState, urls]);
                        });
                }
            );
        });

        Promise.all(promises)
            .then(() => alert("All images uploaded"))
            .catch((err) => console.log(err));
    };

    const getDropZoneContent = () => {
        if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()}
                    type="file"
                    multiple
                    onChange={handleChange} />
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"ico/box-opened.png"}
                />
                <p className="extraBold">Access images</p>
                <p className="extraBold">from cloud storage</p>
                <div>
                    <progress value={progress} max="100" />
                </div>
            </>;
        else if (acceptedFiles.length === 1)
            return <>
                <img
                    draggable={false}
                    alt={"uploaded"}
                    src={"ico/box-closed.png"}
                />
                <p className="extraBold">1 image loaded</p>
            </>;
        else
            return <>
                <input {...getInputProps()}
                    type="file"
                    multiple
                    onChange={handleChange} />

                <img
                    draggable={false}
                    key={1}
                    alt={"uploaded"}
                    src={"ico/box-closed.png"}
                />
                <p key={2} className="extraBold">{acceptedFiles.length} images loaded</p>
            </>;
    };

    return (
        <div className="ImagesDropZone">
            <div {...getRootProps({ className: 'DropZone' })}>
                {getDropZoneContent()}
            </div>
            <div className="DropZoneButtons">
                <TextButton
                    label={"Upload"}
                    // isDisabled={!acceptedFiles.length}
                    onClick={handleUpload}
                />
                <TextButton
                    label={"Google"}
                    onClick={() => handleClientLoad()}
                />
            </div>
        </div>
    )
};

const mapDispatchToProps = {
    updateActiveImageIndex,
    addImageData,
    updateProjectData,
    updateActivePopupType
};

const mapStateToProps = (state: AppState) => ({
    projectData: state.general.projectData
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImagesFromCloud);