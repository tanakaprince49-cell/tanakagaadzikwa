import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Check, 
  Crop, 
  RefreshCw,
  Move,
  Maximize2
} from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string) => void;
}

type AspectRatioOption = {
  label: string;
  ratio: number; // width / height
};

const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: '16:9 Banner (Recommended)', ratio: 16 / 9 },
  { label: '21:9 Ultra-Wide', ratio: 21 / 9 },
  { label: '4:3 Standard', ratio: 4 / 3 },
  { label: '1:1 Square', ratio: 1 / 1 },
];

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageUrl,
  onClose,
  onCropComplete
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [aspectRatio, setAspectRatio] = useState<number>(ASPECT_RATIOS[0].ratio);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load image
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      setImageObj(img);
      setZoom(1);
      setRotation(0);
      setOffset({ x: 0, y: 0 });
    };
  }, [imageUrl]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  const handleCropSave = () => {
    if (!imageObj) return;

    // Output target dimensions based on chosen aspect ratio
    const outputWidth = 1200;
    const outputHeight = Math.round(1200 / aspectRatio);

    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    ctx.save();

    // Center point of output canvas
    ctx.translate(outputWidth / 2, outputHeight / 2);

    // Apply rotation
    ctx.rotate((rotation * Math.PI) / 180);

    // Calculate scale factor relative to container viewport
    const container = containerRef.current;
    const viewportWidth = container ? container.clientWidth : 600;
    const viewportHeight = viewportWidth / aspectRatio;

    const scale = (outputWidth / viewportWidth) * zoom;

    ctx.translate(offset.x * (outputWidth / viewportWidth), offset.y * (outputHeight / viewportHeight));
    ctx.scale(scale, scale);

    // Draw original image centered
    ctx.drawImage(
      imageObj,
      -imageObj.width / 2,
      -imageObj.height / 2,
      imageObj.width,
      imageObj.height
    );

    ctx.restore();

    // Convert to webp/jpg data url
    try {
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      onCropComplete(croppedDataUrl);
      onClose();
    } catch (err) {
      console.error('Failed to crop canvas image:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-zinc-900 text-white rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white">
                Crop &amp; Position Cover Photo
              </h3>
              <p className="text-[11px] text-zinc-400">
                Drag to pan, zoom in/out, and align your photo perfectly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Viewport */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4 flex flex-col justify-between">
          
          {/* Aspect Ratio Selector Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-400 font-medium mr-1 hidden sm:inline">
              Aspect Ratio:
            </span>
            {ASPECT_RATIOS.map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => {
                  setAspectRatio(option.ratio);
                  setOffset({ x: 0, y: 0 });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  aspectRatio === option.ratio
                    ? 'bg-sky-500 text-white shadow-xs font-semibold'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Interactive Drag & Crop Canvas Box */}
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            className="relative w-full mx-auto bg-black rounded-2xl overflow-hidden border-2 border-dashed border-sky-500/50 cursor-grab active:cursor-grabbing select-none shadow-inner flex items-center justify-center min-h-[220px] max-h-[360px]"
            style={{
              aspectRatio: `${aspectRatio}`,
            }}
          >
            {imageObj ? (
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <img 
                  src={imageUrl} 
                  alt="Crop Target" 
                  className="max-w-full max-h-full object-contain pointer-events-none"
                  draggable={false}
                />
              </div>
            ) : (
              <div className="text-xs text-zinc-500">Loading photo...</div>
            )}

            {/* Grid Overlay Guide */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-r border-b border-white/10" />
              <div className="border-b border-white/10" />
              <div className="border-r border-white/10" />
              <div className="border-r border-white/10" />
              <div />
            </div>

            {/* Drag helper overlay hint */}
            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-medium text-zinc-300 pointer-events-none flex items-center gap-1">
              <Move className="w-3 h-3 text-sky-400" />
              <span>Drag to re-position</span>
            </div>
          </div>

          {/* Controls Row */}
          <div className="space-y-3 pt-2">
            
            {/* Zoom Slider */}
            <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
              <ZoomOut className="w-4 h-4 text-zinc-400" />
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <ZoomIn className="w-4 h-4 text-zinc-400" />
              <span className="text-xs font-mono text-zinc-400 min-w-[40px] text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Extra Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRotate}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5 text-sky-400" />
                <span>Rotate 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reset View</span>
              </button>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-950/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleCropSave}
            className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all"
          >
            <Check className="w-4 h-4" />
            <span>Apply Crop &amp; Save</span>
          </button>
        </div>

      </div>
    </div>
  );
};
