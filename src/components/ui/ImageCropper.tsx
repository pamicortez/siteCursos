// src/components/ui/ImageCropper.tsx

"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import axios from "axios";
import { Slider } from "@/components/ui/slider";

interface ImageCropperProps {
  userId: string;
  onUploadSuccess: (url: string) => void;
}

export default function ImageCropper({ userId, onUploadSuccess }: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const ASPECT_RATIO = 630 / 335;
  const MIN_WIDTH = 630;
  const MIN_HEIGHT = 335;

  const onCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
          alert(`A imagem deve ter no mínimo ${MIN_WIDTH}px de largura e ${MIN_HEIGHT}px de altura.`);
          return;
        }
        setImageSrc(reader.result as string);
      };
    };
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

    try {
      const response = await axios.patch("/api/usuario", {
        id: Number(userId),
        atributo: "fotoPerfil",
        novoValor: croppedImage,
      });

      if (response.status === 200) {
        alert("Foto de perfil atualizada!");
        onUploadSuccess(croppedImage);
      } else {
        alert("Erro ao atualizar a foto de perfil.");
      }
    } catch (error) {
      alert("Erro ao enviar imagem para o servidor.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleImageUpload} className="block" />
      {imageSrc && (
        <>
          <div className="relative w-full h-[400px] bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={ASPECT_RATIO}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid={true}
              style={{
                cropAreaStyle: {
                  border: "3px solid #3B82F6",
                  borderRadius: "0.375rem",
                },
              }}
            />
          </div>
          <div>
            <label className="block font-medium mt-2">Zoom</label>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={(value: number[]) => setZoom(value[0])}
              className="w-[300px]"
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
