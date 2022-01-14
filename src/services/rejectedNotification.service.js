import { projectStorage, projectFirestore, timestamp } from "../firebase";

const db = projectFirestore.collection("REJECTEDNOTIFICATIONS");

class rejectednotificationservice {
  create(value) {
    return db.add(value);
  }
}

export default new rejectednotificationservice();
