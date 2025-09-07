import { Schema, model, models, Types } from 'mongoose';

/**
 * Which COURSES a student is in, and credits earned in that course.
 */
const CourseEnrollmentSchema = new Schema({
  studentId: { type: Types.ObjectId, ref: 'Student', required: true, index: true },
  courseId:  { type: Schema.Types.Mixed, required: true, index: true }, // string or ObjectId, your teammate can decide
  status:    { type: String, enum: ['in-progress','completed','withdrawn'], default: 'in-progress', index: true },
  creditsEarned: { type: Number, default: 0, min: 0 },
}, { timestamps: true });

CourseEnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default models.CourseEnrollment || model('CourseEnrollment', CourseEnrollmentSchema);
