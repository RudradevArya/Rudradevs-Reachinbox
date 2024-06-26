import { getOutlookClient } from './outlookAuthService';
import { categorizeEmail, generateResponse } from './aiService';

export const getLatestEmail = async () => {
  const client = getOutlookClient();
  const messages = await client.api('/users/me/messages')
    .filter('isRead eq false')
    .top(1)
    .get();

  if (!messages.value || messages.value.length === 0) {
    throw new Error('No unread messages found');
  }

  return messages.value[0];
};

export const sendEmail = async (to: string, subject: string, body: string) => {
  const client = getOutlookClient();
  const message = {
    subject: subject,
    body: {
      contentType: 'Text',
      content: body
    },
    toRecipients: [
      {
        emailAddress: {
          address: to
        }
      }
    ]
  };

  await client.api('/users/me/sendMail').post({ message });
};

export const applyLabelToEmail = async (emailId: string, labelName: string) => {
  const client = getOutlookClient();
  try {
    await client.api(`/users/me/messages/${emailId}`)
      .update({ categories: [labelName] });
    console.log(`Applied category ${labelName} to email ${emailId}`);
  } catch (error) {
    console.error('Error applying category:', error);
  }
};

export const processEmail = async () => {
  try {
    const email = await getLatestEmail();
    const subject = email.subject || 'No Subject';
    const content = email.bodyPreview || '';
    const sender = email.from?.emailAddress?.address || '';

    const category = await categorizeEmail(subject, content);
    const response = await generateResponse(category, subject, content);

    await sendEmail(sender, `Re: ${subject}`, response);
    await applyLabelToEmail(email.id, category);

    return `Email processed. Category: ${category}, Response sent to: ${sender}`;
  } catch (error) {
    console.error('Error processing email:', error);
    return 'Error processing email';
  }
};

// // // import { Client } from '@microsoft/microsoft-graph-client';
// // // import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
// // // import { ClientSecretCredential } from '@azure/identity';
// // // import { config } from './config';
// // // import { categorizeEmail, generateResponse } from './aiService';

// // // if (!config.outlook.clientId || !config.outlook.clientSecret || !config.outlook.tenantId) {
// // //   throw new Error('Outlook configuration is incomplete. Please check your .env file.');
// // // }
// // // const credential = new ClientSecretCredential(
// // //   config.outlook.tenantId,
// // //   config.outlook.clientId,
// // //   config.outlook.clientSecret
// // // );

// // // const authProvider = new TokenCredentialAuthenticationProvider(credential, {
// // //   scopes: ['https://graph.microsoft.com/.default']
// // // });

// // // const client = Client.initWithMiddleware({ authProvider });

// // // export const getLatestEmailFromSender = async (senderEmail: string) => {
// // //   const messages = await client.api('/me/messages')
// // //     .filter(`from/emailAddress/address eq '${senderEmail}' and isRead eq false`)
// // //     .top(1)
// // //     .get();

// // //   if (!messages.value || messages.value.length === 0) {
// // //     throw new Error('No unread messages found from the specified sender');
// // //   }

// // //   return messages.value[0];
// // // };

// // // export const sendEmail = async (to: string, subject: string, body: string) => {
// // //   const message = {
// // //     subject: subject,
// // //     body: {
// // //       contentType: 'Text',
// // //       content: body
// // //     },
// // //     toRecipients: [
// // //       {
// // //         emailAddress: {
// // //           address: to
// // //         }
// // //       }
// // //     ]
// // //   };

// // //   await client.api('/me/sendMail').post({ message });
// // // };

// // // export const applyLabelToEmail = async (emailId: string, labelName: string) => {
// // //   try {
// // //     // In Outlook, we use categories instead of labels
// // //     await client.api(`/me/messages/${emailId}`)
// // //       .update({ categories: [labelName] });

// // //     console.log(`Applied category ${labelName} to email ${emailId}`);
// // //   } catch (error) {
// // //     console.error('Error applying category:', error);
// // //   }
// // // };

// // // export const processEmail = async (senderEmail: string) => {
// // //   try {
// // //     const email = await getLatestEmailFromSender(senderEmail);
// // //     const subject = email.subject || 'No Subject';
// // //     const content = email.bodyPreview || '';

// // //     const category = await categorizeEmail(subject, content);
// // //     const response = await generateResponse(category, subject, content);

// // //     await sendEmail(senderEmail, `Re: ${subject}`, response);
// // //     await applyLabelToEmail(email.id, category);

// // //     return `Email processed. Category: ${category}, Response sent.`;
// // //   } catch (error) {
// // //     console.error('Error processing email:', error);
// // //     return 'Error processing email';
// // //   }
// // // };
// import { getOutlookClient } from './outlookAuthService';
// import { categorizeEmail, generateResponse } from './aiService';

// export const getLatestEmailFromSender = async (senderEmail: string) => {
//   const client = getOutlookClient();
//   const messages = await client.api('/users/me/messages')
//     .filter(`from/emailAddress/address eq '${senderEmail}' and isRead eq false`)
//     .top(1)
//     .get();

