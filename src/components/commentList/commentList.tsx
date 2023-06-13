import { Comment } from "../comments/comments"

interface commntStructure {
        [key: string]: {
        message: string,
        likeNum: number,
        createdAt: string,
        owner: string,
        parent: string
        }
}

interface propStructure{
    comments: commntStructure,
    setLoad: () =>void
}

export function CommentList(props: propStructure) {
    
    return <>
            {  JSON.stringify(props.comments) !== '{}'? Object.keys(props.comments).map(cmmt => {
                return <Comment 
                key={cmmt}
                id={cmmt}
                message={props.comments[cmmt].message}
                user={props.comments[cmmt].owner}
                likeNum={props.comments[cmmt].likeNum}
                setLoad={props.setLoad}
                createdAt={props.comments[cmmt].createdAt}
                parent={props.comments[cmmt].parent}
            /> }) : null
            }
    </>

}