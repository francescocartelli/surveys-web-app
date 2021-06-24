import './App.css';
import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from "react-router-dom"
import { Container, Button } from 'react-bootstrap'

import { MyNavbar } from './MyNavbar/MyNavbar'
import { Home } from './Home/Home'
import { SurveyForm } from './Surveys/SurveyForm'
import { SurveyEditor } from './Surveys/SurveyEditor'
import { Login } from './Login/Login'
import { PermissionDenied } from './PermissionDenied/PermissionDenied'

import API from './API'

function App() {
  const [user, setUser] = useState()
  const [userLogged, setUserLogged] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(true)

  useEffect(() => {
    setIsAuthenticating(true)

    const checkAuth = async () => {
      try {
        const fetchedUser = await API.getUserInfo()  // here you have the user info, if already logged in
        setUserLogged(true)
      } catch (err) {
        setUserLogged(false)
      }
    }
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
                <Redirect to="/home"></Redirect> :
                <Login></Login>}
            </Route>
          }
          <Route path={["/", "/*"]}>
            <MyNavbar user={user}></MyNavbar>
            <Container fluid className="below-nav vheight-100">
              <Switch>
                <Route exact path={["/", "/home"]}>
                  <Home></Home>
                </Route>
                <Route path="/survey/:id">
                  <SurveyForm></SurveyForm>
                </Route>
                {/* Administrator only area */}
                <Route path="/dashboard">
                  {userLogged ?
                    <p>Dashboard</p> :
                    <PermissionDenied></PermissionDenied>
                  }
                </Route>
                <Route path="/editor">
                  {userLogged ?
                    <SurveyEditor survey={{ title: "New Survey", questions: [] }}></SurveyEditor> :
                    <PermissionDenied></PermissionDenied>
                  }
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
