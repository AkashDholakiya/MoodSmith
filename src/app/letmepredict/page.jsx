"use client";

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

export default function Detect() {
  const videoRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [emotion, setEmotion] = useState('');
  const btnref = useRef(null);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

    });
  };



  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceExpressionNet.loadFromUri('/models');
      setInitialized(true);
    };

    loadModels();
    startVideo();

  }, []);

  useEffect(() => {
    if (initialized) {
      const videoElement = videoRef.current;

      const handlePlay = () => {
        const intervalId = setInterval(async () => {
          const detections = await faceapi.detectAllFaces(
            videoElement,
            new faceapi.TinyFaceDetectorOptions()
          ).withFaceExpressions();
          
          if (detections.length > 0) {
            const emotions = detections[0].expressions;
            const highestEmotion = Object.keys(emotions).reduce((a, b) =>
              emotions[a] > emotions[b] ? a : b
            );
            setEmotion(highestEmotion);
          }
        }, 1000);

        return () => clearInterval(intervalId);
      };

      videoElement.addEventListener('play', handlePlay);

      return () => {
        videoElement.removeEventListener('play', handlePlay);
      };
    }
  }, [initialized]);

  return (
    <div className="flex flex-col h-[90%] items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Emotion Detection</h1>
      <video
        ref={videoRef}
        width="640"
        height="480"
        autoPlay
        muted
        className="border-2 border-gray-300 rounded-lg shadow-lg -scale-x-100"
      ></video>
      <p className="text-2xl font-semibold mt-4">
        Detected Emotion: <span className="text-blue-500">{emotion}</span>
      </p>
    </div>
  );
}
