import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = () => {
    const style = {
        textAlign: 'center',
        height: '100%',
        background: 'linear-gradient(53deg, rgba(131,58,180,1) 19%, rgba(69,186,252,1) 72%)',

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