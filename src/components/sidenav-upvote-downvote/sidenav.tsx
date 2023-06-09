import { TiArrowUpThick, TiArrowUpOutline, TiArrowDownThick, TiArrowDownOutline } from "react-icons/ti";
import { auth, cache, handlePostLike } from "../../services/firebase";
import { IconBtn } from "../Icons/IconBtn";
import { HomePostProps } from "../homePostView/homePostView";



export function SidenavUpDownVote( props : HomePostProps) {

    function handleLike(status: boolean){
        handlePostLike(props.keyId, status).then(() => {
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
            props.setLoad ? props.setLoad(): null ;
        })
        props.setLoad ? props.setLoad(): null ;
    }
    return (
        <div className={`post-sidenav ${props.className}` } >
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
    )
}