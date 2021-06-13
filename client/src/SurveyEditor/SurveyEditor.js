import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form, FormControl } from 'react-bootstrap'
import { PencilFill, TrashFill, CheckCircleFill, PlusCircleFill, DashCircleFill, XCircleFill } from 'react-bootstrap-icons'
import './SurveyEditor.css'

function SurveyEditor(props) {
    const [surveyTitle, setSurveyTitle] = useState(props.survey.title)
    const [questions, setQuestions] = useState([])
    const [isEditTitle, setIsEditTitle] = useState(false)

    /* QuestId is a unique id registered for each question in this client */
    /* It's used to avoid deletion error */
    const [questId, setQuestId] = useState(0)

    const addQuestion = () => {
        setQuestions([...questions, { id: questId + 1, text: "", answers: [], min: 1, max: 1 }])
        setQuestId(i => i + 1)
    }

    const removeQuestion = (question) => {
        let newQuestions = [...questions]
        newQuestions.splice(question, 1)
        setQuestions(newQuestions)
    }

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
            <Row className="p-2">
                <Col>
                    <Button onClick={() => addQuestion()}>Add Question</Button>
                </Col>
            </Row>
            {
                questions.map((question, i) => {
                    return <Question
                        key={question.id}
                        position={i}
                        question={question}
                        setQuestions={setQuestions}
                        removeQuestion={() => removeQuestion(i)}>
                    </Question>
                })
            }
        </Container>
    )
}

function Question(props) {
    const [text, setText] = useState(props.question.text)
    const [answers, setAnswers] = useState(props.question.answers)
    const [min, setMin] = useState(props.question.min)
    const [max, setMax] = useState(props.question.max)
    const [isEdit, setIsEdit] = useState(false)
    const [newAnswerText, setNewAnswerText] = useState("")

    const addAnswer = () => {
        setAnswers([...answers, { text: newAnswerText }])
        /* Empty the input text when answer is added */
        setNewAnswerText("")
    }

    const removeAnswer = (item) => {
        let newAnswers = [...answers]
        newAnswers.splice(item, 1)
        setAnswers(newAnswers)
    }

    /* When edit is confirmed question is set into the parent state component */
    const submitQuestion = () => {
        /* Edit mode is reset */
        setIsEdit(!isEdit)
        props.setQuestions(prevQuestions => {
            return prevQuestions.map((q, i) => {
                return i === props.position ?
                    { id: props.question.id, text: text, answers: answers, min: min, max: max } : q
            })
        })
    }

    const discardChanges = () => {
        setText(props.question.text)
        setAnswers(props.question.answers)
        setMin(props.question.min)
        setMax(props.question.max)
        setIsEdit(false)
        setNewAnswerText("")
    }

    return (
        <Container fluid className="question-container">
            {/* Question Header */}
            <Row className="question-row">
                <div className="number-box">{props.position + 1}</div>
                <Col>
                    {
                        isEdit ? <Form.Control
                            type="input"
                            placeholder="Enter question here"
                            value={text}
                            onInput={(ev) => setText(ev.target.value)} /> :
                            <p className="pt-2">{text}</p>
                    }
                </Col>
                {
                    isEdit ?
                        <>
                            <Col xs="auto" className="pl-1 pr-0">
                                <Button variant="success" onClick={() => submitQuestion()}>
                                    <CheckCircleFill />
                                </Button>
                            </Col>
                            <Col xs="auto" className="pl-1 pr-0">
                                <Button variant="warning" onClick={() => discardChanges()}>
                                    <XCircleFill />
                                </Button>
                            </Col>
                        </> :
                        <Col xs="auto" className="pl-1 pr-0">
                            <Button onClick={() => setIsEdit(!isEdit)}>
                                <PencilFill />
                            </Button>
                        </Col>
                }
                <Col xs="auto" className="pl-1 pr-0">
                    <Button variant="danger" onClick={() => props.removeQuestion()}><TrashFill /></Button>
                </Col>
            </Row>
            {/* Answers */}
            {
                isEdit &&
                <>
                    <hr></hr>
                    <Col xs="12" className="suggestion-text">Question type:</Col>
                </>
            }
            {
                isEdit &&
                <>
                    <hr></hr>
                    <Col xs="12" className="suggestion-text">Answers:</Col>
                </>
            }
            {
                answers.map((answer, i) => {
                    return <Row key={i} className="answer-row">
                        <Col xs="auto" className="pl-3 pr-0"><div className="number-box-answer">{i + 1}.</div></Col>
                        <Col><p>{answer.text}</p></Col>
                        {
                            isEdit &&
                            <Col xs="auto" className="pr-0">
                                <Button onClick={() => { removeAnswer(i) }}>
                                    <DashCircleFill></DashCircleFill>
                                </Button>
                            </Col>
                        }
                    </Row>
                })
            }
            {/* Add answers */}
            {
                isEdit &&
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
                    <MinMaxEditor AnswersNumber={answers.length} min={min} max={max} setMin={setMin} setMax={setMax}></MinMaxEditor>
                </>
            }
        </Container>
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