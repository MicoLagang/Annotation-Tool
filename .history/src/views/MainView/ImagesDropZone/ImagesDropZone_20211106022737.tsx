import React, { useContext, useState } from 'react';
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

    const { imagesData, setImagesData } = useImage()
    const timer = ms => new Promise(res => setTimeout(res, ms))
    const [progress, setProgress] = useState(0);
    

    // load();
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
        if (imagesData.length > -1) {
            for (var i = 0; i < imagesData.length; i++) {
                console.log(i);
                var image = await new Image;
                image.src = imagesData[i];
                console.log(imagesData[i])
                console.log(image)
                image.setAttribute("crossOrigin", "Anonymous");
                image.onload = async() => {
                    var base64 = await getBase64Image(image);
                    console.log("done base 64")

                    var file = await btof(base64, `test${i}`);
                    console.log("done btof")
                      
                    acceptedFiles[i] = file;
                    console.log(file)
                };
                await timer(1000); // then the created Promise can be awaited
            }
            getDropZoneContent();
        } else {
            alert("No images selected to annotate.")
        }
    }
    
    load()

    const getDropZoneContent = () => {
        if (acceptedFiles.length > 0)
              
        // setProgress(acceptedFiles.length );
        
        console.log(acceptedFiles.length)
        console.log("Done Loading Image...")
        if (acceptedFiles.length > 0) {
            
            // startEditor(ProjectType.OBJECT_DETECTION)
            timer(100000);
            console.log("apple")
            toast.success("PLS WAIT");
            for (var i = 0; i > 10;i++){
                if (i == 10) {
                    // startEditor(ProjectType.OBJECT_DETECTION) 
                    console.log("apple")
                }
            }
            // 
        }
 
        return <>
            <ToastContainer />
            <>

                </>
                <p>All Images are loaded. Start annotating now?</p>
                {/* <TextButton
                label={"Start"}
                    isDisabled={acceptedFiles.length > 0}
                    onClick={() => startEditor(ProjectType.OBJECT_DETECTION)}
                /> */}
            </>

            // if (acceptedFiles.length === 0)
            //     return <>
            //         <input {...getInputProps()} />
            //         <img
            //             draggable={false}
            //             alt={"upload"}
            //             src={"ico/box-opened.png"}
            //         />
            //         <p className="extraBold">Drop images</p>
            //         <p>or</p>
            //         <p className="extraBold">Click here to select them</p>
            //     </>;
            // else if (acceptedFiles.length === 1)
            //     return <>
            //         <img
            //             draggable={false}
            //             alt={"uploaded"}
            //             src={"ico/box-closed.png"}
            //         />
            //         <p className="extraBold">1 image loaded</p>
            //     </>;
            // else
            //     return <>
            //         <input {...getInputProps()} />
            //         <img
            //             draggable={false}
            //             key={1}
            //             alt={"uploaded"}
            //             src={"ico/box-closed.png"}
            //         />
            //         <p key={2} className="extraBold">{acceptedFiles.length} images loaded</p>
            //     </>;
    
        
    };

    return (
        <div className="ImagesDropZone">
     
            {/* <div {...getRootProps({ className: 'DropZone' })}>
                {getDropZoneContent()}
            </div> */}
            {getDropZoneContent()}
            <div className="DropZoneButtons">
                {/* {imagesData && 
                <TextButton
                    label={"Load Images"}
                    onClick={() => load()}
                />} */}
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
)(ImagesDropZone);