import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from "react-router-dom"
import { Container, Button } from 'react-bootstrap'
import { Dash } from 'react-bootstrap-icons';

import { MyNavbar } from './MyNavbar/MyNavbar'
import { Home } from './Home/Home'
import { SurveyForm } from './Surveys/SurveyForm'
import { SurveyEditor } from './Surveys/SurveyEditor'
import { Login } from './Login/Login'
import { PermissionDenied } from './PermissionDenied/PermissionDenied'
import { Dashboard } from './Dashboard/Dashboard'
import { Results } from './Surveys/Results'

import API from './API'
import { propTypes } from 'react-bootstrap/esm/Image';

function App() {
  const [user, setUser] = useState()
  const [userLogged, setUserLogged] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  const checkAuth = async () => {
    try {
      const fetchedUser = await API.getUserInfo()  // here you have the user info, if already logged in
      setUserLogged(true)
      setUser(fetchedUser.username)
    } catch (err) {
      setUserLogged(false)
      setUser("")
    }
  }

  useEffect(() => {
    setIsAuthenticating(true)
    checkAuth()
    setIsAuthenticating(false)
  }, [])

  return (
    <Router>
      <div className="App">
        <Switch>
          {!isAuthenticating &&
            <Route path="/login">
              {userLogged ?
                <Redirect to="/dashboard"></Redirect> :
                <Login setUser={setUser} setUserLogged={setUserLogged}></Login>}
            </Route>
          }
          <Route path={["/", "/*"]}>
            <MyNavbar user={user} setUser={setUser} setUserLogged={setUserLogged}></MyNavbar>
            <Container fluid className="below-nav vheight-100">
              <Switch>
                <Route exact path={["/", "/home"]}>
                  {userLogged ? <Redirect to="/dashboard"></Redirect> :
                    <Home></Home>
                  }
                </Route>
                <Route path="/survey/:id">
                  {userLogged ? <Redirect to="dashboard"></Redirect> :
                    <SurveyForm></SurveyForm>
                  }
                </Route>
                {/* Administrator only area */}
                <Route path="/dashboard">
                  {userLogged ? <Dashboard></Dashboard> :
                    <PermissionDenied></PermissionDenied>
                  }
                </Route>
                <Route path="/editor">
                  <SurveyEditor survey={{ title: "New Survey", questions: [] }}></SurveyEditor>
                </Route>
                <Route path="/results/:id/:idCS">
                  <Results></Results>
                </Route>
                <Route>
                  <Container className="text-center">
                    <h2 className="pt-2 pb-2">The page you are looking for cannot be found!</h2>
                    <Link to="/home"><Button onClick={() => { }}>Go back to Home!</Button></Link>
                  </Container>
                </Route>
              </Switch>
            </Container>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
