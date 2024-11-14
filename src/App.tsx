mport React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import FileUpload from './components/FileUpload';
import ProgressBar from './components/ProgressBar';
import TextEditor from './components/TextEditor';
import InvoicePreview from './components/InvoicePreview';
import { Scan, CheckCircle } from 'lucide-react';

function App() {
  const [extractedText, setExtractedText] = useState('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setStatus('Initialisation de l\'OCR...');
    setProgress(0);
    setError(null);

    // Créer un worker avec la langue française pré-configurée
    const worker = await createWorker('fra');

    try {
      worker.logger = (data) => {
        if (data.status === 'recognizing text') {
          setProgress(data.progress * 100);
          setStatus('Extraction du texte...');
        }
      };

      const { data: { text } } = await worker.recognize(file);
      
      if (!text) {
        throw new Error('Aucun texte n\'a été extrait de l\'image');
      }

      // Basic text cleanup
      const cleanedText = text
        .replace(/\s+/g, ' ')
        .trim();

      setExtractedText(cleanedText);
      setProgress(100);
      setStatus('Terminé!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue lors du traitement de l\'image';
      console.error('Error processing image:', err);
      setError(errorMessage);
      setStatus('Échec');
      setProgress(0);
    } finally {
      await worker.terminate();
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Analyse de Factures
            </h1>
            <p className="mt-2 text-gray-600">
              Convertissez vos factures manuscrites en format numérique
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* File Upload Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <FileUpload 
                onFileSelect={processImage}
                disabled={isProcessing}
              />
            </div>

            {/* Progress Section */}
            {isProcessing && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ProgressBar progress={progress} status={status} />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Results Section */}
            {extractedText && (
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <TextEditor 
                  text={extractedText} 
                  onTextChange={setExtractedText} 
                />
                
                <div className="border-t pt-6">
                  <InvoicePreview text={extractedText} />
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-3">
                <Scan className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Reconnaissance OCR
                </h3>
              </div>
              <p className="mt-2 text-gray-600">
                Extraction précise du texte à partir de vos factures manuscrites
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Nettoyage Automatique
                </h3>
              </div>
              <p className="mt-2 text-gray-600">
                Nettoyage automatique du texte pour des résultats optimaux
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;