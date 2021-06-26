import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form, FormControl, Alert } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { PlusCircleFill, DashCircleFill } from 'react-bootstrap-icons'

import './style.css'
import API from '../API'
import { Confirmation, Information } from '../Modals/Modals'
import { EditQuestion } from './Question'

function SurveyEditor(props) {
    /* These 2 states are the survey state that are sent into the
       database once the submit is performed */
    const [surveyTitle, setSurveyTitle] = useState(props.survey.title)
    const [questions, setQuestions] = useState([])
    const [isEditTitle, setIsEditTitle] = useState(false)

    /* Used in private pages */
    const [wait, setWait] = useState(true)

    const history = useHistory()

    // Modals
    const [isConfirmation, setIsConfimation] = useState(false)
    const [isInformation, setIsInformation] = useState(false)
    const [isWarning, setIsWarning] = useState(false)
    const [warning, setWarning] = useState({ title: "", text: "" })

    const addQuestion = (newQuestion) => {
        setQuestions([...questions, newQuestion])
    }

    const removeQuestion = (question) => {
        let newQuestions = [...questions]
        newQuestions.splice(question, 1)
        setQuestions(newQuestions)
    }

    const validateSurvey = () => {
        if (questions.length < 1) {
            setWarning({ title: "Survey has no questions", text: "In order to proceed survey needs at least one question." })
            setIsWarning(true)
        } else {
            /* Always ask for confirmation */
            setIsConfimation(true)
        }
    }

    const publishSurvey = () => {
        API.publishSurvey(surveyTitle, questions).then(() => {
            setIsInformation(true)
        }).catch(err => {
            setWarning({ title: "Error", text: err.message })
            setIsWarning(true)
        })
    }

    useEffect(() => {
        API.getUserInfo().then(() => setWait(false)).catch(err => {
            history.push("/login")
        })
    }, [history])

    return (
        wait ? <></> :
            <Container fluid>
                <Confirmation
                    title="Confirm survey publication"
                    text="Are you sure you want to publish this survey?"
                    isShow={isConfirmation}
                    onConfirm={() => {
                        setIsConfimation(false)
                        publishSurvey()
                    }}
                    onClose={() => setIsConfimation(false)}
                    onHide={() => setIsConfimation(false)}
                />
                <Information
                    title="The survey has been published"
                    text="You will be redirected to the dashboard page."
                    isShow={isInformation}
                    onClose={() => {
                        setIsInformation(false)
                        history.push("/dashboard")
                    }}
                    onHide={() => {
                        setIsInformation(false)
                        history.push("/dashboard")
                    }}
                />
                <Information
                    title={warning.title}
                    text={warning.text}
                    isShow={isWarning}
                    onClose={() => setIsWarning(false)}
                    onHide={() => setIsWarning(false)}
                />
                <Row className="pt-2 pb-2">
                    <Col className="m-0">
                        {
                            isEditTitle ?
                                <Form.Control
                                    type="input"
                                    placeholder="Enter survey title here"
                                    value={surveyTitle}
                                    onInput={(ev) => setSurveyTitle(ev.target.value)} /> :
                                <h2>{surveyTitle}</h2>
                        }
                    </Col>
                    <Col xs="auto">
                        <Button onClick={() => setIsEditTitle(!isEditTitle)}>
                            {isEditTitle ? "Save Title" : "Edit Title"}
                        </Button>
                    </Col>
                </Row>
                {
                    questions.length === 0 &&
                    <Row className="pt-2 pb-2">
                        <Col>
                            <Alert variant="primary" className="text-center">
                                You survey has no questions!<br></br>
                                Create your first question by intereacting with the form below.<br></br>
                                Your questions will be displayed here.
                            </Alert>
                        </Col>
                    </Row>
                }
                {
                    questions.map((question, i) => {
                        return <EditQuestion
                            key={"quest_" + question.id}
                            number={i}
                            question={question}
                            isLast={i === questions.length - 1}
                            setQuestions={setQuestions}
                            removeQuestion={() => removeQuestion(i)}>
                        </EditQuestion>
                    })
                }
                <Col xs="12" className="pl-0 pt-2"><h3>New Question:</h3></Col>
                <EditPanel addQuestion={addQuestion}></EditPanel>
                <Container fluid className="pt-2 mb-3">
                    <Col><Button className="button-wide button-tall" onClick={() => { validateSurvey() }}>Publish Survey</Button></Col>
                </Container>
            </Container>
    )
}

