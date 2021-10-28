import { projectStorage, projectFirestore, timestamp } from "../firebase";

const db = projectFirestore.collection("ANNOTATIONS");

class ImageDataService {
  getOnce() {
    return db;
  }

  create(data) {
    return db.add(data);
    // console.log(data);
  }

  read() {
    var docRef = projectFirestore
      .collection("ANNOTATIONS")
      .doc("24ul5NguzlVppt0TXgjU");

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          // console.log("Document data:", doc.data());
          return doc.data().data;
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  }
}

export default new ImageDataService();
