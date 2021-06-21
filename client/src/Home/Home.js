import { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './Home.css'

import API from '../API'

function Home(props) {
    const [allSurveys, setAllSurveys] = useState([])

    useEffect(() => {
        API.getSurveys().then(s => {
            setAllSurveys(s)
        }).catch(err => {
            console.log(err.message)
        })
    }, [])

    return (
        <div className="bg-light vh-100">
            <div className="text-center title-container bg-white">
                <p className="title">Welcome to <strong>.surveys</strong></p>
                <p className="subtitle">Your opinion is important!
                <br />Browse this page and find the latest published surveys.
                </p>
            </div>
            <Container className="surveys-list">
                {
                    allSurveys.map(s => {
                        return <SurveyCard key={"survey_" + s.id} survey={s}></SurveyCard>
                    })
                }
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
                        <Col xs={12} md={8} lg={6}><Link to={"/survey/" + props.survey.id}><Button className="large-button">Answer this survey!</Button></Link></Col>
                        <Col xs={0}></Col>
                    </Row>
                    <hr></hr>
                    <span>published on {props.survey.pubdate} by <strong>@{props.survey.creator}</strong></span>
                </>
            }

        </Container>
    )
}

export { Home };