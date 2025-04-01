import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download } from 'lucide-react';
import cv from '@techstark/opencv-js';

// Processing techniques
const TECHNIQUES = {
  FILTERING: {
    GAUSSIAN: 'Gaussian Blur',
    MEDIAN: 'Median Filter',
    CANNY: 'Canny Edge Detection',
    LAPLACIAN: 'Laplacian Spatial Filter'
  },
  SEGMENTATION: {
    BINARY: 'Binary Thresholding',
    OTSU: "Otsu's Thresholding",
    MORPHOLOGICAL: 'Morphological Cleaning'
  }
};

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.5.4/opencv.js';
    script.async = true;
    script.onload = () => {
      cv.onRuntimeInitialized = () => {
        console.log('OpenCV.js initialized');
      };
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (!dropZone) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('border-blue-500');
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('border-blue-500');
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('border-blue-500');

      const files = e.dataTransfer?.files;
      if (files && files[0]) {
        handleImageUpload(files[0]);
      }
    };

    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);

    return () => {
      dropZone.removeEventListener('dragover', handleDragOver);
      dropZone.removeEventListener('dragleave', handleDragLeave);
      dropZone.removeEventListener('drop', handleDrop);
    };
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!selectedImage || !selectedTechnique || !imageRef.current || !canvasRef.current) return;

    setIsProcessing(true);

    try {
      const img = cv.imread(imageRef.current);
      let dst = new cv.Mat();

      switch (selectedTechnique) {
        case TECHNIQUES.FILTERING.GAUSSIAN:
          cv.GaussianBlur(img, dst, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
          break;

        case TECHNIQUES.FILTERING.MEDIAN:
          cv.medianBlur(img, dst, 5);
          break;

        case TECHNIQUES.FILTERING.CANNY:
          cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY);
          cv.Canny(img, dst, 50, 150, 3, false);
          break;

        case TECHNIQUES.FILTERING.LAPLACIAN:
          cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY);
          cv.Laplacian(img, dst, cv.CV_8U, 1, 1, 0, cv.BORDER_DEFAULT);
          break;

        case TECHNIQUES.SEGMENTATION.BINARY:
          cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY);
          cv.threshold(img, dst, 127, 255, cv.THRESH_BINARY);
          break;

        case TECHNIQUES.SEGMENTATION.OTSU:
          cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY);
          cv.threshold(img, dst, 0, 255, cv.THRESH_BINARY + cv.THRESH_OTSU);
          break;

        case TECHNIQUES.SEGMENTATION.MORPHOLOGICAL:
          cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY);
          cv.threshold(img, dst, 127, 255, cv.THRESH_BINARY);
          const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
          cv.morphologyEx(dst, dst, cv.MORPH_OPEN, kernel);
          kernel.delete();
          break;
      }

      cv.imshow(canvasRef.current, dst);
      setProcessedImage(canvasRef.current.toDataURL());

      img.delete();
      dst.delete();
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'processed-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Image Processing & Segmentation
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div
              ref={dropZoneRef}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors duration-200 hover:border-blue-500 cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              {selectedImage ? (
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-64 mx-auto"
                  crossOrigin="anonymous"
                />
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-gray-500">
                    Drop your image here or click to upload
                  </p>
                </div>
              )}
              <input
                type="file"
                id="fileInput"
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
              />
            </div>

            {/* Technique Selection */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Select Technique
              </h2>
              
              <div className="space-y-2">
                <h3 className="font-medium text-gray-600">Filtering Techniques</h3>
                {Object.values(TECHNIQUES.FILTERING).map((technique) => (
                  <label
                    key={technique}
                    className="block"
                  >
                    <input
                      type="radio"
                      name="technique"
                      value={technique}
                      checked={selectedTechnique === technique}
                      onChange={(e) => setSelectedTechnique(e.target.value)}
                      className="mr-2"
                    />
                    {technique}
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-600">Segmentation Techniques</h3>
                {Object.values(TECHNIQUES.SEGMENTATION).map((technique) => (
                  <label
                    key={technique}
                    className="block"
                  >
                    <input
                      type="radio"
                      name="technique"
                      value={technique}
                      checked={selectedTechnique === technique}
                      onChange={(e) => setSelectedTechnique(e.target.value)}
                      className="mr-2"
                    />
                    {technique}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={processImage}
              disabled={!selectedImage || !selectedTechnique || isProcessing}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Process Image'}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="border-2 border-gray-300 rounded-lg p-8 min-h-[300px] flex items-center justify-center">
              {processedImage ? (
                <img
                  src={processedImage}
                  alt="Processed"
                  className="max-h-64"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4" />
                  <p>Processed image will appear here</p>
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>

            <button
              onClick={downloadImage}
              disabled={!processedImage}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Processed Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;