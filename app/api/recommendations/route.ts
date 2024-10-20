// app/api/recommendations/route.ts //Not in use any more, we will be using Gemini AI
// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function POST(request: Request) {
//   try {
//     const { title, description } = await request.json();

//     const completion = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'system',
//           content:
//             'You are a helpful assistant that recommends projects and tags for tasks based on their title and description.',
//         },
//         {
//           role: 'user',
//           content: `Task Title: ${title}\nTask Description: ${description}\n\nPlease recommend a project and up to 3 tags for this task. Respond in JSON format.`,
//         },
//       ],
//     });

//     const recommendations = JSON.parse(completion.choices[0].message.content);

//     return NextResponse.json(recommendations);
//   } catch (error) {
//     console.error('Error generating recommendations:', error);
//     return NextResponse.json(
//       { error: 'Error generating recommendations' },
//       { status: 500 }
//     );
//   }
// }
