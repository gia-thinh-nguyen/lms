import mongoose from 'mongoose';

let cached = (global as any)._mongoose;
if (!cached) cached = (global as any)._mongoose = { conn: null as typeof mongoose | null, promise: null as Promise<typeof mongoose> | null };

export async function connectDB() {
  if (cached.conn) return cached.conn as typeof mongoose;

  const uri = process.env.MONGODB_URI;         // <-- read env lazily here
  if (!uri) throw new Error('❌ Missing MONGODB_URI in .env.local');

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { dbName: 'lms' }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn as typeof mongoose;
}