//   if (!messages.value || messages.value.length === 0) {
//     throw new Error('No unread messages found from the specified sender');
//   }

//   return messages.value[0];
// };

// export const sendEmail = async (to: string, subject: string, body: string) => {
//   const client = getOutlookClient();
//   const message = {
//     subject: subject,
//     body: {
//       contentType: 'Text',
//       content: body
//     },
//     toRecipients: [
//       {
//         emailAddress: {
//           address: to
//         }
//       }
//     ]
//   };

//   await client.api('/users/me/sendMail').post({ message });
// };

// export const applyLabelToEmail = async (emailId: string, labelName: string) => {
//   const client = getOutlookClient();
//   try {
//     // In Outlook, we use categories instead of labels
//     await client.api(`/users/me/messages/${emailId}`)
//       .update({ categories: [labelName] });

//     console.log(`Applied category ${labelName} to email ${emailId}`);
//   } catch (error) {
//     console.error('Error applying category:', error);
//   }
// };

// export const processEmail = async (senderEmail: string) => {
//   try {
//     const email = await getLatestEmailFromSender(senderEmail);
//     const subject = email.subject || 'No Subject';
//     const content = email.bodyPreview || '';

//     const category = await categorizeEmail(subject, content);
//     const response = await generateResponse(category, subject, content);

//     await sendEmail(senderEmail, `Re: ${subject}`, response);
//     await applyLabelToEmail(email.id, category);

//     return `Email processed. Category: ${category}, Response sent.`;
//   } catch (error) {
//     console.error('Error processing email:', error);
//     return 'Error processing email';
//   }
// };


// // import { getOutlookClient } from './outlookAuthService';
// // import { categorizeEmail, generateResponse } from './aiService';
// // import { Client } from '@microsoft/microsoft-graph-client';

// // export const getLatestEmail = async () => {
// //   const client = getOutlookClient();
// //   try {
// //     const messages = await client.api('/users/me/messages')
// //       .filter('isRead eq false')
// //       .top(1)
// //       .get();

// //     if (!messages.value || messages.value.length === 0) {
// //       throw new Error('No unread messages found');
// //     }

// //     return messages.value[0];
// //   } catch (error) {
// //     console.error('Error fetching latest email:', error);
// //     if (error instanceof Client.GraphError) {
// //       console.error('GraphError details:', {
// //         statusCode: error.statusCode,
// //         code: error.code,
// //         message: error.message,
// //         requestId: error.requestId,
// //       });
// //     }
// //     throw error;
// //   }
// // };
// // // export const getLatestEmail = async () => {
// // //   const client = getOutlookClient();
// // //   const messages = await client.api('/users/me/messages')
// // //     .filter('isRead eq false')
// // //     .top(1)
// // //     .get();

// // //   if (!messages.value || messages.value.length === 0) {
// // //     throw new Error('No unread messages found');
// // //   }

// // //   return messages.value[0];
// // // };

// // export const sendEmail = async (to: string, subject: string, body: string) => {
// //   const client = getOutlookClient();
// //   const message = {
// //     subject: subject,
// //     body: {
// //       contentType: 'Text',
// //       content: body
// //     },
// //     toRecipients: [
// //       {
// //         emailAddress: {
// //           address: to
// //         }
// //       }
// //     ]
// //   };

// //   await client.api('/users/me/sendMail').post({ message });
// // };

// // export const applyLabelToEmail = async (emailId: string, labelName: string) => {
// //   const client = getOutlookClient();
// //   try {
// //     // In Outlook, we use categories instead of labels
// //     await client.api(`/users/me/messages/${emailId}`)
// //       .update({ categories: [labelName] });

// //     console.log(`Applied category ${labelName} to email ${emailId}`);
// //   } catch (error) {
// //     console.error('Error applying category:', error);
// //   }
// // };

// // export const processEmail = async () => {
// //   try {
// //     const email = await getLatestEmail();
// //     // ... rest of the function remains the same ...
// //   } catch (error) {
// //     console.error('Error processing email:', error);
// //     if (error instanceof Client.GraphError) {
// //       console.error('GraphError details:', {
// //         statusCode: error.statusCode,
// //         code: error.code,
// //         message: error.message,
// //         requestId: error.requestId,
// //       });
// //     }
// //     return 'Error processing email';
// //   }
// // };
// // export const processEmail = async () => {
// //   try {
// //     const email = await getLatestEmail();
// //     const subject = email.subject || 'No Subject';
// //     const content = email.bodyPreview || '';
// //     const sender = email.from?.emailAddress?.address || '';

// //     const category = await categorizeEmail(subject, content);
// //     const response = await generateResponse(category, subject, content);

// //     await sendEmail(sender, `Re: ${subject}`, response);
// //     await applyLabelToEmail(email.id, category);

// //     return `Email processed. Category: ${category}, Response sent to: ${sender}`;
// //   } catch (error) {
// //     console.error('Error processing email:', error);
// //     return 'Error processing email';
// //   }
// // };