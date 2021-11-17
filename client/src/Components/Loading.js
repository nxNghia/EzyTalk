import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => {
    const style = {
        textAlign: 'center',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(88,63,243,1) 0%, rgba(255,77,0,0.7962535355939251) 100%)',

        content: {
            position: 'absolute',
            top: '40%',
            left: '45%',
        }
    }
    return (
        <div style={style}>
            <div style={style.content}>
                <CircularProgress></CircularProgress>
                <p>Wait a few second...</p>
            </div>
        </div>
    )
}

export default Loading