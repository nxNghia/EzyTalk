import Avatar from '@material-ui/core/Avatar'
import { useState, useEffect } from 'react'
import Emoji from '../Emoji/Emoji';
import EmojiIcon from '../Emoji/EmojiIcon';
import DeleteIcon from '@material-ui/icons/Delete';
import Cookies from 'js-cookie';
import axios from 'axios'

const Dialog = ({dialog, onDelete, room, socket}) => {
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
            background: `#${dialog.from.color}`
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

    const react = (reaction_id, id) => {
        const cookie = Cookies.get('userId')
        const index = cookie.indexOf('"')
        const new_cookie = cookie.slice(index + 1, cookie.length - 1)

        //edit reactions array
        const tmp = [...reactions]
        let pre_react = 0

        tmp.every(react => {
            const index = react.from.findIndex(user => user.userId === new_cookie)
            if(index !== -1)
            {
                react.from.splice(index, 1)
                pre_react = react.reaction_type
                return false
            }
            return true
        })

        if(pre_react !== reaction_id)
        {
            const index = tmp.findIndex(react => react.reaction_type === reaction_id)
            if(index !== -1)
            {
                tmp[index].from.push({userId: new_cookie, username: ' '})
            }else{
                tmp.push({
                    reaction_type: reaction_id,
                    from: [{
                        userId: new_cookie,
                        username: ' '
                    }]
                })
            }
        }

        setReaction([...tmp])

        socket.emit('get-reaction', dialog, reaction_id, new_cookie, room._id)
    }

    useEffect(() => {
        socket.on('return-reaction', (return_dialog) => {
            if(dialog._id === return_dialog._id)
            {
                setReaction(return_dialog.data)
            }
        })
        
        if(self === null)
        {
            const cookie = Cookies.get('userId')
            const index = cookie.indexOf('"')
            setSelf(cookie.slice(index + 1, cookie.length - 1) === dialog.from.userId)
        }

        return () => {
            socket.off('return-reaction')
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialog])

    useEffect(() => {
        axios.post('http://localhost:8000/reaction/retrieve', {id: dialog._id}, {withCredentials: true}).then(result => {
            setReaction(result.data.data)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={style.dialogDiv}>
            <div style={style.container} onMouseEnter={() => setWidget(true)} onMouseLeave={() => setWidget(false)}>
                {!self && <Avatar style={style.avatar}>{dialog.from.username.toUpperCase()[0]}</Avatar>}
                {self && <Avatar style={style.avatar}>{dialog.from.username.toUpperCase()[0]}</Avatar>}
                <p style={style.bubble}>{dialog.content}</p>
                <Icons reactions={reactions} self={self}/>
                <div style={style.widget}>
                    <Emoji dialog={dialog} react={react}></Emoji>
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

const Icons = ({reactions, self}) => {
    const style = {
        icons: {
            position: 'absolute',
            right: self && 60,
            left: !self && 60,
            bottom: 5,
            borderRadius: '25px',
            backgroundColor: '#aaa',
            paddingLeft: 5,
            paddingRight: 5,
        }
    }
    
    return (
        <div style={style.icons}>
            {reactions.map((reaction) => {
                if(reaction.from.length !== 0)
                {
                    return <EmojiIcon key={reaction.reaction_type} emojiIndex={reaction.reaction_type}></EmojiIcon>
                }
                return null
            })}
        </div>
    )
}

export default Dialog