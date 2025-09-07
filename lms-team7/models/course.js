import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const CourseSchema = new Schema(
  {
    courseId:   { type: String, required: true, unique: true },
    title:      { type: String, required: true, trim: true },
    lessonIds:  [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    courseDirectorId: { type: Schema.Types.ObjectId, ref: 'User' }, // teacher
    status:     { type: String, enum: ['active','inactive'], default: 'active' },
    enrolledStudentIds: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true, versionKey: false }
);

CourseSchema.index({ courseId: 1 }, { unique: true });

export default models.Course || model('Course', CourseSchema);
