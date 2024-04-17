import express from 'express'
import cors from 'cors';
import{User, VideoSchedule} from './db.mjs'
import session from 'express-session';
//import bcrypt from 'bcrypt';
//const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';
import './config.mjs';
import moment from 'moment-timezone'


const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
    secure: 'auto', // for HTTPS use 'true', 'auto' will adjust based on the connection
    httpOnly: true, // Recommended: prevents client-side JS from accessing the cookie
    sameSite: 'strict', // CSRF protection
    // Optional: set cookie expiration
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));


app.use(express.urlencoded({extended: false}));

app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, 
  };
app.use(cors(corsOptions)); // Allows cross-origin requests
//app.use(bodyParser.json()); // Parses JSON request bodies

//<----------------authentication function------------------->

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: "User not authenticated" });
    }
}
//<----------------authentication function------------------->





//<----------------login------------------->
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Attempt to find the user by their username
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(401).json({ message: 'Login failed: User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(user);
        if (isMatch) {
            req.session.userId = user._id; 
            // After successful login
            res.json({ message: 'Logged in successfully', user: { id: user._id, username: user.username, email: user.email } });

        } else {
            res.status(401).json({ message: 'Login failed: Incorrect password.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
});
app.get('/api/logout', (req, res) => {
  // Check if a user session exists
  if (req.session.userId) {
      // If it exists, attempt to destroy the session
      req.session.destroy(err => {
          if (err) {
              console.error("Session destruction error:", err);
              return res.status(500).json({ message: 'Could not log out' });
          } else {
              res.clearCookie('connect.sid', { path: '/' }); // Adjust path if needed
              return res.json({ message: 'Logged out successfully' });
          }
      });
  } else {
      // If no user session exists, return a different response
      return res.status(200).json({ message: 'No user logged in' });
  }
});



//<----------------login------------------->
app.get('/api/session', async(req, res) => {
    if (req.session.userId) {
        const user = await User.findById(req.session.userId);
        res.json({ isLoggedIn: true, user: { id: user._id, username: user.username, email: user.email } });
      } else {
        res.json({ isLoggedIn: false });
      }
    }
)
//<----------------Register------------------->

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Here, you should ideally hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10); // '10' is the salt rounds
        const newUser = new User({ username, email, password: hashedPassword });
        console.log(newUser)
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

//<----------------Register------------------->

//<----------------adding Video Url------------------->

app.post('/api/schedule', isAuthenticated,async (req, res) => {
    try {
      const { userId, videos } = req.body; // Expect videos to be an array of { url, date }
      const newSchedule = new VideoSchedule({ user: userId, videos });
      await newSchedule.save();
      res.status(201).json({ message: 'Videos scheduled successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

//<----------------adding Video Url------------------->

app.get('/api/workouts', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        // Fetch all video schedules for the logged-in user
        //const videoSchedules = await VideoSchedule.find();

        const videoSchedules = await VideoSchedule.find({ user: userId }).populate('user');
        //console.log(videoSchedules);
        res.json(videoSchedules);
    } catch (error) {
        console.error('Failed to fetch video schedules:', error);
        res.status(500).json({ message: 'Failed to fetch video schedules' });
    }
});
app.post('/api/workouts', isAuthenticated, async (req, res) => {
    try {
        let { url, date, title } = req.body;
        const userId = req.session.userId;
        console.log("url:"+url+" "+"date:"+date)
        console.log('the user is id '+ userId)
        
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const dateUTC = moment(date).utc().format();
        console.log(dateUTC)

        // Check if there's an existing schedule for the date, or create a new one
        let schedule = await VideoSchedule.findOne({ user: userId, 'videos.date': dateUTC });
        if (!schedule) {
          schedule = new VideoSchedule({ user: userId });
      }
      // Correctly push the new video with the UTC date
        schedule.videos.push({ url, date: dateUTC,title });
        await schedule.save();
        console.log('New Schedule:'+schedule+"added");
        res.status(201).json(schedule);
    } catch (error) {
        console.error('Failed to add video schedule:', error);
        res.status(500).json({ message: 'Failed to add video schedule' });
    }
});



// Start the server

app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on port ${process.env.PORT ?? 5173}`);
  });
  



