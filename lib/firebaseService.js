import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  doc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { db } from "./firebase";

// Save a typing test score to Firebase
export const saveScore = async (scoreData) => {
  try {
    const docRef = await addDoc(collection(db, "scores"), {
      ...scoreData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("Score saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving score: ", error);
    throw error;
  }
};

// Get all scores from Firebase
export const getAllScores = async () => {
  try {
    const q = query(collection(db, "scores"), orderBy("wpm", "desc"));
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });
    return scores;
  } catch (error) {
    console.error("Error getting scores: ", error);
    throw error;
  }
};

// Get user's personal best score
export const getUserBestScore = async (username) => {
  try {
    const q = query(
      collection(db, "scores"), 
      where("username", "==", username),
      orderBy("wpm", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error("Error getting user best score: ", error);
    throw error;
  }
};

// Get user's score history
export const getUserHistory = async (username) => {
  try {
    const q = query(
      collection(db, "scores"), 
      where("username", "==", username),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });
    return scores;
  } catch (error) {
    console.error("Error getting user history: ", error);
    throw error;
  }
};

// Get leaderboard (top scores from all users)
export const getLeaderboard = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, "scores"), 
      orderBy("wpm", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const scores = [];
    const userBestScores = {}; // Track best score per user
    
    querySnapshot.forEach((doc) => {
      const score = { id: doc.id, ...doc.data() };
      const username = score.username;
      
      // Only keep the best score for each user
      if (!userBestScores[username] || score.wpm > userBestScores[username].wpm) {
        userBestScores[username] = score;
      }
    });
    
    // Convert to array and sort by WPM
    const leaderboard = Object.values(userBestScores).sort((a, b) => b.wpm - a.wpm);
    return leaderboard;
  } catch (error) {
    console.error("Error getting leaderboard: ", error);
    throw error;
  }
};

// Save custom test snippets
export const saveCustomTests = async (tests, adminId) => {
  try {
    const docRef = await addDoc(collection(db, "customTests"), {
      tests,
      adminId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving custom tests: ", error);
    throw error;
  }
};

// Get custom test snippets
export const getCustomTests = async () => {
  try {
    const q = query(collection(db, "customTests"), orderBy("createdAt", "desc"), limit(1));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return doc.data().tests;
    }
    return [];
  } catch (error) {
    console.error("Error getting custom tests: ", error);
    throw error;
  }
};
