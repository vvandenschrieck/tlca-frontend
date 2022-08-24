## 1.0.4 (2022-08-24)

### Bug Fixes

- **courses:** fix issues with registration and invitation request for courses

## 1.0.3 (2022-08-21)

### Bug Fixes

- **partners:** fix title generation issue for partners

## 1.0.2 (2022-08-15)

### Code Refactoring

- use the environement variables management provided by Nuxt

### Tools

- set up BugSnag to monitor bug in production

## 1.0.1 (2022-08-12)

### Bug Fixes

- **assessments:** fix GraphQL query issue with wrong type for dates

## 1.0.0 (2022-08-08)

### Features

- **assessments:** create a new assessment for a given course (coordinator)
- **assessments:** consult the list of assessments of a given course (coordinator)
- **assessments:** consult the details of a given assessment from a given course (coordinator)
- **assessments:** check the competency coverage of a given assessment from a given course (coordinator)

- **competencies:** create a new competency (teacher)
- **competencies:** define tags for a competency (teacher)
- **competencies:** consult the list of competencies available to the connected teacher (teacher)
- **competencies:** consult the list of all competencies (admin)
- **competencies:** consult the details of a given competency from a teacher (teacher)

- **public:** consult the list of all "public" courses, programs and partners (user)
- **public:** consult the list of recent courses, programs and partners (user)

- **users:** create an account (user)
- **users:** connect to the platform (user)
- **users:** consult the list of all users (admin)
- **users:** view temporarily the password in clear when signing up or in (user)

- **programs:** create a new program (teacher)
- **programs:** consult the list of programs available to the connected teacher (teacher)
- **programs:** consult the details of a given program from a teacher (teacher)

- **partners:** consult the details of a given partner (user)

- **courses:** create a new course (teacher)
- **courses:** define the banner for a course (coordinator)
- **courses:** define teaching groups for a course (coordinator)
- **courses:** assign registered students to a teaching group for a given course (coordinator)
- **courses:** consult the list of courses created by a teacher (coordinator)
- **courses:** consult the list of courses available to the connected teacher (teacher)
- **courses:** consult the list of courses available to the connected student (student)
- **courses:** consult the list of all courses (admin)
- **courses:** consult the details of a given course (user, coordinator)
- **courses:** consult the list of registrations for a given (coordinator)
- **courses:** publish a course (teacher)
- **courses:** archive a course (teacher)
- **courses:** clone a course (teacher)
- **courses:** register to a course (student)
- **courses:** request an invitation for a course (user, student)
- **courses:** accept an invitation request from a user or student for a given course (coordinator)

- **misc:** switch from one space to another
