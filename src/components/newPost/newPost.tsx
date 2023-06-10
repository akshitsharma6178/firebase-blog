import { ChangeEvent, useState } from "react";
import { addPost, storage } from "../../services/firebase";
import { v4 as uuidv4} from 'uuid';
import { useNavigate} from 'react-router-dom';
import "./newPost.css"
import { auth } from "../../services/firebase";
import { FilterMenu } from "../filterMenu/filterMenu";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { TextEditor } from "../textEditor/textEditor";
import 'draft-js/dist/Draft.css';


export function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [previewURL, setPreviewURL] = useState('');
    const [file, setFile] = useState<File>();

    async function setPostOnline(){
        if (file){
            const imageRef = ref(storage, `${'images/' + file.name}`);

            const uploadTask = uploadBytesResumable(imageRef, file)
            uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
            },
            (error) => {
                console.error(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                const newPost = {[uuidv4()]: {
                    title: title,
                    content: content,
                    user: auth.currentUser?.displayName,
                    category: category,
                    createdAt: new Date().toISOString().slice(0, 19),
                    downloadURL: downloadURL,
                    likeNum: 0
                }}
                    addPost(newPost)
                    navigate('/');
                    return ;
                });
            }
            );
        }
        else{
            const newPost = {[uuidv4()]: {
                title: title,
                content: content,
                user: auth.currentUser?.displayName,
                category: category,
                createdAt: new Date().toISOString().slice(0, 19),
                downloadURL: '',
                likeNum: 0
            }}
            addPost(newPost)
            navigate('/');
            return ;
        }
    }
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setPreviewURL(URL.createObjectURL(selectedFile));
        setFile(selectedFile)
      };

    return(
        <> 
        <div className="main-new-post main-body"> 
            <h1>Create a Post </h1>
            <div className="create-post-box">
            <input
                type="text"
                placeholder="Title"
                className="newpost-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
                <TextEditor 
                 setMethod={setContent}/>  
                {/* <textarea placeholder="Text (optional)" className="newpost-input newtext-area" value = {content} onChange={e=> {setContent(e.target.value)} }/><br /> */}
                <div className="category">
                    <span>Choose a Category</span>
                    <FilterMenu 
                    setCategory={setCategory}
                    />
                </div>
                <input type="file" className="custom-input" onChange={handleImageUpload} accept="image/*" />
                {previewURL && <img src={previewURL} alt="Preview" className="image-preview" />}
                <button className="postbtn lgn-btn" onClick={() => setPostOnline()}>Add</button>
            </div>
        </div>
        </>
    )
}