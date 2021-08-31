import React, { useState } from "react";
import './Project.scss';
import { storage } from "../../../firebase"

export default function Project() {
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
        <div>
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
    )
}
