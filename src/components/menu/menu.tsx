import { Button, MenuItem, Menu, Divider } from "@mui/material";
import { FaEllipsisH } from "react-icons/fa";
import React from "react";


export interface optionsStructure {
    [key: string] : {
        displayName : string,
        onClick: () => void,
        im: React.ComponentType
    }
}
interface menuPropStructure {
    options : optionsStructure
    className?: string
}


export function OptionsMenu(props : menuPropStructure) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <div className={`${props.className? props.className : ''}`}>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        variant="text"
      >
        <FaEllipsisH />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems:'flex-start',
          }
        }}
      >
        {
            Object.keys(props.options).map((option , index, array) => {
                const ImComponent = props.options[option].im;
                return (
                    <div key={option} style={{width:'100%'}}>
                        <MenuItem 
                        onClick={() => { props.options[option].onClick(); handleClose() } }
                        style= {{
                            display: 'flex',
                            justifyContent:'space-between',
                            alignItems:'flex-start',
                            color:'gray',
                            fontWeight:'600',
                            gap:'1rem'
                        }}
                        >
                        <ImComponent />
                        <div className="menu-tile-text">
                            <span style={{ }}>{props.options[option].displayName}</span>
                        </div>
                        </MenuItem>
                        {index !== array.length - 1 && <Divider style={{width:'100%'}} />}
                    </div>
                ) 
            })
        }
      </Menu>
    </div>
  );
}