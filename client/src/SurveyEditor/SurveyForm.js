import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form, FormControl, Alert, InputGroup, Modal } from 'react-bootstrap'
import { PencilFill, TrashFill, CheckCircleFill, PlusCircleFill, DashCircleFill, XCircleFill, ArrowUpCircleFill, ArrowDownCircleFill } from 'react-bootstrap-icons'
import './SurveyEditor.css'
import { useParams } from 'react-router'

import API from '../API'
import { ClosedQuestion, OpenQuestion } from './Question'

function SurveyForm(props) {
    let { id } = useParams()
    const [survey, setSurvey] = useState({ questions: [] })
    const [isLoading, setIsLoading] = useState()
    const [userAnswers, setUserAnswers] = useState([])
    const [error, setError] = useState([])

    const submitUserAnswers = () => {
        // Checking for any missed mandatory question
        let errorMessage = []
        survey.questions.forEach((q, i) => {
            if (q.type === 0) {
                let num = userAnswers[i].length
                if (Number(num) < Number(q.min)) {
                    errorMessage.push("Question " + (i + 1) + " require " + q.min + " answers, " + num + " were given")
                }
            }
        })

        setError(errorMessage)
    }

    useEffect(() => {
        API.getSurvey(id)
            .then(s => {
                setSurvey(s)
                setUserAnswers((prev) => {
                    return s.questions.map((q) => {
                        return {}
                    })
                })
            })
            .catch(err => alert(err))
    }, [])

    useEffect(() => {
        alert(JSON.stringify(userAnswers))
    }, [userAnswers])

    return (
        <Container fluid>
            <Row className="pt-2 pb-2 m-0">
                <Col className="pl-0">
                    {
                        <h2>{survey.title}</h2>
                    }
                </Col>
                {
                    error.length > 0 && <Col xs={12}>
                        <Alert variant="danger">{error.map(e => e)}</Alert>
                    </Col>
                }
                {
                    survey.questions &&
                    survey.questions.map((q, i) => {
                        return q.type === 0 ?
                            <ClosedQuestion
                                key={"quest_" + q.id}
                                question={q}
                                number={i}
                                setUserAnswers={setUserAnswers}></ClosedQuestion> :
                            <OpenQuestion
                                key={"quest_" + q.id}
                                question={q}
                                number={i}
                                setUserAnswers={setUserAnswers}></OpenQuestion>
                    })
                }
            </Row>
            <Row className="m-0">
                <Col></Col>
                <Col xs="12" md="9">
                    <Button className="button-wide button-tall" onClick={() => submitUserAnswers()}>Submit Survey</Button>
                </Col>
                <Col></Col>
            </Row>
        </Container>
    )
}

export { SurveyForm }



