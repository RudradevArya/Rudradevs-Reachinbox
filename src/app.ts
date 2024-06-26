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
// import express from 'express';
// import { getAuthUrl, getToken } from './authService';
// import { getOutlookAuthUrl, getOutlookToken} from './outlookAuthService';
// // import { verifyOutlookToken } from './outlookAuthService';
// // import { getLatestEmail, sendEmail,applyLabelToEmail } from './emailService';
// import { processEmail as processGmailEmail} from './emailService';
// import { processEmail as processOutlookEmail } from './outlookEmailService';
// import { categorizeEmail, generateResponse } from './aiService';

// const app = express();
// const port = 3000;


// // Type guard function
// function isError(error: unknown): error is Error {
//   return error instanceof Error;
// }

// app.get('/auth', (req, res) => {
//   const authUrl = getAuthUrl();
//   res.redirect(authUrl);
// });

// app.get('/auth/gmail/callback', async (req, res) => {
//   const code = req.query.code as string;
//   // const tokens = await getToken(code);
//   // Here you should save the tokens securely for future use
//   // res.send('Authentication successful!');
//   try {
//     const tokens = await getToken(code);
//     // Here you should save the tokens securely for future use
//     res.send('Authentication successful!');
//   } catch (error) {
//     res.status(500).send('Authentication failed: ' + (error as Error).message);
//   }
// });


// ////////////////////////////////
// // app.get('/process-email', async (req, res) => {
// //   try {
// //     const result = await processGmailEmail('rudradev93@gmail.com');
// //     res.send(result);
// //   } catch (error) {
// //     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
// //   }
// // });
// // setInterval(async () => {
// //   try {
// //     await processGmailEmail('rudradev93@gmail.com');
// //     console.log('Periodic email check completed');
// //   } catch (error) {
// //     console.error('Error in periodic email check:', error);
// //   }
// // }, 5 * 60 * 1000); // Check every 5 minutes
// ////
// app.get('/process-email/:provider', async (req, res) => {
//   const provider = req.params.provider;

//   try {
//     let result;
//     if (provider === 'gmail') {
//       result = await processGmailEmail();
//     } else if (provider === 'outlook') {
//       result = await processOutlookEmail();
//     } else {
//       throw new Error('Invalid email provider');
//     }
//     res.send(result);
//   } catch (error) {
//     res.status(500).send('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
//   }
// });
// // app.get('/process-email/:provider', async (req, res) => {
// //   const provider = req.params.provider;
// //   const email = 'user@example.com'; // Replace with actual email or get from query params

// //   try {
// //     let result;
// //     if (provider === 'gmail') {
// //       result = await processGmailEmail(email);
// //     } else if (provider === 'outlook') {
// //       result = await processOutlookEmail(email);
// //     } else {
// //       throw new Error('Invalid email provider');
// //     }
// //     res.send(result);
// //   } catch (error) {
// //     res.status(500).send('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
// //   }
// // });

// //OUTLOOK
// // app.get('/verify-outlook-auth', async (req, res) => {
// //   const isAuthenticated = await verifyOutlookToken();
// //   if (isAuthenticated) {
// //     res.send('Outlook authentication successful');
// //   } else {
// //     res.status(401).send('Outlook authentication failed');
// //   }
// // });

// app.get('/auth/outlook', async (req, res) => {
//   const authUrl = await getOutlookAuthUrl();
//   res.redirect(authUrl);
// });

// app.get('/auth/outlook/callback', async (req, res) => {
//   const code = req.query.code as string;
//   try {
//     const token = await getOutlookToken(code);
//     // Store this token securely (e.g., in a database)
//     res.send('Outlook authentication successful!');
//   } catch (error) {
//     res.status(500).send('Outlook authentication failed: ' + (error as Error).message);
//   }
// });
// app.get('/auth/outlook', async (req, res) => {
//   try {
//     const authUrl = await getOutlookAuthUrl();
//     console.log('Redirecting to Outlook auth URL:', authUrl);
//     res.redirect(authUrl);
//   } catch (error) {
//     console.error('Error generating Outlook auth URL:', error);
//     res.status(500).send('Error generating Outlook auth URL: ' + (error instanceof Error ? error.message : 'Unknown error'));
//   }
// });

// // app.get('/auth/outlook/callback', async (req, res) => {
// //   const code = req.query.code as string;
// //   console.log('Received auth code:', code);
// //   if (!code) {
// //     console.error('No authorization code received');
// //     return res.status(400).send('No authorization code received');
// //   }
// //   try {
// //     const token = await getOutlookToken(code);
// //     console.log('Token acquired successfully');
// //     // Here you should save the token securely for future use
// //     res.send('Outlook authentication successful!');
// //   } catch (error) {
// //     console.error('Outlook authentication failed:', error);
// //     res.status(500).send('Outlook authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
// //   }
// // });
// // app.get('/process-email/:provider', async (req, res) => {
// //   const provider = req.params.provider;
// //   const email = 'rudradev93@gmail.com'; // Replace with actual email or get from query params

