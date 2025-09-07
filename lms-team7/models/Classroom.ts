import { Schema, model, models, Types } from 'mongoose';

/**
 * Per-LESSON tracking for a student inside a course (progress + grade).
 */
const ClassroomSchema = new Schema({
  studentId:    { type: Types.ObjectId, ref: 'Student', required: true, index: true },
  courseId:     { type: Schema.Types.Mixed, required: true, index: true }, // ref to Courses
  lessonId:     { type: Schema.Types.Mixed, required: true, index: true }, // ref to Lessons
  teacherId:    { type: Schema.Types.Mixed, index: true },                 // assessor/owner (optional)
  startDate:    { type: Date, default: () => new Date() },
  durationWeeks:{ type: Number, default: 0, min: 0 },
  grade:        { type: String, default: '' }, // HD/D/C/P/F or numeric chosen by team
  status:       { type: String, enum: ['in-progress','completed','withdrawn'], default: 'in-progress', index: true },
}, { timestamps: true });

ClassroomSchema.index({ studentId: 1, courseId: 1, lessonId: 1 }, { unique: true });

export default models.Classroom || model('Classroom', ClassroomSchema);
