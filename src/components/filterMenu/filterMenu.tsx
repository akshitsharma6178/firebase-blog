import { Chip } from "@mui/material"
import { useEffect, useState } from "react"
import { getFilters } from "../../services/firebase"
import "./filterMenu.css"

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

interface filterPropStructure {
    className? : string
    setPosts? : React.Dispatch<React.SetStateAction<MyType>>;
    setCategory? : (caterogy: string) => void
    posts? : MyType
}

export function FilterMenu(props: filterPropStructure) {

    const [filters, setFilters] = useState([])
    const [isSelected, setisSelected] = useState<string[]>([])

    useEffect(() => {
        const fetchFilters = async() => {
            try {
                const data = await getFilters();
                data? setFilters(data['main']) : '';
            }
            catch(e) {
              console.error("Error fetching data:", e);
            }
        } 
        fetchFilters();
    },[])

    function isFilterSelected(filterName: string) {
        return isSelected.includes(filterName)
    }

    function setPosts(filterName: string){
        const originalPosts = { ...props.posts };
        const filteredPosts = Object.keys(originalPosts)
        .filter((e) => originalPosts[e].category === filterName)
        .reduce((res, key) => {
            res[key] = originalPosts[key];
            return res;
        }, {} as MyType);
        if (Object.keys(filteredPosts).length === 0) {
            // No posts for the selected filter, return an empty object
            props.setPosts ? props.setPosts({noPost: {
                title:'',
                content: '',
                user: '',
                category: '',
                createdAt: '',
                likeNum: 0
            }}) : null;
        } else {
            props.setPosts ? props.setPosts(filteredPosts) : null;
        }
    }

    function handleClick(filterName: string) {
        const arr = [filterName];
        setisSelected(arr);
        props.posts? setPosts(filterName): null
        props.setCategory? props.setCategory(arr[0]) : null
      }
      

    function handleDelete() {
        const arr: string[] = []
        setisSelected(arr)
        props.setPosts? props.setPosts({}) : null;
    }
    return (
        <div className={`${props.className}`}>
            <div className="filter-content">
                {
                    filters.map((filter) => {
                        return <Chip 
                        key={filter}
                        className={`chips ${isFilterSelected(filter) ? "selected-chip": 'not-selected-chip'}`} 
                        label={`${filter}`} 
                        onClick={()=>handleClick(filter)} 
                        onDelete={isFilterSelected(filter) ? () => handleDelete() : undefined}
                        />
                    })
                }
            </div>
        </div>
    )
}