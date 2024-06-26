// //app.ts
import express from 'express';
import { getAuthUrl, getToken } from './authService';
import { getOutlookAuthUrl, getOutlookToken } from './outlookAuthService';
import { processEmail as processGmailEmail } from './emailService';
import { processEmail as processOutlookEmail } from './outlookEmailService';

const app = express();
const port = 3000;

app.get('/auth/gmail', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

app.get('/auth/gmail/callback', async (req, res) => {
  const code = req.query.code as string;
  try {
    const tokens = await getToken(code);
    // Here you should save the tokens securely for future use
    res.send('Gmail authentication successful!');
  } catch (error) {
    res.status(500).send('Gmail authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

app.get('/auth/outlook', async (req, res) => {
  try {
    const authUrl = await getOutlookAuthUrl();
    res.redirect(authUrl);
  } catch (error) {
    res.status(500).send('Error generating Outlook auth URL: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

app.get('/auth/outlook/callback', async (req, res) => {
  const code = req.query.code as string;
  try {
    const token = await getOutlookToken(code);
    // Here you should save the token securely for future use
    res.send('Outlook authentication successful!');
  } catch (error) {
    res.status(500).send('Outlook authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

app.get('/process-email/:provider', async (req, res) => {
  const provider = req.params.provider;

  try {
    let result;
    if (provider === 'gmail') {
      result = await processGmailEmail();
    } else if (provider === 'outlook') {
      result = await processOutlookEmail();
    } else {
      throw new Error('Invalid email provider');
    }
    res.send(result);
  } catch (error) {
    res.status(500).send('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
