// import { deletePost } from "../../services/firebase";
import "./homePostView.css"
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import { getTimeDifference } from "../../services/firebase";
import { SidenavUpDownVote } from "../sidenav-upvote-downvote/sidenav";
import { TextEditor } from "../textEditor/textEditor";


export interface MyType {
    [key: string]: {
        title: string;
        content: string;
        user: string;
        category: string;
        createdAt: string;
        likedByMe?: boolean;
        dislikedByMe?: boolean;
        likeNum: number;
        downloadURL?: string
    }
}

export interface HomePostProps {
    keyId: string,
    setLoad?: ()=>void,
    postObj: {
        title: string;
        content: string;
        user: string;
        category: string;
        createdAt: string;
        likedByMe?: boolean;
        dislikedByMe?: boolean;
        likeNum: number;
    },
    className?: string
    filtered?: boolean
    setFilteredPosts?: React.Dispatch<React.SetStateAction<MyType>>;
}
type Page = {
    [key: string]: string;
  };

export function HomePost(props: HomePostProps){
    const navigate = useNavigate();
    function handleNavigateandStorage(){
        const recentPages = localStorage.getItem('recentPages')? JSON.parse(localStorage.getItem('recentPages') as string) : []
        const obj = {
            [props.keyId]: props.postObj.title 
        }
        const pageExists = recentPages.some((page: Page) => page[props.keyId] === obj[props.keyId]);
        if (!pageExists) {
          recentPages.push(obj);
          localStorage.setItem('recentPages', JSON.stringify(recentPages));
          const event = new Event('recentPagesUpdate')
          window.dispatchEvent(event)
        }
        navigate(`post/${props.keyId}`)
    }
    return (
        <>
        <div className={`post ${props.className}`}>
            <SidenavUpDownVote 
                keyId={props.keyId}
                postObj={props.postObj}
                setLoad={props.setLoad}
                filtered={props.filtered}
                className={props.className}
                setFilteredPosts={props.setFilteredPosts}
            />
            <div className="post-content">
                <span className="posted-by-span">Posted by {props.postObj.user} {getTimeDifference(props.postObj.createdAt)}</span>
                <div className="title-div">
                    <Chip
                    className={`chips`} 
                    label={`${props.postObj.category}`} 
                    // onClick={()=>handleClick()} 
                    // onDelete={isFilterSelected(filter) ? () => handleDelete() : undefined}
                    /> 
                    <h2 className="title" onClick={handleNavigateandStorage}>{props.postObj.title}</h2>
                </div>
                    <TextEditor 
                    isViewOnly={true}
                    editorStateData={ props.postObj.content }
                    />
            </div>
            {/* <button className="btn delete-btn" onClick={() => handleDelete(props.keyId)}>Delete</button> */}
        </div>
        </>
    )
}
