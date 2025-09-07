import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const UserSchema = new Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName:  { type: String, trim: true, required: true },
    email:     { type: String, trim: true, lowercase: true, unique: true, required: true },
    role:      { type: String, enum: ['student', 'teacher', 'admin'], required: true },

    // teacher-only (optional)
    staffId:   { type: String, index: true },
    status:    { type: String, enum: ['active','inactive'], default: 'active' },

    // student-only (optional)
    dateEnrolled: Date,
    studentStatus:{ type: String, enum: ['active','dropped-out'], default: 'active' },
    creditPoints: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

UserSchema.index({ email: 1 }, { unique: true });

export default models.User || model('User', UserSchema);
