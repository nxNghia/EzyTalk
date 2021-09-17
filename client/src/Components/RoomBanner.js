import QueueIcon from '@material-ui/icons/Queue';
import { useState } from 'react';
import { BsBoxArrowRight } from "react-icons/bs";


const RoomBanner = ({room, leave}) => {
    const [show, setShow] = useState(false)
    const [leaveHover, setLeave] = useState(false)

    const style = {
        banner: {
            borderRadius: '20px',
            background: '#293B6C',
            position: 'relative',
            fontSize: 'xx-large',
            color: '#ffffff',
            width: '95%',
            margin: 'auto',
            height: '110px',
            marginTop: 10
        },

        name: {
            position: 'absolute',
            top: -5,
            left: 20,
        },

        menu: {
            position: 'absolute',
            right: 40,
            top: 35,
            width: '10%',
            display: 'block',
        },

        menuIcon: {
            cursor: 'pointer',
            right: 0,
            top: 10,
        },

        dropDown: {
            position: 'relative',
            width: '100%',
            height: 0,
        },

        dropDownItem: {
            maxWidth: '100%',
            display: 'block',
        },

        roomCode: {
            cursor: 'pointer',
            marginLeft: '20px',
        },

        leaveIcon: {
            position: 'absolute',
            right: 20,
            top: 35,
            borderRadius: '50%',
            background: leaveHover ? '#233569' : 'transparent',
            padding: 5,
            cursor: 'pointer',
            transition: 'background 500ms'
        }
    }
    
    return (
        <div style={style.banner}>
            {room && <div>
                <p style={style.name}>
                    {show ? room.short_id : room.room_name}
                    <QueueIcon
                        style={style.roomCode}
                        onClick={() => setShow(!show)}
                    ></QueueIcon>
                </p>
                <BsBoxArrowRight
                    style={style.leaveIcon}
                    onMouseEnter={() => setLeave(true)}
                    onMouseLeave={() => setLeave(false)}
                    onClick={() => leave(room._id)}
                ></BsBoxArrowRight>
            </div>}
        </div>
    )
}

export default RoomBanner