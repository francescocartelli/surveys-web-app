import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Alert } from 'react-bootstrap'
import { PersonPlus } from 'react-bootstrap-icons'
import { useParams, Link, useHistory } from 'react-router-dom'

import './style.css'

import { ClosedQuestion, OpenQuestion } from './Question'
import API from '../API'

function Results(props) {
    // Id of the survey
    let { idCS } = useParams()
    // State of the suvey object
    const [title, setTitle] = useState("")
    const [questions, setQuestions] = useState(props.questions)
    const [username, setUsername] = useState("")
    const [next, setNext] = useState("")
    // User answers is a duplication of the useState contained inside of the
    // questions in this form
    // When submit button is clicked, those answers will be sent to database all together
    // This useState is initialized once in the useEffect of this form
    const [error, setError] = useState("")

    const history = useHistory()

    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {

        API.getUserInfo().then(() => {
            API.getResults(idCS).then(s => {
                setTitle(s.title)
                setQuestions(s.questions)
                setNext(s.next)
                setUsername(s.username)
                setIsLoading(false)
            }).catch((err) => {
                setError(err.message)
            })
        }).catch(() => {
            history.push("/login")
        })
    }, [idCS, history])

    return (
        <Container fluid>
            <Row className="align-center">
                <Col xs="12"><h2>Survey: {title}</h2></Col>
                <Col>
                    <h2>Username: {username}</h2>
                </Col>
                <Col xs="auto">
                    {
                        next ?
                            <Link to={"/results/" + next}><Button>Next response</Button></Link> :
                            <Button disabled="disabled">No more responses</Button>

                    }
                </Col>
            </Row>
            <Row className="pt-2 pb-2 m-0">
                {
                    error && <Col xs={12}>
                        <Alert variant="danger">{error}</Alert>
                    </Col>
                }
                {
                    !error && !isLoading &&
                    questions.map((q, i) => {
                        return q.type === 0 ?
                            <ClosedQuestion
                                key={"quest_" + q.id}
                                question={q}
                                number={i}
                                checked={q.values}
                                setUserAnswers={() => { }}
                                readOnly={true}></ClosedQuestion> :
                            <OpenQuestion
                                key={"quest_" + q.id}
                                question={q}
                                number={i}
                                text={q.values}
                                setUserAnswers={() => { }}
                                readOnly={true}></OpenQuestion>
                    })
                }
            </Row>
        </Container>
    )
}

export { Results }



