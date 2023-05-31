import { FaceMesh } from "@mediapipe/face_mesh";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { drawConnectors } from "@mediapipe/drawing_utils";
import * as Facemesh from "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import cross from "../assets/close.png"
import { useNavigate } from "react-router-dom";
function VideoPreview() {
    const mainImgRef = useRef(null);
    const canvasRef = useRef(null);
    const webcamRef = useRef(null);
    const [image, setImage] = useState(null);
    const [selectedColor, setSelectedColor] = useState("#fbcfcb");
    const [faceMesh, setFaceMesh] = useState(null);
    const [display, setDisplay] = useState(true);
    const navigate = useNavigate()
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
    function hexToRgba(hex, alpha) {
        const bigint = parseInt(hex.substring(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
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
        const rgbaColor = hexToRgba(color, 0.7);
        canvasCtx.fillStyle = rgbaColor;
        canvasCtx.fill();

        // Restore the canvas state
        canvasCtx.restore();
    }

    const handleColorButtonClick = async (color) => {
        setSelectedColor(color);
        if (faceMesh) {
            setTimeout(async () => {
                await faceMesh.send({ image: mainImgRef.current });
            }, 50);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        console.log(file);
        if (file) {
            const url = URL.createObjectURL(file);
            mainImgRef.current.src = url;
            mainImgRef.current.onload = async () => {
                if (faceMesh) {
                    await faceMesh.send({ image: mainImgRef.current });
                }
            };
        }
        setDisplay(false);
    };
    const capture = async () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);

        // Convert dataURL to Blob
        const response = await fetch(imageSrc);
        const blob = await response.blob();

        // Create object URL from Blob
        const url = URL.createObjectURL(blob);
        mainImgRef.current.src = url;
        mainImgRef.current.onload = async () => {
            if (faceMesh) {
                await faceMesh.send({ image: mainImgRef.current });
            }
        };

        // Stop the video stream if webcamRef.current exists
        if (webcamRef.current) {
            webcamRef.current.video.pause();
        }
    };



    const retakePhoto = () => {
        setImage(null);
        // Start the video stream again
        mainImgRef.current.src = null
        if (webcamRef.current && webcamRef.current.video) {
            webcamRef.current.video.play();
        }
    };
    const onResults = useCallback(
        (results) => {
            console.log(selectedColor);
            const imageWidth = mainImgRef.current.width;
            const imageHeight = mainImgRef.current.height;
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
            typeof mainImgRef.current !== "undefined" &&
            mainImgRef.current !== null
        ) {
            mainImgRef.current.onload = async () => {
                await faceMeshInstance.send({ image: mainImgRef.current });
            };
        }
    }, []);
    useEffect(() => {
        if (faceMesh) {
            faceMesh.onResults(onResults);
        }
    }, [
        selectedColor,
        onResults,
        faceMesh,
        mainImgRef.current,
        handleImageUpload,
        capture
    ]);

    return (

        <div className="image__capture__" >

            <div className="container">
                <div className="grid">
                    {!image ? (
                        <div className="item">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"

                            />
                            <div className="btns">
                                <button onClick={capture}>Capture photo</button>

                            </div>
                        </div>
                    ) : (
                        <div className="item">
                            <div className="top">
                                {
                                    image !== null ? <>
                                        <img
                                            ref={mainImgRef}
                                            style={{
                                                position: 'absolute',
                                                marginLeft: 'auto',
                                                marginRight: 'auto',
                                                left: '50%',
                                                right: '0px',
                                                top: '0px',
                                                textAlign: 'center',
                                                minHeight: '480px',
                                                maxHeight: '480px',
                                                opacity: '1',
                                                transform: 'translateX(-50%) rotateY(180deg)',
                                                filter: 'brightness(1.2) saturate(1.1)'
                                            }}
                                        />    <canvas
                                            ref={canvasRef}
                                            className="output_canvas"
                                            style={{
                                                position: 'absolute',
                                                marginLeft: 'auto',
                                                marginRight: 'auto',
                                                top: '0',
                                                left: '0px',
                                                right: '0px',
                                                textAlign: 'center',
                                                minHeight: '480px',
                                                maxHeight: '480px',
                                                height: '100%',
                                                width: '100%'
                                            }}
                                        ></canvas>
                                        <img src={cross} onClick={() => navigate('/')} className="cross" alt="" />
                                    </> : null
                                }
                            </div>

                            <div className="btns">
                                <button onClick={retakePhoto}>Take another photo</button>
                            </div>
                        </div>
                    )}
                </div>
                {/* Create buttons for each color in the list */}
                <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px'
                }}>
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
            </div>



        </div>


    );
}

export default VideoPreview;
