import { useState, useEffect } from 'react';
import { projectFirestore } from '../../../firebase';
import { useParams } from 'react-router-dom'

const useFirestore = (collection,sub) => {
  const [docs, setDocs] = useState([]);
  const { name } = useParams()
  const {teamID} = useParams()
  const {folderID} = useParams()

  useEffect(() => {
    // const unsub = projectFirestore.collection(collection).doc(name).collection("images")
      // const unsub = projectFirestore.collection(collection).doc(teamID).collection("FOLDERS").doc(name).collection('images')
      const unsub = projectFirestore.collection('PROJECT').doc(folderID).collection("FOLDERS").doc(name).collection('IMAGESFOLDER').doc(teamID).collection("IMAGES")
      .orderBy('createdAt', 'desc')
      .onSnapshot(snap => {
        let documents = [];
        snap.forEach(doc => {
          documents.push({...doc.data(), id: doc.id});
        });
        setDocs(documents);
      });

    return () => unsub();

  }, [collection]);

  return { docs };
}

export default useFirestore;