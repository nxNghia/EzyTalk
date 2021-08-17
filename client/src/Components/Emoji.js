import EmojiEmotionsOutlinedIcon from '@material-ui/icons/EmojiEmotionsOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useState } from 'react'
import Cookies from 'js-cookie';

const Emoji = ({dialog, socket, room}) => {
    const [enter, setEnter] = useState(false)
    const [show, setShow] = useState(false)

    const style = {
        emoji: {
            background: enter ? '#999999' : '',
            borderRadius: '50%',
            padding: '1px',
            cursor: 'pointer',
            transition: 'background 300ms',
            marginRight: '5px',
        },

        emojiList: {
            position: 'absolute',
            top: 0,
        },

        emojiItem: {
            cursor: 'pointer',
            fontSize: 'medium',
            color: '#fcf51c',
            paddingRight: 5,
        }
    }

    const setEmoji = () => {
        if(show)
            setShow(false)
        else
            setShow(true)
    }

    const reaction = (reactionId) => {
        socket.emit('get-reaction', dialog, reactionId, Cookies.get('userId'), room._id)
    }

    return (
        <div onMouseLeave={() => setShow(false)}>
            {
                show && <div style={style.emojiList}>
                <ThumbUpIcon style={style.emojiItem} onClick={() => reaction(1)}></ThumbUpIcon>
                <ThumbDownAltIcon style={style.emojiItem} onClick={() => reaction(2)}></ThumbDownAltIcon>
                <FavoriteIcon color='secondary' style={{paddingRight: 5, fontSize: 'medium', cursor: 'pointer'}} onClick={() => reaction(3)}></FavoriteIcon>
                </div>
            }
            <EmojiEmotionsOutlinedIcon 
                style={style.emoji} 
                onMouseEnter={() => setEnter(true)}
                onMouseLeave={() => setEnter(false)}
                onClick={() => setEmoji()}
            ></EmojiEmotionsOutlinedIcon>
        </div>
    )
}

export default Emoji