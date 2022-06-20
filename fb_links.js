import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-storage.js";

app = initializeApp(firebaseConfig);
analytics = getAnalytics(app);
auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);