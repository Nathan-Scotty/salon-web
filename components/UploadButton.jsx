import { useRef, useState } from 'react';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = 'p9lyahsb';

export default function UploadButton({ onUpload, label = 'Upload File' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'davilas');

      // Determine resource type
      const isVideo = file.type.startsWith('video/');
      const resourceType = isVideo ? 'video' : 'image';

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Upload failed');
      }

      const data = await res.json();

      onUpload({
        url: data.secure_url,
        type: isVideo ? 'VIDEO' : 'IMAGE',
        publicId: data.public_id,
      });

    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{
          background: uploading ? 'var(--surface2)' : 'var(--gold)',
          color: uploading ? 'var(--text-dim)' : '#0f0f0f',
          border: 'none',
          padding: '0.55rem 1.25rem',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          borderRadius: '3px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {uploading ? 'Uploading...' : label}
      </button>
      {error && (
        <p style={{ fontSize: '12px', color: 'var(--red)', marginTop: '0.4rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}