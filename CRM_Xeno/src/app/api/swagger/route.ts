import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET() {
  try {
    
    // Construct the path to openapi.json in the public directory
    const jsonFilePath = path.join(process.cwd(), 'public', 'swagger.json');
    
    // Read the file content
    const fileContents = await fs.readFile(jsonFilePath, 'utf8');
    
    // Parse the JSON content
    const jsonSpec = JSON.parse(fileContents);
    
    // Return the JSON spec
    return NextResponse.json(jsonSpec);
  } catch (error) {
    console.error('Failed to load OpenAPI spec:', error);
    return NextResponse.json({ message: 'Failed to load OpenAPI spec' }, { status: 500 });
  }
}