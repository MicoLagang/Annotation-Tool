import { projectStorage, projectFirestore, timestamp } from '../firebase';
// import { useImage } from '../logic/context/imageContext';

const db = projectFirestore.collection("PROJECT");
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
  joinTeam(teamId, member){
    return db.doc(teamId).collection("MEMBERS").add(member)
    console.log(teamId)
    console.log(member)
  }

  deleteTeam(teamID){
    console.log(teamID)
    return db.doc(teamID).delete();
  }

  deleteProject(teamID,name){
    return db.doc(teamID).collection('FOLDERS').doc(name).delete();
    // console.log(teamID)
    // console.log(name)
    console.log("delete project")
  }

  deleteFolder(teamID,name,folderID){
    return db.doc(teamID).collection('FOLDERS').doc(name).collection("IMAGESFOLDER").doc(folderID).delete();
  }

  deleteImages(teamID,name,folderID,imageID){
    return db.doc(teamID).collection('FOLDERS').doc(name).collection("IMAGESFOLDER").doc(folderID).collection("IMAGES").doc(imageID).delete()
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