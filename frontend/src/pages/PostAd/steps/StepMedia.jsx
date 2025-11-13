import React, { useMemo, useState } from 'react';
import { usePostAd } from '../../../context/PostAdContext';
import api from '../../../api/http';
import { useNavigate } from 'react-router-dom';

const StepMedia = () => {
  const { draft, setDraft } = usePostAd();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const hasToken = useMemo(() => {
    try { return !!localStorage.getItem('token'); } catch { return false; }
  }, []);
  const addFiles = async (files) => {
    setError('');
    if (!files || files.length === 0) return;
    if (!hasToken) {
      setError('Please log in to upload images.');
      return;
    }
    const form = new FormData();
    Array.from(files).forEach(f => form.append('files', f));
    try {
      setUploading(true);
      const { data } = await api.post('/uploads', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const urls = data?.files || [];
      setDraft(d => ({ ...d, images: [...(d.images || []), ...urls] }));
    } catch (e) {
      const status = e?.response?.status;
      if (status === 401) setError('You must be logged in to upload images.');
      else if (status === 413) setError('File too large. Max 5MB per image.');
      else setError(e?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="text-sm font-medium">Upload images</label>
      <div className="mt-2 border-2 border-dashed rounded-xl p-6 text-center bg-gray-50 hover:bg-gray-100 transition relative">
        <input type="file" accept="image/*" multiple onChange={(e) => addFiles(e.target.files)} className="block mx-auto" disabled={!hasToken} />
        {uploading && <div className="absolute inset-0 bg-white/60 flex items-center justify-center text-sm">Uploading...</div>}
        {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
        {!hasToken && (
          <div className="mt-2 text-xs text-gray-600">You are not logged in. <button className="underline text-blue-600" onClick={() => navigate('/login')}>Login</button> to upload images.</div>
        )}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {(draft.images || []).map((img, idx) => (
            <img key={idx} src={img.url} alt="preview" className="h-28 w-full object-cover rounded-lg shadow" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepMedia;
