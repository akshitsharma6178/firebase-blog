import { useState, useEffect } from "react";
import { HomePost } from "../homePostView/homePostView";
import { getHomePageObj } from "../../services/firebase";
import { useNavigate } from 'react-router-dom'
import "./home.css"
import { auth } from "../../services/firebase";
import { User } from "firebase/auth";
import { FilterMenu } from "../filterMenu/filterMenu";

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




export function Home() {

    const navigate = useNavigate();
    const [posts, setPosts] = useState<MyType>({})
    const [filteredPosts, setFilteredPosts] = useState<MyType>({});
    const [validLoad, setValidLoad] = useState(false)
    const [user, setUser] = useState<User | null>(null);
    


    useEffect(() => {
      const fetchPosts = async() => {
          try {
              const data = await getHomePageObj();
              const sortedArray = Object.entries(data? data : {})
              .sort(([, a], [, b]) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map(([key, value]) => ({ [key]: value }));
              const sortedObject = Object.assign({}, ...sortedArray);
              setPosts(sortedObject as MyType);
          }
          catch(e) {
            console.error("Error fetching data:", e);
          }
        } 
      fetchPosts();
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
      });
      return () => {
        unsubscribe();
      };
    },[validLoad, user]);

    const setLoad = () => {
        setValidLoad(!validLoad);
    }

    return (
        <>
        <div className="main-body">
        <div className="post fliter-grid-item">
          <span className="filter-menu-span">Filter by Category</span>
          <FilterMenu
          posts={posts}
          setPosts={setFilteredPosts}
          />
        </div>
        <div className="grid-item post-main">
        {
          auth.currentUser || user?
          <div className="new-post">
              <textarea onClick={() => navigate('new')} placeholder="Create Post" className="newpost-input"></textarea>
          </div> :
          <></>
        }
        {  Object.keys(filteredPosts).length > 0 ? (
            Object.keys(filteredPosts).map((post) => (
                <HomePost
                  key={post}
                  setLoad={setLoad}
                  keyId={post}
                  postObj={filteredPosts[post]}
                  filtered={true}
                  setFilteredPosts={setFilteredPosts}
                />
              ))
        ) :
            JSON.stringify(posts) !== '{}' ? Object.keys(posts).map(post => {
                    return <HomePost 
                    key={post} 
                    setLoad={setLoad} 
                    keyId={post} 
                    postObj={posts[post]}
                    /> }) : <p>No Posts</p>
            }
        </div>
        </div>
        </>
    )
}

