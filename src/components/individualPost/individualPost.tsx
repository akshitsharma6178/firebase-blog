import { useParams } from "react-router-dom"
import { cache, getComments, getPostData, getTimeDifference, postNewComment } from "../../services/firebase";
import { useEffect, useState } from "react";
import { CommentForm } from "../commentForm/commentForm";
import { v4 as uuidv4} from 'uuid';
import { Comment } from "../comments/comments";
import "./individualPost.css"
import { auth } from "../../services/firebase";
import { User } from "firebase/auth";
import { FaPlus } from "react-icons/fa";
import { LoginDialog } from "../loginDialog/loginDialog";
import { SidenavUpDownVote } from "../sidenav-upvote-downvote/sidenav";
import { Chip } from "@mui/material";
import { TextEditor } from "../textEditor/textEditor";

interface postObjStructure {
    title: string,
    content: string,
    user: string,
    category: string,
    createdAt: string,
    downloadURL?: string
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

interface postObj {
        title: string;
        content: string;
        user: string;
        category: string;
        createdAt: string;
        likedByMe?: boolean;
        dislikedByMe?: boolean;
        likeNum: number
}


export function IndividualPost() {

    const {postId} = useParams();
    const [postData, setPostData] = useState<postObjStructure>({title: '', content: '', user: '', category: '', downloadURL: '', createdAt: ''})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [cmmtData, setCmmtData] = useState<commntStructure>({})
    const [isComments, setIsComments] = useState(false)
    const [validLoad, setValidLoad] = useState(false) 
    const [user, setUser] = useState<User | null>(null); 
    const [isLogin, setisLogin] = useState(false);
    const [postObj, setPostObj] = useState<postObj>()
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
          setUser(currentUser);
        });
    
        return () => {
          unsubscribe();
        };
      }, [user]); 
    
    useEffect(()=>{
        const fetchData = async () => {
            const data = postId? await getPostData(postId): {};
            data ? setPostData(data as postObjStructure) : null ;
        }
        const fetchCmmt = async() => {
            const data = postId? await getComments(postId): ""
            if(data) { setCmmtData(data as commntStructure); setIsComments(true);}
        }
        postId? setPostObj(cache.homePageObj?.[postId]) : null
        fetchData()
        fetchCmmt()
        setLoading(false)
        setError("")
    },[validLoad, postId, isComments])

    const setLoad = () => {
        setValidLoad(!validLoad);
    }

    function postCommentFunction(message: string) {
        return postNewComment(uuidv4(), message, postId? postId: '')
    }


    return (
        <div className="main-body main-post">
            <SidenavUpDownVote 
                keyId={postId ? postId : ''}
                postObj={postObj? postObj : {} as postObj}
                className="individual-post"
                setLoad={setLoad}
            />
            <div className="post-content individual-post">
            <span className="posted-by-span">Posted by {postData.user} {getTimeDifference(postData.createdAt)}</span>
            <div className="title-div">
                    <Chip
                    className={`chips`} 
                    label={`${postData.category}`} 
                    // onClick={()=>handleClick()} 
                    // onDelete={isFilterSelected(filter) ? () => handleDelete() : undefined}
                    /> 
                    <h2 className="title">{postData.title}</h2>
                </div>
                
                <TextEditor 
                    isViewOnly={true}
                    isMain={true}
                    editorStateData={ postData.content }
                />
                

                {auth.currentUser || user? <h5 className="comments-title">Comment as {auth.currentUser?.displayName}</h5> : <></>}
                <section className="comments-section">
                { auth.currentUser || user?
                        <CommentForm
                            loading={loading}
                            error={error}
                            initialValue=""
                            autoFocus={false}
                            onSubmit={postCommentFunction}
                            setLoad = {setLoad}
                        /> :
                        <>
                            <button className="btn cmmt-btn" onClick={() => {setisLogin(true)}}><FaPlus /> Add a Comment</button>
                            {isLogin ? <LoginDialog setisLogin={setisLogin}/>: <></>}
                        </>
                    }
                    <div className="decorator"></div>
                    {  JSON.stringify(cmmtData) !== '{}'? Object.keys(cmmtData).map(cmmt => {
                        return <Comment 
                        key={cmmt}
                        id={cmmt}
                        message={cmmtData[cmmt].message}
                        user={cmmtData[cmmt].owner}
                        likeNum={cmmtData[cmmt].likeNum}
                        likedByMe={cmmtData[cmmt].likedByMe}
                        dislikedByMe={cmmtData[cmmt].dislikedByMe}
                        createdAt={cmmtData[cmmt].createdAt}
                        setLoad={setLoad}
                        parent={cmmtData[cmmt].parent}
                    /> }) : null
                    }
                </section>
            </div>
        </div>
    )
}