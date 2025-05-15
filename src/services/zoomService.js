import express from 'express';
import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json()); // to parse JSON body

const port = 3000;

// Zoom Access Token lene ka function
const getZoomAccessToken = async () => {
  const response = await axios.post(
    'https://zoom.us/oauth/token',
    qs.stringify({
      grant_type: 'account_credentials',
      account_id: process.env.ZOOM_ACCOUNT_ID,
    }),
    {
      auth: {
        username: process.env.ZOOM_CLIENT_ID,
        password: process.env.ZOOM_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data.access_token;
};

// Zoom meeting create karne ka function
const createZoomMeetingHandler = async ({ topic, start_time, duration }) => {
  const token = await getZoomAccessToken();

  const response = await axios.post(
    'https://api.zoom.us/v2/users/me/meetings',
    {
      topic: topic || 'Azad Education Meeting',
      type: 2, // Scheduled meeting
      start_time: start_time || new Date().toISOString(),
      duration: duration || 60,
      timezone: 'Asia/Karachi',
      settings: {
        join_before_host: true,
        approval_type: 0,
        registration_type: 1,
        enforce_login: false,
        waiting_room: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

// Route: create zoom meeting
app.post('/create-zoom-meeting', async (req, res) => {
  try {
    const meetingDetails = req.body;
    const meeting = await createZoomMeetingHandler(meetingDetails);

    res.json({
      meetingInfo: meeting,
    });
  } catch (error) {
    console.error('Error creating Zoom meeting:', error.response?.data || error.message);
    res.status(500).send('Error creating Zoom meeting');
  }
});

export{createZoomMeetingHandler}