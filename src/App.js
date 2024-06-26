import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { drawConnectors } from "@mediapipe/drawing_utils";
import * as Facemesh from "@mediapipe/face_mesh";
function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#fbcfcb");
  const [faceMesh, setFaceMesh] = useState(null);
  const [display, setDisplay] = useState(true)
  const colors = [
    "#fbcfcb",
    "#df8a82",
    "#fa6c98",
    "#e28695",
    "#764537",
    "#9a5243",
    "#ac7560",
    "#bf877d",
    "#9f727b",
    "#d68671",
  ];
  function applyLipColor(canvasCtx, landmarks, color) {
    // Save the current canvas state
    canvasCtx.save();

    // Set the globalCompositeOperation property to "multiply"
    canvasCtx.globalCompositeOperation = "multiply";

    // Define the lip landmark indices
    const lipLandmarks = [
      61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17,
      84, 181, 91, 146, 61,
    ];

    for (let i = 0; i < lipLandmarks.length; i++) {
      const landmarkIndex = lipLandmarks[i];
      const landmark = landmarks[landmarkIndex];

      if (!landmark) {
        console.warn(`Landmark at index ${landmarkIndex} not found.`);
        continue;
      }

      const x = landmark.x * canvasCtx.canvas.width;
      const y = landmark.y * canvasCtx.canvas.height;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
    }
    canvasCtx.closePath();

    // Set the fillStyle to the selected color
    canvasCtx.fillStyle = color;
    canvasCtx.fill();

    // Restore the canvas state
    canvasCtx.restore();
  }

  const handleColorButtonClick = async (color) => {
    setSelectedColor(color);
    if (faceMesh) {
      setTimeout(async () => {
        await faceMesh.send({ image: webcamRef.current });
      }, 50);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      webcamRef.current.src = url;
      webcamRef.current.onload = async () => {
        if (faceMesh) {
          await faceMesh.send({ image: webcamRef.current });
        }
      };
    }
    setDisplay(false)

  };
  const onResults = useCallback(
    (results) => {
      console.log(selectedColor);
      const imageWidth = webcamRef.current.width;
      const imageHeight = webcamRef.current.height;
      canvasRef.current.width = imageWidth;
      canvasRef.current.height = imageHeight;

      const canvasElement = canvasRef.current;
      const canvasCtx = canvasElement.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          applyLipColor(canvasCtx, landmarks, selectedColor);
        }
      }

      canvasCtx.restore();
    },
    [selectedColor] // Add selectedColor as a dependency
  );

  useEffect(() => {
    const faceMeshInstance = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });

    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMeshInstance.onResults(onResults);
    setFaceMesh(faceMeshInstance);

    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null
    ) {
      webcamRef.current.onload = async () => {
        await faceMeshInstance.send({ image: webcamRef.current });
      };
    }
  }, []);
  useEffect(() => {
    if (faceMesh) {
      faceMesh.onResults(onResults);
    }
  }, [selectedColor, onResults, faceMesh, webcamRef.current, handleImageUpload]);

  return (
    <center>
      <div className="App" style={{ marginTop: 10 }}>
        {/* Update the onChange event to call handleImageUpload */}
        <>
          {
            display && <input type="file" accept="image/*" onChange={handleImageUpload} />

          }
        </>
        {/* Add a color picker input */}
        {/* Create buttons for each color in the list */}
        <div style={{ marginTop: 10 }}>
          {colors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleColorButtonClick(color)}
              style={{
                backgroundColor: color,
                width: 30,
                height: 30,
                marginRight: 5,
                border: selectedColor === color ? "2px solid black" : "none",
              }}
            ></button>
          ))}
        </div>
        {/* ... */}

        <img
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            top: 100,
            textAlign: "center",
            zindex: 9,
            minHeight: 480,
            maxHeight: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          className="output_canvas"
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            top: 100,
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            minHeight: 480,
            maxHeight: 480,
          }}
        ></canvas>
      </div>
    </center>
  );
}

export default App;
