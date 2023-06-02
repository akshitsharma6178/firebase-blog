import { useState } from "react";
import { addPost } from "../../services/firebase";
import { v4 as uuidv4} from 'uuid';
import { useNavigate} from 'react-router-dom';
import "./newPost.css"
import { auth } from "../../services/firebase";

export function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    function setPostOnline(): import("react").MouseEventHandler<HTMLButtonElement> | undefined {
        const newPost = {[uuidv4()]: {
            title: title,
            content: content,
            user: auth.currentUser?.displayName
        }}
        addPost(newPost)
        navigate('/');
        return ;
    }

    return( 
        <div className="main-new-post"> 
            <h1>Create a Post </h1>
            <div className="create-post-box">
                <textarea placeholder="Title" className="newpost-input" value = {title} onChange={e => { setTitle(e.target.value)}}/><br />
                <textarea placeholder="Text(optional)" className="newpost-input newtext-area" value = {content} onChange={e=> {setContent(e.target.value)} }/><br />
                <button className="btn postbtn" onClick={setPostOnline}>add</button>
            </div>
        </div>
    )
}