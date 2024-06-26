import dotenv from 'dotenv';

dotenv.config();

export const config = {
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    redirectUri: process.env.GMAIL_REDIRECT_URI,
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
  },
};