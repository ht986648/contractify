"use client";
import React, { useState, useRef, useEffect } from "react";
import { XIcon, UploadIcon, PenIcon, TrashIcon, Loader } from "lucide-react";

const SignatureModal = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState("draw"); // "draw" or "upload"
  const [signature, setSignature] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  // Initialize canvas on component mount
  useEffect(() => {
    if (isOpen && activeTab === "draw" && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;

      const context = canvas.getContext("2d");
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 2;
      contextRef.current = context;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [isOpen, activeTab]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
    // Save the canvas content as an image
    const dataUrl = canvasRef.current.toDataURL("image/png");
    setSignature(dataUrl);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setSignature(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setSignature(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const saveSignature = async () => {
    if (!signature) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/contracts/signature`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ signature }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.url);
        onSave(data.url); // Send the uploaded signature URL to parent component
        onClose();
      } else {
        console.error("Upload failed:", data.error);
      }
    } catch (error) {
      console.error("Error uploading signature:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-backdrop"
      onClick={handleOutsideClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 mx-4 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Add Your Signature
          </h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
            disabled={loading}
          >
            <XIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "draw"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("draw")}
            disabled={loading}
          >
            <div className="flex items-center justify-center gap-2">
              <PenIcon className="h-4 w-4" />
              Draw Signature
            </div>
          </button>
          <button
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "upload"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("upload")}
            disabled={loading}
          >
            <div className="flex items-center justify-center gap-2">
              <UploadIcon className="h-4 w-4" />
              Upload Image
            </div>
          </button>
        </div>

        {/* Drawing Canvas */}
        {activeTab === "draw" && (
          <div className="mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 p-1 cursor-crosshair">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                onMouseLeave={finishDrawing}
                className="w-full h-48 bg-white rounded-md"
                style={{ pointerEvents: loading ? "none" : "auto" }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-sm text-gray-500">
                Use your mouse or touch to sign above
              </p>
              <button
                onClick={clearCanvas}
                className="flex items-center text-sm text-red-500 hover:text-red-600"
                disabled={loading}
              >
                <TrashIcon className="h-4 w-4 mr-1" /> Clear
              </button>
            </div>
          </div>
        )}

        {/* Upload Image */}
        {activeTab === "upload" && (
          <div className="mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Signature"
                    className="max-h-48 mx-auto"
                  />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    disabled={loading}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="py-6">
                  <UploadIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">
                    Drag and drop your signature image here
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    Or select a file from your computer
                  </p>
                  <label
                    className={`inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer hover:bg-blue-700"
                    } transition-colors`}
                  >
                    <UploadIcon className="h-4 w-4" />
                    Browse File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={loading}
                    />
                  </label>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, GIF (max 5MB)
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className={`px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
            } transition-colors`}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={saveSignature}
            className={`px-4 py-2 bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
              signature && !loading
                ? "hover:bg-blue-700"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!signature || loading}
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Signature"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
