// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, getDoc, deleteField, setDoc, deleteDoc, getDocs, collection, query, where, orderBy, arrayRemove, arrayUnion, FieldValue} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
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

//backup config

// const firebaseConfig = {
//     apiKey: "AIzaSyBtwJPCyGVUUiYCMCG3u2F12oH5OSMF66c",
//     authDomain: "try1-e8d1b.firebaseapp.com",
//     databaseURL: "https://try1-e8d1b.firebaseio.com",
//     projectId: "try1-e8d1b",
//     storageBucket: "try1-e8d1b.appspot.com",
//     messagingSenderId: "316167707997",
//     appId: "1:316167707997:web:4fa2add4d30cececb0dcb4",
//     measurementId: "G-N7X1QMXV5Q"
//   };

type filterType = {
    [key: string] : []
}

interface cacheStructure {
    [key: string] : object | undefined,
    homePageObj? : homePageObjStructure,
    filters? : filterType,
    cmmntObj? : commntCacheStructure
}

interface homePageObjStructure  {
        [key : string ] : {
            title: string;
            content: string;
            user: string;
            category: string;
            createdAt: string;
            likedByMe?: boolean;
            dislikedByMe?: boolean
            likeNum: number
        }
}

interface commntStructure {
        [key: string]: {
            message: string,
            likeNum: number,
            likedByMe?: boolean,
            dislikedByMe?: boolean,
            createdAt: string,
            owner: string,
            parent: string
        }
}


interface commntCacheStructure {
    [key: string]: {
        [key: string]: {
            message: string,
            likeNum: number,
            likedByMe?: boolean,
            dislikedByMe?: boolean,
            createdAt: string,
            owner: string,
            parent: string
        }
    } 
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
// const batch = writeBatch(db);
const provider = new GoogleAuthProvider();
let cache : cacheStructure = {}

async function getHomePageObj() {
    cache = getLocalCache()
    if(cache.homePageObj) {
        return cache.homePageObj
    }
    const posts = await getDoc(doc(db, "posts", "allPosts"));
    const data = posts.data();
    if(data){
        cache.homePageObj = data as homePageObjStructure;
        const keys = Object.keys(data as object);
        for (const key of keys) {
            data[key].likedByMe = await getLikeStatus(key, 'posts');
            data[key].dislikedByMe = await getDislikeStatus(key, 'dislikePosts')
        }
        setLocalCache()
        return data
    }
}

async function getLikeStatus(key: string, type: string){
    if(auth.currentUser) {
        const postLikeRef = doc(db, 'userLikes', auth.currentUser?.uid as string)
        const data = await getDoc(postLikeRef)
        const strData = data.data()
        return strData ? strData[type]? strData[type].includes(key) ? true : false : false : false
    }
}

async function getDislikeStatus(key: string, type: string){
    if(auth.currentUser) {
        const postLikeRef = doc(db, 'userLikes', auth.currentUser?.uid as string)
        const data = await getDoc(postLikeRef)
        const strData = data.data()
        return strData ? strData[type]?.includes(key) ? true : false : false
    }
}

async function addPost(postObj: {[key: string]: object}){
    try {
        const key = Object.keys(postObj)[0]
        const docRefForAllPosts = doc(db, "posts", "allPosts");
        const docRefForPostData = doc(db, "postData", key);
        await updateDoc(docRefForAllPosts, postObj);
        await setDoc(docRefForPostData, postObj[key])
        delete cache.homePageObj
        setLocalCache()
    }
    catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function registerUserWithEmailAndPassword(name: string,email: string, password: string) {
        await createUserWithEmailAndPassword(auth, email, password);
        auth.currentUser? await updateProfile(auth.currentUser, {
            displayName: name}): null
        localStorage.clear()
}

async function logInwithGoogle(){
    signInWithPopup(auth, provider)
    localStorage.clear()
}

async function logInWithEmailAndPassword(email: string, password: string){
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        localStorage.clear()
        return user;
    })
    .catch((e) => {
        console.error("Login Error", e.message)
    })
} 

