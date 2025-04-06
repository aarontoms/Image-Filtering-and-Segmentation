# Image Processing & Segmentation Tool 🖼️

A powerful, intuitive web application for real-time image processing and segmentation, built with React, TypeScript, and OpenCV.js.

![App Screenshot](https://images.unsplash.com/photo-1633419461186-7d40a38105ec?auto=format&fit=crop&q=80&w=1200&h=600)

## ✨ Features

- 🎨 Real-time image processing
- 📊 Multiple filtering techniques
- 🔍 Advanced segmentation options
- 🌓 Beautiful dark mode interface
- 📱 Responsive design
- ⬇️ Processed image download
- 🖱️ Drag and drop support

## 🛠️ Processing Techniques

### Filtering
- **Gaussian Blur**: Smooths images while preserving edges
- **Median Filter**: Reduces noise while preserving edges
- **Canny Edge Detection**: Detects edges in images
- **Laplacian Spatial Filter**: Second-order edge detection

### Segmentation
- **Binary Thresholding**: Simple image segmentation
- **Otsu's Thresholding**: Automatic threshold selection
- **Morphological Cleaning**: Removes noise and smooths regions

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aarontoms/Image-Filtering-and-Segmentation.git
   ```

2. Navigate to the project directory:
   ```bash
   cd image-filtering-and-segmentation
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:5173
   ```

## 💡 Usage Guide

1. **Upload an Image**
   - Drag and drop an image onto the upload area
   - Or click the upload area to select an image from your device

2. **Select Processing Technique**
   - Choose from the available filtering or segmentation techniques
   - Each technique is optimized for different use cases

3. **Process the Image**
   - Click the "Process Image" button
   - View the results in real-time

4. **Download Results**
   - Click the "Download Processed Image" button to save the result
   - Images are saved in PNG format

## 🎨 Dark Mode

- Toggle between light and dark modes using the sun/moon icon
- Automatically defaults to dark mode
- Smooth transitions between themes
- Optimized contrast ratios for better visibility

## 🛠️ Built With

- [React](https://reactjs.org/) - UI Framework
- [TypeScript](https://www.typescriptlang.org/) - Type Safety
- [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html) - Image Processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## 📝 Technical Details

### Image Processing Implementation

The application uses OpenCV.js for all image processing operations. Each technique is implemented as follows:

```typescript
// Example: Gaussian Blur
cv.GaussianBlur(img, dst, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);

// Example: Canny Edge Detection
cv.cvtColor(img, img, cv.COLOR_RGBA2GRAY);
cv.Canny(img, dst, 50, 150, 3, false);
```

### Performance Considerations

- Automatic memory management for OpenCV.js matrices
- Efficient image processing using WebAssembly
- Responsive UI with loading states
- Optimized file handling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

