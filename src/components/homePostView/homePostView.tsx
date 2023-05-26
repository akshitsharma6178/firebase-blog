import { deletePost } from "../../services/firebase";
import "./homePostView.css"
import { useNavigate } from "react-router-dom";

interface HomePostProps {
    keyId: string,
    setLoad: ()=>void,
    postObj: {
        title: string;
        content: string;
        user: string;
    }
}

export function HomePost(props: HomePostProps){
    const {title, content, user} = props.postObj;
    const navigate = useNavigate();
    function handleDelete(keyId: string){
        deletePost(keyId);
        props.setLoad();
    }

    return (
        <>
        <div className="post">
            <div className="post-content">
                <h1 className="title" onClick={()=>navigate(`post/${props.keyId}`)}>{title}</h1>
                <h6>{user}</h6>
                <p>{content}</p>
            </div>
            <button className="btn delete-btn" onClick={() => handleDelete(props.keyId)}>Delete</button>
        </div>
        </>
    )
}
