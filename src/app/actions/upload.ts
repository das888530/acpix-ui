'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Server Action to handle uploading files to the public/uploads directory.
 */
export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Define the upload path relative to the project root
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    // Ensure the directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Sanitize filename
    const safeName = file.name.replace(/[^a-z0-0.]/gi, '_').toLowerCase();
    const fileName = `${Date.now()}-${safeName}`;
    const filePath = join(uploadDir, fileName);

    // Write the file
    await writeFile(filePath, buffer);
    
    // Return the public URL that Next.js can serve
    // Next.js serves files in 'public' at the root path '/'
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to save file to project directory');
  }
}
