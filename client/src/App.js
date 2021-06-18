import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Container } from 'react-bootstrap'

import { MyNavbar } from './MyNavbar/MyNavbar'
import { Home } from './Home/Home'
import { SurveyEditor } from './SurveyEditor/SurveyEditor'
import { Login } from './Login/Login'

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/login">
            <Login></Login>
          </Route>
          <Route exact path={["/", "/*"]}>
            <MyNavbar></MyNavbar>
            <Container fluid className="below-nav vheight-100">
              <Route exact path="/">
                <Home></Home>
              </Route>
              <Route path="/survey">
                <p>Survey</p>
              </Route>
              <Route path="/dashboard">
                <p>Dashboard</p>
              </Route>
              <Route path="/editor">
                <SurveyEditor survey={{ title: "New Survey", questions: [] }}></SurveyEditor>
              </Route>
            </Container>
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
