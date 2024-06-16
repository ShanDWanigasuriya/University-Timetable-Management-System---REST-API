import { expect } from 'chai';
import app from '../../index.js';
import request from 'supertest';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import assert from 'assert';
import Timetable from '../../models/timetable.js';
import Student from '../../models/student.js'; 

describe('Student Routes', () => {
  describe('GET /timetable', () => {
    it('should return status 200 and timetable data', async () => {
      // Mock the Timetable.find function to return the expected timetable
      const expectedTimetable = [
        {
          "_id": "65ff2558343722a7e9512b46",
          "faculty": "65ff17bc343722a7e9512afc",
          "specialization": "Software Engineering",
          "batch": "Y1.S1",
          "classSessions": [
              {
                  "location": {
                      "room": "65ff200d343722a7e9512b24",
                      "roomName": "G301"
                  },
                  "dayOfWeek": "Monday",
                  "course": "65ff19f1343722a7e9512aff",
                  "startTime": "2024-02-01T09:00:00.000Z",
                  "endTime": "2024-02-01T11:00:00.000Z",
                  "_id": "661cda7031d73cee27c764ab"
              },
              {
                  "location": {
                      "room": "65ff1ffd343722a7e9512b22",
                      "roomName": "G1101"
                  },
                  "dayOfWeek": "Tuesday",
                  "course": "65ff1a26343722a7e9512b01",
                  "startTime": "2024-02-01T09:00:00.000Z",
                  "endTime": "2024-02-01T11:00:00.000Z",
                  "_id": "661cda7031d73cee27c764ac"
              },
              {
                  "location": {
                      "room": "65ff1fec343722a7e9512b20",
                      "roomName": "B502"
                  },
                  "dayOfWeek": "Wednesday",
                  "course": "65ff1a6a343722a7e9512b03",
                  "startTime": "2024-02-01T09:00:00.000Z",
                  "endTime": "2024-02-01T11:00:00.000Z",
                  "_id": "661cda7031d73cee27c764ad"
              },
              {
                  "location": {
                      "room": "65ff1ffd343722a7e9512b22",
                      "roomName": "G1101"
                  },
                  "dayOfWeek": "Thursday",
                  "course": "65ff1a26343722a7e9512b01",
                  "startTime": "2024-02-01T09:00:00.000Z",
                  "endTime": "2024-02-01T11:00:00.000Z",
                  "_id": "661cda7031d73cee27c764ae"
              },
              {
                  "location": {
                      "room": "65fbc43bd711e38b7fed0da2",
                      "roomName": "B501"
                  },
                  "dayOfWeek": "Friday",
                  "course": "65ff1a6a343722a7e9512b03",
                  "startTime": "2024-02-01T09:00:00.000Z",
                  "endTime": "2024-02-01T11:00:00.000Z",
                  "_id": "661cda7031d73cee27c764af"
              },
              {
                  "location": {
                      "room": "65ff1ffd343722a7e9512b22",
                      "roomName": "G1101"
                  },
                  "dayOfWeek": "Saturday",
                  "course": "65ff1a26343722a7e9512b01",
                  "startTime": "2024-02-01T09:00:00.000Z",
                  "endTime": "2024-02-01T11:00:00.000Z",
                  "_id": "661cda7031d73cee27c764b0"
              },
              {
                  "location": {
                      "room": "65ff200d343722a7e9512b24",
                      "roomName": "G301"
                  },
                  "dayOfWeek": "Sunday",
                  "course": "65ff19f1343722a7e9512aff",
                  "startTime": "2024-02-01T09:00:00.000Z",
                  "endTime": "2024-02-01T11:00:00.000Z",
                  "_id": "661cda7031d73cee27c764b1"
              }
          ],
          "__v": 0
      }
      ];
      sinon.stub(Timetable, 'find').resolves(expectedTimetable);
  
      // Make the request to the endpoint
      const res = await request(app)
        .get('/student/timetable')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjYxY2Q4ZmNmMzkzYzgxMjE3NDZiZmQzIiwicm9sZSI6InN0dWRlbnQifSwiaWF0IjoxNzEzMTY2NjAyfQ.4LzNdaVY4C5uwuUZsPtmPkFUsxqGDKdOT-r4d4a2uHs');
  
      // Assertions
      expect(res.status).to.equal(200);
      expect(res.body.timetable).to.deep.equal(expectedTimetable);
  
      // Restore the stub after the test
      Timetable.find.restore();
    });
  });
});

describe('Student Routes', () => {
  describe('POST /enroll', () => {
    it('should enroll student in a course when authenticated', function(done) {
      this.timeout(50000);
      request(app)
        .post('/student/enroll')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjYxY2Q4ZmNmMzkzYzgxMjE3NDZiZmQzIiwicm9sZSI6InN0dWRlbnQifSwiaWF0IjoxNzEzMTY2NjAyfQ.4LzNdaVY4C5uwuUZsPtmPkFUsxqGDKdOT-r4d4a2uHs')
        .send({
          courseId: "65ff1a26343722a7e9512b01",
          studentId: "661cd8fcf393c8121746bfd3"
        })
        .expect((res) => {
          if (res.status === 409) {
              // Assert if the response is a conflict, meaning the room is already booked
              assert.equal(res.body.message, 'Student already enrolled in the course');
          } else if (res.status === 200) {
              // Assert if the response is success, meaning the room is available and booked
              assert.equal(res.body.message, 'Course enrolled successfully');
          } else {
              // If neither conflict nor success, fail the test
              throw new Error('Unexpected response status');
          }
      })
      .end(done);
  });
});
});
