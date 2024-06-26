
import express from 'express';
import { getAuthUrl, getToken } from './authService';
// import { getLatestEmail, sendEmail,applyLabelToEmail } from './emailService';
import { processEmail } from './emailService';
import { categorizeEmail, generateResponse } from './aiService';

const app = express();
const port = 3000;


// Type guard function
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

app.get('/auth', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

app.get('/auth/gmail/callback', async (req, res) => {
  const code = req.query.code as string;
  // const tokens = await getToken(code);
  // Here you should save the tokens securely for future use
  // res.send('Authentication successful!');
  try {
    const tokens = await getToken(code);
    // Here you should save the tokens securely for future use
    res.send('Authentication successful!');
  } catch (error) {
    res.status(500).send('Authentication failed: ' + (error as Error).message);
  }
});


////////////////////////////////
app.get('/process-email', async (req, res) => {
  try {
    const result = await processEmail('rudradev93@gmail.com');
    res.send(result);
  } catch (error) {
    res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
  }
});
setInterval(async () => {
  try {
    await processEmail('rudradev93@gmail.com');
    console.log('Periodic email check completed');
  } catch (error) {
    console.error('Error in periodic email check:', error);
  }
}, 5 * 60 * 1000); // Check every 5 minutes

////////////////
// async function processEmail() {
//   const email = await getLatestEmail();
//   const subject = email.payload?.headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
//   const content = email.snippet || '';
  
//   const category = await categorizeEmail(subject, content);
//   const response = await generateResponse(category, subject, content);
  
//   const to = 'rudradev93@gmail.com'; // Replace with actual sender email
//   const responseSubject = `Re: ${subject}`;
  
//   await sendEmail(to, responseSubject, response);
  
//   let label = '';
//   switch (category) {
//     case 'Meeting Request':
//       label = 'Meeting';
//       break;
//     case 'Information Request':
//       label = 'Info';
//       break;
//     default:
//       label = 'Other';
//   }
  
//   if (email.id) {
//     await applyLabelToEmail(email.id, label);
//   }

//   return `Email processed. Category: ${category}, Label: ${label}, Response: ${response}`;
// }

// app.get('/test-process-email', async (req, res) => {
//   try {
//     const result = await processEmail();
//     res.send(result);
//   } catch (error) {
//     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
//   }
// });

////////////////////////////////////
// app.get('/test-process-email', async (req, res) => {
//   try {
//     const result = await processEmail();
//     res.send(result);
//   } catch (error) {
//     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
//   }
// });

// async function processEmail() {
//   const email = await getLatestEmail();
//   const content = email.snippet || '';
//   const category = await categorizeEmail(content) || 'Uncategorized';
//   const response = await generateResponse(category, content) || 'No response generated';
  
//   // Here you would typically get the sender's email from the email object
//   const to = 'rudradev93@gmail.com';
//   const subject = 'Re: ' + (email.payload?.headers?.find(h => h.name === 'Subject')?.value || 'Your email');
  
//   await sendEmail(to, subject, response);
  
//   return `Email processed. Category: ${category}, Response: ${response}`;
// }

// app.get('/test-categorize', async (req, res) => {
//   const testContent = "I'm interested in your product. Can you tell me more?";
//   try {
//     const category = await categorizeEmail(testContent) || 'Uncategorized';
//     res.send(`Category: ${category}`);
//   } catch (error) {
//     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
//   }
// });

// app.get('/test-generate-response', async (req, res) => {
//   const testCategory = "Interested";
//   const testContent = "I'm interested in your product. Can you tell me more?";
//   try {
//     const response = await generateResponse(testCategory, testContent) || 'No response generated';
//     res.send(`Generated Response: ${response}`);
//   } catch (error) {
//     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
//   }
// });

// app.get('/test-send-email', async (req, res) => {
//   const to = 'dummypajeet@gmail.com'; // Replace with your email
//   const subject = 'Test Email';
//   const body = 'This is a test email from your Email AI application.';
//   try {
//     await sendEmail(to, subject, body);
//     res.send('Test email sent successfully');
//   } catch (error) {
//     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
//   }
// });
// app.get('/process-email', async (req, res) => {
//   try {
//     const email = await getLatestEmail();
//     const content = email.snippet || '';
//     const category = await categorizeEmail(content);
//     const response = await generateResponse(category, content);
    
//     // Here you would typically get the sender's email from the email object
//     const to = 'sender@example.com';
//     const subject = 'Re: ' + (email.payload?.headers?.find(h => h.name === 'Subject')?.value || 'Your email');
    
//     await sendEmail(to, subject, response);
    
//     res.send('Email processed and response sent!');
//   } catch (error) {
//     // res.status(500).send('Error processing email: ' + error.message);
//     const errorMessage = isError(error) ? error.message : 'An unknown error occurred';
//     res.status(500).send('Error processing email: ' + errorMessage);
//   }
// });

// app.get('/test-process-email', async (req, res) => {
//   try {
//     const result = await processEmail();
//     res.send(result);
//   } catch (error) {
//     res.status(500).send('Error: ' + (error as Error).message);
//   }
// });

// async function processEmail() {
//   const email = await getLatestEmail();
//   const content = email.snippet || '';
//   const category = await categorizeEmail(content);
//   const response = await generateResponse(category, content);
  
//   // Here you would typically get the sender's email from the email object
//   const to = 'sender@example.com';
//   const subject = 'Re: ' + (email.payload?.headers?.find(h => h.name === 'Subject')?.value || 'Your email');
  
//   await sendEmail(to, subject, response);
  
//   return `Email processed. Category: ${category}, Response: ${response}`;
// }

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  // runEmailProcessor(); // Run once on startup
});