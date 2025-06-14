"use client";

import { useState } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import axios from "axios";
import { Slider } from "@/components/ui/slider";

// Enum para os tipos de entidade
export enum ImageCropperType {
  Usuario = "Usuario",
  Projeto = "Projeto",
  Curso = "Curso"
}

interface ImageCropperProps {
  userId: string;
  type?: ImageCropperType;
  onUploadSuccess: (base64: string) => void;
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = 'default'
}: {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  variant?: 'default' | 'destructive';
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          {onClose && (
            <button
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              onClick={onClose}
            >
              Continuar editando
            </button>
          )}
          <button
            className={`px-4 py-2 rounded-md transition ${variant === 'destructive'
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-black text-white hover:bg-gray-700'
              }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ImageCropper({
  userId,
  type = ImageCropperType.Usuario,
  onUploadSuccess
}: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [resultDialog, setResultDialog] = useState({
    title: '',
    message: '',
    isError: false,
  })

  const ASPECT_RATIO = 630 / 335;
  const MIN_WIDTH = 630;
  const MIN_HEIGHT = 335;

  // Configurações baseadas no tipo
  const getApiConfig = () => {
    switch (type) {
      case ImageCropperType.Usuario:
        return {
          endpoint: `/api/usuario?id=${userId}`,
          imageField: 'fotoPerfil',
          entityName: 'usuário'
        };
      case ImageCropperType.Projeto:
        return {
          endpoint: `/api/projeto?id=${userId}`,
          imageField: 'imagem',
          entityName: 'projeto'
        };
      case ImageCropperType.Curso:
        return {
          endpoint: `/api/curso?id=${userId}`,
          imageField: 'imagem',
          entityName: 'curso'
        };
      default:
        return {
          endpoint: `/api/usuario?id=${userId}`,
          imageField: 'fotoPerfil',
          entityName: 'usuário'
        };
    }
  };

  const onCropComplete = (_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      //alert("A imagem deve ter no máximo 5MB.");
      setResultDialog({
        title: 'Alerta!',
        message: "A imagem deve ter no máximo 5MB.",
        isError: true,
      })
      setShowResultDialog(true)

      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => {
        if (img.width < MIN_WIDTH || img.height < MIN_HEIGHT) {
          //alert(`A imagem deve ter no mínimo ${MIN_WIDTH}px de largura e ${MIN_HEIGHT}px de altura.`);
          setResultDialog({
            title: 'Alerta!',
            message: `A imagem deve ter no mínimo ${MIN_WIDTH}px de largura e ${MIN_HEIGHT}px de altura.`,
            isError: true,
          })
          setShowResultDialog(true)

          return;
        }
        setImageSrc(reader.result as string);
      };
    };
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) {
      //alert("Imagem não carregada corretamente.");
      setResultDialog({
        title: 'Erro',
        message: "Imagem não carregada corretamente.",
        isError: true,
      })
      setShowResultDialog(true)
      return;
    }

    setIsLoading(true);
    const apiConfig = getApiConfig();

    try {
      console.log("Iniciando crop da imagem...");
      const croppedImageBase64 = await getCroppedImg(imageSrc, croppedAreaPixels);

      // Log do tamanho da string base64
      console.log("Tamanho da string base64:", croppedImageBase64.length);

      // Verificar se a string não é muito grande (limite de ~1MB para base64)
      if (croppedImageBase64.length > 1400000) {
        //alert("A imagem processada é muito grande. Tente com uma imagem menor ou ajuste o zoom.");
        setResultDialog({
          title: 'Alerta!',
          message: "A imagem processada é muito grande. Tente com uma imagem menor ou ajuste o zoom.",
          isError: true,
        })
        setShowResultDialog(true)
        setIsLoading(false);
        return;
      }

      console.log(`Enviando para API do ${apiConfig.entityName}...`);

      // Preparar o corpo da requisição baseado no campo de imagem
      const requestBody = {
        [apiConfig.imageField]: croppedImageBase64
      };

      const response = await axios.patch(apiConfig.endpoint, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos de timeout
      });

      if (response.status === 200) {
        //alert(`Imagem do ${apiConfig.entityName} atualizada!`);
        setResultDialog({
          title: 'Sucesso!',
          message: `Imagem do ${apiConfig.entityName} atualizada!`,
          isError: false,
        })
        setShowResultDialog(true)
        onUploadSuccess(croppedImageBase64);
        handleCancel(); // Limpar o formulário após sucesso
      } else {
        //alert(`Erro ao atualizar a imagem do ${apiConfig.entityName}.`);
        setResultDialog({
          title: 'Erro',
          message: `Erro ao atualizar a imagem do ${apiConfig.entityName}.`,
          isError: true,
        })
        setShowResultDialog(true)


      }
    } catch (error: any) {
      console.error("Erro completo:", error);
      console.error("Response data:", error.response?.data);
      console.error("Response status:", error.response?.status);

      if (error.response?.status === 413) {
        //alert("A imagem é muito grande para ser processada. Tente com uma imagem menor.");
        setResultDialog({
          title: 'Alerta!',
          message: "A imagem é muito grande para ser processada. Tente com uma imagem menor.",
          isError: true,
        })
        setShowResultDialog(true)
      } else if (error.response?.status === 400) {
        //alert(`Erro de validação: ${error.response?.data?.error || "Dados inválidos"}`);
        setResultDialog({
          title: 'Erro',
          message: `Erro de validação: ${error.response?.data?.error || "Dados inválidos"}`,
          isError: true,
        })
        setShowResultDialog(true)
      } else if (error.response?.status === 404) {
        //alert(`${apiConfig.entityName.charAt(0).toUpperCase() + apiConfig.entityName.slice(1)} não encontrado(a).`);
        setResultDialog({
          title: 'Erro',
          message: `${apiConfig.entityName.charAt(0).toUpperCase() + apiConfig.entityName.slice(1)} não encontrado(a).`,
          isError: true,
        })
        setShowResultDialog(true)
      } else if (error.code === 'ECONNABORTED') {
        //alert("Timeout: A operação demorou muito para ser concluída. Tente novamente.");
        setResultDialog({
          title: 'Erro',
          message: "Timeout: A operação demorou muito para ser concluída. Tente novamente.",
          isError: true,
        })
        setShowResultDialog(true)
      } else {
        //alert(error.response?.data?.error || "Erro ao enviar imagem para o servidor.");
        setResultDialog({
          title: 'Erro',
          message: error.response?.data?.error || "Erro ao enviar imagem para o servidor.",
          isError: true,
        })
        setShowResultDialog(true)
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setImageSrc(null);
    setCroppedAreaPixels(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
  };

  const apiConfig = getApiConfig();

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-2">
        Atualizando imagem do {apiConfig.entityName}
      </div>

      <input
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleImageUpload}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        disabled={isLoading}
      />

      {imageSrc && (
        <>
          <div className="relative w-full h-[400px] bg-black rounded-md">
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
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isLoading ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </>
      )}
      <ConfirmationModal
        isOpen={showResultDialog}
        onConfirm={() => setShowResultDialog(false)}
        title={resultDialog.title}
        message={resultDialog.message}
        confirmText="OK"
        variant={resultDialog.isError ? 'destructive' : 'default'}
      />
    </div>
  );
}