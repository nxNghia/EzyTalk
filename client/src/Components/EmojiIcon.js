import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownAltIcon from '@material-ui/icons/ThumbDownAlt';
import FavoriteIcon from '@material-ui/icons/Favorite';

const EmojiIcon = ({emojiIndex}) => {
    const style = {
        marginRight: '2px',
        cursor: 'pointer',
        fontSize: 'x-small'
    }
    const GetEmoji = () => {
        switch (emojiIndex)
        {
            case '1':
                return <ThumbUpIcon style={style} color='primary'></ThumbUpIcon>
            
            case '2':
                return <ThumbDownAltIcon style={style} color='primary'></ThumbDownAltIcon>

            default:
                return <FavoriteIcon style={style} color='secondary'></FavoriteIcon>
        }
    }
    return (
        <GetEmoji></GetEmoji>
    )
}

export default EmojiIcon