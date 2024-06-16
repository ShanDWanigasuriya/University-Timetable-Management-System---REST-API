import { describe, it } from 'mocha';
import app from '../../index.js'; 
import request from 'supertest';
import { expect } from 'chai';
import assert from 'assert';

describe('Faculty Routes', () => {
  
    describe('GET /enrollments', () => {
      it('should return unauthorized for unauthenticated access', (done) => {
        request(app)
          .get('/faculty/enrollments')
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            assert(res.body.message === undefined, 'Response should contain an error message');
            done();
          });
      });
    });
  
    describe('POST /update-enrollment', () => {
      it('should update an enrollment for authenticated faculty', function(done) {
        this.timeout(50000);
        request(app)
          .post('/faculty/update-enrollment')
          .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE3YmMzNDM3MjJhN2U5NTEyYWZjIiwicm9sZSI6ImZhY3VsdHkifSwiaWF0IjoxNzExMjE5MTgzfQ.wuEH4gVIVp5XLxZtDbCsUBDXxriq3jypFem-WDhUOGU')
          .send({ studentId: '661cd8fcf393c8121746bfd3',
          coursesToRemove: ['65ff19f1343722a7e9512aff'] })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            assert.equal(res.body.message, 'Student enrollment updated successfully');
            done();
          });
      });
  
      it('should return unauthorized for unauthenticated access', (done) => {
        request(app)
          .post('/faculty/update-enrollment')
          .expect(401)
          .end((err, res) => {
            if (err) return done(err);
            assert(res.body.message === undefined, 'Response should contain an error message');
            done();
          });
      });
    });

  describe('GET /timetable', () => {
    it('should return unauthorized for unauthenticated access', (done) => {
      request(app)
        .get('/faculty/timetable')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          assert(res.body.message === undefined, 'Response should contain an error message');
          done();
        });
    });
  });

  describe('POST /timetables', () => {
    it('should create a new timetable for authenticated faculty, otherwise only should give conflict', function(done) {
      this.timeout(50000);
      request(app)
        .post('/faculty/timetables')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE3YmMzNDM3MjJhN2U5NTEyYWZjIiwicm9sZSI6ImZhY3VsdHkifSwiaWF0IjoxNzExMjE5MTgzfQ.wuEH4gVIVp5XLxZtDbCsUBDXxriq3jypFem-WDhUOGU')
        .send({
          faculty: "65ff17bc343722a7e9512afc",
          specialization: "Data Science",
          batch: "Y1.S1",
          classSessions: [
            {
              dayOfWeek: "Monday",
              course: "65ff19f1343722a7e9512aff",
              startTime: "2024-02-01T09:00:00.000Z",
              endTime: "2024-02-01T11:00:00.000Z",
              location: {
                room: "65ff200d343722a7e9512b24",
                roomName: "G301"
              }
            },
            {
              dayOfWeek: "Tuesday",
              course: "65ff1a26343722a7e9512b01",
              startTime: "2024-02-01T09:00:00.000Z",
              endTime: "2024-02-01T11:00:00.000Z",
              location: {
                room: "65ff1ffd343722a7e9512b22",
                roomName: "G1101"
              }
            },
            {
              dayOfWeek: "Wednesday",
              course: "65ff1a6a343722a7e9512b03",
              startTime: "2024-02-01T09:00:00.000Z",
              endTime: "2024-02-01T11:00:00.000Z",
              location: {
                room: "65ff1fec343722a7e9512b20",
                roomName: "B502"
              }
            },
            {
              dayOfWeek: "Thursday",
              course: "65ff1a26343722a7e9512b01",
              startTime: "2024-02-01T09:00:00.000Z",
              endTime: "2024-02-01T11:00:00.000Z",
              location: {
                room: "65ff1ffd343722a7e9512b22",
                roomName: "G1101"
              }
            },
            {
              dayOfWeek: "Friday",
              course: "65ff1a6a343722a7e9512b03",
              startTime: "2024-02-01T09:00:00.000Z",
              endTime: "2024-02-01T11:00:00.000Z",
              location: {
                room: "65fbc43bd711e38b7fed0da2",
                roomName: "B501"
              }
            },
           {
              dayOfWeek: "Saturday",
              course: "65ff1a26343722a7e9512b01",
              startTime: "2024-02-01T09:00:00.000Z",
              endTime: "2024-02-01T11:00:00.000Z",
              location: {
                room: "65ff1ffd343722a7e9512b22",
                roomName: "G1101"
              }
            },
            {
              dayOfWeek: "Sunday",
              course: "65ff19f1343722a7e9512aff",
              startTime: "2024-02-01T09:00:00.000Z",
              endTime: "2024-02-01T11:00:00.000Z",
              location: {
                room: "65ff200d343722a7e9512b24",
                roomName: "G301"
              }
            }
          ]
        })
        .expect((res) => {
          if (res.status === 409) {
              // Assert if the response is a conflict, meaning the timetable already exists
              assert.equal(res.body.message, 'Room already booked for the specified time');
          } else if (res.status === 200) {
              // Assert if the response is success, meaning the timetable is created
              assert.equal(res.body.message, 'Timetable created successfully');
          } else {
              // If neither conflict nor success, fail the test
              throw new Error('Unexpected response status');
          }
      })
      .end(done);
      });

    it('should return unauthorized for unauthenticated access', (done) => {
      request(app)
        .post('/faculty/timetables')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          assert(res.body.message === undefined, 'Response should contain an error message');
          done();
        });
    });
  });

  describe('PUT /timetables/:timetableId', () => {
    it('should update an existing timetable for authenticated faculty', function(done) {
      this.timeout(50000);
      request(app)
        .put('/faculty/timetables/65ff2558343722a7e9512b46')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE3YmMzNDM3MjJhN2U5NTEyYWZjIiwicm9sZSI6ImZhY3VsdHkifSwiaWF0IjoxNzExMjE5MTgzfQ.wuEH4gVIVp5XLxZtDbCsUBDXxriq3jypFem-WDhUOGU')
        .send({timetableId: "65ff2558343722a7e9512b46",
        classSessions: [
          {
            dayOfWeek: "Monday",
            course: "65ff19f1343722a7e9512aff",
            startTime: "2024-02-01T09:00:00.000Z",
            endTime: "2024-02-01T11:00:00.000Z",
            location: {
              room: "65ff200d343722a7e9512b24",
              roomName: "G301"
            }
          },
          {
            dayOfWeek: "Tuesday",
            course: "65ff1a26343722a7e9512b01",
            startTime: "2024-02-01T09:00:00.000Z",
            endTime: "2024-02-01T11:00:00.000Z",
            location: {
              room: "65ff1ffd343722a7e9512b22",
              roomName: "G1101"
            }
          },
          {
            dayOfWeek: "Wednesday",
            course: "65ff1a6a343722a7e9512b03",
            startTime: "2024-02-01T09:00:00.000Z",
            endTime: "2024-02-01T11:00:00.000Z",
            location: {
              room: "65ff1fec343722a7e9512b20",
              roomName: "B502"
            }
          },
          {
            dayOfWeek: "Thursday",
            course: "65ff1a26343722a7e9512b01",
            startTime: "2024-02-01T09:00:00.000Z",
            endTime: "2024-02-01T11:00:00.000Z",
            location: {
              room: "65ff1ffd343722a7e9512b22",
              roomName: "G1101"
            }
          },
          {
            dayOfWeek: "Friday",
            course: "65ff1a6a343722a7e9512b03",
            startTime: "2024-02-01T09:00:00.000Z",
            endTime: "2024-02-01T11:00:00.000Z",
            location: {
              room: "65fbc43bd711e38b7fed0da2",
              roomName: "B501"
            }
          },
         {
            dayOfWeek: "Saturday",
            course: "65ff1a26343722a7e9512b01",
            startTime: "2024-02-01T09:00:00.000Z",
            endTime: "2024-02-01T11:00:00.000Z",
            location: {
              room: "65ff1ffd343722a7e9512b22",
              roomName: "G1101"
            }
          },
          {
            dayOfWeek: "Sunday",
            course: "65ff19f1343722a7e9512aff",
            startTime: "2024-02-01T09:00:00.000Z",
            endTime: "2024-02-01T11:00:00.000Z",
            location: {
              room: "65ff200d343722a7e9512b24",
              roomName: "G301"
            }
          }
        ]})
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          assert.equal(res.body.message, 'Timetable updated successfully');
          done();
        });
    });

    it('should return unauthorized for unauthenticated access', (done) => {
      request(app)
        .put('/faculty/timetables/your-timetable-id-here')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          assert(res.body.message === undefined, 'Response should contain an error message');
          done();
        });
    });
  });

  describe('DELETE /timetables/:timetableId', () => {
    it('should delete an existing timetable for authenticated faculty', function(done) {
      this.timeout(50000);
      request(app)
        .delete('/faculty/timetables/660660a8677fba4fd4447ba8')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE3YmMzNDM3MjJhN2U5NTEyYWZjIiwicm9sZSI6ImZhY3VsdHkifSwiaWF0IjoxNzExMjE5MTgzfQ.wuEH4gVIVp5XLxZtDbCsUBDXxriq3jypFem-WDhUOGU')
        .expect((res) => {
          console.log('Response Status:', res.status);
          console.log('Response Body:', res.body);
          if (res.status === 404) {
              assert.equal(res.body.message, 'Timetable not found');
          } else if (res.status === 200) {
              assert.equal(res.body.message, 'Timetable deleted successfully');
          } else {
              throw new Error('Unexpected response status');
          }
      })
      .end(done);
    });

    it('should return unauthorized for unauthenticated access', (done) => {
      request(app)
        .delete('/faculty/timetables/your-timetable-id-here')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          assert(res.body.message === undefined, 'Response should contain an error message');
          done();
        });
    });
  });

  describe('POST /book-room', () => {
    it('should book a room if it is available and return a conflict if already booked', function(done) {
      this.timeout(50000);
      request(app)
        .post('/faculty/book-room')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE3YmMzNDM3MjJhN2U5NTEyYWZjIiwicm9sZSI6ImZhY3VsdHkifSwiaWF0IjoxNzExMjE5MTgzfQ.wuEH4gVIVp5XLxZtDbCsUBDXxriq3jypFem-WDhUOGU')
        .send({
          room: "65ff1fec343722a7e9512b20",
          roomName: "B502",
          date: "2024-04-25", // Date format: YYYY-MM-DD
          startTime: "2024-04-25T09:00:00.000Z", // Start time in ISO format
          endTime: "2024-04-25T11:00:00.000Z", // End time in ISO format
          faculty: "65ff17bc343722a7e9512afc"
        })
        .expect((res) => {
          if (res.status === 409) {
              // Assert if the response is a conflict, meaning the room is already booked
              assert.equal(res.body.message, 'Room already booked for the specified time');
          } else if (res.status === 200) {
              // Assert if the response is success, meaning the room is available and booked
              assert.equal(res.body.message, 'Room booked successfully');
          } else {
              // If neither conflict nor success, fail the test
              throw new Error('Unexpected response status');
          }
      })
      .end(done);
    });

    it('should return unauthorized for unauthenticated access', (done) => {
      request(app)
        .post('/faculty/book-room')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          assert(res.body.message === undefined, 'Response should contain an error message');
          done();
        });
    });
  });

  describe('POST /book-resource', () => {
    it('should book a resource for authenticated faculty', function(done) {
      this.timeout(50000);
      request(app)
        .post('/faculty/book-resource')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE3YmMzNDM3MjJhN2U5NTEyYWZjIiwicm9sZSI6ImZhY3VsdHkifSwiaWF0IjoxNzExMjE5MTgzfQ.wuEH4gVIVp5XLxZtDbCsUBDXxriq3jypFem-WDhUOGU')
        .send({
          resource: "65fbc60c4cc62d9266caae93",
          date: "2024-03-25",
          startTime: "2024-03-25T09:00:00",
          endTime: "2024-03-25T11:00:00",
          faculty: "65ff17bc343722a7e9512afc"
        })
        .expect(409)
        .end((err, res) => {
          if (err) return done(err);
          assert.equal(res.body.message, 'Resource already booked for the specified time');
          done();
        });
    });

    it('should return unauthorized for unauthenticated access', (done) => {
      request(app)
        .post('/faculty/book-resource')
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          assert(res.body.message === undefined, 'Response should contain an error message');
          done();
        });
    });
  });
});
