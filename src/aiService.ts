// // import { Configuration, OpenAIApi } from 'openai';
// import OpenAI from 'openai';
// import { config } from './config';

// const configuration = new Configuration({
//   apiKey: config.openai.apiKey,
// });
// const openai = new OpenAIApi(configuration);

// export const categorizeEmail = async (content: string) => {
//   const completion = await openai.createCompletion({
//     model: "text-davinci-002",
//     prompt: `Categorize the following email as either "Interested", "Not Interested", or "More Information":\n\n${content}`,
//     max_tokens: 60,
//   });

//   return completion.data.choices[0].text?.trim();
// };

// export const generateResponse = async (category: string, content: string) => {
//   const prompt = `Generate a response to the following email, which has been categorized as "${category}":\n\n${content}`;
  
//   const completion = await openai.createCompletion({
//     model: "text-davinci-002",
//     prompt: prompt,
//     max_tokens: 150,
//   });

//   return completion.data.choices[0].text?.trim();
// };
import OpenAI from 'openai';
import { config } from './config';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export const categorizeEmail = async (content: string): Promise<string> => {
  // const completion = await openai.chat.completions.create({
  //   // model: "text-davinci-002",
  //   model: "gpt-3.5-turbo",
  //   // prompt: `Categorize the following email as either "Interested", "Not Interested", or "More Information":\n\n${content}`,
  //   messages: [
  //     {role: "system", content: "You are a helpful assistant that categorizes emails."},
  //     {role: "user", content: `Categorize the following email as either "Interested", "Not Interested", or "More Information":\n\n${content}`}
  //   ],
  //   max_tokens: 60,
  // });
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {role: "system", content: "You are a helpful assistant that categorizes emails."},
        {role: "user", content: `Categorize the following email as either "Interested", "Not Interested", or "More Information":\n\n${content}`}
      ],
      max_tokens: 60,
    });
  return completion.choices[0].message.content?.trim()|| 'Uncategorized';
  // return completion.choices[0].text?.trim();
} catch (error) {
  console.error('Error in categorizeEmail:', error);
  return 'Uncategorized';
}
};

export const generateResponse = async (category: string, content: string): Promise<string> => {
  // const prompt = `Generate a response to the following email, which has been categorized as "${category}":\n\n${content}`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {role: "system", content: "You are a helpful assistant that generates email responses."},
        {role: "user", content: `Generate a response to the following email, which has been categorized as "${category}":\n\n${content}`}
      ],
      max_tokens: 150,
    });

    return completion.choices[0].message.content?.trim() || 'No response generated';
  } catch (error) {
    console.error('Error in generateResponse:', error);
    return 'No response generated';
  }
  // const completion = await openai.chat.completions.create({
  //   // model: "text-davinci-002",
  //   // prompt: prompt,
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     {role: "system", content: "You are a helpful assistant that generates email responses."},
  //     {role: "user", content: `Generate a response to the following email, which has been categorized as "${category}":\n\n${content}`}
  //   ],
  //   max_tokens: 150,
  // });
  // return completion.choices[0].message.content?.trim();
  // // return completion.choices[0].text?.trim();
};