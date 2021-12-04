
import React, { useContext, useEffect, useState } from 'react';
import './ImagesDropZone.scss';
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
import { useImage } from '../../../logic/context/imageContext';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from "react-toastify";
import { Spinner } from 'react-bootstrap'

interface IProps {
    updateActiveImageIndex: (activeImageIndex: number) => any;
    addImageData: (imageData: ImageData[]) => any;
    updateProjectData: (projectData: ProjectData) => any;
    updateActivePopupType: (activePopupType: PopupWindowType) => any;
    projectData: ProjectData;
}

const ImagesDropZone: React.FC<IProps> = ({ updateActiveImageIndex, addImageData, updateProjectData, updateActivePopupType, projectData }) => {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        accept: AcceptedFileType.IMAGE
    } as DropzoneOptions);

    const timer = ms => new Promise(res => setTimeout(res, ms))
    const { imagesData, setImagesData } = useImage()
    const [loading, setLoading] = useState(false)
    const [imagesLoaded, setImagesLoaded] = useState(0)

    useEffect(() => {
        load()
    }, [])

    const startEditor = (projectType: ProjectType) => {
        console.log(acceptedFiles)

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

    const getBase64Image = (img) => {
        console.log("processing base 64...")
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);

        return dataURL;
    }

    const btof = (data, fileName) => {
        console.log("processing btof...")
        const dataArr = data.split(",");
        const byteString = atob(dataArr[1]);

        const u8Arr = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
            u8Arr[i] = byteString.charCodeAt(i);
        }
        return new File([u8Arr], fileName + ".jpg", {
            type: "image/jpeg",
            endings: "native"
        });
    }

    async function load() {
        if (imagesData) {
            for (var i = 0; i < imagesData.length; i++) {
                console.log(imagesData[i].url);
                var image = await new Image;
                image.src = imagesData[i].url;
                console.log(imagesData[i].url)
                console.log(image)
                image.setAttribute("crossOrigin", "Anonymous");
                image.onload = async () => {
                    var base64 = await getBase64Image(image);
                    console.log("done base 64")

                    var file = await btof(base64, imagesData[i].name);
                    console.log("done btof")

                    acceptedFiles[i] = file;
                    console.log(file)
                };
                setImagesLoaded(imagesLoaded + 1);
                // await timer(1000);
            }
            setLoading(true);
            console.log(acceptedFiles.length)
            if (acceptedFiles.length > 0) toast.success("All images are loaded!")
        }
    }

    const getLoadingContent = () => {
        return <>
            {loading
                ? <div className="text-center">
                    <ToastContainer />
                    <p>All Images are loaded. Start annotating now?</p>
                    <TextButton
                        label={"Start"}
                        isDisabled={acceptedFiles.length > 0}
                        onClick={() => startEditor(ProjectType.OBJECT_DETECTION)}
                    />
                </div>
                : <div className="text-center">
                    <p>Loading images...</p>
                    <Spinner animation="border" />
                </div>
            }
        </>
    }

    const getDropZoneContent = () => {

        if (acceptedFiles.length === 0)
            return <>
                <input {...getInputProps()} />
                <img
                    draggable={false}
                    alt={"upload"}
                    src={"ico/box-opened.png"}
                />
                <p className="extraBold">Drop images</p>
                <p>or</p>
                <p className="extraBold">Click here to select them</p>
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
                <input {...getInputProps()} />
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
        <>

            {imagesData
                ? <div>
                    {getLoadingContent()}
                </div>
                : <div className="ImagesDropZone">
                    <div {...getRootProps({ className: 'DropZone' })}>
                        {getDropZoneContent()}
                    </div>
                    <div className="DropZoneButtons">
                        {!imagesData && <TextButton
                            label={"Object Detection"}
                            isDisabled={!acceptedFiles.length}
                            onClick={() => startEditor(ProjectType.OBJECT_DETECTION)}
                        />}
                    </div>
                </div>
            }
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
)(ImagesDropZone);