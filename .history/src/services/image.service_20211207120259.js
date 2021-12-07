import { projectStorage, projectFirestore, timestamp } from "../firebase";

const db = projectFirestore.collection("ANNOTATIONS");

class ImageDataService {
  getOnce() {
    return db;
  }

  create(data) {
    return db
      .doc(data.folderID)
      .get()
      .then((doc) => {
        if (doc.exists) {
          console.log("Data is updated");
          return db.doc(data.folderID).update(data);
        } else {
          console.log("Data is created");
          return db.doc(data.folderID).set(data);
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
}

export default new ImageDataService();
