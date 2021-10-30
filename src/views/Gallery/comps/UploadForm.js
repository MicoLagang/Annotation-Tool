import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import { projectFirestore } from '../../../firebase';
import { projectStorage,timestamp } from '../../../firebase';
import { motion } from 'framer-motion';
import { Refresh } from '@material-ui/icons';
import { useParams } from 'react-router-dom'
import { folder } from 'jszip';

const UploadForm = () => {
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);
  const [url, setUrl] = useState([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);


  // const { name } = useParams()
  // const {teamID} = useParams()
  // const {folderID} = useParams()
  const teamID= localStorage.getItem("currentTeamID")
  const name = localStorage.getItem("currentProjectID")
  const folderID = localStorage.getItem("currentImagesFolderID")



  const types = ['image/png', 'image/jpeg'];

  const handleChange = (e) => {
    // let selected = e.target.files[0];

    // if (selected && types.includes(selected.type)) {
    //   setFile(selected);
    //   setError('');
    // } else {
    //   setFile(null);
    //   setError('Please select an image file (png or jpg)');
    // }
        for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
        setImages((prevState) => [...prevState, newImage]);
    }
  };


  function handleUpload(){
    const promises = [];
    images.map((image) => {
      const uploadTask = projectStorage.ref(image.name)
      const collectionRef = projectFirestore.collection('PROJECT').doc(teamID).collection("FOLDERS").doc(name).collection('IMAGESFOLDER').doc(folderID).collection("IMAGES");
      promises.push(uploadTask);
      uploadTask.put(image).on(
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

          const url = await uploadTask.getDownloadURL();
          const createdAt = timestamp()

          await collectionRef.add({ url, createdAt });
          setUrl((prevState) => [...prevState, url]);
          // await projectStorage
          //   .ref(image.name)
          //   .getDownloadURL()
          //   .then((urls) => {
          //     setUrl((prevState) => [...prevState, urls]);
          //   });
            
          //   await collectionRef.add({ url, createdAt });

        }
      );
    });

  }


//   const handleChange = (e) => {
//     for (let i = 0; i < e.target.files.length; i++) {
//         const newImage = e.target.files[i];
//         console.log(newImage)
//         newImage["id"] = Math.random();
//         setFile((prevState) => [...prevState, newImage]);
//     }
// };



  return (
    // <form>
    //   {/* <label> */}
    //     <input type="file" multiple onChange={handleChange} />
    //     {/* <span>+</span> */}
    //   {/* </label> */}
    //   <div className="output">
    //     { file && <div>{ file.name }</div> }
    //     { file && <ProgressBar file={file} setFile={setFile} /> }
    //   </div>


    // </form>
    <div>
    <motion.div className="progress-bar"
    initial={{ width: 0 }}
    animate={{ width: progress + '%' }}
  >


  </motion.div>
    <br />
    <br />
    <input type="file" multiple onChange={handleChange} />
    <button onClick={handleUpload}>Upload</button>
    <br />

    <br />

  </div>
     
  );
}


export default UploadForm;