import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const CourseSchema = new Schema(
  {
    title:      { type: String, required: true, trim: true },
    lessonIds:  [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    courseDirectorId: { type: Schema.Types.ObjectId, ref: 'User' }, // teacher
    status:     { type: String, enum: ['active','inactive'], default: 'active' },
    enrolledStudentIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }
);

const Course = models.Course || model('Course', CourseSchema);
export default Course;
