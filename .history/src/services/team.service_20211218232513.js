import { useState } from "react";
import { projectStorage, projectFirestore, timestamp } from "../firebase";
// import { useImage } from '../logic/context/imageContext';

const db = projectFirestore.collection("TEAM");
const storage = projectStorage;
// const { imagesData, setImagesData } = useImage();

class TutorialDataService {
  getAll() {
    return db;
  }

  getOnce() {
    return db;
  }

  getImageFolderData(teamID, name, folderID) {
    return db
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .get();
  }

  create(tutorial) {
    return db.add(tutorial);
    // return db.collection("teams").doc(tutorial).collection('folderimages');
  }

  joinTeam(teamId, member) {
    return db
      .doc(teamId)
      .collection("MEMBERS")
      .add(member);
    console.log(teamId);
    console.log(member);
  }

  async getRole(UID, projectID) {
    console.log(UID);
    console.log(projectID);

    // const response = projectFirestore
    //   .collection("TEAMMEMBERS")
    //   .where("uid", "==", UID)
    //   .where("projectID", "==", projectID);

    // await response.get().then(function(snapshot) {
    //   if (snapshot.docs.length > 0) {
    //     snapshot.docs.forEach((doc) => {
    //       // doc is a DocumentSnapshot with actual data
    //       const data = doc.data();
    //       console.log(data.role);
    //       localStorage.setItem("currentUserRole", data.role);
    //     });
    //   } else {
    //     console.log("No data found");
    //   }
    // });
  }

  deleteTeam(teamID) {
    // console.log(teamID)
    // return db.doc(teamID).delete()
    projectFirestore
      .collection("TEAM")
      .doc(teamID)
      .delete();
    //   projectFirestore.collection("TEAM").doc(teamID).get().then(querySnapshot => {
    //     querySnapshot.docs.forEach(snapshot => {
    //         snapshot.ref.delete();
    //     })
    // })
  }

  deleteProject(teamID, name) {
    return db
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .delete();
    // console.log(teamID)
    // console.log(name)
    console.log("delete project");
  }

  deleteFolder(teamID, name, folderID) {
    return db
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .delete();
  }

  deleteImages(teamID, name, folderID, imageID) {
    const ref = db
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .collection("IMAGES")
      .doc(imageID);

    ref.get().then((snapshot) => {
      console.log(snapshot.data().url);

      var fileUrl = snapshot.data().url;

      // Create a reference to the file to delete
      var fileRef = storage.refFromURL(fileUrl);

      // console.log("File in database before delete exists : " + fileRef.exists());

      // Delete the file using the delete() method
      fileRef
        .delete()
        .then(function() {
          // File deleted successfully
          console.log("File Deleted");

          ref.delete();
        })
        .catch(function(error) {
          // Some Error occurred
        });

      // console.log("File in database after delete exists : " + fileRef.exists());
    });
  }

  isValidated(teamID, name, folderID,imageID,currentUserName){

   return db
    .doc(teamID)
    .collection("FOLDERS")
    .doc(name)
    .collection("IMAGESFOLDER")
    .doc(folderID)
    .collection("IMAGES")
    .doc(imageID).update({
      validated: currentUserName,
    })


 
  
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }

  editTeam(value, teamID) {
    return db.doc(teamID).update({
      name: value,
    });
  }

  submitAnnotation(teamID, name, folderID) {
    return db
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .update({
        isSubmitted: true,
        isCompleted: true,
        isRejected:false
      });
  }

  acceptAnnotaion(teamID, name, folderID) {
    return db
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .update({
        isAccepted: true,
        isCompleted:false,
        isRejected:false,
        isSubmitted: false,
      });
  }


  rejectAnnotation(teamID, name, folderID) {
    return db
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .update({
        isSubmitted: false,
        isCompleted:false,
        isRejected:true,
      });
  }

  evaluateAnnotation(teamID, name, folderID) {
    return db
      .doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .update({
        isSubmitted: false,
        isCompleted:false,
        isRejected:false,
        isAccepted:false,
      });
  }

  unArchiveTeam(key) {
    return db.doc(key).update({
      isArchive: false,
    });
  }

  ArchiveTeam(key) {
    return db.doc(key).update({
      isArchive: true,
    });
  }
}

export default new TutorialDataService();
