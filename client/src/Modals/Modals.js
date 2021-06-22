import { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

/* Modal with dual option used for asking confirmation */
function Confirmation(props) {
    return (
        <Modal show={props.isShow} onHide={() => props.onClose()}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{props.text}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => props.onClose()}>Close</Button>
                <Button variant="primary" onClick={() => props.onConfirm()}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
}

/* Just an informative modal with only close action */
function Information(props) {
    return (
        <Modal show={props.isShow} onHide={() => props.onClose()}>
            <Modal.Header closeButton>
                <Modal.Title>{props.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{props.text}</p>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" onClick={() => props.onClose()}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

/* Modal used in SurveyForm for getting the username */
function UserModal(props) {
    const [username, setUsername] = useState("")
    const [enabled, setEnabled] = useState(false)

    const handleChange = (value) => {
        if (value !== undefined && value !== "") setEnabled(true)
        else setEnabled(false)
        setUsername(value)
    }

    return (
        <Modal show={props.isShow} onHide={() => props.onClose()}>
            <Modal.Header>
                <Modal.Title>Who are you?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>In order to continue, you have to specify a username</p>
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            placeholder="Your name goes here..."
                            onChange={(ev) => handleChange(ev.target.value)}></Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button disabled={enabled ? "" : "disabled"} variant="primary" onClick={() => {
                    // This is a callback, not this component useEffect setting
                    props.setUsername(username)
                    props.onClose()
                }}>Confirm</Button>
            </Modal.Footer>
        </Modal>
    )
}

export { Confirmation, Information, UserModal }