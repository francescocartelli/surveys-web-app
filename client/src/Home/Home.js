import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link, Router } from 'react-router-dom'
import './Home.css'

const appName = 'Surveys';

function Home(props) {
    return (
        <div className="bg-light vh-100">
            <div className="text-center title-container bg-white">
                <p className="title">Welcome to <strong>.surveys</strong></p>
                <p className="subtitle">Your opinion is important!
                <br />Browse this page and find the latest published surveys.
                </p>
            </div>
            <Container className="surveys-list">
                    <SurveyCard survey={{
                        id: 1,
                        title: "What is the most annoying thing on work?",
                        creator: "admin",
                        date: "2021/06/03 12:20"
                    }}></SurveyCard>
                    <SurveyCard survey={{
                        id: 2,
                        title: "Electric car. Real solution or expensive trend?",
                        creator: "admin",
                        date: "2021/06/03 12:20"
                    }}></SurveyCard>
            </Container>
        </div>
    )
}

function SurveyCard(props) {
    return (
        <Container className="card-body">
            {
                props.survey && <>
                    <h2>{props.survey.title ? props.survey.title : "no title"}</h2>
                    <p>20 questions</p>
                    <Row className="pt-1 pb-1 align-center">
                        <Col xs={0}></Col>
                        <Col xs={12} md={8} lg={6}><Link to={"/survey/id:" + props.survey.id}><Button className="large-button">Answer this survey!</Button></Link></Col>
                        <Col xs={0}></Col>
                    </Row>
                    <hr></hr>
                    <span>published on {props.survey.date} by <strong>@{props.survey.creator}</strong></span>
                </>
            }

        </Container>
    )
}

export { Home };