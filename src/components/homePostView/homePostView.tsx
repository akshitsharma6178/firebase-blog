// import { deletePost } from "../../services/firebase";
import { useState } from "react";
import "./homePostView.css"
import { useNavigate } from "react-router-dom";
import { Chip } from "@mui/material";
import { getTimeDifference, handlePostLike , cache, auth } from "../../services/firebase";
import { IconBtn } from "../Icons/IconBtn";
import { TiArrowDownOutline, TiArrowDownThick, TiArrowUpOutline, TiArrowUpThick } from "react-icons/ti"


interface MyType {
    [key: string]: {
        title: string;
        content: string;
        user: string;
        category: string;
        createdAt: string;
        likedByMe?: boolean;
        dislikedByMe?: boolean;
        likeNum: number
    }
}

interface HomePostProps {
    keyId: string,
    setLoad: ()=>void,
    postObj: {
        title: string;
        content: string;
        user: string;
        category: string;
        createdAt: string;
        likedByMe?: boolean;
        dislikedByMe?: boolean;
        likeNum: number
    },
    className: string
    filtered?: boolean
    setFilteredPosts?: React.Dispatch<React.SetStateAction<MyType>>;
}
type Page = {
    [key: string]: string;
  };

export function HomePost(props: HomePostProps){
    const [showImage, setShowImage] = useState(false);
    const navigate = useNavigate();
    function handleLike(status: boolean){
        handlePostLike(props.keyId, status).then(() => {
            console.log('running')
            if(props.filtered && props.setFilteredPosts) {
                props.setFilteredPosts((prevFileredPosts) => {
                    const updatedFilterPosts = { ...prevFileredPosts }
                    const likeMe = cache.homePageObj? cache.homePageObj[props.keyId].likedByMe : false
                    updatedFilterPosts[props.keyId].likedByMe = likeMe !== undefined ? likeMe : false
                    const dislikeMe = cache.homePageObj? cache.homePageObj[props.keyId].dislikedByMe : false
                    updatedFilterPosts[props.keyId].dislikedByMe = dislikeMe !== undefined ? dislikeMe : false
                    updatedFilterPosts[props.keyId].likeNum = cache.homePageObj? cache.homePageObj[props.keyId].likeNum : updatedFilterPosts[props.keyId].likeNum;
                    return updatedFilterPosts
                })
            }
            props.setLoad();
        })
        props.setLoad();
    }

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
            <div className="post-sidenav">
                <IconBtn 
                    im={props.postObj.likedByMe? TiArrowUpThick : TiArrowUpOutline}
                    onClick={() => handleLike(true)}
                    color={props.postObj.likedByMe? 'liked': ''}
                    disabled = {!auth.currentUser ? true : false} 
                />
                <span className={`${props.postObj.likedByMe ? 'liked-span' : ''} ${props.postObj.dislikedByMe? 'disliked-span' : ''}`}>{props.postObj.likeNum}</span>
                <IconBtn 
                    im={props.postObj.dislikedByMe? TiArrowDownThick : TiArrowDownOutline}
                    onClick={() => handleLike(false)}
                    color={props.postObj.dislikedByMe? 'disliked': ''}
                    disabled = {!auth.currentUser ? true : false} 
                />
            </div>
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
                <div className={`post-image-container ${showImage ? '' : 'hide-image'}`}>
                    <img loading="lazy" className="post-image" src="https://firebasestorage.googleapis.com/v0/b/major-project-19028.appspot.com/o/image.jpeg?alt=media&token=76618eca-29db-45fc-9b12-629a7d020c2c&_gl=1*1b9mywe*_ga*NzY4MDMwNjg0LjE2ODM5MzUxMTM.*_ga_CW55HF8NVT*MTY4NTk5NzUxNC4yNS4xLjE2ODU5OTgwNjUuMC4wLjA." alt="" />
                        <div className="show-image-button" onClick={handleToggleImage}>
                            <span className="expand-text post-image-container-span">Show</span>
                        </div>
                        {showImage?                         
                        <div className="hide-image-button" onClick={handleToggleImage}>
                            <span className="expand-text post-image-container-span">Hide</span>
                        </div>: 
                        <></>}
                    </div>
                <p>{props.postObj.content}</p>
            </div>
            {/* <button className="btn delete-btn" onClick={() => handleDelete(props.keyId)}>Delete</button> */}
        </div>
        </>
    )
}
