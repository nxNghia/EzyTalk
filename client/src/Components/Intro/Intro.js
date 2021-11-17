import { useEffect, useState } from 'react'
import './Intro.css'
import { useMediaQuery } from 'react-responsive'

const Intro = () => {
    const [begin, setBegin] = useState(false)

    const limit = useMediaQuery({maxWidth: 1300})

    const style = {
        container: {
            position: 'absolute',
            left: '10em',
            top: '-2.5em',
            display: limit ? 'none' : 'block'
        },

        text: {
            fontSize: '30px',
            color: 'cyan',
            fontWeight: 'bold',
            transform: begin ? 'translate(200px, 0)' : 'none',
            opacity: begin ? 1 : 0,
            fontFamily: 'Comfortaa',
            transition: 'transform 1000ms ease-out, opacity 800ms'
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setBegin(true)
        }, 2000)
    }, [])

    return (
        <div style={style.container}>
            <p className='intro-text'>EzyTalk</p>
            <p style={style.text}>...for a world without boring</p>
        </div>
    )
}

export default Intro