import { useParams } from "react-router-dom"
import { getComments, getPostData, postNewComment } from "../../services/firebase";
import { useEffect, useState } from "react";
import { CommentForm } from "../commentForm/commentForm";
import { v4 as uuidv4} from 'uuid';
import { Comment } from "../comments/comments";
import "./individualPost.css"

interface postObjStructure {
    title: string,
    content: string,
    user: string
}

interface commntStructure {
    [key: string]: {
        message: string,
        likeNum: number,
        createdAt: string,
        owner: string,
        parent: string
    }
}

export function IndividualPost() {

    const {postId} = useParams();
    const [postData, setPostData] = useState<postObjStructure>({title: '', content: '', user: ''})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [cmmtData, setCmmtData] = useState<commntStructure>({})
    const [isComments, setIsComments] = useState(false)
    const [validLoad, setValidLoad] = useState(false)  
    
    useEffect(()=>{
        const fetchData = async () => {
            const data = postId? await getPostData(postId): {};
            data ? setPostData(data as postObjStructure) : null ;
        }
        const fetchCmmt = async() => {
            const data = postId? await getComments(postId): ""
            if(data) { setCmmtData(data as commntStructure); setIsComments(true);}
        }
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
        <div className="main-post">
        <h1>{postData.title}</h1>
        <article>{postData.content}</article>
        <h3 className="comments-title">Comment as {"user"}</h3>
        <section className="comments-section">
            <CommentForm
                loading={loading}
                error={error}
                initialValue=""
                autoFocus={false}
                onSubmit={postCommentFunction}
                setLoad = {setLoad}
            />
            <div className="decorator"></div>
            {  JSON.stringify(cmmtData) !== '{}'? Object.keys(cmmtData).map(cmmt => {
                return <Comment 
                key={cmmt}
                id={cmmt}
                message={cmmtData[cmmt].message}
                user={cmmtData[cmmt].owner}
                likeCount={cmmtData[cmmt].likeNum}
                likedByMe={false}
                createdAt={cmmtData[cmmt].createdAt}
                setLoad={setLoad}
            /> }) : null
            }
        </section>
        </div>
    )
}