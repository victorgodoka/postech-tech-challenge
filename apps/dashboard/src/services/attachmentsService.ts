/**
 * Serviço de Anexos - Tech Challenge POSTECH
 * Gerencia upload, armazenamento e recuperação de anexos no IndexedDB
 */

import { getDB } from '@/lib/db';

export interface Attachment {
  id: string;
  transactionId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  file: Blob; // Arquivo armazenado como Blob no IndexedDB
  description?: string;
}

export interface AttachmentUpload {
  transactionId: string;
  file: File;
  description?: string;
}

class AttachmentsService {
  /**
   * Fazer upload de um anexo
   */
  async uploadAttachment(upload: AttachmentUpload): Promise<Attachment> {
    const db = await getDB();
    
    // Validar arquivo
    this.validateFile(upload.file);
    
    const attachment: Attachment = {
      id: `attachment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionId: upload.transactionId,
      fileName: upload.file.name,
      fileType: upload.file.type,
      fileSize: upload.file.size,
      uploadDate: new Date().toISOString(),
      file: upload.file, // IndexedDB pode armazenar File/Blob diretamente
      description: upload.description
    };

    await db.add('attachments', attachment);
    return attachment;
  }

  /**
   * Fazer upload de múltiplos anexos
   */
  async uploadMultipleAttachments(uploads: AttachmentUpload[]): Promise<Attachment[]> {
    const results: Attachment[] = [];
    
    for (const upload of uploads) {
      try {
        const attachment = await this.uploadAttachment(upload);
        results.push(attachment);
      } catch (error) {
        console.error(`Erro ao fazer upload de ${upload.file.name}:`, error);
        throw error;
      }
    }
    
    return results;
  }

  /**
   * Buscar anexos por transação
   */
  async getAttachmentsByTransaction(transactionId: string): Promise<Attachment[]> {
    const db = await getDB();
    const tx = db.transaction('attachments', 'readonly');
    const index = tx.store.index('transactionId');
    return await index.getAll(transactionId);
  }

  /**
   * Buscar anexo por ID
   */
  async getAttachmentById(id: string): Promise<Attachment | undefined> {
    const db = await getDB();
    return await db.get('attachments', id);
  }

  /**
   * Buscar todos os anexos
   */
  async getAllAttachments(): Promise<Attachment[]> {
    const db = await getDB();
    return await db.getAll('attachments');
  }

  /**
   * Deletar anexo
   */
  async deleteAttachment(id: string): Promise<void> {
    const db = await getDB();
    await db.delete('attachments', id);
  }

  /**
   * Deletar todos os anexos de uma transação
   */
  async deleteAttachmentsByTransaction(transactionId: string): Promise<void> {
    const attachments = await this.getAttachmentsByTransaction(transactionId);
    const db = await getDB();
    
    for (const attachment of attachments) {
      await db.delete('attachments', attachment.id);
    }
  }

  /**
   * Baixar anexo como URL para visualização/download
   */
  async getAttachmentUrl(id: string): Promise<string | null> {
    const attachment = await this.getAttachmentById(id);
    if (!attachment) return null;
    
    // Criar URL temporária para o blob
    return URL.createObjectURL(attachment.file);
  }

  /**
   * Obter estatísticas de anexos
   */
  async getAttachmentStats(): Promise<{
    totalAttachments: number;
    totalSize: number;
    byType: Record<string, number>;
  }> {
    const attachments = await this.getAllAttachments();
    
    const stats = {
      totalAttachments: attachments.length,
      totalSize: attachments.reduce((sum, att) => sum + att.fileSize, 0),
      byType: {} as Record<string, number>
    };

    attachments.forEach(att => {
      const type = att.fileType.split('/')[0] || 'unknown';
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Validar arquivo antes do upload
   */
  private validateFile(file: File): void {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande. Tamanho máximo: ${maxSize / 1024 / 1024}MB`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de arquivo não permitido: ${file.type}`);
    }
  }

  /**
   * Formatar tamanho do arquivo
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Obter ícone baseado no tipo do arquivo
   */
  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return 'mdi:image';
    if (fileType === 'application/pdf') return 'mdi:file-pdf';
    if (fileType.includes('word')) return 'mdi:file-word';
    if (fileType.includes('text')) return 'mdi:file-document';
    return 'mdi:file';
  }
}

export const attachmentsService = new AttachmentsService();
