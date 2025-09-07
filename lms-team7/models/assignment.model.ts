import { Schema, model, models } from 'mongoose';

/**
 * ASSIGNMENT
 * - name: assignment name
 * - grade: "Pass" | "Fail" (optional at creation; teacher can set later)
 */
const AssignmentSchema = new Schema({
  name:  { type: String, required: true, trim: true },
  grade: { type: String, enum: ['Pass', 'Fail', ''], default: '' }, // empty = not graded yet
}, { timestamps: true });

export default models.Assignment || model('Assignment', AssignmentSchema);
