import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { campaignName, description, audience, userMessage } = await req.json();

    const prompt = `Enhance and professionalize this marketing message:
    
    Original Message: "${userMessage}"
    
    Campaign Context:
    - Name: ${campaignName}
    - Description: ${description}
    - Audience: ${audience}
    
    Requirements:
    1. Maintain the core message but make it more professional and persuasive
    2. Use {{name}} for personalization
    3. Keep it under 200 characters
    4. Include a clear call to action
    5. Maintain any specific offers or details from the original message
    
    Return only the enhanced message text, no explanations.`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content?.trim();
    if (!message) {
      throw new Error('No response from Groq');
    }

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Message generation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate message' 
    }, { status: 500 });
  }
}