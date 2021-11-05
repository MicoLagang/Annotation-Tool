import { projectStorage, projectFirestore, timestamp } from "../firebase";

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

  async getRole(UID, projectID) {
    console.log(UID);
    console.log(projectID);

    const response = projectFirestore
      .collection("PROJECTMEMBERS")
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
}

export default new TutorialDataService();