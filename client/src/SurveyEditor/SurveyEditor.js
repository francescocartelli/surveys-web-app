import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form, FormControl } from 'react-bootstrap'
import { PencilFill, TrashFill, CheckCircleFill, PlusCircleFill, DashCircleFill, XCircleFill, ArrowUpCircleFill, ArrowDownCircleFill } from 'react-bootstrap-icons'
import './SurveyEditor.css'

function SurveyEditor(props) {
    /* These 2 states are the survey state that are sent into the
       database once the submit is performed */
    const [surveyTitle, setSurveyTitle] = useState(props.survey.title)
    const [questions, setQuestions] = useState([])

    const [isEditTitle, setIsEditTitle] = useState(false)

    /* QuestId is a unique id registered for each question in this client */
    /* It's used to avoid deletion error */
    const [questId, setQuestId] = useState(0)

    const addQuestion = (newQuestion) => {
        setQuestions([...questions, newQuestion])
        setQuestId(i => i + 1)
    }

    const removeQuestion = (question) => {
        let newQuestions = [...questions]
        newQuestions.splice(question, 1)
        setQuestions(newQuestions)
    }

    useEffect(() => {
        //alert(JSON.stringify(questions))
    }, [questions])

    return (
        <Container fluid>
            <Row className="p-2">
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
            <EditPanel addQuestion={addQuestion}></EditPanel>
            {
                questions.map((question, i) => {
                    return <Question
                        key={question.id}
                        position={i}
                        question={question}
                        isLast={i === questions.length - 1}
                        setQuestions={setQuestions}
                        removeQuestion={() => removeQuestion(i)}>
                    </Question>
                })
            }
        </Container>
    )
}

function EditPanel(props) {
    const [text, setText] = useState("")
    const [type, setType] = useState(0)
    const [answers, setAnswers] = useState([])
    const [min, setMin] = useState(0)
    const [max, setMax] = useState(0)

    const [newAnswerText, setNewAnswerText] = useState("")

    const submitQuestion = () => {
        props.addQuestion({
            text: text,
            type: type,
            answers: answers,
            min: min,
            max: max
        })
        resetQuestion()
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
        <Container fluid className="question-container">
            {/* Question Header */}
            <Col xs="12" className="suggestion-text">Question:</Col>
            <Row className="question-row">
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
            {/* Question Type */}
            <hr></hr>
            <Col xs="12" className="suggestion-text">Question type:</Col>
            <Col xs="12">
                <Form.Control as="select" onChange={
                    (ev) => {
                        if ("Short Text" === ev.target.value) setType(1)
                        else setType(0)
                    }
                }>
                    <option>Multiple Choice</option>
                    <option>Short Text</option>
                </Form.Control>
            </Col>
            {/* Answers */}
            <hr></hr>
            <Col xs="12" className="suggestion-text">Answers:</Col>
            {
                type === 0 ?
                    answers.map((answer, i) => {
                        return <Row key={i} className="answer-row">
                            <Col xs="auto" className="pl-3 pr-0"><div className="number-box-answer">{i + 1}.</div></Col>
                            <Col><p>{answer.text}</p></Col>
                            <Col xs="auto" className="pr-0">
                                <Button onClick={() => { removeAnswer(i) }}>
                                    <DashCircleFill></DashCircleFill> Remove Answer
                                </Button>
                            </Col>
                        </Row>
                    }) :
                    <Col xs="12" className="pt-1">
                        <Form.Control readOnly as="textarea" rows={3} placeholder="Short text answer here..." />
                    </Col>
            }
            {/* Add answers */}
            {
                type === 0 &&
                <>
                    <Row className="new-answer-row">
                        <Col xs="auto" className="pl-0 pr-0">
                            <Button className="button" onClick={addAnswer}>
                                <PlusCircleFill />
                            </Button>
                        </Col>
                        <Col className="pr-0">
                            <FormControl
                                type="input"
                                placeholder="Enter new answer here"
                                value={newAnswerText}
                                onInput={(ev) => setNewAnswerText(ev.target.value)}></FormControl>
                        </Col>
                    </Row>
                    <hr></hr>
                    {/* Advanced Setting */}
                    {
                        type === 0 &&
                        <MinMaxEditor AnswersNumber={answers.length} min={min} max={max} setMin={setMin} setMax={setMax}></MinMaxEditor>
                    }
                </>
            }
            <hr></hr>
            <Row className="p-2">
                <Col xs="6">
                    <Button onClick={() => submitQuestion()}>Add Question</Button>
                </Col>
                <Col xs="6">
                    <Button onClick={() => resetQuestion()}>Reset Question</Button>
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
        <Container fluid className="question-container">
            {/* Question Header */}
            <Row className="question-row">
                <div className="number-box">{props.position + 1}</div>
                <Col><p className="pt-2">{props.question.text}</p></Col>
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
            </Row>
            {
                props.question.type === 0 ?
                    props.question.answers.map((answer, i) => {
                        return <Row key={i} className="answer-row">
                            <Col xs="auto" className="pl-3 pr-0"><div className="number-box-answer">{i + 1}.</div></Col>
                            <Col><p>{answer.text}</p></Col>
                        </Row>
                    }) :
                    <Col xs="12" className="pt-1">
                        <Form.Control readOnly as="textarea" rows={3} placeholder="Short text answer here..." />
                    </Col>
            }
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
        <Row className="answer-row-mix-max">
            <Col xs={12} className="suggestion-text">Enter minimum and maximum number of answers:</Col>
            <Col xs={2} className="pt-1">Min:</Col>
            <Col xs={4}>
                <FormControl
                    type="number"
                    placeholder="enter min"
                    value={props.min}
                    onInput={(ev) => setMinimum(ev.target.value)}>
                </FormControl>
            </Col>
            <Col xs={2} className="pt-1">Max:</Col>
            <Col xs={4}>
                <FormControl
                    type="number"
                    placeholder="enter max"
                    value={props.max}
                    onInput={(ev) => setMaximum(ev.target.value)}>
                </FormControl>
            </Col>
        </Row>
    )
}

export { SurveyEditor };