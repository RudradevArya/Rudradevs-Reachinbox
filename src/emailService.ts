import { google } from 'googleapis';
import { oauth2Client } from './authService';

const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export const getLatestEmail = async () => {
  const response = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 1,
  });

  const messageId = response.data.messages?.[0].id;

  if (!messageId) {
    throw new Error('No messages found');
  }

  const message = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
  });

  return message.data;
};

export const sendEmail = async (to: string, subject: string, body: string) => {
  const encodedMessage = Buffer.from(
    `To: ${to}\r\n` +
    `Subject: ${subject}\r\n\r\n` +
    `${body}`
  ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });
};