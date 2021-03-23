var firebaseConfig = {
  apiKey: "AIzaSyD-kbYj3HCrVNxEuci-HNOxI0egDBjG1Co",
  authDomain: "chat-app-4d149.firebaseapp.com",
  projectId: "chat-app-4d149",
  storageBucket: "chat-app-4d149.appspot.com",
  messagingSenderId: "514142097468",
  appId: "1:514142097468:web:6f10c8b391e8d622fb7339",
  measurementId: "G-2TCHS6YBNT",
};

firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

if (!localStorage.getItem("name")) {
  name = prompt("What is your name?");
  localStorage.setItem("name", name);
} else {
  name = localStorage.getItem("name");
}
document.querySelector("#name").innerText = name;

document.querySelector("#change-name").addEventListener("click", () => {
  name = prompt("What is your name?");
  localStorage.setItem("name", name);
  document.querySelector("#name").innerText = name;
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  let message = document.querySelector("#message-input").value;
  db.collection("messages")
    .add({
      name: name,
      message: message,
      date: firebase.firestore.Timestamp.fromMillis(Date.now()),
    })
    .then((docRef) => {
      console.log(`Document written with ID: ${docRef.id}`);
      document.querySelector("#message-form").reset();
    })
    .catch((error) => {
      console.log(`Error adding document: ${error}`);
    });
});

db.collection("messages")
  .orderBy("date", "asc")
  .onSnapshot((snapshot) => {
    document.querySelector("#messages").innerHTML = "";
    snapshot.forEach((doc) => {
      let message = document.createElement("div");
      message.innerHTML = `
		<p class="name">${doc.data().name}</p>
		<p>${doc.data().message}</p>
		`;
      document.querySelector("#messages").prepend(message);
    });
  });

document.querySelector("#clear").addEventListener("click", () => {
  db.collection("messages")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        db.collection("messages")
          .doc(doc.id)
          .delete()
          .then(() => {
            console.log("Document successfully deleted!");
          })
          .catch((error) => {
            console.error(`Error removing document: ${error}`);
          });
      });
    })
    .catch((error) => {
      console.log(`Error getting documents: ${error}`);
    });
});
