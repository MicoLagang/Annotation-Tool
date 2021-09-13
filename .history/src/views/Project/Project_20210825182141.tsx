import React, { useState } from "react";
import './Project.scss';
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { TextButton } from "../Common/TextButton/TextButton";
import { ImageData } from "../../store/labels/types";
import { connect } from "react-redux";
import { addImageData, updateActiveImageIndex } from "../../store/labels/actionCreators";
import { AppState } from "../../store";
import { ProjectType } from "../../data/enums/ProjectType";
import { PopupWindowType } from "../../data/enums/PopupWindowType";
import { updateActivePopupType, updateProjectData } from "../../store/general/actionCreators";
import { AcceptedFileType } from "../../data/enums/AcceptedFileType";
import { ProjectData } from "../../store/general/types";
import { ImageDataUtil } from "../../utils/ImageDataUtil";
import { storage } from "../../firebase"

import { google } from 'googleapis'

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    addImageData: (imageData: ImageData[]) => any;
    updateProjectData: (projectData: ProjectData) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    projectData: ProjectData;
}

const Project: React.FC<IProps> = ({
    updateActiveImageIndex,
    addImageData,
    updateProjectData,
    updateActivePopupType,
    projectData }) => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: AcceptedFileType.IMAGE
    } as DropzoneOptions);


    // test to upload
    const [images, setImages] = useState([]);
    const [urls, setUrls] = useState([]);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        for (let i = 0; i < e.target.files.length; i++) {
            const newImage = e.target.files[i];
            console.log(newImage)
            newImage["id"] = Math.random();
            setImages((prevState) => [...prevState, newImage]);
        }
    };

    const handleUpload = () => {
        if (images.length > 0) {
            const promises = [];
            images.map((image) => {
                console.log('uploading images...')
                console.log(image)
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
        }
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
                <div>
                    <progress value={progress} max="100" />
                </div>
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
                <div>
                    <progress value={progress} max="100" />
                </div>
            </>;
    };

    return (
        <>
            <div className="mt-5 d-flex justify-content-center" style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: '400px' }}>
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
                        </div>
                    </div>
                </div>
            </div>

            <img src="https://firebasestorage.googleapis.com/v0/b/ilabel-tool.appspot.com/o/images%2Filabel.png?alt=media&token=5abe1679-fa4f-4927-a663-c2d9885f561c" alt="" />

        </>
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
)(Project);