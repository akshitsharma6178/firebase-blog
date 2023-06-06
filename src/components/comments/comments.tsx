import { IconBtn } from "../Icons/IconBtn"
import { FaEdit, FaHeart, FaRegHeart, FaReply, FaTrash } from "react-icons/fa"
import { CommentList } from "../commentList/commentList"
import { useEffect, useState } from "react"
import { CommentForm } from "../commentForm/commentForm"
import { auth, deleteComment, getComments, postNewComment, updateComment, updateLikeCount } from "../../services/firebase"
import { v4 as uuidv4} from 'uuid';
import { User } from "firebase/auth"

// const dateFormatter = new Intl.DateTimeFormat(undefined, {
//   dateStyle: "medium",
//   timeStyle: "short",
// })

interface cmmtProp {
  id: string,
  message?: string,
  user: string,
  createdAt: string,
  likeCount: number,
  likedByMe: boolean,
  setLoad: () => void
}

interface childCommntStructure {
  [key: string]: {
      message: string,
      likeNum: number,
      createdAt: string,
      owner: string,
      parent: string
  }
}

export function Comment(props: cmmtProp) {
  const [areChildrenHidden, setAreChildrenHidden] = useState(false)
  const [isReplying, setIsReplying] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [childComments, setChildComments] = useState<childCommntStructure>({});
  const [user, setUser] = useState<User | null>(null); 
  useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
      });
  
      return () => {
        unsubscribe();
      };
    }, [user]); 
  useEffect(()=>{
    const getRepliesRef = async function(){
      const data = await getComments(props.id)
      data? setChildComments(data as childCommntStructure): null
    }
    getRepliesRef()
    props.setLoad
  },[props.id,props])

  const state = function stateManagement(){
    setIsEditing(false)
    setIsReplying(false)
  }

  function getTimeDifference(){
    const createdAtDateUTC = new Date(props.createdAt)
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    const createdAtLocal = new Date(createdAtDateUTC.getTime() - timezoneOffset)
    const timeDifference = Date.now() - createdAtLocal.getTime();
    // Define the time intervals for formatting
    const minute = 60 * 1000; // 1 minute = 60 seconds * 1000 milliseconds
    const hour = 60 * minute;
    const day = 24 * hour;

    // Determine the appropriate format based on the time difference
    let formattedTime;
    if (timeDifference < minute) {
      formattedTime = `${Math.floor(timeDifference / 1000)} seconds ago`;
    } else if (timeDifference < hour) {
      formattedTime = `${Math.floor(timeDifference / minute)} minutes ago`;
    } else if (timeDifference < day) {
      formattedTime = `${Math.floor(timeDifference / hour)} hours ago`;
    } else {
      formattedTime = `${Math.floor(timeDifference / day)} days ago`;
    }
    return formattedTime
  }

  function onCommentReply(message: string) {
    return postNewComment(uuidv4(), message, props.id).then(props.setLoad)
  }

  function onCommentUpdate(message: string) {
    return updateComment(props.id, message).then(props.setLoad)
  }

  function onCommentDelete() {
    return deleteComment(props.id).then(props.setLoad)
  }

  function onToggleCommentLike() {
    return updateLikeCount(props.id, props.likeCount+1).then(props.setLoad)
  }
  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{props.user}</span>
          <span className="date">
            {/* {dateFormatter.format(Date.parse(props.createdAt))} */}
            {getTimeDifference()}
          </span>
        </div>
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={props.message}
            onSubmit={onCommentUpdate}
            setLoad={props.setLoad}
            state={state}
          />
        ) : (
          <div className="message">{props.message}</div>
        )}
        <div className="footer">
          <IconBtn
            onClick={onToggleCommentLike}
            im={props.likedByMe ? FaHeart : FaRegHeart}
            aria-label={props.likedByMe ? "Unlike" : "Like"}
          >
            {props.likeCount}
          </IconBtn>
          <IconBtn
            onClick={() => setIsReplying(prev => !prev)}
            isactive={isReplying? 1 : 0}
            im={FaReply}
            aria-label={isReplying ? "Cancel Reply" : "Reply"}
            disabled = {!auth.currentUser ? true : false} 
          />
          {auth.currentUser?.displayName === props.user && (
            <>
              <IconBtn
                onClick={() => setIsEditing(prev => !prev)}
                isactive={isEditing? 1 : 0}
                im={FaEdit}
                aria-label={isEditing ? "Cancel Edit" : "Edit"}
              />
              <IconBtn
                onClick={onCommentDelete}
                im={FaTrash}
                aria-label="Delete"
                color="danger"
              />
            </>
          )}
        </div>
        {/* {deleteCommentFn.error && (
          <div className="error-msg mt-1">{deleteCommentFn.error}</div>
        )} */}
      </div>
      {isReplying && (
        <div className="mt-1 ml-3">
          <CommentForm
            autoFocus
            onSubmit={onCommentReply}
            setLoad={props.setLoad}
            state={state}
          />
        </div>
      )}
      {JSON.stringify(childComments) !== '{}' ? (
        <>
          <div
            className={`nested-comments-stack ${
              areChildrenHidden ? "hide" : ""
            }`}
          >
            <button
              className="collapse-line"
              aria-label="Hide Replies"
              onClick={() => setAreChildrenHidden(true)}
            />
            <div className="nested-comments">
              <CommentList comments={childComments} setLoad={props.setLoad}/>
            </div>
          </div>
          <div
            className={`${!areChildrenHidden ? "hide" : ""}`}
            onClick={() => setAreChildrenHidden(false)}
          >
            <span className="expand-text">Expand</span>
          </div>
        </>
      ): null}
    </>
  )
}