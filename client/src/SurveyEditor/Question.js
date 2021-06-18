import { useState } from 'react'
import { Container, Row, Col, Button, Form, FormControl, Alert, InputGroup } from 'react-bootstrap'
import { PencilFill, TrashFill, CheckCircleFill, PlusCircleFill, DashCircleFill, XCircleFill, ArrowUpCircleFill, ArrowDownCircleFill } from 'react-bootstrap-icons'
import './SurveyEditor.css'

function Question(props) {
    return (
        <Container fluid className="question-container">
            {/* Question Header */}
            <Row className="question-row">
                <div className="number-box">{props.number}</div>
                <Col><p className="pt-2">{props.question.text}</p></Col>
            </Row>
            <Row>
                {props.question.type === 0 ?
                    <InputGroup>
                        {props.question.answers.map((answer, i) => {
                            return
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

function Answers(props) {
    return (
        <Col sm="12" md="6" className="pb-1">
            <Row className="answer-row">
                <Col xs="auto">{
                    props.max === 1 ?
                        <Form.Check readOnly /> : <InputGroup.Radio readOnly />
                }</Col>
                <Col xs="auto" className="pl-3 pr-0"><div className="number-box-answer">{i + 1}.</div></Col>
                <Col>{answer.text}</Col>
            </Row>
        </Col>
    )
}

export { Question }