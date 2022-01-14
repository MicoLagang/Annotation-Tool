import { projectStorage, projectFirestore, timestamp } from "../firebase";

const db = projectFirestore.collection("NOTIFICATIONS");

class notificationservice {
  create(value) {
    return db.add(value);
  }
}

export default new notificationservice();
