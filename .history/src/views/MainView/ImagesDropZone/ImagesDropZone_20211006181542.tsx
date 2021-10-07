import React, { useContext } from 'react';
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

// const img = "https://firebasestorage.googleapis.com/v0/b/ilabel-tool.appspot.com/o/RTX742OR-e1572454412638.jpg?alt=media&token=0dc64c89-82f0-47f4-9fb2-f2111018beb7";

    // const img1 = "https://firebasestorage.googleapis.com/v0/b/ilabel-tool.appspot.com/o/WhatsApp-Image-2020-04-10-at-22.03.56.jpeg?alt=media&token=5673969d-38fb-4639-abd1-db5e9223a56f";
    

    // const img2 = "https://firebasestorage.googleapis.com/v0/b/ilabel-tool.appspot.com/o/Screenshot_2.png?alt=media&token=564dbe65-bbf1-44e2-ab87-175b30f8e311"
    // const img = [
        // "https://firebasestorage.googleapis.com/v0/b/ilabel-tool.appspot.com/o/RTX742OR-e1572454412638.jpg?alt=media&token=0dc64c89-82f0-47f4-9fb2-f2111018beb7",
        // "https://firebasestorage.googleapis.com/v0/b/ilabel-tool.appspot.com/o/WhatsApp-Image-2020-04-10-at-22.03.56.jpeg?alt=media&token=5673969d-38fb-4639-abd1-db5e9223a56f"
    // ];

    const { imagesData, setImagesData } = useImage()

    const startEditor = (projectType: ProjectType) => {
        console.log(imagesData)

        loadDummyData()
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

    const loadDummyData = () => {



    // for(var i = 0; i <img.length ; i++){
        var image = new Image;
        image.src = imagesData[0];
        image.setAttribute("crossOrigin", "Anonymous");
        image.onload = function() {
            var base64 = getBase64Image(image);

            var file = btof(base64, "test");
            acceptedFiles[0] = file;
            console.log(file)
            // console.log(img.length)

        };

        // var image1 = new Image();
        // image1.src = img1;
        // image1.setAttribute("crossOrigin", "Anonymous");
        // image1.onload = function() {
        //     var base64 = getBase64Image(image1);

        //     var file1 = btof(base64, "test");
        //     acceptedFiles[1] = file1;
        //     console.log(file1)

        // };
        // var image2 = new Image();
        // image2.src = img2;
        // image2.setAttribute("crossOrigin", "Anonymous");
        // image2.onload = function() {
        //     var base64 = getBase64Image(image2);

        //     var file2 = btof(base64, "test");
        //     acceptedFiles[2] = file2;
        //     console.log(file2)

        // };
    // }


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
        <div className="ImagesDropZone">
            <div {...getRootProps({ className: 'DropZone' })}>
                {getDropZoneContent()}
            </div>
            <div className="DropZoneButtons">
                <TextButton
                    label={"Object Detection"}
                    // isDisabled={!acceptedFiles.length}
                    onClick={() => startEditor(ProjectType.OBJECT_DETECTION)}
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
)(ImagesDropZone);