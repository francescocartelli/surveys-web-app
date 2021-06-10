import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import './SurveyEditor.css'

function SurveyEditor(props) {
    const [surveyTitle, setSurveyTitle] = useState(props.survey.title)
    const [questions, setQuestions] = useState(props.survey.questions)

    const [isEditTitle, setIsEditTitle] = useState(false)

    const addQuestion = () => { setQuestions([...questions, { text: "New Question" }]) }

    const removeQuestion = (question) => { 
        let q = questions
        q.forEach((i, j) => {
            if(i === question) q.slice(j, 1)
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
                questions.map((question, i) => { return <Question key={i} position={i + 1} question={question} removeQuestion={removeQuestion}></Question> })
            }
        </Container>
    )
}

function Question(props) {
    const [text, setText] = useState(props.question.text)
    const [isEdit, setIsEdit] = useState(false)

    return (
        <Container fluid className="question-container">
            <Row>
                <Col xs="auto" className="pr-0 pt-2"><p>{props.position}.</p></Col>
                <Col>
                    {
                        isEdit ? <Form.Control
                            type="input"
                            placeholder="Enter question here"
                            value={text}
                            onInput={(ev) => setText(ev.target.name)} /> :
                            <p className="pt-2">{text}</p>
                    }
                </Col>
                <Col xs="auto">
                    <Button onClick={() => setIsEdit(!isEdit)}>
                        {isEdit ? "Save" : "Edit"}
                    </Button>
                </Col>
                <Col xs="auto">
                    <Button onClick={() => props.removeQuestion(props.question)}>Delete</Button>
                </Col>
            </Row>
            <Row>
                <Row>
                    <Col xs="auto"><Form.Check /></Col>
                    <Col xs="auto"><Form.Check type="checkbox" /></Col>
                    <Col><p>Risposta</p></Col>
                </Row>
            </Row>
        </Container>
    )
}

export { SurveyEditor };