import { useState, useEffect } from "react";
import { HomePost } from "../homePostView/homePostView";
import { getHomePageObj } from "../../services/firebase";
import { useNavigate } from 'react-router-dom'
import "./home.css"

interface MyType {
    [key: string]: {
        title: string;
        content: string;
        user: string;
    }
}

export function Home() {

    const navigate = useNavigate();
    const [posts, setPosts] = useState<MyType>({})
    const [validLoad, setValidLoad] = useState(false)


    useEffect(() => {
      const fetchPosts = async() => {
          try {
              const data = await getHomePageObj();
              setPosts(data as MyType);
          }
          catch(e) {
            console.error("Error fetching data:", e);
          }
      } 
      fetchPosts();
    },[validLoad]);

    const setLoad = () => {
        setValidLoad(!validLoad);
    }

    return (
        <div className="main-body">
            <div className="new-post">
                <textarea onClick={() => navigate('new')} placeholder="Create Post" className="newpost-input"></textarea>
            </div>
        {  JSON.stringify(posts) !== '{}' ? Object.keys(posts).map(post => {
                return <HomePost 
                key={post} 
                setLoad={setLoad} 
                keyId={post} 
                postObj={posts[post]} 
                /> }) : <p>No Posts</p>
        }
        </div>
    )
}

