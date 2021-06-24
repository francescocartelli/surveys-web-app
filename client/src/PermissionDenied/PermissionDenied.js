import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { Container, Button } from 'react-bootstrap'

function PermissionDenied(props) {
    const [visible, setVisible] = useState(false)

    const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }

    useEffect(() => {
        let isSubscribed = true
        sleep(200).then(() => {
            if (isSubscribed) setVisible(true)
        })
        return () => isSubscribed = false
    }, [])

    return (
        <Container className="text-center">
            {
                visible &&
                <>
                    <h2 className="pt-2 pb-2">Login is required to access this page!</h2>
                    <Link to="/login"><Button onClick={() => { }}>Go to Login</Button></Link>
                </>
            }
        </Container>
    )
}

export { PermissionDenied }