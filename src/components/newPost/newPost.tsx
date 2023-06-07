import { ChangeEvent, useState } from "react";
import { addPost } from "../../services/firebase";
import { v4 as uuidv4} from 'uuid';
import { useNavigate} from 'react-router-dom';
import "./newPost.css"
import { auth } from "../../services/firebase";
import { FilterMenu } from "../filterMenu/filterMenu";

export function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [previewURL, setPreviewURL] = useState('');

    function setPostOnline(){
        const newPost = {[uuidv4()]: {
            title: title,
            content: content,
            user: auth.currentUser?.displayName,
            category: category,
            createdAt: new Date().toISOString().slice(0, 19),
            likeNum: 0
        }}
        addPost(newPost)
        navigate('/');
        return ;
    }
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
    
        setPreviewURL(URL.createObjectURL(selectedFile));
        // const storageRef = firebase.storage().ref();
        // const imageRef = storageRef.child('images/' + imageFile.name);
      
        // // Upload the image file to Firebase Storage
        // const uploadTask = imageRef.put(imageFile);
      
        // // Listen for state changes, errors, and completion of the upload
        // uploadTask.on(
        //   firebase.storage.TaskEvent.STATE_CHANGED,
        //   (snapshot) => {
        //     // Get the progress percentage
        //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //     console.log('Upload is ' + progress + '% done');
        //   },
        //   (error) => {
        //     // Handle any errors during the upload
        //     console.error(error);
        //   },
        //   () => {
        //     // Upload completed successfully
        //     // Get the download URL of the uploaded image
        //     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        //       console.log('Image available at', downloadURL);
        //       // Store the download URL in your state or perform further actions
        //     });
        //   }
        // );
      };

    return( 
        <div className="main-new-post main-post main-body"> 
            <h1>Create a Post </h1>
            <div className="create-post-box">
            <input
                type="text"
                placeholder="Title"
                className="newpost-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
                <textarea placeholder="Text (optional)" className="newpost-input newtext-area" value = {content} onChange={e=> {setContent(e.target.value)} }/><br />
                <div className="category">
                    <span>Choose a Category</span>
                    <FilterMenu 
                    setCategory={setCategory}
                    />
                </div>
                <input type="file" className="image-input custom-input" onChange={handleImageUpload} accept="image/*" />
                {previewURL && <img src={previewURL} alt="Preview" className="post-image" />}
                <button className="postbtn lgn-btn" onClick={() => setPostOnline()}>Add</button>
            </div>
        </div>
    )
}