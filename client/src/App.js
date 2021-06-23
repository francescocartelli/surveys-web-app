import './App.css';
import { useState } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Container } from 'react-bootstrap'

import { MyNavbar } from './MyNavbar/MyNavbar'
import { Home } from './Home/Home'
import { SurveyForm } from './Surveys/SurveyForm'
import { SurveyEditor } from './Surveys/SurveyEditor'
import { Login } from './Login/Login'

import API from './API'

function App() {
  const [user, setUser] = useState();
  const [userLogged, setUserLogged] = useState(false);

  async function doLogin(credentials) {
    try {
      const user = await API.logIn(credentials);
      alert(user.username)
      setUser(user.username);
      setUserLogged(true);
    } catch (err) {
      throw err;
    }
  }

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/login">
            {
              userLogged ?
                <Redirect push to="/dashboard"></Redirect> :
                <Login doLogin={doLogin}></Login>
            }
          </Route>
          <Route exact path={["/", "/*"]}>
            <MyNavbar></MyNavbar>
            <Container fluid className="below-nav vheight-100">
              <Route exact path="/">
                <Home></Home>
              </Route>
              <Route path="/survey/:id">
                <SurveyForm></SurveyForm>
              </Route>
              <Route path="/dashboard">
                <p>Dashboard</p>
              </Route>
              <Route path="/editor">
                <SurveyEditor survey={{ title: "New Survey", questions: [] }}></SurveyEditor>
              </Route>
            </Container>
            <Route path="/">
              <p>Not found</p>
            </Route>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
