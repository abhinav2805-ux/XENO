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

    const { prompt, availableFields } = await req.json();

    const llmPrompt = `Convert the following natural language filter request into a query.
    Request: "${prompt}"
    Available fields: ${JSON.stringify(availableFields)}
    
    Return only a valid JSON object matching this structure exactly:
    {
      "combinator": "and",
      "rules": [
        {
          "field": "fieldName",
          "operator": "equal" | "notEqual" | "greaterThan" | "lessThan" | "contains",
          "value": "value"
        }
      ]
    }`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: llmPrompt }],
      model: "llama3-8b-8192",
      temperature: 0.1,
    });

    const generatedText = completion.choices[0]?.message?.content;
    if (!generatedText) {
      throw new Error('No response from Groq');
    }

    try {
      // Find the JSON object in the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : generatedText;
      const queryStructure = JSON.parse(jsonStr);
      return NextResponse.json({ query: queryStructure });
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError);
      return NextResponse.json({ 
        error: 'Invalid response format from AI' 
      }, { status: 422 });
    }

  } catch (error: any) {
    console.error('Filter generation error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate filter' 
    }, { status: 500 });
  }
}