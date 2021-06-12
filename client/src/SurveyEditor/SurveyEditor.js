import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form, FormControl } from 'react-bootstrap'
import { PencilFill, TrashFill, CheckCircleFill, PlusCircleFill } from 'react-bootstrap-icons'
import './SurveyEditor.css'

function SurveyEditor(props) {
    const [surveyTitle, setSurveyTitle] = useState(props.survey.title)
    const [questions, setQuestions] = useState(props.survey.questions)

    const [isEditTitle, setIsEditTitle] = useState(false)

    const addQuestion = () => { setQuestions([...questions, { text: "New Question" }]) }

    const removeQuestion = (question) => {
        let q = questions
        q.forEach((i, j) => {
            if (i === question) q.slice(j, 1)
        })
        setQuestions(q)
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
                    <Button onClick={() => { addQuestion() }}>Add Question</Button>
                </Col>
            </Row>
            {
                questions.map((question, i) => {
                    return <Question
                        key={i}
                        position={i + 1}
                        question={question}
                        removeQuestion={removeQuestion}>
                    </Question>
                })
            }
        </Container>
    )
}

function Question(props) {
    const [answers, setAnswers] = useState([])
    const [isEdit, setIsEdit] = useState(false)
    const [newAnswerText, setNewAnswerText] = useState()
    const [min, setMin] = useState(1)
    const [max, setMax] = useState(1)

    const addNewAnswer = () => {
        setAnswers([...answers, { text: newAnswerText }])
        setNewAnswerText()
    }

    return (
        <Container fluid className="question-container">
            <QuestionHeader number={props.position} isEdit={isEdit} setIsEdit={setIsEdit}/>
            {
                answers.map((answer, i) => {
                    return <Row className="answer-row">
                        <Col xs="auto"><Form.Check /></Col>
                        <Col xs="auto" className="pl-0 pr-0"><div className="number-box-answer">{i + 1}.</div></Col>
                        <Col><p>{answer.text}</p></Col>
                    </Row>
                })
            }
            {
                isEdit &&
                <>
                <Row className="new-answer-row">
                    <Col xs="auto" className="pl-0 pr-0">
                        <Button onClick={addNewAnswer}>
                            <PlusCircleFill />
                        </Button>
                    </Col>
                    <Col className="pr-0">
                        <FormControl
                            type="input"
                            placeholder="Enter new Answer Here"
                            value={newAnswerText}
                            onInput={(ev) => setNewAnswerText(ev.target.value)}></FormControl>
                    </Col>
                </Row>
                <Row className="answer-row-mix-max">
                    <Col className="pl-0 pr-0 pt-1">
                        Type of question:
                    </Col>
                    <Col className="pr-0">
                        <FormControl
                            type="input"
                            placeholder="Enter new Answer Here"
                            value={newAnswerText}
                            onInput={(ev) => setNewAnswerText(ev.target.value)}></FormControl>
                    </Col>
                </Row>
                </>
            }
        </Container>
    )
}

function QuestionHeader(props) {
    const [text, setText] = useState()

    return (
        <Row className="question-row">
        <div className="number-box">{props.number}</div>
        <Col>
            {
                props.isEdit ? <Form.Control
                    type="input"
                    placeholder="Enter question here"
                    value={text}
                    onInput={(ev) => setText(ev.target.value)} /> :
                    <p className="pt-2">{text}</p>
            }
        </Col>
        <Col xs="auto" className="pl-1 pr-0">
            <Button onClick={() => props.setIsEdit(!props.isEdit)}>
                {props.isEdit ?
                    <CheckCircleFill /> :
                    <PencilFill />}
            </Button>
        </Col>
        <Col xs="auto" className="pl-1 pr-0">
            <Button onClick={() => props.removeQuestion(props.question)}><TrashFill /></Button>
        </Col>
    </Row>
    )
}

export { SurveyEditor };