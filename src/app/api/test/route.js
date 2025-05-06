import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();
    return Response.json({ message: 'MongoDB connection successful' });
  } catch (error) {
    return Response.json({ message: 'MongoDB connection failed', error: error.message }, { status: 500 });
  }
} 