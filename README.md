## G1 Exam Web API
The web api services for Ontario G1 exam practise questions.

### Application links

- web-app: https://g1-exam-webapp.herokuapp.com/
- web-api: https://g1-exam-webapi.herokuapp.com/

### Database

- mongodb (preferably atlas)

### Collections

- `questions: { order: Number, question: String, picture: String, answers: Array of String, correct: Number, image: String }`

### Environment variables

- `PORT=8080`
- `DB_CONNECTION_STRING=mongodb+srv://{username}:{password}@{url}/{database}`

### Installation

- `git clone` this repository
- `npm install`
- create a `.env` file in the root directory and fill in environment variables
- `npm run start`
- navigate to `localhost:8080` to view
