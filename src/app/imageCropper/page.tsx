// src/app/imageCrop/page.tsx

"use client";

import ImageCropper from "@/components/ui/ImageCropper";

export default function ImageCropPage() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Editar Foto de Perfil</h1>
      <ImageCropper
        userId="33"
        onUploadSuccess={(url) => {
          console.log("Imagem salva com sucesso:", url);
        }}
      />
    </div>
  );
}
