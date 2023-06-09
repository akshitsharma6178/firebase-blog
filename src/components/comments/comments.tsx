import { IconBtn } from "../Icons/IconBtn"
import { FaEdit, FaCommentAlt , FaTrash } from "react-icons/fa"
import { CommentList } from "../commentList/commentList"
import { useEffect, useState } from "react"
import { CommentForm } from "../commentForm/commentForm"
import { auth, deleteComment, getComments, getTimeDifference, handleCommentLike, postNewComment, updateComment } from "../../services/firebase"
import { v4 as uuidv4} from 'uuid';
import { User } from "firebase/auth"
import { TiArrowUpThick, TiArrowUpOutline, TiArrowDownThick, TiArrowDownOutline } from "react-icons/ti"
import './comments.css'
import { OptionsMenu, optionsStructure } from "../menu/menu"
import { LoginDialog } from "../loginDialog/loginDialog"

// const dateFormatter = new Intl.DateTimeFormat(undefined, {
//   dateStyle: "medium",
//   timeStyle: "short",
// })

interface cmmtProp {
  id: string,
  message?: string,
  user: string,
  createdAt: string,
  likeNum: number,
  likedByMe: boolean | undefined,
  dislikedByMe: boolean | undefined,
  parent: string
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
  const [isLogin, setisLogin] = useState(false);
  const optionMenuObject : optionsStructure = {
    'edit': {
      displayName: 'Edit',
      onClick: () => setIsEditing(prev => !prev),
      im: FaEdit
    },
    'delete': {
      displayName: 'Delete',
      onClick: onCommentDelete,
      im: FaTrash
    }
  }
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

  function onCommentReply(message: string) {
    return postNewComment(uuidv4(), message, props.id).then(props.setLoad)
  }

  function onCommentUpdate(message: string) {
    return updateComment(props.id, message).then(props.setLoad)
  }

  function onCommentDelete() {
    return deleteComment(props.id).then(props.setLoad)
  }

  // function onToggleCommentLike() {
  //   return updateLikeCount(props.id, props.likeCount+1).then(props.setLoad)
  // }
    function handleLike(status: boolean){
      handleCommentLike(props.parent, props.id, status)
      props.setLoad();
  }
  return (
    <>
      <div className="comment">
        <div className="header">
          <span className="name">{props.user}</span>
          <span className="date">
            {/* {dateFormatter.format(Date.parse(props.createdAt))} */}
            {getTimeDifference(props.createdAt)}
          </span>
        </div>
        {isEditing ? (
          <CommentForm
            autoFocus
            initialValue={props.message}
            onSubmit={onCommentUpdate}
            setLoad={props.setLoad}
            state={state}
            isEditing={true}
            setIsEditing={setIsEditing}
          />
        ) : (
          <div className="message">{props.message}</div>
        )}
        <div className="footer">
          <IconBtn 
            im={props.likedByMe? TiArrowUpThick : TiArrowUpOutline}
            onClick={() => handleLike(true)}
            color={props.likedByMe? 'liked': ''}
            disabled = {!auth.currentUser ? true : false} 
          />
          <span className={`${props.likedByMe ? 'liked-span' : ''} ${props.dislikedByMe? 'disliked-span' : ''}`}>{props.likeNum}</span>
          <IconBtn 
              im={props.dislikedByMe? TiArrowDownThick : TiArrowDownOutline}
              onClick={() => handleLike(false)}
              color={props.dislikedByMe? 'disliked': ''}
              disabled = {!auth.currentUser ? true : false} 
          />
          <div className="footer-icon-label-div" onClick={() => {auth.currentUser ? setIsReplying(prev => !prev) : setisLogin(true)}}>
            <FaCommentAlt />
            <span className="comment-span">Reply</span>
          </div>
          {isLogin ? <LoginDialog setisLogin={setisLogin}/>: <></>}
          {auth.currentUser?.displayName === props.user && (
            <>
              {/* <IconBtn
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
              /> */}
              <OptionsMenu 
                options={optionMenuObject}
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
            isReplying={true}
            setIsEditing={setIsReplying}
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