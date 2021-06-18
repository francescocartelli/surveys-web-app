import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form, FormControl, Alert, InputGroup, Modal } from 'react-bootstrap'
import { HashLink } from 'react-router-hash-link'
import { useHistory } from 'react-router-dom'
import { PencilFill, TrashFill, CheckCircleFill, PlusCircleFill, DashCircleFill, XCircleFill, ArrowUpCircleFill, ArrowDownCircleFill } from 'react-bootstrap-icons'
import './SurveyEditor.css'

function SurveyEditor(props) {
    /* These 2 states are the survey state that are sent into the
       database once the submit is performed */
    const [surveyTitle, setSurveyTitle] = useState(props.survey.title)
    const [questions, setQuestions] = useState([])

    const [isEditTitle, setIsEditTitle] = useState(false)
    const [isPreview, setIsPreview] = useState(false)

    const addQuestion = (newQuestion) => {
        setQuestions([...questions, newQuestion])
    }

    const removeQuestion = (question) => {
        let newQuestions = [...questions]
        newQuestions.splice(question, 1)
        setQuestions(newQuestions)
    }

    const publishSurvey = () => {
        const survey = { title: surveyTitle, questions: questions }
        alert(JSON.stringify(survey))
    }

    useEffect(() => {
        //alert(JSON.stringify(questions))
    }, [questions])

    return (
        <Container fluid>
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
                {
                    !isPreview &&
                    <Col xs="auto">
                        <Button onClick={() => setIsEditTitle(!isEditTitle)}>
                            {isEditTitle ? "Save Title" : "Edit Title"}
                        </Button>
                    </Col>
                }
                <Col xs="auto">
                    <Button onClick={() => setIsPreview(s => !s)}>
                        {isPreview ? "Return to Edit" : "Enable Preview"}
                    </Button>
                </Col>
            </Row>
            {
                questions.length === 0 ? <Row className="pt-2 pb-2">
                    <Col>
                        <Alert variant="primary" className="text-center">
                            You survey has no questions!<br></br>
                        Create your first question by intereacting with the form below.<br></br>
                        Your questions will be displayed here.
                    </Alert>
                    </Col>
                </Row> : <Row>
                    <Col>
                        <Alert variant="primary" className="text-center" dismissible>
                            Tap "Enable Preview" to see the final result of your survey.
                    </Alert>
                    </Col>
                </Row>
            }
            {
                questions.map((question, i) => {
                    return <Question
                        key={"quest_" + question.id}
                        position={i}
                        question={question}
                        preview={isPreview}
                        isLast={i === questions.length - 1}
                        setQuestions={setQuestions}
                        removeQuestion={() => removeQuestion(i)}>
                    </Question>
                })
            }
            {
                !isPreview && <EditPanel addQuestion={addQuestion}></EditPanel>
            }
            <Container fluid className="edit-container">
                <Row>
                    <Col><Button className="button-wide" onClick={() => { publishSurvey() }}>Publish</Button></Col>
                </Row>
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

    const [newAnswerText, setNewAnswerText] = useState("")

    const history = useHistory()

    /* QuestId is a unique id registered for each question in this client */
    /* It's used to avoid deletion error */
    const [questId, setQuestId] = useState(0)

    const submitQuestion = () => {
        props.addQuestion({
            id: questId,
            text: text,
            type: type,
            answers: answers,
            min: min,
            max: max
        })
        history.push("#quest_1")
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
        setType(0)
        setAnswers([])
        setMin(0)
        setMax(0)
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
                    <Form.Control as="select" onChange={(ev) => { "Short Text" === ev.target.value ? setType(1) : setType(0) }}>
                        <option>Multiple Choice</option>
                        <option>Short Text</option>
                    </Form.Control>
                </Col>
            </Row>
            <hr></hr>
            {/* Answers */}
            <Row className="container-row">
                <Col xs="12" className="suggestion-text">Answers:</Col>
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
                type === 0 && <>
                    <MinMaxEditor AnswersNumber={answers.length} min={min} max={max} setMin={setMin} setMax={setMax}></MinMaxEditor>
                    <hr></hr>
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

function Question(props) {
    const moveUp = () => {
        props.setQuestions(prevQuestions => {
            return prevQuestions.map((q, i) => {
                if (i === props.position - 1) return prevQuestions[props.position]
                else if (i === props.position) return prevQuestions[props.position - 1]
                else return q
            })
        })
    }

    const moveDown = () => {
        props.setQuestions(prevQuestions => {
            return prevQuestions.map((q, i) => {
                if (i === props.position) return prevQuestions[props.position + 1]
                else if (i === props.position + 1) return prevQuestions[props.position]
                else return q
            })
        })
    }

    return (
        <Container fluid id={"quest_" + props.question.id} className="question-container">
            {/* Question Header */}
            <Row className="question-row">
                <div className="number-box">{props.position + 1}</div>
                <Col><p className="pt-2">{props.question.text}</p></Col>
                {
                    !props.preview &&
                    <>
                        {
                            props.position !== 0 &&
                            <Col xs="auto" className="pl-1 pr-0">
                                <Button onClick={() => { moveUp() }}>
                                    <ArrowUpCircleFill />
                                </Button>
                            </Col>
                        }
                        {
                            !props.isLast &&
                            <Col xs="auto" className="pl-1 pr-0">
                                <Button onClick={() => { moveDown() }}>
                                    <ArrowDownCircleFill />
                                </Button>
                            </Col>
                        }
                        <Col xs="auto" className="pl-1 pr-0">
                            <Button variant="danger" onClick={() => props.removeQuestion()}><TrashFill /></Button>
                        </Col>
                    </>
                }
            </Row>
            <Row>
                {props.question.type === 0 ?
                    <InputGroup>
                        {props.question.answers.map((answer, i) => {
                            return <Col sm="12" md="6" key={props.question.id + "ans" + i} className="pb-1">
                                <Row key={"qt_" + i} className="answer-row">
                                    <Col xs="auto">{
                                        props.max === 1 ?
                                            <Form.Check readOnly /> : <InputGroup.Radio readOnly />
                                    }</Col>
                                    <Col xs="auto" className="pl-3 pr-0"><div className="number-box-answer">{i + 1}.</div></Col>
                                    <Col>{answer.text}</Col>
                                </Row>
                            </Col>
                        })}
                    </InputGroup> :
                    <Col xs="12" className="pt-1">
                        <Form.Control readOnly as="textarea" rows={3} placeholder="Short text answer here..." />
                    </Col>
                }
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