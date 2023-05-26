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
    state?: () => void
    // postId: string
}


export function CommentForm( {
    loading,
    error,
    autoFocus = false,
    initialValue = "",
    setLoad,
    onSubmit,
    state
}: commentFormPropStructure ) {
  const [message, setMessage] = useState(initialValue)

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
        />
        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Loading" : "Post"}
        </button>
      </div>
      <div className="error-msg">{error}</div>
    </form>)
}