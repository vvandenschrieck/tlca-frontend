## 1.1.17 (2022-11-03)

### Bug Fixes

- fixed form display issues for mass creation of evaluations (teacher)

## 1.1.17 (2022-11-02)

### Features

- **evaluations:** create multiple evaluations at once for several learners (teacher)

### Improvements

- added buttons to delete and publish an evaluation from the evaluations list page (teacher)

## 1.1.16 (2022-11-01)

### Features

- **evaluations:** correct evaluations from assessment with the 'tfq' provider (teacher)
- **evaluations:** display selected answers, solution and feedback for evaluations from assessment with the 'tfq' provider (student and teacher)

- **registrations:** assign students to a working group (coordinator)

### Improvements

- hid archived courses by default in teach space (and updated the courses filter)
- moved information about assessment with a provider to a specific panel

### Code Refactoring

- refactored several pieces of code in the course section of manage space (cleaning up the code structure and moving GraphQL queries inside components)

## 1.1.15 (2022-10-28)

### Features

- **assessments:** export evaluation form for a given assessment (teacher)
- **assessments:** show/hide the timer when taking an assessment with a provider (student)

### Improvements

- added information about provider in the assessment and evaluation info panels
- changed the order of evaluation fields in creation/edit/request form and on detail page
- displayed the provider specific answers on the evaluation detail page

### Bug Fixes

- **assessments:** fix issue with validation rule for the number of takes

### Code Refactoring

- made it possible to have more than one custom action in the actions menu

## 1.1.14 (2022-10-27)

### Features

- **courses:** define working groups for a course (coordinator)
- **courses:** get the list of working groups for a course (coordinator)

### Improvements

- added a warning to the course page when editing a published one
- added checks for the evaluation request against the assessement dates
- grouped assessments by categories by default
- grouped evaluations by status by default

### Bug Fixes

- **evaluations:** hid the evaluation request button on assessments list when the current date is not within the assessment schedule
- **evaluations:** fixed issue in the evaluation detail and edit pages

## 1.1.13 (2022-10-24)

### Bug Fixes

- fixed display bug in info cards always mentioning that the entities are empty
- fixed issue on the assessment info card with the stat line specific to teachers

## 1.1.12 (2022-10-24)

### Features

- **assessments:** delete an instance (admin)
- **assessments:** get the list of all instances (admin)

- **evaluations:** display competencies acquired by past evaluations for incremental assessment (teacher and student)

- **files:** get the list of files (resources) associated to a given course (student)

- **users:** change the password with a password reset process (user)

### Improvements

- replaced the username column by an email column of users list page (admin)

### Bug Fixes

- fixed a bug on the evaluation creation page with the instance selection when changing the learner and/or the assessment in the assessment selector component

## 1.1.11 (2022-10-19)

### Bug Fixes

- **evaluations:** fixed issue in the evaluation creation form by clearing the selected instance when it has been cleared in the assessment instance selector component

## 1.1.10 (2022-10-17)

- **evaluations:** accept an evaluation request (teacher)
- **evaluations:** delete a published evaluation (teacher)
- **evaluations:** edit a non-published or accepted evaluation (teacher)
- **evaluations:** reject an evaluation request (teacher)

### Improvements

- replaced first and last names by display names in the learners list (teacher)

## 1.1.9 (2022-10-15)

### Features

- **assessments:** take and submit an assessment that has been defined with the tfq provider (student)

### Improvements

- added a switch to group evaluations by status on the evaluations list page
- added the learning outcomes progress on the competencies list page (students)
- added the requested status for evaluations on the evaluations list page
- hid categories column on assessments list when grouping by categories
- improved the evaluations info card with new pieces of information (teacher)
- toggled the new instance button automatically when creating a new evaluation for which it does not exist any instances yet

### Bug Fixes

- fixed the search in the learner and in the assessment select fields, to allow searching with the content
- fixed the values shown on the evaluation detail page, depending on its status

## 1.1.8 (2022-10-09)

### Features

- **assessments:** configure an assessment to not authorise evaluation request (coordinator)

### Improvements

