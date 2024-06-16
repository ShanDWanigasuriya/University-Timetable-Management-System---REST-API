import { expect } from 'chai';
import sinon from 'sinon';
import notificationController from '../../controllers/notificationController.js';
import Faculty from '../../models/faculty.js';
import Student from '../../models/student.js';
import Notification from '../../models/notification.js';

describe('sendRoomResourceNotification', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should handle error when failing to send room/resource notifications', async () => {
        const errorMessage = 'Database error';
        sinon.stub(Faculty, 'find').throws(new Error(errorMessage));

        try {
            await notificationController.sendRoomResourceNotification('Test message');
        } catch (error) {
            expect(error.message).to.equal('Failed to send room/resource notifications');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.property('message', 'Failed to send room/resource notifications');
        }
    });
});

describe('sendTimetableNotification', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should handle error when failing to send timetable notifications', async () => {
        const errorMessage = 'Database error';
        sinon.stub(Student, 'find').throws(new Error(errorMessage));

        try {
            await notificationController.sendTimetableNotification('Test message', '2024A');
        } catch (error) {
            expect(error.message).to.equal('Failed to send timetable notifications');
            expect(error).to.be.an.instanceOf(Error);
            expect(error).to.have.property('message', 'Failed to send timetable notifications');
        }
    });
});
