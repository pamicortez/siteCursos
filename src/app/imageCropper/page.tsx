// src/app/imageCropper/page.tsx

"use client";

import { useState } from "react";
import ImageCropper from "@/components/ui/ImageCropper";
import { User, Camera } from "lucide-react";

export default function ImageCropPage() {
  const [userId, setUserId] = useState("");
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const handleOpenModal = () => {
    if (!userId.trim()) {
      alert("Por favor, digite um ID de usuário válido.");
      return;
    }
    setShowImageCropper(true);
  };

  const handleCloseModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowImageCropper(false);
      setIsModalClosing(false);
    }, 700); // Duração da animação de fade out
  };

  const handleImageUploadSuccess = (newImageBase64: string) => {
    setProfileImage(newImageBase64);
    handleCloseModal();
    console.log("Imagem salva com sucesso:", newImageBase64);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Editar Foto de Perfil</h1>
            <p className="text-gray-600">Digite o ID do usuário para alterar a foto de perfil</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* User ID Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="inline w-4 h-4 mr-1" />
                ID do Usuário
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite o ID do usuário"
              />
            </div>

            {/* Current Profile Photo Preview */}
            {profileImage && (
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Foto Atual</h3>
                <div className="flex justify-center mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                    <img
                      src={profileImage}
                      alt="Foto de perfil atual"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleOpenModal}
                disabled={!userId.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                <Camera className="w-4 h-4 mr-2" />
                Alterar Foto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do Image Cropper */}
      {showImageCropper && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-700 ease-in-out ${
            isModalClosing
              ? 'bg-slate-600/0 backdrop-blur-none opacity-0'
              : 'bg-slate-600/40 backdrop-blur-sm opacity-100'
          }`}
          style={{
            backdropFilter: isModalClosing ? 'blur(0px)' : 'blur(8px)',
            background: isModalClosing
              ? 'rgba(71, 85, 105, 0)'
              : 'rgba(71, 85, 105, 0.4)'
          }}
        >
          <div
            className={`bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-700 ease-in-out ${
              isModalClosing
                ? 'scale-95 opacity-0 translate-y-4'
                : 'scale-100 opacity-100 translate-y-0'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Escolher Foto de Perfil</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              <ImageCropper 
                userId={userId} 
                onUploadSuccess={handleImageUploadSuccess} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}