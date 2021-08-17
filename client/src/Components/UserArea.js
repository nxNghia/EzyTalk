import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    large: {
      width: theme.spacing(10),
      height: theme.spacing(10)
    },
  }))

const UserArea = ({user, logout}) => {
    const classes = useStyles()
    const style = {
        userInformation: {
            display: 'flex',
            alignItems: 'center',
            borderBottom: '2px solid #4a336e',
            padding: '20px',
            fontSize: 'large',
            marginBottom: '10px',
        },

        avatar: {
            fontSize: 'xx-large',
            marginRight: '20px',
            marginLeft: '20px'
        },
    }
    return (
        <div style={style.userInformation}>
          <Avatar style={style.avatar} className={classes.large}>{user.username.toUpperCase()[0]}</Avatar>
          <div>
            <p style={{color: '#ffffff', marginBottom: 0, paddingLeft: 10}}>{user.username}</p>
            <Button color='secondary' onClick={() => logout()}>Logout</Button>
          </div>
        </div>
    )
}

export default UserArea