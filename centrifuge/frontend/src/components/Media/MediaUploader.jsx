import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';

const MediaUploader = ({ onUploadComplete }) => {
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);

    // Call the parent component callback
    if (onUploadComplete) {
      onUploadComplete(files);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow-md bg-white w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">Upload Media Files</h2>

      <label className="flex items-center justify-center border-dashed border-2 border-gray-400 p-6 rounded-xl cursor-pointer hover:border-blue-500 transition-all">
        <input
          type="file" // ✅ lowercase
          accept="image/*,video/*" // ✅ lowercase
          multiple // ✅ lowercase
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="text-center">
          <UploadCloud className="mx-auto text-blue-600 mb-2" size={40} />
          <p className="text-gray-600">Click or drag files here to upload</p>
        </div>
      </label>

      {mediaFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Selected Files:</h3>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {mediaFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
