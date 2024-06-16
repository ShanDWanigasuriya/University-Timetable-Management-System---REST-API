# University-Timetable-Management-System---REST-API
## Overview
#### The University Timetable Management System API is designed to streamline the scheduling and management of courses, faculty, and students within a university environment. It provides a secure and efficient platform for administrative staff, faculty members, and students to perform various operations related to managing timetables and resources.

## Key Features
* **Role-based Access:** Administrators, faculty members, and students each have specific roles and permissions within the system, ensuring secure access and management of data.
* **Administrative Capabilities:** Administrators can add and manage faculty, courses, rooms, resources, and student enrollments. They can also send announcement notifications to relevant parties.
* **Faculty Tools:** Faculty members can manage their course timetables, view student enrollments, and book rooms and resources necessary for their classes.
* **Student Tools:** Students can view their course timetables, enroll in courses, and access their profile information.

## Technology Stack
#### The University Timetable Management System API is built using the following technologies:

* **Backend: Node.js and Express.js** Node.js provides the runtime environment for server-side logic. Express.js is used for building robust and scalable APIs, handling routes, middleware, and request/response handling.
* **Database: MongoDB** MongoDB is utilized as the database management system. It offers flexibility in schema design and scalability, suitable for managing timetable schedules, course details, user information, and bookings.
* **Authentication and Authorization: JWT Tokens** JSON Web Tokens (JWT) are employed for secure authentication and authorization. JWT tokens ensure that only authenticated users with appropriate roles can access sensitive API endpoints and perform authorized actions.
* **Testing: Mocha and Chai** Mocha is used as the testing framework. Chai is used for assertions and expectations within unit tests. Considerations are made for integration testing in various environments to validate API functionality across different scenarios.

## Setup Instructions
#### 1. Clone the Repository:
```
git clone https://github.com/ShanDWanigasuriya/University-Timetable-Management-System---REST-API.git
cd University-Timetable-Management-System---REST-API
```

#### 2. Install Dependencies:
```
npm install
```

#### 3. Set Environment Variables & Database Setup

#### 4. Start the Server:
```
npm start
```


## API Endpoint Documentation
#### Admin Endpoints
* **Admin SignUp: POST /api/admin/signup**
* **Admin Login: POST /api/admin/login**
* **Admin Add Faculty: POST /admin/faculty**
* **Admin Add Course: POST /admin/courses**
* **Admin Assign Courses to Faculties: POST /admin/assign-faculty**
* **Admin Add Student: POST /admin/student**
* **Admin Add Room: POST /admin/room**
* **Admin Add Resource: POST /admin/resource**
* **Admin View Faculties: GET /admin/faculties**
* **Admin View Students: GET /admin/students**
* **Admin Update Course: PUT /admin/courses/:courseId**
* **Admin Delete Course: DELETE /admin/courses/:courseId**
* **Admin Update Room: PUT /admin/room/:roomId**
* **Admin Delete Room: DELETE /admin/room/:roomId**
* **Admin Update Resource: PUT /admin/resource/:resourceId**
* **Admin Delete Resource: DELETE /admin/resource/:resourceId**
* **Admin Send Announcement Notifications: POST /admin/send-announcement-notification**

#### Faculty Endpoints
* **Faculty Login: POST /api/faculty/login**
* **Faculty Add Timetable: POST /faculty/timetables**
* **Faculty Update Timetable: PUT /faculty/timetables/:timetableId**
* **Faculty View Timetables: GET /faculty/timetable**
* **Faculty View Enrollments: GET /faculty/enrollments**
* **Faculty Delete Timetable: DELETE /faculty/timetables/:timetableId**
* **Faculty Book Room: POST /faculty/book-room**
* **Faculty Book Resource: POST /faculty/book-resource**
* **Faculty Update Student Enrollment: POST /faculty/update-enrollment**

#### Student Endpoints
* **Student Login: POST /api/student/login**
* **Student Enroll to Courses: POST /student/enroll**
* **Student View Timetable: GET /student/timetable**
* **Student View Profile: GET /student/profile**


## Running Tests
#### To run the tests, execute the following command:
```
npm test
```