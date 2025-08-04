/**
 * Componente FileUpload - Tech Challenge POSTECH
 * Upload de anexos com drag & drop, preview e validação
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { attachmentsService, type Attachment } from '@/services/attachmentsService';

interface FileUploadProps {
  transactionId: string;
  onUploadComplete?: (attachments: Attachment[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  className?: string;
}

interface FilePreview {
  file: File;
  id: string;
  preview?: string;
  uploading?: boolean;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  transactionId,
  onUploadComplete,
  onUploadError,
  multiple = true,
  className = ""
}) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gerar preview para imagens
  const generatePreview = useCallback((file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/')) {
        resolve(undefined);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(file);
    });
  }, []);

  // Processar arquivos selecionados
  const processFiles = useCallback(async (fileList: FileList) => {
    const newFiles: FilePreview[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const preview = await generatePreview(file);
      
      newFiles.push({
        file,
        id: `${Date.now()}_${i}`,
        preview
      });
    }

    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
  }, [multiple, generatePreview]);

  // Handlers de drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [processFiles]);

  // Handler de seleção de arquivo
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
  }, [processFiles]);

  // Remover arquivo da lista
  const removeFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  // Fazer upload dos arquivos
  const handleUpload = useCallback(async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Marcar arquivos como uploading
      setFiles(prev => prev.map(f => ({ ...f, uploading: true, error: undefined })));

      const uploads = files.map(f => ({
        transactionId,
        file: f.file
      }));

      const attachments = await attachmentsService.uploadMultipleAttachments(uploads);
      
      onUploadComplete?.(attachments);
      setFiles([]); // Limpar após upload bem-sucedido
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no upload';
      onUploadError?.(errorMessage);
      
      // Marcar arquivos com erro
      setFiles(prev => prev.map(f => ({ 
        ...f, 
        uploading: false, 
        error: errorMessage 
      })));
    } finally {
      setIsUploading(false);
    }
  }, [files, transactionId, onUploadComplete, onUploadError]);

  // Obter ícone do arquivo
  const getFileIcon = useCallback((fileType: string) => {
    return attachmentsService.getFileIcon(fileType);
  }, []);

  // Formatar tamanho do arquivo
  const formatFileSize = useCallback((bytes: number) => {
    return attachmentsService.formatFileSize(bytes);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      {/* Área de drop */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Icon 
              icon={isDragOver ? "mdi:cloud-upload" : "mdi:cloud-upload-outline"} 
              className={`w-12 h-12 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`}
            />
          </div>

          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragOver ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Suporte: Imagens, PDF, DOC, TXT (máx. 10MB cada)
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Icon icon="mdi:folder-open" className="w-4 h-4 mr-2" />
            Selecionar Arquivos
          </button>
        </div>
      </div>

      {/* Lista de arquivos */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900">
            Arquivos selecionados ({files.length})
          </h4>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((filePreview) => (
              <div
                key={filePreview.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Preview ou ícone */}
                <div className="flex-shrink-0">
                  {filePreview.preview ? (
                    <img
                      src={filePreview.preview}
                      alt={filePreview.file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <Icon 
                        icon={getFileIcon(filePreview.file.type)} 
                        className="w-6 h-6 text-gray-500"
                      />
                    </div>
                  )}
                </div>

                {/* Informações do arquivo */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {filePreview.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(filePreview.file.size)}
                  </p>
                  {filePreview.error && (
                    <p className="text-xs text-red-600 mt-1">
                      {filePreview.error}
                    </p>
                  )}
                </div>

                {/* Status e ações */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {filePreview.uploading ? (
                    <Icon icon="mdi:loading" className="w-4 h-4 text-blue-500 animate-spin" />
                  ) : (
                    <button
                      onClick={() => removeFile(filePreview.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remover arquivo"
                    >
                      <Icon icon="mdi:close" className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() => setFiles([])}
              disabled={isUploading}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Limpar Tudo
            </button>
            <button
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Icon icon="mdi:loading" className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Icon icon="mdi:upload" className="w-4 h-4 mr-2" />
                  Enviar Arquivos
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
