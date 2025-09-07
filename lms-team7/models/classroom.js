import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const ClassroomSchema = new Schema(
  {
    courseRef:  { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    lessonRef:  { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    studentRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    teacherRef: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // who recorded it
    startDate:  { type: Date, required: true },
    durationWeeks: { type: Number, min: 1, max: 52, required: true },
    grade: { type: String, enum: ['HD','D','C','P','N','IP'], default: 'IP' } // In Progress
  },
  { timestamps: true, versionKey: false }
);

ClassroomSchema.index({ courseRef:1, lessonRef:1, studentRef:1 }, { unique: true });

export default models.Classroom || model('Classroom', ClassroomSchema);
