const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/auth');

// Protect all student routes
router.use(protect);

// @desc    Get all students
// @route   GET /api/students
// @access  Private
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Set student
// @route   POST /api/students
// @access  Private
router.post('/', async (req, res) => {
    try {
        if (!req.body.name || !req.body.rollNumber || !req.body.email || !req.body.course || !req.body.grade) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }

        const studentExists = await Student.findOne({
            $or: [{ rollNumber: req.body.rollNumber }, { email: req.body.email }]
        });

        if (studentExists) {
            return res.status(400).json({ message: 'Student with this roll number or email already exists' });
        }

        const student = await Student.create(req.body);

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        await student.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
