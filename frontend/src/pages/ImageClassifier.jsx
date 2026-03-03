import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';
import HistoryTray from '../components/HistoryTray';
import ResultsPanel from '../components/ResultsPanel';

function App() {
  const [activeModel, setActiveModel] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('imageHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResults, setPredictionResults] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);

  const [currentImageFile, setCurrentImageFile] = useState(null);

  React.useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await fetch('http://localhost:8000/models');
      if (response.ok) {
        const data = await response.json();
        setAvailableModels(data);
        if (data.length > 0) {
          // Set the first model as active if none is selected
          setActiveModel(prev => {
            if (!prev || !data.find(m => m.id === prev)) {
              return data[0].id;
            }
            return prev;
          });
        }
      }
    } catch (error) {
      console.error("Failed to fetch models", error);
    }
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handlePredict = async () => {
    if (!currentImage || !currentImageFile) return;

    setIsPredicting(true);
    setPredictionResults(null);

    try {
      // Create FormData to send the file and model name
      const formData = new FormData();
      formData.append('file', currentImageFile);
      formData.append('model_name', activeModel);

      // Send to FastAPI backend
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Update results with backend response
      setPredictionResults(data.predictions);
    } catch (error) {
      console.error('Failed to predict class:', error);
      // Fallback or error display
      setPredictionResults([
        { label: `Error: ${error.message}`, confidence: 0 }
      ]);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setCurrentImage(base64String);
      setCurrentImageFile(file);

      setHistory((prev) => {
        // Prevent duplicate consecutive uploads from filling history
        if (prev.length > 0 && prev[0].url === base64String) return prev;

        const newHistory = [{ url: base64String, name: file.name }, ...prev];
        localStorage.setItem('imageHistory', JSON.stringify(newHistory));
        return newHistory;
      });
    };
    reader.readAsDataURL(file);
    setPredictionResults(null);
  };

  return (
    <div className="flex h-screen bg-[#0b0f19] text-white">
      {/* Sidebar */}
      <Sidebar
        activeModel={activeModel}
        setActiveModel={setActiveModel}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        availableModels={availableModels}
        fetchModels={fetchModels}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          activeModel={activeModel}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-full min-h-0">

            {/* Left Column: Upload */}
            <div className="flex-1 flex flex-col bg-[#0f172a] rounded-2xl border border-blue-500/20 overflow-hidden shadow-xl shadow-blue-900/10">
              <div className="p-4 border-b border-blue-500/20 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-blue-100">Image Analysis</h2>
                <button
                  onClick={handlePredict}
                  disabled={!currentImage || isPredicting}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-medium py-2 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2 text-sm"
                >
                  {isPredicting ? 'Analyzing...' : 'Predict Class'}
                </button>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                <ImageUploader
                  currentImage={currentImage}
                  onImageUpload={handleImageUpload}
                />

              </div>
            </div>

            {/* Right Column: Results */}
            <div className="lg:w-[400px] flex flex-col bg-[#0f172a] rounded-2xl border border-blue-500/20 overflow-hidden shadow-xl shadow-blue-900/10">
              <div className="p-4 border-b border-blue-500/20 bg-slate-800/50">
                <h2 className="text-lg font-semibold text-blue-100">Results</h2>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <ResultsPanel
                  isPredicting={isPredicting}
                  results={predictionResults}
                  activeModel={activeModel}
                />
              </div>
            </div>

          </div>
        </main>

        {/* Bottom History Tray */}
        <HistoryTray history={history.map(h => h.url)} onSelectImage={(url) => {
          const matchingItem = history.find(h => h.url === url);
          if (matchingItem) {
            setCurrentImage(matchingItem.url);
            // Reconstruct the file from Base64 so it can be uploaded to FastAPI again
            const newFile = dataURLtoFile(matchingItem.url, matchingItem.name || `history_image_${Date.now()}.png`);
            setCurrentImageFile(newFile);
            setPredictionResults(null);
          }
        }} />
      </div>
    </div>
  );
}

export default App;
