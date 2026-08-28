import React from 'react';
import { X } from 'lucide-react';

const ImageModal = ({ imageUrl, title, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <span className="text-sm font-bold text-white truncate max-w-md">
            {title || 'Image Preview'}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 flex items-center justify-center bg-black min-h-[300px] max-h-[80vh] overflow-auto">
          <img
            src={imageUrl}
            alt={title || 'Full resolution proof image'}
            className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
