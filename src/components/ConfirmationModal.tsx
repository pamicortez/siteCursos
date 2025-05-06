import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default"
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl border border-gray-200">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            {onClose && (
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-4 py-2"
              >
                {cancelText}
              </Button>
            )}
            
            <Button
              type="button"
              variant={variant}
              onClick={onConfirm}
              className={variant === "destructive" 
                ? "bg-red-600 hover:bg-red-700" 
                : ""}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}