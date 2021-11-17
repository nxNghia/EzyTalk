import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from "@material-ui/core";
import { useMediaQuery } from 'react-responsive'

const useStyles = makeStyles((theme) => ({
    large: {
      width: theme.spacing(10),
      height: theme.spacing(10)
    },
  }))

const UserArea = ({user, logout}) => {
    const classes = useStyles()

    const limit = useMediaQuery({maxWidth: 1300})

    const style = {
        userInformation: {
            display: 'flex',
            alignItems: 'center',
            borderBottom: '2px solid #4a336e',
            height: '18%',
            marginBottom: '10px',
        },

        avatar: {
            fontSize: 'xx-large',
            marginRight: '20px',
            marginLeft: '20px',
            background: '#' + user.color,
        },
    }

    return (
        <div style={style.userInformation}>
          <Avatar style={style.avatar} className={classes.large}>{user.username.toUpperCase()[0]}</Avatar>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <p style={{color: '#000000', marginBottom: 10, marginLeft: 5, fontSize: 'xx-large', display: limit ? 'none' : 'block'}}>{user.username}</p>
            <Button color='secondary' onClick={() => logout()}>Logout</Button>
          </div>
        </div>
    )
}

export default UserArea