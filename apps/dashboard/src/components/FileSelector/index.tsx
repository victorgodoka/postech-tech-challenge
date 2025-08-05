'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';

interface FileSelectorProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // em bytes
  acceptedTypes?: string[];
  multiple?: boolean;
  className?: string;
}

interface FilePreview {
  file: File;
  id: string;
  preview?: string; 
}

export const FileSelector: React.FC<FileSelectorProps> = ({
  onFilesSelected,
  maxFiles = 5,
  maxSizePerFile = 10 * 1024 * 1024, // 10MB
  acceptedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  multiple = true,
  className = ""
}) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const validateFile = useCallback((file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Tipo de arquivo não suportado: ${file.type}`;
    }

    if (file.size > maxSizePerFile) {
      const maxSizeMB = (maxSizePerFile / (1024 * 1024)).toFixed(1);
      return `Arquivo muito grande. Máximo: ${maxSizeMB}MB`;
    }

    return null;
  }, [acceptedTypes, maxSizePerFile]);

  // Processar arquivos selecionados
  const processFiles = useCallback(async (fileList: FileList) => {
    setError('');
    const newFiles: FilePreview[] = [];
    const validFiles: File[] = [];

    // Verificar limite de arquivos
    if (files.length + fileList.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const validationError = validateFile(file);

      if (validationError) {
        setError(validationError);
        continue;
      }

      const id = `file_${Date.now()}_${i}`;
      const preview = await generatePreview(file);

      newFiles.push({
        file,
        id,
        preview
      });

      validFiles.push(file);
    }

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      
      // Notificar componente pai com todos os arquivos
      const allFiles = updatedFiles.map(f => f.file);
      onFilesSelected(allFiles);
    }
  }, [files, maxFiles, validateFile, generatePreview, onFilesSelected]);

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

  // Handler de seleção via input
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    
    // Limpar input para permitir seleção do mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [processFiles]);

  // Remover arquivo
  const removeFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    
    // Notificar componente pai
    const allFiles = updatedFiles.map(f => f.file);
    onFilesSelected(allFiles);
  }, [files, onFilesSelected]);

  // Limpar todos os arquivos
  const clearFiles = useCallback(() => {
    setFiles([]);
    setError('');
    onFilesSelected([]);
  }, [onFilesSelected]);

  // Obter ícone do arquivo
  const getFileIcon = useCallback((fileType: string) => {
    if (fileType.startsWith('image/')) return 'mdi:image';
    if (fileType === 'application/pdf') return 'mdi:file-pdf-box';
    if (fileType.includes('word')) return 'mdi:file-word-box';
    if (fileType === 'text/plain') return 'mdi:file-document-outline';
    return 'mdi:file-outline';
  }, []);

  // Formatar tamanho do arquivo
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Área de upload */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-2">
          <Icon 
            icon="mdi:cloud-upload" 
            className={`w-12 h-12 mx-auto ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} 
          />
          <div>
            <p className="text-sm font-medium text-gray-900">
              Clique para selecionar ou arraste arquivos aqui
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Máximo {maxFiles} arquivos, {formatFileSize(maxSizePerFile)} cada
            </p>
          </div>
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <Icon icon="mdi:alert-circle" className="w-5 h-5 text-red-500" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Lista de arquivos selecionados */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Arquivos selecionados ({files.length})
            </h4>
            <button
              onClick={clearFiles}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              Limpar todos
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((filePreview) => (
              <div
                key={filePreview.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* Preview ou ícone */}
                <div className="flex-shrink-0">
                  {filePreview.preview ? (
                    <Image
                      src={filePreview.preview}
                      alt={filePreview.file.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-white rounded flex items-center justify-center border">
                      <Icon 
                        icon={getFileIcon(filePreview.file.type)} 
                        className="w-6 h-6 text-gray-600"
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
                </div>

                {/* Botão remover */}
                <button
                  onClick={() => removeFile(filePreview.id)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Remover arquivo"
                >
                  <Icon icon="mdi:close" className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
