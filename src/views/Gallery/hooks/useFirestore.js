import { useState, useEffect } from "react";
import { projectFirestore } from "../../../firebase";
import { useParams } from "react-router-dom";

const useFirestore = (collection, sub) => {
  const [docs, setDocs] = useState([]);

  const teamID = localStorage.getItem("currentTeamID");
  const name = localStorage.getItem("currentProjectID");
  const folderID = localStorage.getItem("currentImagesFolderID");

  useEffect(() => {
    const unsub = projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .collection("IMAGES")
      .orderBy("createdAt", "desc")
      .onSnapshot((snap) => {
        let documents = [];
        snap.forEach((doc) => {
          documents.push({ ...doc.data(), id: doc.id });
        });
        setDocs(documents);
      });

    return () => unsub();
  }, [collection]);

  return { docs };
};

export default useFirestore;
