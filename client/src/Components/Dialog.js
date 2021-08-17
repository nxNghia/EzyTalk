import Avatar from '@material-ui/core/Avatar'
import { useState, useEffect } from 'react'
import Emoji from './Emoji';
import EmojiIcon from './EmojiIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import Cookies from 'js-cookie';

const Dialog = ({dialog, socket, onDelete, room}) => {
    const [widget, setWidget] = useState(false)
    const [enter, setEnter] = useState(false)
    const [reactions, setReaction] = useState([])
    const [self, setSelf] = useState(null)

    const style = {
        dialogDiv: {
            width: '95%',
            position: 'relative',
            marginLeft: '20px',
            marginRight: '20px',
        },

        bubble: {
            backgroundColor: self ? '#32a6b8' : '#c27f67',
            color: '#ffffff',
            padding: '10px',
            margin: '10px 0px 20px 0px',
            borderRadius: '25px',
            maxWidth: '30%',
            position: 'relative',
        },

        avatar: {
            position: 'relative',
            margin: '10px',
        },

        widget: {
            padding: '10px',
            margin: '10px 0px 10px 0px',
            opacity: widget ? 1 : 0,
            transition: 'opacity 250ms',
            display: 'flex',
            flexDirection: self ? 'row-reverse' : 'flex',
        },

        widgetItem: {
            cursor: 'pointer',
            borderRadius: '50%',
        },

        emojiList: {
            position: 'absolute',
            right: self && 60,
            left: !self && 60,
            bottom: 5,
            borderRadius: '25px',
            backgroundColor: '#888888',
            paddingLeft: 5,
            paddingRight: 5,
        },

        deleteIcon: {
            background: enter ? '#999999' : '',
            borderRadius: '50%',
            padding: '1px',
            cursor: 'pointer',
            transition: 'background 300ms',
            marginRight: '5px',
        },

        container: {
            display: 'flex',
            flexDirection: self ? 'row-reverse' : 'flex',
            width: '100%',
        },

        reply: {
            display: 'block',
        }
    }

    const GetReactions = () => {
        let result = null
        let reacted = 0
        
        if(reactions.length > 0)
        {

            result = <div style={style.emojiList}>
                    {reactions.map((reaction) => {
                        if(reaction.users.length !== 0)
                        {
                            reacted += reaction.users.length
                            console.log(reaction.reactionType)
                            return <EmojiIcon key={reaction.reactionType} emojiIndex={reaction.reactionType}></EmojiIcon>
                        }else return null
                    })}
                    <span style={{fontSize: 'small', padding: 5}}>{reacted}</span>
                </div>
        }

        if(reacted !== 0)
            return result
        else
            return null
    }

    useEffect(() => {
        setReaction(dialog.reactions)
    }, [])

    useEffect(() => {
        socket.on('return-reaction', (return_dialog) => {
            console.log(return_dialog)
            if(dialog._id === return_dialog._id)
            {
                setReaction(return_dialog.reactions)
            }
        })
        
        if(self === null)
        {
            const cookie = Cookies.get('userId')
            const index = cookie.indexOf('"')
            setSelf(cookie.slice(index + 1, cookie.length - 1) === dialog.from.id)
        }

        return () => {
            // socket.off('return-reaction')
        }
    }, [reactions])

    return (
        <div style={style.dialogDiv} onMouseEnter={() => setWidget(true)} onMouseLeave={() => setWidget(false)}>
            <div style={style.container}>
                {!self && <Avatar style={style.avatar}>{dialog.from.name.toUpperCase()[0]}</Avatar>}
                {self && <Avatar style={style.avatar}>{dialog.from.name.toUpperCase()[0]}</Avatar>}
                    <p style={style.bubble}>{dialog.text}</p>
                    <GetReactions></GetReactions>
                <div style={style.widget}>
                    <Emoji dialog={dialog} socket={socket} room={room}></Emoji>
                    <DeleteIcon
                        style={style.deleteIcon}
                        onMouseEnter={() => setEnter(true)}
                        onMouseLeave={() => setEnter(false)}
                        onClick={() => onDelete(dialog)}
                    >
                    </DeleteIcon>
                </div>
            </div>
        </div>
    )
}

export default Dialog