import { useEffect, useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { ExclamationCircleFill, CheckCircleFill, ArrowUpCircleFill, TrashFill, ArrowDownCircleFill } from 'react-bootstrap-icons'
import './style.css'

/* Question's subcomponent containing title and other stuff */
function QuestionHeader(props) {
    // props.hint show or hides the error or correct icon
    return (
        <Row className="question-row">
            <div className="number-box">{props.number}</div>
            <Col><p className="pt-2 mb-0">{props.text}</p></Col>
            {props.hint && <Col xs="auto" className="pr-3 pt-2"> {
                props.error ?
                    <ExclamationCircleFill size="24" color="orange" /> :
                    <CheckCircleFill size="24" color="green" />
            }
            </Col>
            }
        </Row>
    )
}

/* Question used in SurveyEditor as a question preview */
function EditQuestion(props) {
    const moveUp = () => {
        props.setQuestions(prevQuestions => {
            return prevQuestions.map((q, i) => {
                if (i === props.number - 1) return prevQuestions[props.number]
                else if (i === props.number) return prevQuestions[props.number - 1]
                else return q
            })
        })
    }

    const moveDown = () => {
        props.setQuestions(prevQuestions => {
            return prevQuestions.map((q, i) => {
                if (i === props.number) return prevQuestions[props.number + 1]
                else if (i === props.number + 1) return prevQuestions[props.number]
                else return q
            })
        })
    }

    return (
        <Container fluid className="question-container">
            <Row className="question-row">
                <div className="number-box">{props.number + 1}</div>
                <Col><p className="pt-2 mb-0">{props.question.text}</p></Col>
                {
                    props.number !== 0 &&
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
                <Col xs="12">
                    {
                        (props.question.min !== 0 || props.question.max !== 1) &&
                        <Row className="suggestion-text-small">
                            {props.question.min !== 0 && <Col xs="auto" className="pr-0">Minumun of {props.question.min} answers required.</Col>}
                            {props.question.min !== 1 && <Col xs="auto">Maximum of {props.question.max} answers allowed.</Col>}
                        </Row>
                    }
                </Col>
            </Row>
            <Row>
                {props.question.type === 0 ?
                    <Col xs="12">
                        {
                            (props.question.min === 1 && props.question.max === 1) ?
                                props.question.answers.map((answer, i) => {
                                    return <Answers
                                        key={"ans_" + props.question.id + "_" + i}
                                        answer={answer}
                                        number={i}
                                        controlType="radio"
                                        readOnly={true}
                                    ></Answers>
                                }) : props.question.answers.map((answer, i) => {
                                    return <Answers
                                        key={"ans_" + props.question.id + "_" + i}
                                        answer={answer}
                                        number={i}
                                        controlType="check"
                                        readOnly={true}
                                    ></Answers>
                                })
                        }
                    </Col> :
                    <Col xs="12" className="pt-1">
                        {
                            props.question.min > 0 && <Row className="suggestion-text-small">
                                <Col xs="auto" className="pr-0">This answer is necessary</Col>
                            </Row>
                        }
                        <Row>
                            <Col xs="12" className="pt-1">
                                <Form.Control as="textarea"
                                    rows={3}
                                    placeholder="Short text answer here..."
                                    disabled={true} />
                            </Col>
                        </Row>
                    </Col>
                }
            </Row>
        </Container>
    )
}

/* Closed question component used in SurveyForm by the user  */
function ClosedQuestion(props) {
    // This useState contains the ids of the checked answers
    // when this change the state is sent into the survey userAnswers state
    const [checked, setChecked] = useState(props.checked)
    // Is used only for max answers overloading
    const [message, setMessage] = useState("")

    /* Handle form multiple choice */
    const updateUserAnswers = (answerId, ev) => {
        ev.stopPropagation()
        const value = ev.target.checked
        if (value === true) {
            // Check added
            // If it's an optional single choice just recreate the checked state
            if (props.question.max === 1) setChecked([answerId])
            else {
                // If question allow multiple answer check max constraint before
                if (Number(checked.length) >= Number(props.question.max)) {
                    setMessage("Maximum number of answers reached. Deselect some if you want to change answers.")
                } else setChecked(p => [...p, answerId])
            }
        } else {
            // Check removed 
            setMessage("")
            setChecked(p => p.filter(item => item !== answerId))
        }
    }

    /* Handle for single choice */
    const updateUserAnswersRadio = (answerId, ev) => {
        ev.stopPropagation()

        if (ev.target.checked) setChecked(p => [answerId])
        else setChecked([])
    }

    // This is a callback that aligns the value of this answered question
    // to the survey form userAnswers useEffect
    const updateParent = props.setUserAnswers
    useEffect(() => {
        updateParent(prev => {
            return prev.map(userAnswer => {
                return userAnswer.id === props.question.id ?
                    { id: props.question.id, type: props.question.type, values: checked } : userAnswer
            })
        })
    }, [checked, updateParent, props.question.id, props.question.type])

    return (
        <Container fluid className="question-container">
            <QuestionHeader
                number={props.number + 1}
                text={props.question.text}
                error={checked.length < props.question.min}
                hint={true}></QuestionHeader>
            {
                (props.question.min !== 0 || props.question.max !== 1) &&
                <Row className="suggestion-text-small">
                    {props.question.min !== 0 && <Col xs="auto" className="pr-0">Minumun of {props.question.min} answers required.</Col>}
                    {props.question.min !== 1 && <Col xs="auto">Maximum of {props.question.max} answers allowed.</Col>}
                </Row>
            }
            {
                message &&
                <Row className="suggestion-text-small"><Col xs="12">{message}</Col></Row>
            }
            <Row>
                {
                    (props.question.min === 1 && props.question.max === 1) ?
                        props.question.answers.map((answer, i) => {
                            return <Answers
                                key={"ans_" + answer.id}
                                answer={answer}
                                number={i}
                                controlType="radio"
                                isChecked={checked.includes(answer.id)}
                                updateUserAnswers={updateUserAnswersRadio}
                                readOnly={props.readOnly}
                            ></Answers>
                        }) : props.question.answers.map((answer, i) => {
                            return <Answers
                                key={"ans_" + answer.id}
                                answer={answer}
                                number={i}
                                controlType="check"
                                isChecked={checked.includes(answer.id)}
                                updateUserAnswers={updateUserAnswers}
                                readOnly={props.readOnly}
                            ></Answers>
                        })
                }
            </Row>
        </Container>
    )
}

/* Open question component used in SurveyForm by the user  */
function OpenQuestion(props) {
    const [value, setValue] = useState(props.text ? props.text : "")

    // This is a callback that aligns the value of this answered question
    // to the survey form userAnswers useEffect
    const updateParent = props.setUserAnswers
    useEffect(() => {
        updateParent(prev => {
            return prev.map(userAnswer => {
                return userAnswer.id === props.question.id ?
                    { id: props.question.id, type: props.question.type, values: value } : userAnswer
            })
        })
    }, [value, updateParent, props.question.id, props.question.type])

    return (
        <Container fluid className="question-container">
            <QuestionHeader
                number={props.number + 1}
                text={props.question.text}
                error={props.question.min !== 0 && value === ""}
                hint={true}></QuestionHeader>
            {
                props.question.min > 0 && <Row className="suggestion-text-small">
                    <Col xs="auto" className="pr-0">This answer is necessary</Col>
                </Row>
            }
            <Row>
                <Col xs="12" className="pt-1">
                    <Form.Control as="textarea"
                        rows={3}
                        maxLength="200"
                        value={value}
                        placeholder="Short text answer here..."
                        disabled={props.readOnly}
                        onChange={ev => {
                            ev.preventDefault()
                            setValue(ev.target.value)
                        }} />
                </Col>
            </Row>
        </Container>
    )
}

/* Block of answers used in ClosedQuestion */
function Answers(props) {
    const handleChange = (ev) => {
        props.updateUserAnswers(props.answer.id, ev)
    }
    return (
        <Col sm="12" md="6" className="pb-1">
            <Row className="answer-row">
                <Col xs="auto">{
                    props.controlType === 'check' ?
                        <input
                            type="checkbox"
                            checked={props.isChecked}
                            onClick={ev => { handleChange(ev) }}
                            onChange={ev => { }}
                            disabled={props.readOnly}
                        /> :
                        <input id={props.name + "_" + props.number}
                            type="radio"
                            checked={props.isChecked}
                            onClick={ev => { handleChange(ev) }}
                            onChange={ev => { }}
                            disabled={props.readOnly}
                        />
                }</Col>
                <Col xs="auto" className="pl-3 pr-0"><div className="number-box-answer">{props.number + 1}.</div></Col>
                <Col>{props.answer.text}</Col>
            </Row>
        </Col>
    )
}

export { ClosedQuestion, OpenQuestion, EditQuestion }