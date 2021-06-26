import { useEffect, useState } from 'react';
import { Alert, Container, Row, Col, Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { PeopleFill } from 'react-bootstrap-icons'
import './Dashboard.css'

import API from '../API'

function Dashboard(props) {
    const [adminSurveys, setAdminSurveys] = useState([])
    const [error, setError] = useState("")
    const [user, setUser] = useState({})

    /* Used in private pages */
    const [wait, setWait] = useState(true)

    const history = useHistory()

    useEffect(() => {
        API.getUserInfo().then(user => {
            setWait(false)

            setUser(user)

            API.getAdminSurveys().then((surveys) => {
                setAdminSurveys(surveys)
            }).catch((err) => {
                setError("Something went wrong in your surveys fetching")
            })
        }).catch(err => {
            history.push("/login")
        })
    }, [history])

    return (
        wait ? <></> :
            <div className="bg-light vh-100">
                <div className="text-center title-container bg-white">
                    <p className="title">Welcome <strong>{user.username}</strong></p>
                    <p className="subtitle">This is your administration dashboard.
                        <br />Browse the result of your surveys or create a new one.
                    </p>
                    <Container className="text-center mt-2">
                        <Link to="/editor"><Button variant="info" className="button-wide button-tall">Create a new survey</Button></Link>
                    </Container>
                </div>
                <Container className="results-list">
                    <h4 className="mt-4">Your surveys results:</h4>
                    {
                        adminSurveys.map(s => {
                            return <ResultCard key={"result_" + s.id} survey={s}></ResultCard>
                        })
                    }
                    {
                        error && <Alert variant="danger">{error}</Alert>
                    }
                </Container>
            </div>
    )
}

function ResultCard(props) {
    return (
        <Container className="card-body">
            {
                props.survey && <>
                    <Row className="pt-1 pb-1 align-center">
                        <Col>
                            <h4>{props.survey.title ? props.survey.title : "no title"}</h4>
                        </Col>
                        <Col xs="auto"><PeopleFill size="32"></PeopleFill></Col>
                        <Col xs="auto" className="pl-0 pr-4 pt-1"><h5>{props.survey.count}</h5></Col>
                        {
                            props.survey.count === 0 ?
                                <Col xs={12} className="text-center"><Button variant="secondary" className="button-wide">No results!</Button></Col> :
                                <Col xs={12} className="text-center"><Link to={"/results/" + props.survey.next}><Button className="button-wide">Browse results!</Button></Link></Col>
                        }
                    </Row>
                </>
            }

        </Container>
    )
}

export { Dashboard }