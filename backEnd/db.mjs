import mongoose from 'mongoose';
import './config.mjs';

const dbUri = process.env.DB_URI || 'mongodb://localhost/workoutScheduler';
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB connection error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, minLength: 4 },
  email: { type: String, required: true },
  // Assume passwords are hashed
  password: { type: String, required: true, minLength: 8 }
});

// Video Schedule Schema
const VideoScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  videos: [{
    url: String,
    date: Date,
    title: String
  }]
});

// Compiling models
const User = mongoose.model('User', UserSchema);
const VideoSchedule = mongoose.model('VideoSchedule', VideoScheduleSchema);

export { User, VideoSchedule };
