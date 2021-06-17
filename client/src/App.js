import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Container } from 'react-bootstrap'

import { MyNavbar } from './MyNavbar/MyNavbar'
import { Home } from './Home/Home'
import { SurveyEditor } from './SurveyEditor/SurveyEditor'

function App() {
  return (
    <Router>
      <div className="App">
        <MyNavbar></MyNavbar>
        <Container fluid className="below-nav vheight-100">
          <Switch>
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
            <Route path="/login">
              <p>Login</p>
            </Route>
            <Route exact path="/*">
              <p>Page not found</p>
            </Route>
          </Switch>
        </Container>
      </div>
    </Router>
  )
}

export default App
