
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { BoundingBox } from '../types';

interface DetectionCanvasProps {
  imageSrc: string;
  detections: BoundingBox[];
}

const DetectionCanvas: React.FC<DetectionCanvasProps> = ({ imageSrc, detections }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => setImageObj(img);
  }, [imageSrc]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imageObj) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculate scaling to fit image in container while maintaining aspect ratio
    const containerWidth = container.clientWidth;
    const scaleFactor = containerWidth / imageObj.naturalWidth;
    const displayHeight = imageObj.naturalHeight * scaleFactor;

    canvas.width = containerWidth;
    canvas.height = displayHeight;

    // Draw base image
    ctx.drawImage(imageObj, 0, 0, canvas.width, canvas.height);

    // Draw bounding boxes
    ctx.strokeStyle = '#22c55e'; // Green-500
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';

    detections.forEach(([x1, y1, x2, y2]) => {
      const width = (x2 - x1) * scaleFactor;
      const height = (y2 - y1) * scaleFactor;
      
      // Draw shadow for visibility
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 5;
      ctx.strokeRect(x1 * scaleFactor, y1 * scaleFactor, width, height);

      // Draw actual box
      ctx.strokeStyle = '#4ade80'; // Slightly brighter green
      ctx.lineWidth = 2;
      ctx.strokeRect(x1 * scaleFactor, y1 * scaleFactor, width, height);
      
      // Optional: highlight fill
      ctx.fillStyle = 'rgba(74, 222, 128, 0.15)';
      ctx.fillRect(x1 * scaleFactor, y1 * scaleFactor, width, height);
    });
  }, [imageObj, detections]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full relative rounded-xl overflow-hidden shadow-2xl bg-slate-900 flex items-center justify-center min-h-[300px]">
      {!imageObj && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm">Processing image...</p>
        </div>
      )}
      <canvas ref={canvasRef} className="max-w-full h-auto block" />
    </div>
  );
};

export default DetectionCanvas;
