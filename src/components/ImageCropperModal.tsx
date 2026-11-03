import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  Crop,
  RefreshCw,
  Move,
  Maximize2,
  AlertCircle,
} from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  /** Always pass the ORIGINAL uploaded image here so re-cropping stays sharp. */
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedDataUrl: string, meta: { width: number; height: number; ratio: number }) => void;
  /** Optional starting aspect ratio (defaults to 16:9) */
  initialRatio?: number;
}

type AspectRatioOption = {
  label: string;
  short: string;
  ratio: number | 'original';
};

const ASPECT_RATIOS: AspectRatioOption[] = [
  { label: '16:9 Banner (Recommended)', short: '16:9', ratio: 16 / 9 },
  { label: '21:9 Ultra-Wide', short: '21:9', ratio: 21 / 9 },
  { label: '4:3 Standard', short: '4:3', ratio: 4 / 3 },
  { label: '1:1 Square', short: '1:1', ratio: 1 },
  { label: 'Original', short: 'Auto', ratio: 'original' },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Pan / zoom / rotate cropper.
 *
 * The on-screen preview and the exported canvas use one single transform, so the
 * saved picture is pixel-for-pixel what the user framed (no stretching or odd
 * letterboxing). The visible frame always stays completely covered by the image.
 */
export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageUrl,
  onClose,
  onCropComplete,
  initialRatio = 16 / 9,
}) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ratioOption, setRatioOption] = useState<AspectRatioOption>(
    ASPECT_RATIOS.find((o) => o.ratio === initialRatio) || ASPECT_RATIOS[0]
  );
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [boxWidth, setBoxWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef({ pointerId: -1, startX: 0, startY: 0, originX: 0, originY: 0 });
  const pinchRef = useRef({ active: false, startDistance: 0, startZoom: 1 });
  const measuredRatioRef = useRef<number | null>(null);

  /* ------------------------------------------------------------------ */
  /* Reset everything whenever a new picture is opened                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isOpen) return;
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setLoadError(null);
    setIsSaving(false);
    measuredRatioRef.current = null;
    setRatioOption(ASPECT_RATIOS.find((o) => o.ratio === initialRatio) || ASPECT_RATIOS[0]);
  }, [isOpen, imageUrl, initialRatio]);

  const handleImageLoaded = () => {
    const img = imgRef.current;
    if (!img) return;
    setNatural({ w: img.naturalWidth, h: img.naturalHeight });
    setLoadError(null);
    if (measuredRatioRef.current === null && img.naturalWidth && img.naturalHeight) {
      measuredRatioRef.current = img.naturalWidth / img.naturalHeight;
    }
  };

  /* ------------------------------------------------------------------ */
  /* Track the frame width so the export math matches the preview        */
  /* ------------------------------------------------------------------ */
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const update = () => setBoxWidth(box.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(box);
    return () => ro.disconnect();
  }, [isOpen, ratioOption]);

  const activeRatio: number =
    ratioOption.ratio === 'original'
      ? measuredRatioRef.current || natural.w / (natural.h || 1) || 16 / 9
      : ratioOption.ratio;

  const boxHeight = boxWidth ? boxWidth / activeRatio : 0;

  /* Base "cover" scale: the image always fills the frame at zoom = 1 */
  const rotateSwap = rotation % 180 !== 0;
  const rotatedW = rotateSwap ? natural.h : natural.w;
  const rotatedH = rotateSwap ? natural.w : natural.h;
  const baseScale =
    boxWidth && boxHeight && rotatedW && rotatedH
      ? Math.max(boxWidth / rotatedW, boxHeight / rotatedH)
      : 1;
  const displayScale = baseScale * zoom;

  /* Keep the frame fully covered: limits how far the user can pan */
  const clampOffset = useCallback(
    (next: { x: number; y: number }, scale: number) => {
      if (!boxWidth || !boxHeight || !rotatedW || !rotatedH) return next;
      const drawnW = rotatedW * scale;
      const drawnH = rotatedH * scale;
      const maxX = Math.max(0, (drawnW - boxWidth) / 2);
      const maxY = Math.max(0, (drawnH - boxHeight) / 2);
      return {
        x: clamp(next.x, -maxX, maxX),
        y: clamp(next.y, -maxY, maxY),
      };
    },
    [boxWidth, boxHeight, rotatedW, rotatedH]
  );

  /* Re-clamp whenever the frame, zoom or rotation changes */
  useEffect(() => {
    setOffset((prev) => clampOffset(prev, displayScale));
  }, [clampOffset, displayScale, activeRatio]);

  /* ------------------------------------------------------------------ */
  /* Pointer interactions (mouse, touch, pen)                            */
  /* ------------------------------------------------------------------ */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    setIsDragging(true);
    dragRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || dragRef.current.pointerId !== e.pointerId) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setOffset(
      clampOffset(
        { x: dragRef.current.originX + dx, y: dragRef.current.originY + dy },
        displayScale
      )
    );
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (dragRef.current.pointerId === e.pointerId) dragRef.current.pointerId = -1;
  };

  /* Non-passive wheel listener so the page doesn't scroll while zooming */
  useEffect(() => {
    const box = boxRef.current;
    if (!box || !isOpen) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.06 : 0.06;
      setZoom((prev) => clamp(Number((prev + delta).toFixed(2)), 1, 4));
    };
    box.addEventListener('wheel', handler, { passive: false });
    return () => box.removeEventListener('wheel', handler);
  }, [isOpen]);

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 2) return;
    e.preventDefault();
    const [a, b] = [e.touches[0], e.touches[1]];
    const distance = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    if (!pinchRef.current.active) {
      pinchRef.current = { active: true, startDistance: distance, startZoom: zoom };
      return;
    }
    const factor = distance / (pinchRef.current.startDistance || distance);
    setZoom(clamp(Number((pinchRef.current.startZoom * factor).toFixed(2)), 1, 4));
  };

  const onTouchEnd = () => {
    pinchRef.current.active = false;
  };

  /* ------------------------------------------------------------------ */
  /* Control actions                                                     */
  /* ------------------------------------------------------------------ */
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    setOffset({ x: 0, y: 0 });
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  /* ------------------------------------------------------------------ */
  /* Export                                                             */
  /* ------------------------------------------------------------------ */
  const handleCropSave = () => {
    const img = imgRef.current;
    if (!img || !img.complete || !natural.w || !boxWidth) return;

    setIsSaving(true);
    try {
      // Source pixels covered by the frame (never upscale, cap for file size)
      const sourceWidth = boxWidth / displayScale;
      const outputWidth = Math.round(clamp(sourceWidth, 800, 1800));
      const outputHeight = Math.round(outputWidth / activeRatio);
      const k = outputWidth / boxWidth; // canvas px per on-screen px

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas is unavailable in this browser');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      // Same transform chain as the CSS preview, scaled by k
      ctx.save();
      ctx.translate(outputWidth / 2, outputHeight / 2);
      ctx.translate(offset.x * k, offset.y * k);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(displayScale * k, displayScale * k);
      ctx.drawImage(img, -natural.w / 2, -natural.h / 2, natural.w, natural.h);
      ctx.restore();

      const mime = 'image/jpeg';
      const croppedDataUrl = canvas.toDataURL(mime, 0.9);
      onCropComplete(croppedDataUrl, {
        width: outputWidth,
        height: outputHeight,
        ratio: activeRatio,
      });
      setIsSaving(false);
      onClose();
    } catch (err) {
      console.error('Failed to crop image:', err);
      setLoadError('Sorry, this picture could not be cropped. Try uploading another file.');
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const scaledW = natural.w * displayScale;
  const scaledH = natural.h * displayScale;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-zinc-900 text-white rounded-3xl shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-zinc-800 bg-zinc-950/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white">Crop &amp; Position Cover Photo</h3>
              <p className="text-[11px] text-zinc-400">
                Drag to pan, scroll or pinch to zoom, rotate — whatever you frame is exactly what gets saved.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close cropper"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
          {/* Aspect ratio pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {ASPECT_RATIOS.map((option) => {
              const isActive = ratioOption.short === option.short;
              return (
                <button
                  key={option.short}
                  type="button"
                  onClick={() => {
                    setRatioOption(option);
                    setOffset({ x: 0, y: 0 });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm font-semibold'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                  title={option.label}
                >
                  {option.short}
                </button>
              );
            })}
          </div>

          {/* Crop frame */}
          <div
            ref={boxRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative w-full mx-auto bg-black rounded-2xl overflow-hidden border-2 border-sky-500/60 cursor-grab active:cursor-grabbing select-none touch-none shadow-inner"
            style={{ aspectRatio: `${activeRatio}` }}
          >
            {imageUrl ? (
              <img
                ref={imgRef}
                src={imageUrl}
                alt="Crop preview"
                draggable={false}
                onLoad={handleImageLoaded}
                onError={() => setLoadError('This picture could not be loaded. Please try another file.')}
                className="absolute left-1/2 top-1/2 max-w-none pointer-events-none select-none"
                style={{
                  width: scaledW ? `${scaledW}px` : undefined,
                  height: scaledH ? `${scaledH}px` : undefined,
                  transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
                  transition: isDragging ? 'none' : 'transform 80ms ease-out',
                }}
              />
            ) : null}

            {!natural.w && !loadError && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">Loading photo...</div>
            )}

            {loadError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-red-300 px-6 text-center">
                <AlertCircle className="w-5 h-5" />
                <span>{loadError}</span>
              </div>
            )}

            {/* Rule-of-thirds guide */}
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>

            <div className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-medium text-zinc-300 pointer-events-none flex items-center gap-1">
              <Move className="w-3 h-3 text-sky-400" />
              <span>Drag to re-position</span>
            </div>

            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-zinc-300 pointer-events-none">
              {Math.round(boxWidth)} × {Math.round(boxHeight)} frame
            </div>
          </div>

          {/* Zoom */}
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setZoom((z) => clamp(Number((z - 0.1).toFixed(2)), 1, 4))}
              className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4 text-zinc-300" />
            </button>
            <input
              type="range"
              min="1"
              max="4"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
              aria-label="Zoom"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => clamp(Number((z + 0.1).toFixed(2)), 1, 4))}
              className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4 text-zinc-300" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="text-[11px] font-mono text-zinc-400 hover:text-white min-w-[44px] text-right cursor-pointer"
              title="Reset zoom to 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
          </div>

          {/* Extra controls */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
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
              onClick={() => {
                const original = ASPECT_RATIOS[ASPECT_RATIOS.length - 1];
                setRatioOption(original);
                setZoom(1);
                setRotation(0);
                setOffset({ x: 0, y: 0 });
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Fit the whole picture with its own aspect ratio"
            >
              <Maximize2 className="w-3.5 h-3.5 text-sky-400" />
              <span>Auto Fit</span>
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

          {natural.w > 0 && (
            <p className="text-center text-[10px] text-zinc-500 font-mono">
              Source {natural.w} × {natural.h}px · exporting ≈{' '}
              {Math.round(clamp(boxWidth / (displayScale || 1), 800, 1800))} ×{' '}
              {Math.round(clamp(boxWidth / (displayScale || 1), 800, 1800) / activeRatio)}px
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/80 shrink-0">
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
            disabled={!natural.w || !!loadError || isSaving}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Cropping...' : 'Apply Crop & Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
