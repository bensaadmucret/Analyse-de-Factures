import React from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface InvoicePreviewProps {
  text: string;
}

export default function InvoicePreview({ text }: InvoicePreviewProps) {
  const handleDownload = async () => {
    const element = document.getElementById('invoice-preview');
    if (!element) return;

    try {
      const canvas = await html2canvas(element);
      const pdf = new jsPDF();
      
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 280);
      pdf.save('facture.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Aperçu de la facture</h3>
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger PDF
        </button>
      </div>
      
      <div
        id="invoice-preview"
        className="bg-white p-8 border rounded-lg shadow-sm"
      >
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900">FACTURE</h2>
          </div>
          
          <div className="whitespace-pre-wrap font-mono text-sm text-gray-600">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}