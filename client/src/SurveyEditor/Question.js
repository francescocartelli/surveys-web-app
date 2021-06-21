import { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Form, FormControl, Alert, InputGroup } from 'react-bootstrap'
import { PencilFill, TrashFill, CheckCircleFill, PlusCircleFill, DashCircleFill, XCircleFill, ArrowUpCircleFill, ArrowDownCircleFill } from 'react-bootstrap-icons'
import './SurveyEditor.css'

function QuestionHeader(props) {
    return (
        <Row className="question-row">
            <div className="number-box">{props.number}</div>
            <Col><p className="pt-2">{props.text}</p></Col>
            {props.error && <Col xs={12} className="suggestion-text">{props.error}</Col>}
        </Row>
    )
}

function ClosedQuestion(props) {
    // This useState contains the ids of the checked answers
    // when this change the state is sent into the survey userAnswers state
    const [checked, setChecked] = useState([])
    const [error, setError] = useState("")

    /* Handle form multiple choice */
    const updateUserAnswers = (answerId, ev) => {
        const value = ev.target.checked
        let errorMessage = ""
        if (value === true) {
            // If value is true -> add the answers into the checked answers
            if (Number(checked.length) >= Number(props.question.max)) {
                // Check if user will raise the max answers limit
                ev.preventDefault()
                errorMessage += "Maximum number of answers reached. Deselect some.\n"
            } else {
                setChecked(p => [...p, answerId])
            }

            if (Number(checked.length + 1) < Number(props.question.min))
                errorMessage += "This question require " + props.question.min + " answers."

            setError(errorMessage)
        } else {
            if (Number(checked.length - 1) < Number(props.question.min))
                errorMessage += "This question require " + props.question.min + " answers."

            setError(errorMessage)

            // If value is false -> remove the answers from the checked answers
            setChecked(p => p.filter(item => item !== answerId))
        }
    }

    /* Handle for single choice */
    const updateUserAnswersRadio = (answerId, ev) => {
        if (ev.target.checked) setChecked(p => [answerId])
    }

    useEffect(() => {
        props.setUserAnswers(prev => {
            return prev.map((q, i) => {
                return props.number === i ? checked : q
            })
        })
    }, [checked])

    return (
        <Container fluid className="question-container">
            <QuestionHeader number={props.number + 1} text={props.question.text} error={error}></QuestionHeader>
            <Row>
                <InputGroup>
                    {
                        props.question.max === 1 ?
                            props.question.answers.map((answer, i) => {
                                return <Answers
                                    key={"ans_" + answer.id}
                                    answer={answer}
                                    number={i}
                                    controlType="radio"
                                    isChecked={checked.includes(answer.id)}
                                    updateUserAnswers={updateUserAnswersRadio}
                                ></Answers>
                            }) : props.question.answers.map((answer, i) => {
                                return <Answers
                                    key={"ans_" + answer.id}
                                    answer={answer}
                                    number={i}
                                    controlType="check"
                                    isChecked={checked.includes(answer.id)}
                                    updateUserAnswers={updateUserAnswers}
                                ></Answers>
                            })
                    }
                </InputGroup>
            </Row>
        </Container >
    )
}

// Open-ended question
function OpenQuestion(props) {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        props.setUserAnswers(prev => {
            return prev.map((q, i) => {
                return props.number === i ? value : q
            })
        })
    }, [value])

    return (
        <Container fluid className="question-container">
            <QuestionHeader number={props.number + 1} text={props.question.text} error={props.question.error}></QuestionHeader>
            <Row>
                <Col xs="12" className="pt-1">
                    <Form.Control as="textarea"
                        rows={3}
                        value={value}
                        placeholder="Short text answer here..."
                        onChange={ev => setValue(ev.target.value)} />
                </Col>
            </Row>
        </Container >
    )
}

function Answers(props) {
    const handleChange = (ev) => {
        props.updateUserAnswers(props.answer.id, ev)
    }

    return (
        <Col sm="12" md="6" className="pb-1">
            <Row className="answer-row">
                <Col xs="auto">{
                    props.controlType === 'check' ?
                        <Form.Check
                            checked={props.isChecked}
                            onChange={ev => { handleChange(ev) }} /> :
                        <InputGroup.Radio
                            name={"group_" + props.questionId}
                            onChange={ev => { handleChange(ev) }}
                        />
                }</Col>
                <Col xs="auto" className="pl-3 pr-0"><div className="number-box-answer">{props.number + 1}.</div></Col>
                <Col>{props.answer.text}</Col>
            </Row>
        </Col>
    )
}

export { ClosedQuestion, OpenQuestion }