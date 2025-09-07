import { Schema, model, models, Types } from 'mongoose';

const CourseSchema = new Schema({
  courseId: { type: String, required: true, unique: true, trim: true, uppercase: true }, // e.g., BCOM-2025
  title: { type: String, required: true, trim: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', index: true },
  courseDirectorId: { type: Schema.Types.Mixed }, // teacher _id (use ObjectId when you add Teacher model)
  totalCreditsRequired: { type: Number, default: 24, min: 0 },
  lessonIds: [{ type: Schema.Types.Mixed }], // fill with ObjectId[] once you add a Lesson model
}, { timestamps: true });

export default models.Course || model('Course', CourseSchema);
