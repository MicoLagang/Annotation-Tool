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
}

export default new ImageDataService();