// //   try {
// //     let result;
// //     if (provider === 'gmail') {
// //       result = await processGmailEmail(email);
// //     } else if (provider === 'outlook') {
// //       result = await processOutlookEmail(email);
// //     } else {
// //       throw new Error('Invalid email provider');
// //     }
// //     res.send(result);
// //   } catch (error) {
// //     res.status(500).send('Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
// //   }
// // });
// ////////////////
// // async function processEmail() {
// //   const email = await getLatestEmail();
// //   const subject = email.payload?.headers?.find(h => h.name === 'Subject')?.value || 'No Subject';
// //   const content = email.snippet || '';
  
// //   const category = await categorizeEmail(subject, content);
// //   const response = await generateResponse(category, subject, content);
  
// //   const to = 'rudradev93@gmail.com'; // Replace with actual sender email
// //   const responseSubject = `Re: ${subject}`;
  
// //   await sendEmail(to, responseSubject, response);
  
// //   let label = '';
// //   switch (category) {
// //     case 'Meeting Request':
// //       label = 'Meeting';
// //       break;
// //     case 'Information Request':
// //       label = 'Info';
// //       break;
// //     default:
// //       label = 'Other';
// //   }
  
// //   if (email.id) {
// //     await applyLabelToEmail(email.id, label);
// //   }

// //   return `Email processed. Category: ${category}, Label: ${label}, Response: ${response}`;
// // }

// // app.get('/test-process-email', async (req, res) => {
// //   try {
// //     const result = await processEmail();
// //     res.send(result);
// //   } catch (error) {
// //     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
// //   }
// // });

// ////////////////////////////////////
// // app.get('/test-process-email', async (req, res) => {
// //   try {
// //     const result = await processEmail();
// //     res.send(result);
// //   } catch (error) {
// //     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
// //   }
// // });

// // async function processEmail() {
// //   const email = await getLatestEmail();
// //   const content = email.snippet || '';
// //   const category = await categorizeEmail(content) || 'Uncategorized';
// //   const response = await generateResponse(category, content) || 'No response generated';
  
// //   // Here you would typically get the sender's email from the email object
// //   const to = 'rudradev93@gmail.com';
// //   const subject = 'Re: ' + (email.payload?.headers?.find(h => h.name === 'Subject')?.value || 'Your email');
  
// //   await sendEmail(to, subject, response);
  
// //   return `Email processed. Category: ${category}, Response: ${response}`;
// // }

// // app.get('/test-categorize', async (req, res) => {
// //   const testContent = "I'm interested in your product. Can you tell me more?";
// //   try {
// //     const category = await categorizeEmail(testContent) || 'Uncategorized';
// //     res.send(`Category: ${category}`);
// //   } catch (error) {
// //     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
// //   }
// // });

// // app.get('/test-generate-response', async (req, res) => {
// //   const testCategory = "Interested";
// //   const testContent = "I'm interested in your product. Can you tell me more?";
// //   try {
// //     const response = await generateResponse(testCategory, testContent) || 'No response generated';
// //     res.send(`Generated Response: ${response}`);
// //   } catch (error) {
// //     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
// //   }
// // });

// // app.get('/test-send-email', async (req, res) => {
// //   const to = 'dummypajeet@gmail.com'; // Replace with your email
// //   const subject = 'Test Email';
// //   const body = 'This is a test email from your Email AI application.';
// //   try {
// //     await sendEmail(to, subject, body);
// //     res.send('Test email sent successfully');
// //   } catch (error) {
// //     res.status(500).send('Error: ' + (isError(error) ? error.message : 'Unknown error'));
// //   }
// // });
// // app.get('/process-email', async (req, res) => {
// //   try {
// //     const email = await getLatestEmail();
// //     const content = email.snippet || '';
// //     const category = await categorizeEmail(content);
// //     const response = await generateResponse(category, content);
    
// //     // Here you would typically get the sender's email from the email object
// //     const to = 'sender@example.com';
// //     const subject = 'Re: ' + (email.payload?.headers?.find(h => h.name === 'Subject')?.value || 'Your email');
    
// //     await sendEmail(to, subject, response);
    
// //     res.send('Email processed and response sent!');
// //   } catch (error) {
// //     // res.status(500).send('Error processing email: ' + error.message);
// //     const errorMessage = isError(error) ? error.message : 'An unknown error occurred';
// //     res.status(500).send('Error processing email: ' + errorMessage);
// //   }
// // });

// // app.get('/test-process-email', async (req, res) => {
// //   try {
// //     const result = await processEmail();
// //     res.send(result);
// //   } catch (error) {
// //     res.status(500).send('Error: ' + (error as Error).message);
// //   }
// // });

// // async function processEmail() {
// //   const email = await getLatestEmail();
// //   const content = email.snippet || '';
// //   const category = await categorizeEmail(content);
// //   const response = await generateResponse(category, content);
  
// //   // Here you would typically get the sender's email from the email object
// //   const to = 'sender@example.com';
// //   const subject = 'Re: ' + (email.payload?.headers?.find(h => h.name === 'Subject')?.value || 'Your email');
  
// //   await sendEmail(to, subject, response);
  
// //   return `Email processed. Category: ${category}, Response: ${response}`;
// // }

// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
//   // runEmailProcessor(); // Run once on startup
// });