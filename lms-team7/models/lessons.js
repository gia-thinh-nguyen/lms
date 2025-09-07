import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const LessonSchema = new Schema(
  {
    unitCode:   { type: String, required: true, unique: true }, // lesson id
    title:      { type: String, required: true, trim: true },
    description:{ type: String, default: '' },
    objectives: { type: [String], default: [] },
    readingList:{ type: [String], default: [] },
    estHoursPerWeek: { type: Number, min: 1, max: 40 },
    prereqs:    { type: [String], default: [] },
    designerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // teacher
    status:     { type: String, enum: ['draft','active','archived'], default: 'active' },
    credit:     { type: Number, default: 6 }, // each lesson = 6cp
  },
  { timestamps: true, versionKey: false }
);

LessonSchema.index({ unitCode: 1 }, { unique: true });

export default models.Lesson || model('Lesson', LessonSchema);