- updated the course detail page in the teach space, by defining the missing info cards
- changed the visibilities filter of competencies list in manage space by one to show/hide public competencies
- updated the evaluation info panel to include additional items (evaluator, creation date, assessment and learner)

### Bug Fixes

- fixed issue with takes field of assessment that was not taken into account upon edit
- hid the competency archive button if the connected user is not its owner

### Code Refactoring

- defined a component to display a list of stats (for info cards)

## 1.1.7 (2022-10-08)

### Features

- **competencies:** archive a competency (coordinator)
- **competencies:** include archived competencies with the competencies filter, they are hidden by default (coordinator)

- **evaluations:** request an evaluation (student)

### Improvements

- changed the french translation of 'evaluation'
- added information in several info panels (assessment and competency)

### Code Refactoring

- defined a component to display an HTML text
- completely refactored the assessment competencies list component to have a single one that can be used as a form or just to display information

## 1.1.6 (2022-09-30)

### Improvements

- removed the stepper in the evaluation creation form

### Bug Fixes

- fixed issue with two functional components by temporarily making them non-functional again

### Code Refactoring

- refactored the two learning outcomes list components into a single one

## 1.1.5 (2022-09-28)

### Features

- **courses:** consult the details of the progress competencies (student)
- **courses:** display the competencies progress with a progress bar when using learning outcomes (student)

- **evaluations:** get the details of a given evaluation (student)
- **evaluations:** get the list of all the evaluations associated to a given course concerning a learner (student)

- **registrations:** delete a registration that is not confirmed, that is, invitations and invitation requests (coordinator)

- **users:** resend the confirmation email, from the sign in form (user)

### Bug Fixes

- **assessments:** fix issue with displayed assessments on the assessments list (student)
- **assessments:** fix the alert displayed when there are no available assessments (coordinator)

- **competencies:** fix display issues with too long description for learning outcomes or checklist items

- **registrations:** hid invitation request button when already registered and for the coordinator and teachers

### Code Refactoring

- refactored all the pages used in the learn space, by moving GraphQL queries into components instead of making them directly in the page and by cleaning and making their structures similar
- refactored the course card component to use the 'status' field

## 1.1.4 (2022-09-20)

### Features

- **evaluations:** delete a non-published evaluation (teacher)

- **users:** edit a user (user)
- **users:** resend the confirmation email (user and admin)

### Improvements

- updated the evaluation creation form with the possibility to create or select an existing assessment instance
- showed the results of the previous published evaluations when creating a new one
- displayed detailed informations on the assessments info card for teachers and students

## 1.1.3 (2022-09-19)

### Improvements

- replaced the default display name by the email address in the registrations list (coordinator)

## 1.1.2 (2022-09-18)

### Features

- **assessments:** consult the details of a given assessment from a given course (teacher)

- **evaluations:** define the acquired competencies in the evaluation creation form (teacher)

### Improvements

- set up the info cards on the course detail page in teach space

### Bug Fixes

- fixed breadcrumb to display correctly parts containing special characters

### Code Refactoring

- refactored code in the teach space, by moving GraphQL queries into components instead of making them directly in the page

## 1.1.1 (2022-09-17)

### Features

- **assessments:** create an assessment instance (student)

- **programs:** create a program with the 'unit' type (coordinator)

- **misc:** go to the dashboard with a link in the user menu

### Improvements

- **assessments:** add the code or name of the assessment in the breadcrumb

- **courses:** add course search bar and filter (student)

### Bug Fixes

- **assessments:** remove the validation rule for assessment code
- fixed entity removal in several select components due to a misuse of the JavaScript splice method of arrays
- fixed title computation and display error in assessments list page in manage and learn space

### Code Refactoring

- moved GraphQL queries in the component (for info panels and several 'list' components)

## 1.1.0 (2022-09-15)

### Features