function EditPanel(props) {
    const [text, setText] = useState("")
    const [type, setType] = useState(0)
    const [answers, setAnswers] = useState([])
    const [min, setMin] = useState(1)
    const [max, setMax] = useState(1)

    const [error, setError] = useState("")

    const [newAnswerText, setNewAnswerText] = useState("")

    /* QuestId is a unique id registered for each question in this client */
    /* It's used to avoid deletion error */
    const [questId, setQuestId] = useState(0)

    const submitQuestion = () => {
        let newError = []
        if (type === 0) {
            if (answers.length < 1) newError.push("Questions with no answers are not allowed.")
            if (min > answers.length) newError.push("Answers number is lower than minimum.")
            if (min > max) newError.push("Minimum answers require are higher than maximul answers allowed.")
        }

        setError(newError)
        if (newError.length > 0) return

        props.addQuestion({
            id: questId,
            text: text,
            type: type,
            answers: answers,
            min: min,
            max: max
        })
        resetQuestion()
        setQuestId(i => i + 1)
    }

    const addAnswer = () => {
        setAnswers([...answers, { text: newAnswerText }])
        setNewAnswerText("")
    }

    const removeAnswer = (item) => {
        let newAnswers = [...answers]
        newAnswers.splice(item, 1)
        setAnswers(newAnswers)
    }

    const resetQuestion = () => {
        setText("")
        setAnswers([])
        setMin(1)
        setMax(1)
        setNewAnswerText("")
    }

    return (
        <Container fluid className="edit-container">
            {/* Question Header */}
            <Row className="container-row">
                <Col xs="auto" className="suggestion-text">Question:</Col>
                <Col>
                    {
                        <Form.Control
                            type="input"
                            placeholder="Enter question sentence here..."
                            value={text}
                            onInput={(ev) => setText(ev.target.value)} />
                    }
                </Col>
            </Row>
            <hr></hr>
            {/* Question Type */}
            <Row className="container-row">
                <Col xs="auto" className="suggestion-text">Question type:</Col>
                <Col>
                    <Form.Control as="select" option="" onChange={(ev) => { "Short Text" === ev.target.value ? setType(1) : setType(0) }}>
                        <option>Closed Answer</option>
                        <option>Short Text</option>
                    </Form.Control>
                </Col>
            </Row>
            <hr></hr>
            {/* Answers */}
            <Row className="container-row">
                <Col xs="12" className="suggestion-text">Answers:</Col>
                {
                    error.length > 0 && <Col xs="12"><Alert variant="danger">
                        {
                            error.map(e => <p>{e}<br /></p>)
                        }
                    </Alert></Col>
                }
                {type === 0 ? <>
                    {answers.map((answer, i) => {
                        return <Col sm="12" md="6" key={i} className="pb-1">
                            <Row>
                                <Col xs="auto" className="pr-0">
                                    <Button onClick={() => { removeAnswer(i) }}><DashCircleFill></DashCircleFill></Button>
                                </Col>
                                <Col xs="auto" className="pt-2 pl-3 pr-0"><div className="number-box-answer">{i + 1}.</div></Col>
                                <Col className="pt-2">{answer.text}</Col>
                            </Row>
                        </Col>
                    })}
                    <Col xs="12">
                        <Row className="container-row">
                            <Col xs="auto" className="pl-0 pr-0">
                                <Button className="button" onClick={addAnswer}>
                                    <PlusCircleFill />
                                </Button>
                            </Col>
                            <Col className="pr-0">
                                <FormControl
                                    className="pr-0"
                                    type="input"
                                    placeholder="Enter new answer here"
                                    value={newAnswerText}
                                    onInput={(ev) => setNewAnswerText(ev.target.value)}></FormControl>
                            </Col>
                        </Row>
                    </Col>
                </> :
                    <Col xs="12" className="pt-1">
                        <Form.Control readOnly as="textarea" rows={2} placeholder="Answer will be a short text..." />
                    </Col>
                }
            </Row>
            <hr></hr>
            {/* Advanced Setting */}
            {
                type === 0 ?
                    <>
                        <MinMaxEditor AnswersNumber={answers.length} min={min} max={max} setMin={setMin} setMax={setMax}></MinMaxEditor>
                        <hr></hr>
                    </> :
                    <>
                        <Row className="container-row">
                            <Col xs="auto" className="suggestion-text">Mandatory question:</Col>
                            <Col xs="auto" className="pt-2"><Form.Check checked={min > 0} onChange={(ev) => {
                                if (ev.target.checked) setMin(1)
                                else setMin(0)
                            }}></Form.Check></Col>
                        </Row>
                    </>
            }
            <Row className="p-2">
                <Col xs="6">
                    <Button className="button-wide" onClick={() => submitQuestion()}>Add Question</Button>
                </Col>
                <Col xs="6">
                    <Button className="button-wide" onClick={() => resetQuestion()}>Reset Question</Button>
                </Col>
            </Row>
        </Container >
    )
}

function MinMaxEditor(props) {
    const setMinimum = (value) => {
        if (value < 0) props.setMin(0)
        else if (value > props.AnswersNumber) setMaximum(props.AnswersNumber)
        else props.setMin(value)
    }

    const setMaximum = (value) => {
        if (value < 1) props.setMax(1)
        else if (value > props.AnswersNumber) setMaximum(props.AnswersNumber)
        else props.setMax(value)
    }

    return (
        <Row className="container-row">
            <Col xs={12} className="suggestion-text">Enter minimum and maximum number of answers:</Col>
            <Col xs="6">
                <Row>
                    <Col xs="auto" className="suggestion-text">Min:</Col>
                    <Col>
                        <FormControl
                            type="number"
                            placeholder="enter min"
                            value={props.min}
                            onInput={(ev) => setMinimum(ev.target.value)}>
                        </FormControl>
                    </Col>
                </Row>
            </Col>
            <Col xs="6">
                <Row>
                    <Col xs="auto" className="suggestion-text">Max:</Col>
                    <Col>
                        <FormControl
                            type="number"
                            placeholder="enter max"
                            value={props.max}
                            onInput={(ev) => setMaximum(ev.target.value)}>
                        </FormControl>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}

export { SurveyEditor };