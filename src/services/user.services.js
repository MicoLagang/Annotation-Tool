import { projectStorage, projectFirestore, timestamp } from '../firebase';

const db = projectFirestore.collection("USERS");

class userServices {
  getAll() {
    return db;
  }

  getOnce() {
    return db;
  }

  create(tutorial) {
    return db.add(tutorial);
    console.log(tutorial)
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

  getName(value){
    const response = projectFirestore.collection("USERS").where("email", "==",value)

    response.get().then(function(snapshot) {

        snapshot.docs.forEach((doc) => {
          // doc is a DocumentSnapshot with actual data
          const data = doc.data().username;
          localStorage.setItem("currentUserName",data );
        });
    });
  }
}

export default new userServices();