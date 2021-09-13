// import React, { useState } from "react";
// import './style.scss';
// import { useDropzone, DropzoneOptions } from "react-dropzone";
// import { TextButton } from "../Common/TextButton/TextButton";
// import { ImageData } from "../../store/labels/types";
// import { connect } from "react-redux";
// import { addImageData, updateActiveImageIndex } from "../../store/labels/actionCreators";
// import { AppState } from "../../store";
// import { ProjectType } from "../../data/enums/ProjectType";
// import { PopupWindowType } from "../../data/enums/PopupWindowType";
// import { updateActivePopupType, updateProjectData } from "../../store/general/actionCreators";
// import { AcceptedFileType } from "../../data/enums/AcceptedFileType";
// import { ProjectData } from "../../store/general/types";
// import { ImageDataUtil } from "../../utils/ImageDataUtil";
// import firebaseDb,{ storage } from "../../firebase"

// // idiot

// interface IProps {
//     updateActiveImageIndex: (activeImageIndex: number) => any;
//     addImageData: (imageData: ImageData[]) => any;
//     updateProjectData: (projectData: ProjectData) => any;
//     updateActivePopupType: (activePopupType: PopupWindowType) => any;
//     projectData: ProjectData;
// }

// const ImagesFromCloud: React.FC<IProps> = ({ updateActiveImageIndex, addImageData, updateProjectData, updateActivePopupType, projectData }) => {
//     const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
//         accept: AcceptedFileType.IMAGE
//     } as DropzoneOptions);

//     const startEditor = (projectType: ProjectType) => {
//         if (acceptedFiles.length > 0) {
//             updateProjectData({
//                 ...projectData,
//                 type: projectType
//             });
//             updateActiveImageIndex(0);
//             addImageData(acceptedFiles.map((fileData: File) => ImageDataUtil.createImageDataFromFileData(fileData)));
//             updateActivePopupType(PopupWindowType.INSERT_LABEL_NAMES);
//             acceptedFiles.map((fileData: File) => console.log(fileData))
//         }
//     };


//     // test to upload
//     const [images, setImages] = useState([]);
//     const [urls, setUrls] = useState([]);
//     const [progress, setProgress] = useState(0);
//     const db = firebaseDb.ref("images");

//     const handleChange = (e) => {
//         for (let i = 0; i < e.target.files.length; i++) {
//             const newImage = e.target.files[i];
//             console.log(newImage)
//             newImage["id"] = Math.random();
//             setImages((prevState) => [...prevState, newImage]);
//         }
//     };

//     const handleUpload = () => {
//         const promises = [];
//         images.map((image) => {
//             console.log('uploading images...')
//             const uploadTask = storage.ref(`images/${image.name}`).put(image);
//             promises.push(uploadTask);
//             uploadTask.on(
//                 "state_changed",
//                 (snapshot) => {
//                     const progress = Math.round(
//                         (snapshot.bytesTransferred / snapshot.totalBytes) * 100
//                     );
//                     setProgress(progress);
//                 },
//                 (error) => {
//                     console.log(error);
//                 },
//                 async () => {
//                     await storage
//                         .ref("images")
//                         .child(image.name)
//                         .getDownloadURL()
//                         .then((urls) => {
//                             setUrls((prevState) => [...prevState, urls]);
//                             db.push({link : urls});
//                         });
//                 }
//             );
//         });

//         Promise.all(promises)
//             .then(() => alert("All images uploaded"))
//             .catch((err) => console.log(err));
//     };

//     const getDropZoneContent = () => {
//         if (acceptedFiles.length === 0)
//             return <>
//                 <input {...getInputProps()}
//                     type="file"
//                     multiple
//                     onChange={handleChange} />
//                 <img
//                     draggable={false}
//                     alt={"upload"}
//                     src={"ico/box-opened.png"}
//                 />
//                 <p className="extraBold">Access images</p>
//                 <p className="extraBold">from cloud storage</p>
//                 <div>
//                     <progress value={progress} max="100" />
//                 </div>
//             </>;
//         else if (acceptedFiles.length === 1)
//             return <>
//                 <img
//                     draggable={false}
//                     alt={"uploaded"}
//                     src={"ico/box-closed.png"}
//                 />
//                 <p className="extraBold">1 image loaded</p>
//             </>;
//         else
//             return <>
//                 <input {...getInputProps()}
//                     type="file"
//                     multiple
//                     onChange={handleChange} />

//                 <img
//                     draggable={false}
//                     key={1}
//                     alt={"uploaded"}
//                     src={"ico/box-closed.png"}
//                 />
//                 <p key={2} className="extraBold">{acceptedFiles.length} images loaded</p>
//             </>;
//     };

//     return (
//         <>
//             <div className="mt-5 d-flex justify-content-center" style={{ minHeight: "100vh" }}>
//                 <div className="w-100" style={{ maxWidth: '400px' }}>
//                 <br></br>
//                     <br></br>
//                     <br></br>

            
//                     <div className="ImagesDropZone">
//                         <div {...getRootProps({ className: 'DropZone' })}>
//                             {getDropZoneContent()}
//                         </div>
//                         <div className="DropZoneButtons">
//                             <TextButton
//                                 label={"Upload"}
//                                 // isDisabled={!acceptedFiles.length}
//                                 onClick={handleUpload}
//                             />
//                         </div>
//                     </div>
//                     <br></br>
//                     <br></br>

//                     {urls.map((url, i) => (
//                     <img
//                     key={i}
//                     style={{ height:"100px", width: "100px" }}
//                     src={url || "http://via.placeholder.com/300"}
//                     alt="firebase-image"
//                     />
//                 ))}
//                 </div>
//             </div>

//             <div className="mt-5 d-flex justify-content-center" style={{ minHeight: "100vh" }}>
//                             {/* {urls.map((url, i) => (
//                     <div key={i}>
//                     <a href={url} target="_blank">
//                         {url}
//                     </a>
//                     </div>
//                 ))} */}
//                 <br />
                
//                 {urls.map((url, i) => (
//                     <img
//                     key={i}
//                     style={{ height:"100px", width: "100px" }}
//                     src={url || "http://via.placeholder.com/300"}
//                     alt="firebase-image"
//                     />
//                 ))}

//             </div>
                
   
//         </>
//     )
// };

// const mapDispatchToProps = {
//     updateActiveImageIndex,
//     addImageData,
//     updateProjectData,
//     updateActivePopupType
// };

// const mapStateToProps = (state: AppState) => ({
//     projectData: state.general.projectData
// });

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(ImagesFromCloud);



import React from 'react';
import useFirestore from '../../views/hooks/useFirestore';
import { motion } from 'framer-motion';

const ImageGrid = ({ setSelectedImg }) => {
  const { docs } = useFirestore('images');

  return (
    <div className="img-grid">
      {docs && docs.map(doc => (
        <motion.div className="img-wrap" key={doc.id} 
          layout
          whileHover={{ opacity: 1 }}
          onClick={() => setSelectedImg(doc.url)}
        >
          <motion.img src={doc.url} alt="uploaded pic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default ImageGrid;