import { useState, useEffect } from "react"
import axios from 'axios'

const Members = ({room}) => {
    const [members, setMembers] = useState([])
    const [roomId, setRoomId] = useState()
    const style = {
        members: {
            background: '#aaaaaa',
            borderRadius: '5px',
            maxHeight: '50%',
            overflow: 'auto',
        },
    }

    useEffect(() => {
        axios.post('/room/members', {roomId}, {withCredentials: true}).then(response => {
            setMembers(response.data)
        })
    }, [roomId])

    useEffect(() => {
        setRoomId(room._id)
    }, [room])

    return (
        <div style={style.members}>
            {members.map(member => {
                return (
                    <Member key={member._id} member={member}></Member>
                )
            })}
        </div>
    )
}

const Member = ({member}) => {
    const [hover, setHover] = useState(false)

    const style = {
        member_container: {
            background: hover ? '#bbbbbb' : '#aaaaaa',
            height: '2em',
            display: 'flex',
            paddingLeft: '1em',
            alignItems: 'center',
            fontSize: 'large',
            transition: 'background 250ms'
        }
    }

    return (
        <div
            style={style.member_container}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {member.username}
        </div>
    )
}

export default Members