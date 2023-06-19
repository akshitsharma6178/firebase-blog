import { Chip } from "@mui/material"
import { ChangeEvent, useEffect, useState } from "react"
import { addFilter, cache, getFilters, setLocalCache } from "../../services/firebase"
import "./filterMenu.css"
import { FaPlus } from "react-icons/fa"

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
    addTrue? : boolean
}

export function FilterMenu(props: filterPropStructure) {

    const [filters, setFilters] = useState<string[]>([])
    const [isSelected, setisSelected] = useState<string[]>([])
    const [isEditing, setIsEditing] = useState(false);
    const [labelText, setLabelText] = useState('Add Label');
  
    const handleLabelClick = () => {
        if(labelText === 'Add Label')
            setIsEditing(!isEditing);
        else 
            handleAddFilter()
    };
  
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      setLabelText(e.target.value);
    };
  
    const handleInputBlur = () => {
      setIsEditing(false)
      handleAddFilter()
    };

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
    async function handleAddFilter(){
        if(labelText === 'Add Label' || labelText === '') return
        if(filters.includes(labelText)) {
            console.error("Tag Already Present")
            setLabelText('Add Label');
            return
        }
        setFilters((currentFilters) => {
            const newFilter = [...currentFilters, labelText]
            cache.filters = {['main']: newFilter as []}
            setLocalCache();
            setLabelText('Add Label');
            setIsEditing(false)
            return newFilter
        })
        addFilter(labelText)
    }
    const handleKeyDown = (event : React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          handleInputBlur();
        }
      };

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
                {props.addTrue ? 
                <div>
                {
                    <Chip
                    label={
                        <>
                        {isEditing ? (
                            <>
                            <input
                                type="text"
                                value={labelText}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                className="chip-input"
                                autoFocus
                                onKeyDown={handleKeyDown}
                            />
                            </>
                        ) : (
                            labelText
                        )}
                        </>
                    }
                    onClick={handleLabelClick}
                    icon={<FaPlus />}
                    />
                }
              </div>: <></>}
            </div>
        </div>
    )
}