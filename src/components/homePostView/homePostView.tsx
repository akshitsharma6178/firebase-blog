// import { deletePost } from "../../services/firebase";
import { useState } from "react";
import "./homePostView.css"
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import { getTimeDifference } from "../../services/firebase";
import { SidenavUpDownVote } from "../sidenav-upvote-downvote/sidenav";


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
        downloadURL?: string
    },
    className?: string
    filtered?: boolean
    setFilteredPosts?: React.Dispatch<React.SetStateAction<MyType>>;
}
type Page = {
    [key: string]: string;
  };

export function HomePost(props: HomePostProps){
    const [showImage, setShowImage] = useState(false);
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
    const handleToggleImage = () => {
        setShowImage(!showImage);
      };
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
                {props.postObj.downloadURL ? 
                    <div className={`post-image-container ${showImage ? '' : 'hide-image'}`}>
                        <img loading="lazy" className="post-image" src={props.postObj.downloadURL} alt="" />
                            <div className="show-image-button" onClick={handleToggleImage}>
                                <span className="expand-text post-image-container-span">Show</span>
                            </div>
                        {showImage?                         
                            <div className="hide-image-button" onClick={handleToggleImage}>
                                <span className="expand-text post-image-container-span">Hide</span>
                            </div>: 
                        <></>}
                    </div>  
                    :
                    <></>
                }

                <p dangerouslySetInnerHTML={{__html : props.postObj.content}}></p>
            </div>
            {/* <button className="btn delete-btn" onClick={() => handleDelete(props.keyId)}>Delete</button> */}
        </div>
        </>
    )
}
