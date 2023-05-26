// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc, deleteField, setDoc, deleteDoc, getDocs, collection, query, where } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { arrayUnion, arrayRemove } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyALSOE8H14F-bAimyccnRfpfKCIX2z8wbE",
  authDomain: "major-project-19028.firebaseapp.com",
  projectId: "major-project-19028",
  storageBucket: "major-project-19028.appspot.com",
  messagingSenderId: "537624713062",
  appId: "1:537624713062:web:c509f56c66eb171a2b5aa7",
  measurementId: "G-HB40RNBEGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

async function getHomePageObj() {
    const posts = await getDoc(doc(db, "posts", "allPosts"));
    return posts.data();
}

async function addPost(postObj: {[key: string]: object}){
    try {
        const key = Object.keys(postObj)[0]
        const docRefForAllPosts = doc(db, "posts", "allPosts");
        const docRefForPostData = doc(db, "postData", key);
        await updateDoc(docRefForAllPosts, postObj);
        await setDoc(docRefForPostData, postObj[key])
    }
    catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function registerUserWithEmailAndPassword(email: string, password: string) {
    createUserWithEmailAndPassword(auth, email, password).then ((userCredential) => {
        const user = userCredential.user;
        return user;
    })
    .catch((e) => {
        console.error("Register Error ", e.message)
    })
}

async function logInWithEmailAndPassword(email: string, password: string){
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        return user;
    })
    .catch((e) => {
        console.error("Login Error", e.message)
    })
} 

function logout(){
    signOut(auth).then(() => {
        return
    }).catch((e) => {
        console.error("Cannot SignOut", e.message)
    })
}

async function deletePost(key: string){
    const postRef = doc(db, 'posts', 'allPosts');
    const field: {[key: string] : object}= {};
    field[key] = deleteField();
    await updateDoc(postRef, field);
}

async function getPostData(key: string){
    const docRef = doc(db, "postData", key);
    const post = await getDoc(docRef)
    return post.data()
}

async function postNewComment(key: string, message: string, parentId: string){
    const commntRef = doc(db, 'comments', key);
    const cmmtObj = {
        owner: "user",
        message: message,
        parent: parentId,
        createdAt: new Date().toISOString().slice(0, 19),
        likeNum: 0,
        }
    await setDoc(commntRef, cmmtObj);
}

async function updateComment(key: string, message: string){
    const commntRef = doc(db, 'comments', key);
    await updateDoc(commntRef, {
        message: message
    })
}

async function deleteComment(key: string){
    await deleteDoc(doc(db,"comments", key))
}

async function getComments(key: string){
    const commntRef = collection(db, 'comments');
    const commntQuery = query(commntRef, where("parent","==",key))
    const commnts = await getDocs(commntQuery)
    const commntsObj: {[key: string]: object} = {}
    commnts.forEach((doc) => {
        commntsObj[doc.id] = doc.data()
    })
    return commntsObj
}

async function updateLikeCount(key: string, likeCount: number){
    const commntRef = doc(db, 'comments', key)
    await updateDoc(commntRef,{
        likeNum: likeCount
    })
}

async function toggleLike(key: string, user: string, currentValue: boolean){
    const likeRef = doc(db, 'commentLike', key)
    await updateDoc(likeRef,{
        [user]: !currentValue
    })

    
}

async function manageUserLikedComment(user: string, cmmtId: string){
    const userRef = doc(db, 'comments', 'users')
    await updateDoc(userRef, {
        [user]: arrayUnion(cmmtId)
    })
}

async function manageUserRemovedLikedComment(user: string, cmmtId: string){
    const userRef = doc(db, 'comments', 'users')
    await updateDoc(userRef, {
        [user]: arrayRemove(cmmtId)
    })
}

export { 
    getHomePageObj, 
    addPost, 
    registerUserWithEmailAndPassword, 
    logInWithEmailAndPassword, 
    logout, 
    deletePost, 
    getPostData,
    postNewComment,
    getComments,
    updateComment,
    deleteComment,
    updateLikeCount,
    toggleLike,
    manageUserLikedComment,
    manageUserRemovedLikedComment
}