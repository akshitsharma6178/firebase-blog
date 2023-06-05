// import { deletePost } from "../../services/firebase";
import "./homePostView.css"
import { useNavigate } from "react-router-dom";

interface HomePostProps {
    keyId: string,
    setLoad: ()=>void,
    postObj: {
        title: string;
        content: string;
        user: string;
    },
    className: string
}
type Page = {
    [key: string]: string;
  };

export function HomePost(props: HomePostProps){
    const {title, content, user} = props.postObj;
    const navigate = useNavigate();
    // function handleDelete(keyId: string){
    //     deletePost(keyId);
    //     props.setLoad();
    // }

    function handleNavigateandStorage(){
        console.log("step")
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
            <div className="post-content">
                <h1 className="title" onClick={handleNavigateandStorage}>{title}</h1>
                <h6>{user}</h6>
                <p>{content}</p>
            </div>
            {/* <button className="btn delete-btn" onClick={() => handleDelete(props.keyId)}>Delete</button> */}
        </div>
        </>
    )
}
