import { projectStorage, projectFirestore, timestamp } from '../firebase';

const db = projectFirestore.collection("PROJECTMEMBERS");


class TutorialDataService {
  getAll() {
    return db;
  }

  getOnce() {
    return db;
  }

  create(tutorial) {
    return db.add(tutorial);
  
    // return db.add(teamID);
    // return db.collection("teams").doc(tutorial).collection('folderimages');
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