- **assessments:** associate an event to an assessment
- **assessments:** consult the list of assessments of a given course (student)
- **assessments:** consult the list of assessments of a given course (teacher)
- **assessments:** define an estimated grading load for a given assessment (coordinator)
- **assessments:** define an estimated workload for a given assessment (coordinator)
- **assessments:** define public and private checklist for competencies for a given assessment (coordinator)
- **assessments:** define the learning outcomes covered by a given assessment (coordinator)
- **assessments:** define the number of instances and of evaluations that can be taken for a given assessment (coordinator)
- **assessments:** define whether a given assessment is open or closed (coordinator)
- **assessments:** define whether a given assessment is visible or hidden (coordinator)
- **assessments:** delete an assessment (coordinator)
- **assessments:** edit an assessment (coordinator)
- **assessments:** limit the maximum number of stars that can be acquired with a given assessment (coordinator)
- **assessments:** visualise the availabilities and deadlines of the assessments of a course on a timeline (coordinator)

- **competencies:** define learning outcomes for a competency (teacher)
- **competencies:** define the number of times each LO of a competency must be proven (teacher)
- **competencies:** edit a competency (teacher)

- **courses:** accept an invitation received for a given course (user, student)
- **courses:** consult the details of a given course (student)
- **courses:** define advanced information for a given course (teacher)
- **courses:** edit a course (teacher)
- **courses:** get the list of my own students (teacher)
- **courses:** invite a user or student to a given course (coordinator)
- **courses:** select how a competency is used (stars or LO) when creating a course (teacher)

- **evaluations:** create a new evaluation for a given assessment of a given course (teacher)
- **evaluations:** get the details of a given evaluation (teacher)
- **evaluations:** get the list of all the evaluations associated to a given course (teacher)
- **evaluations:** publish an evaluation (teacher)

- **events:** create a new event corresponding to a course session (teacher)
- **events:** get the list of all events available to the connected teacher for a given course (teacher)

- **partners:** create a new partner (manager)
- **partners:** get the list of all partners (admin)
- **partners:** get the list of partners created by a manager (manager)

- **programs:** accept an invitation request from a user or student for a given program (coordinator)
- **programs:** edit a program (teacher)
- **programs:** get the details of a given program (user, coordinator)
- **programs:** get the list of students registered to my program (coordinator)
- **programs:** publish a program (teacher)
- **programs:** request an invitation for a program (user, student)

- **users:** sign out of the platform (user)
- **users:** validate a user account (user)

- **misc:** be redirected to the sign in page when the access token is expired
- **misc:** get all the general actions from a single page menu (fab)

### Technical

- automatically refresh the access token when expired, with the refresh token

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

- **assessments:** check the competency coverage of a given assessment from a given course (coordinator)
- **assessments:** consult the details of a given assessment from a given course (coordinator)
- **assessments:** consult the list of assessments of a given course (coordinator)
- **assessments:** create a new assessment for a given course (coordinator)

- **competencies:** consult the details of a given competency from a teacher (teacher)
- **competencies:** consult the list of all competencies (admin)
- **competencies:** consult the list of competencies available to the connected teacher (teacher)
- **competencies:** create a new competency (teacher)
- **competencies:** define tags for a competency (teacher)

- **courses:** accept an invitation request from a user or student for a given course (coordinator)
- **courses:** archive a course (teacher)
- **courses:** assign registered students to a teaching group for a given course (coordinator)
- **courses:** clone a course (teacher)
- **courses:** create a new course (teacher)
- **courses:** consult the details of a given course (user, coordinator)
- **courses:** consult the list of all courses (admin)
- **courses:** consult the list of courses available to the connected student (student)
- **courses:** consult the list of courses available to the connected teacher (teacher)
- **courses:** consult the list of courses created by a teacher (coordinator)
- **courses:** consult the list of registrations for a given (coordinator)
- **courses:** define teaching groups for a course (coordinator)
- **courses:** define the banner for a course (coordinator)
- **courses:** publish a course (teacher)
- **courses:** register to a course (student)
- **courses:** request an invitation for a course (user, student)

- **partners:** consult the details of a given partner (user)

- **programs:** consult the details of a given program from a teacher (teacher)
- **programs:** consult the list of programs available to the connected teacher (teacher)
- **programs:** create a new program (teacher)

- **public:** consult the list of all "public" courses, programs and partners (user)
- **public:** consult the list of recent courses, programs and partners (user)

- **users:** connect to the platform (user)
- **users:** consult the list of all users (admin)
- **users:** create an account (user)
- **users:** view temporarily the password in clear when signing up or in (user)

- **misc:** switch from one space to another