function logout(){
    signOut(auth).then(() => {
        localStorage.clear()
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
    cache = getLocalCache();
    if (cache[key]) {
        return cache[key]
    }
    const docRef = doc(db, "postData", key);
    const post = await getDoc(docRef)
    const data = post.data()
    cache[key] = data
    setLocalCache()
    return data
}

async function postNewComment(key: string, message: string, parentId: string){
    const commntRef = doc(db, 'comments', key);
    const cmmtObj = {
        owner: auth.currentUser?.displayName,
        message: message,
        parent: parentId,
        createdAt: new Date().toISOString().slice(0, 19),
        likeNum: 0,
        }
    if(cache.cmmntObj) {
        cache.cmmntObj[parentId][key] = cmmtObj as {
            message: string,
            likeNum: number,
            likedByMe?: boolean,
            dislikedByMe?: boolean,
            createdAt: string,
            owner: string,
            parent: string
        };
    }
    setLocalCache()
    await setDoc(commntRef, cmmtObj);
}

async function updateComment(key: string, message: string){
    delete cache.cmmntObj
    setLocalCache()
    const commntRef = doc(db, 'comments', key);
    await updateDoc(commntRef, {
        message: message
    })
}

async function deleteComment(key: string){
    delete cache.cmmntObj
    setLocalCache()
    await deleteDoc(doc(db,"comments", key))

}

async function getComments(key: string){
    getLocalCache()
    if(cache.cmmntObj && cache.cmmntObj[key]){
        const sortedArray = Object.entries(cache.cmmntObj[key]? cache.cmmntObj[key] : {})
        .sort(([, a], [, b]) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map(([key, value]) => ({ [key]: value }));
        const sortedObject = Object.assign({}, ...sortedArray);
        return sortedObject
    }
    const commntRef = collection(db, 'comments');
    const commntQuery = query(commntRef, where("parent","==",key), orderBy("createdAt", "desc"))
    const commnts = await getDocs(commntQuery)
    const commntsObj: commntStructure = {}
    commnts.forEach((doc) => {
        const data = doc.data() as {
            message: string,
            likeNum: number,
            likedByMe?: boolean,
            dislikedByMe?: boolean,
            createdAt: string,
            owner: string,
            parent: string
        };
        commntsObj[doc.id] = data
    })
    const keys = Object.keys(commntsObj)
    for (const key of keys) {
        commntsObj[key].likedByMe = await getLikeStatus(key, 'comments');
        commntsObj[key].dislikedByMe = await getDislikeStatus(key, 'dislikeComments')
    }
    cache.cmmntObj ??= {};
    cache.cmmntObj[key] = commntsObj
    setLocalCache()
    return commntsObj
}

async function getFilters(){
    cache = getLocalCache();
    if (cache.filters) {
        return cache.filters
    }
    const filterObj = await getDoc(doc(db, "posts", "filters"));
    const data = filterObj.data()
    cache.filters = data as filterType
    setLocalCache()
    return data
}

function getLocalCache() {
    return localStorage.getItem("cache") ? JSON.parse(localStorage.getItem("cache") as string) : {};
}

function setLocalCache() {
    localStorage.setItem("cache", JSON.stringify(cache))
}

function getTimeDifference(createdAt: string){
    const createdAtDateUTC = new Date(createdAt)
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const createdAtLocal = new Date(createdAtDateUTC.getTime() - timezoneOffset)
    const timeDifference = Date.now() - createdAtLocal.getTime();
    // Define the time intervals for formatting
    const minute = 60 * 1000; // 1 minute = 60 seconds * 1000 milliseconds
    const hour = 60 * minute;
    const day = 24 * hour;

    // Determine the appropriate format based on the time difference
    let formattedTime;
    if (timeDifference < minute) {
      formattedTime = `${Math.floor(timeDifference / 1000)} seconds ago`;
    } else if (timeDifference < hour) {
      formattedTime = `${Math.floor(timeDifference / minute)} minutes ago`;
    } else if (timeDifference < day) {
      formattedTime = `${Math.floor(timeDifference / hour)} hours ago`;
    } else {
      formattedTime = `${Math.floor(timeDifference / day)} days ago`;
    }
    return formattedTime
  }

async function handleCommentLike(parentKey: string, key: string, status: boolean) {
    const likeDataRef = doc(db,'userLikes', auth.currentUser?.uid as string)
    const cmmntRef = doc(db,'comments', key)
    if(cache.cmmntObj && cache.cmmntObj[parentKey] && typeof cache.cmmntObj[parentKey][key].likeNum === 'number'){
        const comment = cache.cmmntObj[parentKey][key];
        const likeData = {} as {
            comments? : FieldValue
            dislikeComments? : FieldValue
        }
        if (status) {
            if (comment.likedByMe) {
                comment.likedByMe = false;
                comment.likeNum -= 1;
                likeData.comments = arrayRemove(key)
            }
            else if (comment.dislikedByMe) {
                comment.likedByMe = true;
                comment.dislikedByMe = false;
                comment.likeNum += 2;
                likeData.comments = arrayUnion(key)
                likeData.dislikeComments = arrayRemove(key)
            }
            else{
                comment.likedByMe = true;
                comment.likeNum += 1;
                likeData.comments = arrayUnion(key)
            }
        } else {
            if (comment.dislikedByMe) {
                comment.dislikedByMe = false;
                comment.likeNum += 1;
                likeData.dislikeComments = arrayRemove(key)
            }
            else if (comment.likedByMe) {
                comment.dislikedByMe = true;
                comment.likedByMe = false;
                comment.likeNum -= 2;
                likeData.comments = arrayRemove(key)
                likeData.dislikeComments = arrayUnion(key)
            }
            else{
                comment.dislikedByMe = true;
                comment.likeNum -= 1;
                likeData.dislikeComments = arrayUnion(key)
            }
        }
        setLocalCache()
        await setDoc(likeDataRef,likeData,{merge: true});
        await updateDoc(cmmntRef, {
            likeNum: comment.likeNum
        })
    }
    
}

async function handlePostLike(key: string, status: boolean) {
    const likeDataRef = doc(db,'userLikes', auth.currentUser?.uid as string)
    const postRef = doc(db,'posts', 'allPosts')
    if(cache.homePageObj){
        const likeData = {} as {
            posts? : FieldValue
            dislikePosts? : FieldValue
        }
        if (status) {
            if (cache.homePageObj[key].likedByMe) {
                cache.homePageObj[key].likedByMe = false;
                cache.homePageObj[key].likeNum -= 1;
                likeData.posts = arrayRemove(key)
            }
            else if (cache.homePageObj[key].dislikedByMe) {
                cache.homePageObj[key].likedByMe = true;
                cache.homePageObj[key].dislikedByMe = false;
                cache.homePageObj[key].likeNum += 2;
                likeData.posts = arrayUnion(key)
                likeData.dislikePosts = arrayRemove(key)
            }
            else{
                cache.homePageObj[key].likedByMe = true;
                cache.homePageObj[key].likeNum += 1;
                likeData.posts = arrayUnion(key)
            }
        } else {
            if (cache.homePageObj[key].dislikedByMe) {
                cache.homePageObj[key].dislikedByMe = false;
                cache.homePageObj[key].likeNum += 1;
                likeData.dislikePosts = arrayRemove(key)
            }
            else if (cache.homePageObj[key].likedByMe) {
                cache.homePageObj[key].dislikedByMe = true;
                cache.homePageObj[key].likedByMe = false;
                cache.homePageObj[key].likeNum -= 2;
                likeData.posts = arrayRemove(key)
                likeData.dislikePosts = arrayUnion(key)
            }
            else{
                cache.homePageObj[key].dislikedByMe = true;
                cache.homePageObj[key].likeNum -= 1;
                likeData.dislikePosts = arrayUnion(key)
            }
        }
        setLocalCache()
        const postUpdateData = {...cache.homePageObj[key]};
        delete postUpdateData.likedByMe;
        delete postUpdateData.dislikedByMe;
        await setDoc(likeDataRef,likeData,{merge: true});
        await updateDoc(postRef, {
            [key]: postUpdateData
        })
    }
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
    logInwithGoogle,
    auth,
    getFilters,
    getTimeDifference,
    handleCommentLike,
    handlePostLike,
    cache
}