'use server';

type UploadResponse = {
  absoluteUrl?: string;
  url?: string;
};

/**
 * Server Action to forward uploads to the backend media service.
 */
export async function uploadFile(formData: FormData) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    throw new Error('BACKEND_URL is not configured');
  }

  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const response = await fetch(`${backendUrl}/api/uploads`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
        'x-file-name': file.name,
      },
      body: Buffer.from(await file.arrayBuffer()),
      cache: 'no-store',
    });

    if (!response.ok) {
      let message = `Upload failed with ${response.status}`;
      try {
        const body = await response.json();
        if (body?.error) {
          message = body.error;
        }
      } catch {}
      throw new Error(message);
    }

    const body = (await response.json()) as UploadResponse;
    return body.absoluteUrl || body.url || '';
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file to backend media service');
  }
}
