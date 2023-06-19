import { useState } from "react";
import { addPost} from "../../services/firebase";
import { v4 as uuidv4} from 'uuid';
import { useNavigate} from 'react-router-dom';
import "./newPost.css"
import { auth } from "../../services/firebase";
import { FilterMenu } from "../filterMenu/filterMenu";
import { TextEditor } from "../textEditor/textEditor";
import 'draft-js/dist/Draft.css';


export function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");

    async function setPostOnline(){
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
                 setMethod={setContent}
                 isViewOnly={false}/>  
                {/* <textarea placeholder="Text (optional)" className="newpost-input newtext-area" value = {content} onChange={e=> {setContent(e.target.value)} }/><br /> */}
                <div className="category">
                    <span>Choose a Category</span>
                    <FilterMenu 
                    setCategory={setCategory}
                    addTrue={true}
                    />
                </div>
                <button className="postbtn lgn-btn" onClick={() => setPostOnline()}>Post</button>
            </div>
        </div>
        </>
    )
}