import { projectStorage, projectFirestore, timestamp } from "../firebase";

const db = projectFirestore.collection("PROJECTMEMBERS");

class teamMembers {
  getAll() {
    return db;
  }

  getOnce() {
    return db;
  }

  create(tutorial) {
    return db.add(tutorial)

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

  deleteproject(value){
    const response =projectFirestore.collection("PROJECTMEMBERS").where("teamID", "==", value);

    response.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

  editTeamMembers(value,teamID){
    return db.doc(teamID).update({
      name : value,
    })
    console.log(value)
    console.log(teamID)
  }

}

export default new teamMembers();
