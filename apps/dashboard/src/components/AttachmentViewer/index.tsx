/**
 * Componente AttachmentViewer - Tech Challenge POSTECH
 * Visualização e gerenciamento de anexos de transações
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { attachmentsService, type Attachment } from '@/services/attachmentsService';

interface AttachmentViewerProps {
  transactionId: string;
  onAttachmentDeleted?: (attachmentId: string) => void;
  className?: string;
}

export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({
  transactionId,
  onAttachmentDeleted,
  className = ""
}) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Carregar anexos da transação
  const loadAttachments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await attachmentsService.getAttachmentsByTransaction(transactionId);
      setAttachments(data);
    } catch (error) {
      console.error('Erro ao carregar anexos:', error);
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  // Carregar anexos ao montar o componente
  useEffect(() => {
    loadAttachments();
  }, [loadAttachments]);

  // Visualizar anexo
  const viewAttachment = useCallback(async (attachment: Attachment) => {
    try {
      const url = await attachmentsService.getAttachmentUrl(attachment.id);
      if (url) {
        setSelectedAttachment(attachment);
        setPreviewUrl(url);
      }
    } catch (error) {
      console.error('Erro ao visualizar anexo:', error);
    }
  }, []);

  // Baixar anexo
  const downloadAttachment = useCallback(async (attachment: Attachment) => {
    try {
      const url = await attachmentsService.getAttachmentUrl(attachment.id);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = attachment.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Limpar URL após download
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error('Erro ao baixar anexo:', error);
    }
  }, []);

  // Fechar preview
  const closePreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedAttachment(null);
    setPreviewUrl(null);
  }, [previewUrl]);

  // Deletar anexo
  const deleteAttachment = useCallback(async (attachment: Attachment) => {
    if (!confirm(`Tem certeza que deseja excluir "${attachment.fileName}"?`)) {
      return;
    }

    try {
      await attachmentsService.deleteAttachment(attachment.id);
      setAttachments(prev => prev.filter(a => a.id !== attachment.id));
      onAttachmentDeleted?.(attachment.id);
      
      // Fechar preview se for o anexo selecionado
      if (selectedAttachment?.id === attachment.id) {
        closePreview();
      }
    } catch (error) {
      console.error('Erro ao deletar anexo:', error);
    }
  }, [selectedAttachment, onAttachmentDeleted, closePreview]);

  // Obter ícone do arquivo
  const getFileIcon = useCallback((fileType: string) => {
    return attachmentsService.getFileIcon(fileType);
  }, []);

  // Formatar tamanho do arquivo
  const formatFileSize = useCallback((bytes: number) => {
    return attachmentsService.formatFileSize(bytes);
  }, []);

  // Formatar data
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Icon icon="mdi:loading" className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Carregando anexos...</span>
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className={`text-center p-4 text-gray-500 ${className}`}>
        <Icon icon="mdi:attachment" className="w-8 h-8 mx-auto mb-2 text-gray-300" />
        <p>Nenhum anexo encontrado</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Lista de anexos */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Anexos ({attachments.length})
        </h4>
        
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* Ícone do arquivo */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white rounded flex items-center justify-center border">
                <Icon 
                  icon={getFileIcon(attachment.fileType)} 
                  className="w-6 h-6 text-gray-600"
                />
              </div>
            </div>

            {/* Informações do arquivo */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {attachment.fileName}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatFileSize(attachment.fileSize)}</span>
                <span>•</span>
                <span>{formatDate(attachment.uploadDate)}</span>
              </div>
              {attachment.description && (
                <p className="text-xs text-gray-600 mt-1 truncate">
                  {attachment.description}
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="flex-shrink-0 flex items-center space-x-1">
              {/* Visualizar */}
              <button
                onClick={() => viewAttachment(attachment)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Visualizar"
              >
                <Icon icon="mdi:eye" className="w-4 h-4" />
              </button>

              {/* Baixar */}
              <button
                onClick={() => downloadAttachment(attachment)}
                className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                title="Baixar"
              >
                <Icon icon="mdi:download" className="w-4 h-4" />
              </button>

              {/* Deletar */}
              <button
                onClick={() => deleteAttachment(attachment)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Excluir"
              >
                <Icon icon="mdi:trash-can-outline" className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de preview */}
      {selectedAttachment && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-hidden">
            {/* Header do modal */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedAttachment.fileName}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(selectedAttachment.fileSize)} • {formatDate(selectedAttachment.uploadDate)}
                </p>
              </div>
              <button
                onClick={closePreview}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="mdi:close" className="w-6 h-6" />
              </button>
            </div>

            {/* Conteúdo do preview */}
            <div className="p-4 max-h-96 overflow-auto">
              {selectedAttachment.fileType.startsWith('image/') ? (
                <Image
                  src={previewUrl}
                  alt={selectedAttachment.fileName}
                  width={500}
                  height={300}
                  className="max-w-full h-auto rounded"
                  style={{ objectFit: 'contain' }}
                />
              ) : selectedAttachment.fileType === 'application/pdf' ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-96 border rounded"
                  title={selectedAttachment.fileName}
                />
              ) : (
                <div className="text-center py-8">
                  <Icon 
                    icon={getFileIcon(selectedAttachment.fileType)} 
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  />
                  <p className="text-gray-600 mb-4">
                    Preview não disponível para este tipo de arquivo
                  </p>
                  <button
                    onClick={() => downloadAttachment(selectedAttachment)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Icon icon="mdi:download" className="w-4 h-4 mr-2" />
                    Baixar Arquivo
                  </button>
                </div>
              )}
            </div>

            {/* Footer do modal */}
            <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50">
              <button
                onClick={() => downloadAttachment(selectedAttachment)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Icon icon="mdi:download" className="w-4 h-4 mr-2" />
                Baixar
              </button>
              <button
                onClick={closePreview}
                className="px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
