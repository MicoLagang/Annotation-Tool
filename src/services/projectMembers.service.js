import { projectStorage, projectFirestore, timestamp } from "../firebase";

const db = projectFirestore.collection("TEAMMEMBERS");

class TutorialDataService {
  getAll() {
    return db;
  }

  getOnce() {
    return db;
  }

  create(tutorial) {
    return db.add(tutorial);
  }

  update(key, value) {
    return db.child(key).update(value);
  }

  getAnnotator(teamID){
    console.log(teamID)
     return projectFirestore.collection("TEAMMEMBERS").where("projectID", "==", teamID).get()

  }

  deleteTeam(teamID){
   const response =projectFirestore.collection("TEAMMEMBERS").where("projectID", "==", teamID);

    response.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.delete();
      });
    });
  }

  delete(key) {
    return db.child(key).remove();
  }

  deleteAll() {
    return db.remove();
  }

  async getRole(UID, projectID) {
    console.log(UID);
    console.log(projectID);

    const response = projectFirestore
      .collection("TEAMMEMBERS")
      .where("uid", "==", UID)
      .where("projectID", "==", projectID);

    await response.get().then(function(snapshot) {
      if (snapshot.docs.length > 0) {
        snapshot.docs.forEach((doc) => {
          // doc is a DocumentSnapshot with actual data
          const data = doc.data();
          console.log(data.role);
          localStorage.setItem("currentUserRole", data.role);
        });
      } else {
        console.log("No data found");
      }
    });
  }

  editTeamMembers(value,teamID){
    const response =projectFirestore.collection("TEAMMEMBERS").where("projectID", "==", teamID);

    response.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update({
          TeamName : value,
        })
      });
    });
  }
  unArchiveTeam(key){
    const response =projectFirestore.collection("TEAMMEMBERS").where("projectID", "==", key);

    response.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update({
          isArchive : false,
        })
      });
    });
  }
  
  ArchiveTeam(key){
    const response =projectFirestore.collection("TEAMMEMBERS").where("projectID", "==", key);

    response.get().then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        doc.ref.update({
          isArchive : true,
        })
      });
    });
  }
}

export default new TutorialDataService();
