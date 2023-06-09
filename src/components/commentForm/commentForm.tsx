import { useState } from "react"
// import { postComment } from "../../services/firebase"

// type SubmitHandler<T> = (data: T) => Promise<void>;

interface commentFormPropStructure{
    loading?: boolean,
    error?: string,
    autoFocus?: boolean,
    initialValue?: string,
    onSubmit: (msg: string) => Promise<void>,
    setLoad: () => void,
    state?: () => void,
    isEditing?: boolean,
    isReplying?: boolean,
    setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>
    // postId: string
}


export function CommentForm( {
    loading,
    error,
    autoFocus = false,
    initialValue = "",
    setLoad,
    onSubmit,
    state,
    isEditing,
    isReplying,
    setIsEditing
}: commentFormPropStructure ) {
  const [message, setMessage] = useState(initialValue)
  const [activeComment, setActiveComment] = useState(false)
  // async function handleSubmit() {
  //   console.log("this works")
  //   const cmmtObj = {
  //     id: postId,
  //     owner: "user",
  //     message: message,
  //     parent: "none",
  //     likeNum: 0
  //   }
  //   await postComment(postId, cmmtObj)
  //   setLoad()
  // }

  function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    onSubmit(message).then(() =>{ 
      setMessage("")
      setLoad? setLoad(): null
      state? state(): null
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="comment-form-row">
        <textarea
          autoFocus={autoFocus}
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="message-input"
          placeholder="What are your thoughts?"
          onFocus={()=>setActiveComment(true)} 
          onBlur={()=>setActiveComment(false)}
        />
        <div className={`comment-form-btn ${activeComment? 'active': ''}`}>
            {(isEditing || isReplying) && setIsEditing ? <>
              <button onClick={()=> setIsEditing(false)} className="lgn-btn post-cncl-btn">
                {loading ? "Loading" : "Cancel"}
              </button>
              {
                isReplying ?
                  <button className="lgn-btn post-btn" type="submit" disabled={message.length == 0}>
                    {loading ? "Loading" : "Reply"}
                  </button>:
                  <button className="lgn-btn post-btn" type="submit" disabled={message.length == 0}>
                    {loading ? "Loading" : "Update"}
                  </button>
              }
            </>            
            : 
            <button className="lgn-btn post-btn" type="submit" disabled={message.length == 0}>
              {loading ? "Loading" : "Comment"}
            </button>}
        </div>
      </div>
      <div className="error-msg">{error}</div>
    </form>)
}