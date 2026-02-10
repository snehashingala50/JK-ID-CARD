const { Student } = require("../models/student");

exports.createStudent = async (req, res) => {
  try {
    console.log('Received student data:', JSON.stringify(req.body).substring(0, 200) + '...');
    console.log('Creating student with fields:', Object.keys(req.body));
    
    const { class: studentClass, section, rollNumber, name } = req.body;
    
    // Check for existing student with same class-section-rollNumber combination
    const existingStudent = await Student.findOne({
      class: studentClass,
      section: section,
      rollNumber: rollNumber
    });
    
    if (existingStudent) {
      console.log('Duplicate student registration attempt:', {
        class: studentClass,
        section: section,
        rollNumber: rollNumber,
        existingStudentId: existingStudent._id
      });
      
      return res.status(409).json({ 
        message: `Student with Class ${studentClass}, Section ${section}, Roll No ${rollNumber} already exists`,
        error: 'DUPLICATE_STUDENT',
        existingStudent: {
          id: existingStudent._id,
          name: existingStudent.name,
          status: existingStudent.status
        }
      });
    }
    
    const student = new Student(req.body);
    await student.save();
    
    console.log('Student saved successfully with ID:', student._id);
    res.status(201).json(student);
  } catch (err) {
    console.error('Error saving student:', err);
    console.error('Error details:', err.message);
    
    // Handle MongoDB duplicate key error specifically
    if (err.code === 11000) {
      return res.status(409).json({ 
        message: 'A student with this Class, Section, and Roll Number combination already exists',
        error: 'DUPLICATE_STUDENT'
      });
    }
    
    res.status(500).json({ message: err.message, error: err.toString() });
  }
};

exports.getStudents = async (req, res) => {
  try {
    console.log('Fetching all students from database...');
    const students = await Student.find().sort({ createdAt: -1 });
    console.log(`Found ${students.length} students in database`);
    
    // Add duplicate status information for admin panel
    const studentsWithDuplicateInfo = students.map(student => ({
      ...student.toObject(),
      duplicateIdentifier: `${student.class}-${student.section}-${student.rollNumber}`
    }));
    
    res.json(studentsWithDuplicateInfo);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('Updating student status:', id, 'to', status);
    
    const student = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log('Student status updated successfully:', student._id);
    res.json(student);
  } catch (err) {
    console.error('Error updating student status:', err);
    res.status(500).json({ message: err.message });
  }
};

// Check for duplicate student registration
exports.checkDuplicate = async (req, res) => {
  try {
    const { class: studentClass, section, rollNumber } = req.body;
    
    console.log('Checking for duplicate:', { class: studentClass, section, rollNumber });
    
    if (!studentClass || !section || !rollNumber) {
      return res.status(400).json({ message: 'Class, section, and roll number are required' });
    }
    
    const existingStudent = await Student.findOne({
      class: studentClass,
      section: section,
      rollNumber: rollNumber
    });
    
    if (existingStudent) {
      console.log('Duplicate found:', existingStudent._id);
      return res.json({
        exists: true,
        student: {
          id: existingStudent._id,
          name: existingStudent.name,
          status: existingStudent.status
        }
      });
    }
    
    console.log('No duplicate found');
    res.json({ exists: false });
  } catch (err) {
    console.error('Error checking for duplicates:', err);
    res.status(500).json({ message: err.message });
  }
};
