import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const EnrollmentSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId:  { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    startDate: { type: Date, default: Date.now },
    status:    { type: String, enum: ['active','completed','withdrawn'], default: 'active' },
    earnedCredits: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

export default models.Enrollment || model('Enrollment', EnrollmentSchema);
