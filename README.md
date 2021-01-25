# Job-portal

A website that aims to easen up the process of job-searching and employee filtering by providing a unified, holistic environment where the two agents, recruiter and applicant, meet - the recruiter can post job and hire employees they deem suitable and the applicants can search for and apply them.

The project is built using MERN stack technology implementing a REST API while following best practices as closely as possible.

## Setup and Run
There is a backend as well as a frontend component to the project each of which has its own directory named `frontend` and `backend` in the project root directory.

Note that both the frontend and the backend must be running in parallel.


* Backend to get the express REST API running.
```bash
$ cd backend
$ npm install
$ npm run start
```
* Frontend to initiate the react web application (`http://localhost:3000/`)
```bash
$ cd frontend
$ npm install
$ npm start
```

## Bonuses
* Profile photo upload
* Email update when an applicant's application has been accepted
* Fuzzy search

## Assumptions
* The start year can be at any "relevant" year (even in future) so as to let the applicant inform the recruiter that he
will be entering with an institute relevant to the experience needed.
* Editing the maximum number of applications or the maximum number of positions available to lesser that what already exists is not allowed.
* On editing the maximum positions value to the number that already exists results in all other applications getting rejected as the job is now `inactive`.
* An applications is said to be `open` if it is in either `applied` or `shortlisted` state.