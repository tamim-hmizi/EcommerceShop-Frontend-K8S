import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCamera, FiUpload, FiX, FiTrash2, FiCheck } from 'react-icons/fi';
import { uploadProfilePicture, deleteProfilePicture } from '../redux/slices/authSlice';
import Avatar from './Avatar';
import { validateImageFile } from '../utils/imageUtils';

const ProfilePictureUpload = ({ className = "" }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const fileInputRef = useRef(null);

  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle file selection
  const handleFileSelect = (file) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setError(validation.error);
      return;
    }

    setError("");
    setSelectedFile(file);

    // Clean up previous preview URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadProgress(0);
      await dispatch(uploadProfilePicture(selectedFile)).unwrap();

      // Clean up
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);

      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || "Failed to upload profile picture");
    }
  };

  // Delete profile picture
  const handleDelete = async () => {
    try {
      await dispatch(deleteProfilePicture()).unwrap();
    } catch (err) {
      setError(err.message || "Failed to delete profile picture");
    }
  };

  // Cancel selection
  const handleCancel = () => {
    // Clean up preview URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Profile Picture */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar
            src={previewUrl || user?.profilePicture}
            alt={user?.name || "Profile"}
            size="3xl"
            fallbackText={user?.name}
            className="border-4 border-base-300"
          />

          {/* Camera overlay button */}
          <button
            onClick={openFileDialog}
            className="absolute bottom-0 right-0 btn btn-circle btn-primary btn-sm shadow-lg"
            disabled={loading}
          >
            <FiCamera className="w-4 h-4" />
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {!selectedFile && user?.profilePicture && (
            <button
              onClick={handleDelete}
              className="btn btn-outline btn-error btn-sm gap-2"
              disabled={loading}
            >
              <FiTrash2 className="w-4 h-4" />
              Remove
            </button>
          )}

          <button
            onClick={openFileDialog}
            className="btn btn-outline btn-primary btn-sm gap-2"
            disabled={loading}
          >
            <FiUpload className="w-4 h-4" />
            {user?.profilePicture ? 'Change' : 'Upload'}
          </button>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-base-300'}
          ${selectedFile ? 'border-success bg-success/5' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-success">
              <FiCheck className="w-5 h-5" />
              <span className="font-medium">File selected: {selectedFile.name}</span>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={handleUpload}
                className="btn btn-success btn-sm gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <FiUpload className="w-4 h-4" />
                )}
                Upload
              </button>

              <button
                onClick={handleCancel}
                className="btn btn-outline btn-sm gap-2"
                disabled={loading}
              >
                <FiX className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <FiUpload className="w-8 h-8 mx-auto text-base-content/40" />
            <p className="text-base-content/70">
              Drag and drop an image here, or{' '}
              <button
                onClick={openFileDialog}
                className="link link-primary"
                disabled={loading}
              >
                click to select
              </button>
            </p>
            <p className="text-sm text-base-content/50">
              Supports JPEG, PNG, GIF, WebP (max 5MB)
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
