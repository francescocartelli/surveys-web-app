import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Alert } from 'react-bootstrap'
import './style.css'
import { useParams, Redirect } from 'react-router'

import API from '../API'
import { ClosedQuestion, OpenQuestion } from './Question'
import { useHistory } from 'react-router-dom'
import { PersonPlus } from 'react-bootstrap-icons'

function Results(props) {
    // Id of the survey
    let { id } = useParams()
    let { idCS } = useParams()
    // State of the suvey object
    const [survey, setSurvey] = useState({ questions: [] })
    // User answers is a duplication of the useState contained inside of the
    // questions in this form
    // When submit button is clicked, those answers will be sent to database all together
    // This useState is initialized once in the useEffect of this form
    const [username, setUsername] = useState("")
    const [error, setError] = useState([])

    const [users, setUsers] = useState("")
    const [previousUser, setPreviousUser] = useState("")
    const [nextUser, setNextUser] = useState("")

    const history = useHistory()

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        API.getUserInfo().then(() => {
            API.getResults(id, idCS)
            .then(s => {
                setSurvey(s)
            }).catch((err) => {
                setError(err.message)
            })
        }).catch(() => {
            history.push("/login")
        })
    }, [props, id])

    return (
        <Container fluid>
            <Row className="align-center">
                <Col xs="12"><h2>Responses for "{survey.title}"</h2></Col>
                <Col xs="auto"><Button>Previous User</Button></Col>
                <Col className="question-container">
                </Col>
                <Col xs="auto"><Button>Next User</Button></Col>
            </Row>
            <Row className="pt-2 pb-2 m-0">
                {
                    error.length > 0 && <Col xs={12}>
                        <Alert variant="danger">{error}</Alert>
                    </Col>
                }
                {
                    <Col xs={12}><p>user {username}</p></Col>
                }
                {
                    survey.questions &&
                    survey.questions.map((q, i) => {
                        return q.type === 0 ?
                            <ClosedQuestion
                                key={"quest_" + q.id}
                                question={q}
                                number={i}
                                checked={q.values}
                                setUserAnswers={() => {}}
                                readOnly={true}></ClosedQuestion> :
                            <OpenQuestion
                                key={"quest_" + q.id}
                                question={q}
                                number={i}
                                text={q.values}
                                setUserAnswers={() => {}}
                                readOnly={true}></OpenQuestion>
                    })
                }
            </Row>
        </Container>
    )
}

export { Results }



