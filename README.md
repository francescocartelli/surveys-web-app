## Routes:
* **/**, **/home**: Homepage of the website, visibile only for unlogged users. Contains a list of published surveys.<br/> If the user is logged and broswe this page it is redirect to his personal 'dashboard'.

* **/survey/:id**: Survey form for the survey specified by the id.

* **/dashboard**: Personal 'home' for each administrator.<br/>
This page allows admin to navigate to the 'editor' and shows all the surveys published by the admin and their results. <br/>
Require login.

* **/editor**: Editor for a new survey. Allows an admin to create a new survey.<br/>
Require login.

* **/results/:idCS**: Allows an admin to display the result for a specific 'CompletedSurvey', idCS is the identifier of a survey completed by a user.<br/>
Navigation throught survey can be achieved by moving forward and backward in the responses made by the users.<br/>
Require login.

* **/login**: Application login.<br/>
Require unlogged sessione.<br/>
Redirect to 'home' if user is logged.

## Database tables:
* **Admin**: used for keeping track of the admin credentials.

* **Survey**: contains the information about the surveys created by the admins.<br/>
Contains a reference to che admin that created it.

* **Question**: contains the questions within the surveys.<br/>
There are no tables dedicated to open or closed questions.<br/>
Each question (open or closed) is contained in this table. The type column allows you to identify its type (0 -> closed, 1 -> open).<br/>
Min and max columns refer to the constraints of the questions.<br/>
If question is closed, min and max limit the number of possibile answers.<br/>
If question is open, min refers to a mandatory or optional question, max has no purpose for open questions.<br/>
Questions contains a reference to the survey where they belong.
Each question belongs only to one survey.
Using the same table for all types of question, simplifies ordering procedure when
a survey is proposed to a user.

* **Answer**: contains the possible answers (closed answers) to a closed ended question.<br/>
Each answers contains a reference to the question were it belong.<br/>
One answer belongs only to a question.

* **CompletedSurvey**: contains the information for a survey that has been responded to a user.<br/>
Contains a non-unique username and a reference to the survey that has been answered.<br/>

* **UserClosedAnswer**: keeps track of an answer (closed answer) given by a user.<br/>
Contains a reference to a completedSurvey and AN ANSWER (closed answer) from a survey.<br/>

**eg.** *idCompletedSurvey: X, idAnswer: Y*<br/>
means that in the survey response X the user checked the answer Y<br/>
**eg.** *idCompletedSurvey: X, idAnswer: Z*<br/>
means that in the survey response X the user checked the answer Z<br/>

Answer Y and Z can belong to the same question (multiple-choice)<br/>
I only keep track of true answer, if user did not checked the answer, the is not existing<br/>

* **UserOpenAnswer**: contains the text provided by the user in an open ended question.<br/>
Contains a reference to a completedSurvey and A QUESTION (open question) from a survey.<br/>

**eg.** *idCompletedSurvey: X, idQuestion: Y, text: Z*<br/>
means that in the survey response X the user checked answered Z to the question Y<br/>

## Login credentials (username + password)
