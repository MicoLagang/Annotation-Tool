import { useState, useEffect } from 'react';
import { projectStorage, projectFirestore, timestamp } from '../../../firebase';
import { useParams } from 'react-router-dom'

const useStorage = (file) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);
  const { name } = useParams()
  const {teamID} = useParams()
  const {folderID} = useParams()

  useEffect(() => {

    // references
    const storageRef = projectStorage.ref(file.name);

    // const collectionRef = projectFirestore.collection('teams').doc(name).collection("images");
    const collectionRef = projectFirestore.collection('PROJECT').doc(folderID).collection("FOLDERS").doc(name).collection('IMAGESFOLDER').doc(teamID).collection("IMAGES");

    console.log(storageRef);
    storageRef.put(file).on('state_changed', (snap) => {
      let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      setProgress(percentage);
    }, (err) => {
      setError(err);
    }, async () => {
      const url = await storageRef.getDownloadURL();
      const createdAt = timestamp();
      await collectionRef.add({ url, createdAt });
      setUrl(url);
    });
  }, [file]);

  return { progress, url, error };
}

export default useStorage;