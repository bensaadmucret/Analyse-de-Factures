import React, { useState, useEffect } from 'react';
import { createWorker, Worker } from 'tesseract.js';
import FileUpload from './components/FileUpload';
import ProgressBar from './components/ProgressBar';
import TextEditor from './components/TextEditor';
import InvoicePreview from './components/InvoicePreview';
import { Scan, CheckCircle } from 'lucide-react';

function App() {
  // Définition d'un état pour le worker qui sera réutilisé
  const [worker, setWorker] = useState<Worker | null>(null);
  const [extractedText, setExtractedText] = useState('');
  const [ocrStatus, setOcrStatus] = useState({
    isProcessing: false,
    progress: 0,
    status: '',
    error: null as string | null,
  });

  // Initialisation du worker avec un effet, pour éviter de le recréer à chaque requête
  useEffect(() => {
    const initWorker = async () => {
      const newWorker = await createWorker({ langPath: 'fra' });
      setWorker(newWorker);
    };
    initWorker();

    // Terminaison du worker au démontage du composant
    return () => {
      worker?.terminate();
    };
  }, []);

  const processImage = async (file: File) => {
    if (!worker) return;

    // Mise à jour de l'état pour démarrer le traitement
    setOcrStatus({
      isProcessing: true,
      progress: 0,
      status: "Initialisation de l'OCR...",
      error: null,
    });

    try {
      // Configuration du logger pour la progression
      worker.logger = (data) => {
        if (data.status === 'recognizing text') {
          setOcrStatus((prev) => ({
            ...prev,
            progress: data.progress * 100,
            status: 'Extraction du texte...',
          }));
        }
      };

      const { data: { text } } = await worker.recognize(file);

      if (!text) {
        throw new Error("Aucun texte n'a été extrait de l'image");
      }

      // Nettoyage du texte extrait
      const cleanedText = text.replace(/\s+/g, ' ').replace(/[^\w\s.,]/g, '').trim();
      setExtractedText(cleanedText);

      // Mise à jour de l'état pour marquer la fin du traitement
      setOcrStatus({
        isProcessing: false,
        progress: 100,
        status: 'Terminé!',
        error: null,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors du traitement de l'image";
      console.error('Error processing image:', err);

      // Mise à jour de l'état en cas d'erreur
      setOcrStatus({
        isProcessing: false,
        progress: 0,
        status: 'Échec',
        error: errorMessage,
      });
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
                disabled={ocrStatus.isProcessing}
              />
            </div>

            {/* Progress Section */}
            {ocrStatus.isProcessing && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <ProgressBar progress={ocrStatus.progress} status={ocrStatus.status} />
              </div>
            )}

            {/* Error Message */}
            {ocrStatus.error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{ocrStatus.error}</p>
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
