import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file = data.get('file') as File;
        const pathName = data.get('path') as string || 'patients';

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file received.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create the uploads directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads', pathName);
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err: any) {
            if (err.code !== 'EEXIST') throw err;
        }

        // Ensure a unique filename using timestamp
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
        const filePath = join(uploadDir, uniqueFileName);

        // Write file to disk
        await writeFile(filePath, buffer);

        // Return the URL path accessible from the browser
        const fileUrl = `/uploads/${pathName}/${uniqueFileName}`;

        return NextResponse.json({ success: true, url: fileUrl });
    } catch (error: any) {
        console.error('File Upload Error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}
