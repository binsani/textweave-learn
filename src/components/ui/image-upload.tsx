import { useState, useRef, useCallback } from 'react';
import { Upload, X, Crop, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  aspect?: number; // width/height ratio (1 for square, 16/9 for widescreen)
  className?: string;
  placeholder?: string;
  maxSize?: number; // in MB
}

interface CropState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export function ImageUpload({
  value,
  onChange,
  aspect = 1,
  className,
  placeholder = 'Upload image',
  maxSize = 5,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropState>({ x: 0, y: 0, scale: 1, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      setCrop({ x: 0, y: 0, scale: 1, rotation: 0 });
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  }, [maxSize]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - crop.x, y: e.clientY - crop.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCrop(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const applyCrop = useCallback(() => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const outputSize = 400;
    canvas.width = outputSize;
    canvas.height = outputSize / aspect;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((crop.rotation * Math.PI) / 180);
    ctx.scale(crop.scale, crop.scale);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    const img = imageRef.current;
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = canvas.width / canvas.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
    }

    offsetX = (canvas.width - drawWidth) / 2 + crop.x;
    offsetY = (canvas.height - drawHeight) / 2 + crop.y;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setPreview(dataUrl);
    onChange(dataUrl);
    setShowCropper(false);
  }, [crop, aspect, onChange]);

  const handleRemove = () => {
    setPreview(null);
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <>
      <div
        className={cn(
          'relative border-2 border-dashed border-border rounded-lg overflow-hidden transition-colors',
          'hover:border-primary/50 cursor-pointer',
          className
        )}
        style={{ aspectRatio: aspect }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  if (originalImage) {
                    setShowCropper(true);
                  } else {
                    inputRef.current?.click();
                  }
                }}
              >
                <Crop className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-2">
            <Upload className="h-8 w-8" />
            <span className="text-sm">{placeholder}</span>
            <span className="text-xs">or drag and drop</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      <Dialog open={showCropper} onOpenChange={setShowCropper}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adjust Image</DialogTitle>
          </DialogHeader>
          
          <div
            className="relative bg-muted rounded-lg overflow-hidden cursor-move"
            style={{ aspectRatio: aspect, minHeight: 300 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {originalImage && (
              <img
                ref={imageRef}
                src={originalImage}
                alt="Crop preview"
                className="absolute max-w-none select-none"
                style={{
                  transform: `translate(${crop.x}px, ${crop.y}px) scale(${crop.scale}) rotate(${crop.rotation}deg)`,
                  transformOrigin: 'center',
                  left: '50%',
                  top: '50%',
                  marginLeft: '-50%',
                  marginTop: '-50%',
                }}
                draggable={false}
              />
            )}
            <div className="absolute inset-0 border-2 border-primary/50 pointer-events-none" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <ZoomOut className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[crop.scale * 100]}
                min={50}
                max={200}
                step={1}
                onValueChange={([v]) => setCrop(prev => ({ ...prev, scale: v / 100 }))}
                className="flex-1"
              />
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCrop(prev => ({ ...prev, rotation: (prev.rotation + 90) % 360 }))}
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Rotate
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCropper(false)}>
              Cancel
            </Button>
            <Button onClick={applyCrop}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
