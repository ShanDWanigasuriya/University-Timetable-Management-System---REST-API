import request from 'supertest';
import { expect } from 'chai';
import express from 'express';
import assert from 'assert';
import adminRouter from '../../routes/adminRoute.js'; // Assuming the file path is correct
import Faculty from '../../models/faculty.js';

const app = express();
app.use(express.json());
app.use('/admin', adminRouter);

describe('Admin Routes', () => {
    describe('POST /admin/faculty', () => {
        it('should add a new faculty', function(done) {
            this.timeout(50000);
            request(app)
                .post('/admin/faculty')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .send({
                    username: "SLIIT LAW SCHOOL",
                    password: "Law@123", 
                    notification: [],
                    coursesAssigned: [],
                    timetables: []
                })
                .expect((res) => {
                    if (res.status === 409) {
                        // Assert if the response is a conflict, meaning the room is already booked
                        assert.equal(res.body.message, 'Username already exists');
                    } else if (res.status === 200) {
                        // Assert if the response is success, meaning the room is available and booked
                        assert.equal(res.body.message, 'Faculty added successfully');
                    } else {
                        // If neither conflict nor success, fail the test
                        throw new Error('Unexpected response status');
                    }
                })
                .end(done);
        });
    });

    describe('POST /admin/courses', () => {
        it('should add a new course', function(done) {
            this.timeout(50000);
            request(app)
                .post('/admin/courses')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .send({
                    name: 'Mathematics for Computing',
                    code: 'IT1030',
                    description: 'MC.This course provides an introduction to the fundamentals of Calculations that need for Programming.',
                    credits: 3,
                    faculty: "65ff17bc343722a7e9512afc"
                })
                .expect((res) => {
                    if (res.status === 200) {
                        // Assert if the response is success, meaning the room is available and booked
                        assert.equal(res.body.message, 'Course added successfully');
                    }else if (res.status === 400) {
                        assert.equal(res.body.message, 'Course already exists');
                    } else {
                        // If neither conflict nor success, fail the test
                        throw new Error('Unexpected response status');
                    }
                })
                .end(done);
        });
    });


    describe('PUT /admin/courses/:courseId', () => {
        it('should update an existing course', function(done) {
            this.timeout(50000);
            request(app)
                .put('/admin/courses/65ff1a26343722a7e9512b01')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .send({
                    courseId: '65ff1a26343722a7e9512b01',
                    name: 'Introduction to Programming',
                    code: 'IT1010',
                    description: 'This course provides an introduction to the fundamentals of C Programming.',
                    credits: 4,
                    faculty: "65ff17bc343722a7e9512afc"
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.body.message, 'Course updated successfully');
                    done();
                });
        });
    });


    describe('DELETE /admin/courses/:courseId', () => {
        it('should delete an existing course', function(done) {
            this.timeout(50000);
            request(app)
                .delete('/admin/courses/66068b0276de48d6932d588f')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .expect((res) => {
                    if (res.status === 200) {
                        // Assert if the response is success, meaning the room is available and booked
                        assert.equal(res.body.message, 'Course deleted successfully');
                    }else if (res.status === 404) {
                        assert.equal(res.body.message, 'Course not found');
                    } else {
                        // If neither conflict nor success, fail the test
                        throw new Error('Unexpected response status');
                    }
                })
                .end(done);
        });
    });

    describe('POST /admin/assign-faculty', () => {
        it('should assign a faculty to a course', function(done) {
            this.timeout(50000);
            request(app)
                .post('/admin/assign-faculty')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .send({
                    facultyId:"65ff17bc343722a7e9512afc", 
                    courseId:"65ff1a26343722a7e9512b01"
                })
                .expect((res) => {
                    console.log('Response Status:', res.status);
                    console.log('Response Body:', res.body);
                    if (res.status === 409) {
                        // Assert if the response is a conflict, meaning the room is already booked
                        assert.equal(res.body.message, 'Course already asigned to the faculty');
                    } else if (res.status === 200) {
                        // Assert if the response is success, meaning the room is available and booked
                        assert.equal(res.body.message, 'Faculty assigned to course successfully');
                    }else if (res.status === 404) {
                        // Assert if the response is success, meaning the room is available and booked
                        assert.equal(res.body.message, 'Faculty not found');
                    } else {
                        // If neither conflict nor success, fail the test
                        throw new Error('Unexpected response status');
                    }
                })
                .end(done);
        });
    });

    describe('POST /admin/student', () => {
        it('should add a new student', function(done) {
            this.timeout(50000);
            request(app)
                .post('/admin/student')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .send({
                    username: 'KamalaH',
                    password: 'Kamala@123',
                    fullName: 'Don kamala Hasan',
                    nic: '1234567890',
                    address: 'Pittugala, Malabe',
                    contactNo: '0757903414',
                    email: 'student@example.com',
                    faculty: '65ff17bc343722a7e9512afc',
                    batch: 'Y1.S1',
                    specialization: 'Software Engineering',
                    coursesEnrolled: [],
                    notification: []
                })
                .expect((res) => {
                    console.log('Response Status:', res.status);
                    console.log('Response Body:', res.body);
                if (res.status === 409) {
                    // Assert if the response is a conflict, meaning the room is already booked
                    assert.equal(res.body.message, 'Username already exists');
                } else if (res.status === 200) {
                    // Assert if the response is success, meaning the room is available and booked
                    assert.equal(res.body.message, 'Student added successfully');
                } else {
                    // If neither conflict nor success, fail the test
                    throw new Error('Unexpected response status');
                }
            })
            .end(done);
        });
    });

    describe('POST /admin/room', () => {
        it('should add a new room', function(done) {
            this.timeout(50000);
            request(app)
                .post('/admin/room')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .send({
                    name: 'Room Name',
                    capacity: 50,
                    location: 'Room Location',
                    resources: ['Resource 1', 'Resource 2'],
                })
                .expect((res) => {
                    if (res.status === 200) {
                        // Assert if the response is success, meaning the room is available and booked
                        assert.equal(res.body.message, 'Room added successfully');
                    }else if (res.status === 400) {
                        assert.equal(res.body.message, 'Room already exists');
                    } else {
                        // If neither conflict nor success, fail the test
                        throw new Error('Unexpected response status');
                    }
                })
                .end(done);
        });
    });

    describe('PUT /admin/room/:roomId', () => {
        it('should update an existing room', function(done) {
            this.timeout(50000);
            request(app)
                .put('/admin/room/66068f5644debc027fd24d88')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .send({
                    name: 'Uname',
                    capacity: 60,
                    location: 'UpdateLocation',
                    resources: ['Resource 11', 'Resource 22', 'Resource 33'],
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    assert.equal(res.body.message, 'Room updated successfully');
                    done();
                });   
        });
    });

    describe('DELETE /admin/room/:roomId', () => {
        it('should delete an existing room', function(done) {
            this.timeout(50000);
            request(app)
                .delete('/admin/room/66068ebbfe5c5b87a0cf572b')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .expect((res) => {
                    console.log('Response Status:', res.status);
                    console.log('Response Body:', res.body);
                    if (res.status === 404) {
                        assert.equal(res.body.message, 'Room not found');
                    } else if (res.status === 200) {
                        assert.equal(res.body.message, 'Room deleted successfully');
                    } else {
                        throw new Error('Unexpected response status');
                    }
                })
                .end(done);
        });
    });

    describe('POST /admin/resource', () => {
        it('should add a new resource', function(done) {
            this.timeout(50000);
            request(app)
                .post('/admin/resource')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .send({
                    name: 'Broom',
                    description: 'Resource_Description',
                })
                .expect((res) => {
                    if (res.status === 200) {
                        // Assert if the response is success, meaning the room is available and booked
                        assert.equal(res.body.message, 'Resource added successfully');
                    }else if (res.status === 400) {
                        assert.equal(res.body.message, 'Resource already exists');
                    } else {
                        // If neither conflict nor success, fail the test
                        throw new Error('Unexpected response status');
                    }
                })
                .end(done);
        });
    });

    describe('PUT /admin/resource/:resourceId', () => {
        it('should update an existing resource', function(done) {
            this.timeout(50000);
            request(app)
                .put('/admin/resource/66066b935642761bc92c3761')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .send({
                    name: 'Desktop',
                    description: 'Resource_Description',
                })
                .expect(200)
                .end((err, res) => {
                  if (err) return done(err);
                  assert.equal(res.body.message, 'Resource updated successfully');
                  done();
                });
        });
    });

    describe('DELETE /admin/resource/:resourceId', () => {
        it('should delete an existing resource', function(done) {
            this.timeout(50000);
            request(app)
                .delete('/admin/resource/66066ab24921c4c45f24ab2c')
                .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjVmZjE2MTEzNDM3MjJhN2U5NTEyYWY4Iiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTcxMTIxNjI1MH0.yM-Ea7dv4P39p061uS2gq9LBjGl4Z4atSKxsXEB2JPY')
                .expect((res) => {
                    console.log('Response Status:', res.status);
                    console.log('Response Body:', res.body);
                    if (res.status === 404) {
                        assert.equal(res.body.message, 'Resource not found');
                    } else if (res.status === 200) {
                        assert.equal(res.body.message, 'Resource deleted successfully');
                    } else {
                        throw new Error('Unexpected response status');
                    }
                })
                .end(done);
        });
    });
});
