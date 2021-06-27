## Database tables
* Admin: used for keeping track of the admin credentials.

* Survey: contains the information about the surveys created by the admins.
Contains a reference to che admin that created it.

* Question: contains the questions within the surveys.
There are no tables dedicated to open or closed questions.
Each question (open or closed) is contained in this table. The type column allows you to identify its type (0 -> closed, 1 -> open).
Min and max columns refer to the constraints of the questions.
If question is closed, min and max limit the number of possibile answers.
If question is open, min refers to a mandatory or optional question, max has no purpose for open questions.
Questions contains a reference to the survey where they belong.
Each question belongs only to one survey.
Using the same table for all types of question, simplifies ordering procedure when
a survey is proposed to a user.

* Answer: contains the possible answers (closed answers) to a closed ended question.
Each answers contains a reference to the question were it belong.
One answer belongs only to a question.

* CompletedSurvey: contains the information for a survey that has been responded to a user.
Contains a non-unique username and a reference to the survey that has been answered.

* UserClosedAnswer: keeps track of an answer (closed answer) given by a user.
Contains a reference to a completedSurvey and AN ANSWER (closed answer) from a survey.

eg. idCompletedSurvey: X, idAnswer: Y
means that in the survey response X the user checked the answer Y
eg. idCompletedSurvey: X, idAnswer: Z
means that in the survey response X the user checked the answer Z

Answer Y and Z can belong to the same question (multiple-choice)
I only keep track of true answer, if user did not checked the answer, the is not existing

* UserOpenAnswer: contains the text provided by the user in an open ended question.
Contains a reference to a completedSurvey and A QUESTION (open question) from a survey.

eg. idCompletedSurvey: X, idQuestion: Y, text: Z
means that in the survey response X the user checked answered Z to the question Y

## Login credentials (username + password)
