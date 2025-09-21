import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const CourseSchema = new Schema(
  {
    courseId:  { type: String, required: true, trim: true },
    title:      { type: String, required: true, trim: true },
    credits:    { type: Number, required: true, min: 0 }, // total credits required to pass the subject
    lessonIds:  [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    courseDirectorId: { type: Schema.Types.ObjectId, ref: 'User' }, // teacher
    status:     { type: String, enum: ['active','inactive'], default: 'active' },
    enrolledStudentIds: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }
);

const Course = models.Course || model('Course', CourseSchema);
export default Course;
