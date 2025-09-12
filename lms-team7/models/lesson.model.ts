import { Schema, model, models, Types } from 'mongoose';

/**
 * LESSON
 * unitCode              : unique human ID (e.g., FIT2099-L1)
 * title                 : lesson title
 * description           : rich text / markdown ok
 * objectives            : string[]
 * readingList           : [{ title, url? }]
 * estimatedHoursPerWeek : number
 * prerequisites         : ObjectId[] -> Lesson._id (self-reference)
 * creatorId             : ObjectId -> Teacher._id (teacher/instructor who created it)
 * status                : "draft" | "published" | "archived"
 * assignments           : ObjectId[] -> Assignment._id
 * credit                : number (e.g., 6)
 *
 * timestamps            : adds createdAt, updatedAt (use updatedAt as "Date of update")
 */

const ReadingItem = new Schema({
  title: { type: String, required: true, trim: true },
  url:   { type: String, trim: true },
}, { _id: false });

const LessonSchema = new Schema({
  unitCode:              { type: String, required: true, unique: true, trim: true, uppercase: true },
  title:                 { type: String, required: true, trim: true },
  description:           { type: String, default: '' },
  objectives:            [{ type: String, trim: true }],
  readingList:           [ReadingItem],
  estimatedHoursPerWeek: { type: Number, default: 0, min: 0 },

  // Self-referencing prerequisites
  prerequisites:         [{ type: Types.ObjectId, ref: 'Lesson' }],

  // Reference to Teacher; you can swap to Types.ObjectId once your Teacher model exists
  creatorId:             { type: Types.ObjectId, ref: 'Teacher', required: false },

  status:                { type: String, enum: ['draft', 'published', 'archived'], default: 'draft', index: true },

  // Reference list to Assignment docs
  assignments:           [{ type: Types.ObjectId, ref: 'Assignment' }],

  credit:                { type: Number, default: 0, min: 0 },
}, { timestamps: true }); // use updatedAt for "Date of update"



export default models.Lesson || model('Lesson', LessonSchema);
