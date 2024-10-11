import React, { useState, useRef } from 'react';
import './App.css';
import { toPng } from 'html-to-image';

function App() {
  const [image, setImage] = useState(null);
  const [position, setPosition] = useState({ top: 150, left: 100 });
  const [size, setSize] = useState({ width: 200, height: 200 });
  const tshirtRef = useRef(null); // Reference for the T-shirt container

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle design resizing
  const handleResize = (event) => {
    const { name, value } = event.target;
    setSize((prevSize) => ({ ...prevSize, [name]: parseInt(value, 10) }));
  };

  // Handle design repositioning
  const handlePositionChange = (event) => {
    const { name, value } = event.target;
    setPosition((prevPos) => ({ ...prevPos, [name]: parseInt(value, 10) }));
  };

  // Handle download of the T-shirt preview
  const handleDownload = () => {
    if (tshirtRef.current) {
      toPng(tshirtRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'tshirt_design_preview.png';
          link.click();
        })
        .catch((error) => {
          console.error('Oops, something went wrong!', error);
        });
    }
  };

  return (
    <div className="App">
      <h1>Custom T-shirt Design</h1>

      {/* Step 1: Upload Design */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Step 2: T-shirt mockup and design overlay */}
      <div className="tshirt-container" ref={tshirtRef}>
        <img src={process.env.PUBLIC_URL + "/tshirt_mockup.png"} alt="T-shirt" className="tshirt-image" />
        {image && (
          <img
            src={image}
            alt="Design preview"
            className="design-image"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${size.width}px`,
              height: `${size.height}px`,
            }}
          />
        )}
      </div>

      {/* Controls for resizing and repositioning */}
      {image && (
        <div className="controls">
          <div>
            <label>Width: </label>
            <input
              type="range"
              name="width"
              min="50"
              max="400"
              value={size.width}
              onChange={handleResize}
            />
          </div>
          <div>
            <label>Height: </label>
            <input
              type="range"
              name="height"
              min="50"
              max="400"
              value={size.height}
              onChange={handleResize}
            />
          </div>
          <div>
            <label>Top: </label>
            <input
              type="range"
              name="top"
              min="0"
              max="400"
              value={position.top}
              onChange={handlePositionChange}
            />
          </div>
          <div>
            <label>Left: </label>
            <input
              type="range"
              name="left"
              min="0"
              max="400"
              value={position.left}
              onChange={handlePositionChange}
            />
          </div>
        </div>
      )}

      {/* Step 3: Download button */}
      {image && (
        <button onClick={handleDownload} className="download-button">
          Download Preview
        </button>
      )}
    </div>
  );
}

export default App;
