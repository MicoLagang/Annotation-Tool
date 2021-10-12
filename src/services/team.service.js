import { projectStorage, projectFirestore, timestamp } from '../firebase';

const db = projectFirestore.collection("PROJECT");

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