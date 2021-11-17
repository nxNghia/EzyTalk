import { InputAdornment } from "@material-ui/core";
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import '../../App.css';
import { useMediaQuery } from 'react-responsive'

const FindRoom = ({roomId, setRoomId, findRoom}) => {
    const limit = useMediaQuery({maxWidth: 1300})
    const style = {
        searchRoom: {
            position: 'fixed',
            bottom: '20px',
            left: '30px',
            color: '#ffffff',
            width: limit ? '11em' : '20%'
        },
    }
    return (
        <div style={style.searchRoom} className='search-room'>
            <TextField
              id='standard-required'
              label="Room's id"
              className='input-room'
              size='medium'
              value={roomId}
              autoComplete='off'
              onChange={(e) => setRoomId(e.target.value)}
              onKeyUp={(e) => {
                if(e.key === 'Enter')
                {
                    findRoom()
                    setRoomId('')
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <SendIcon
                      onClick={() => {
                        findRoom()
                        setRoomId('')
                      }}
                    />
                  </InputAdornment>
                )
              }}
            />
        </div>
    )
}

export default FindRoom