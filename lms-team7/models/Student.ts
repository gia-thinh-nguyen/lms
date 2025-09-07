import { Schema, model, models, Types } from 'mongoose';

const StudentSchema = new Schema({
  studentId:    { type: String, unique: true, index: true, required: true, trim: true, uppercase: true },
  title:        { type: String, enum: ['Mr','Mrs','Ms','Mx','Dr','Prof',''], default: '' },
  firstName:    { type: String, trim: true, required: true },
  lastName:     { type: String, trim: true, required: true },
  email:        { type: String, unique: true, index: true, required: true, trim: true },
  role:         { type: String, enum: ['student'], default: 'student', index: true },
  dateEnrolled: { type: Date, default: () => new Date() },
  status:       { type: String, enum: ['active','dropped'], default: 'active', index: true },
  credits:      { type: Number, default: 0, min: 0 },

  // NEW: direct linkage to Course docs
  enrolledCourses: [{ type: Types.ObjectId, ref: 'Course', default: [] }],
}, { timestamps: true });

export default models.Student || model('Student', StudentSchema);
