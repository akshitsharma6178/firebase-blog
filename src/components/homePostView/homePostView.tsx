// import { deletePost } from "../../services/firebase";
import { useState } from "react";
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
    const [showImage, setShowImage] = useState(false);
    const navigate = useNavigate();
    // function handleDelete(keyId: string){
    //     deletePost(keyId);
    //     props.setLoad();
    // }

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
            <div className="post-content">
                <h1 className="title" onClick={handleNavigateandStorage}>{title}</h1>
                <h6>{user}</h6>
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
                <p>{content}</p>
            </div>
            {/* <button className="btn delete-btn" onClick={() => handleDelete(props.keyId)}>Delete</button> */}
        </div>
        </>
    )
}
