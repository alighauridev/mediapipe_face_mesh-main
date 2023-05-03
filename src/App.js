import React, { useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import ImagePreview from "./pages/ImagePreview";
import VideoPreview from "./pages/VideoPreview";
import "./app.scss"
function App() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    setFile(event.target.files[0])
    navigate('/photo')
  };
  const navigate = useNavigate();
  const [file, setFile] = useState(null)
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    // Stop the video stream
    webcamRef.current.video.pause();
  };

  const retakePhoto = () => {
    setImage(null);
    // Start the video stream again
    if (webcamRef.current && webcamRef.current.video) {
      webcamRef.current.video.play();
    }
  };
  const handleImageUpload = (event) => {
    setFile(event.target.files[0])
    navigate('/photo')


  };

  const CameraPreview = () => {
    return (
      <div className="main__page">

        <div className="container">
          <div className="grid">
            <div className="item">
              <h2>GET STARTED!</h2>
              <p>By using 'Try It On,' I understand that L'Oreal USA, Inc. may process my image.</p>
              <p> (A) I consent to the scanning of my face and the processing of my image as described in the Virtual Try-On Information Notice and agree to all its terms, including as regards data retention, data deletion, and data use, processing, storage, and transfer; and (B) I am a US resident, and agree to the Terms of Use (which include an arbitration provision to resolve disputes) and all terms set forth therein.</p>
              <div className="btns">
                <button onClick={() => navigate('/video')}>CAPTURE IMAGE</button>
                <button onClick={handleButtonClick}>UPLOAD IMAGE</button>
                <div style={{ display: 'none' }}>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<CameraPreview />} />
        <Route path="/photo" element={<ImagePreview file={file} />} />
        <Route path="/video" element={<VideoPreview />} />
      </Routes>
    </>
  );
}

export default App;
