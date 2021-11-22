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

  deleteTeam(teamID) {
    // console.log(teamID)
    // return db.doc(teamID).delete()
    const response = projectFirestore.collection("TEAM").doc(teamID);
    response.delete();
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
    db.doc(teamID)
      .collection("FOLDERS")
      .doc(name)
      .collection("IMAGESFOLDER")
      .doc(folderID)
      .collection("IMAGES")
      .doc(imageID)
      .delete();

    var fileUrl =
      "https://firebasestorage.googleapis.com/v0/b/ilabel-tool.appspot.com/o/245928964_223982296387420_5334875800510505173_n.jpg?alt=media&token=3008911d-1204-42c5-895b-573bd8fe2607";

    // Create a reference to the file to delete
    var fileRef = storage.refFromURL(fileUrl);

    console.log("File in database before delete exists : " + fileRef.exists());

    // Delete the file using the delete() method
    fileRef
      .delete()
      .then(function() {
        // File deleted successfully
        console.log("File Deleted");
      })
      .catch(function(error) {
        // Some Error occurred
      });

    console.log("File in database after delete exists : " + fileRef.exists());
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
}

export default new TutorialDataService();
