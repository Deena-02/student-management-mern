const mongoose = require('mongoose');

const studentSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        rollNumber: {
            type: String,
            required: [true, 'Please add a roll number'],
            unique: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        course: {
            type: String,
            required: [true, 'Please add a course'],
        },
        grade: {
            type: String,
            required: [true, 'Please add a grade'],
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Graduated'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Student', studentSchema);
