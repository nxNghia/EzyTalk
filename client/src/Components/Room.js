import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    large: {
      width: theme.spacing(10),
      height: theme.spacing(10)
    },
  }))

const Room = ({room, onClick}) => {
    const classes = useStyles()

    const style = {
        room: {
            position: 'relative',
            width: '90%',
            margin: 'auto',
            background: '#293B6C',
            padding: '10px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
            marginBottom: 10,
            height: 100,
        },

        avatar: {
            fontSize: 'xx-large',
            marginRight: '20px',
            marginLeft: '20px'
        },
    }
    return (
        <div style={style.room} onClick={() => onClick(room)}>
                <Avatar style={style.avatar} className={classes.large}>{room.room_name[0].toUpperCase()}</Avatar>
                <p>{room.room_name}</p>
        </div>
    )
}

export default Room