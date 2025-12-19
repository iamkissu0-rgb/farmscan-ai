import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Image, Zap, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';
import { cn } from '@/lib/utils';

export default function ScanPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    navigate('/processing', { state: { imageUrl: selectedImage } });
  };

  return (
    <MainLayout>
      <div className="min-h-full natural-gradient p-6 lg:p-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/home')}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Scan Cattle</h1>
              <p className="text-muted-foreground">Upload or capture an image</p>
            </div>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden",
              isDragging
                ? "border-primary bg-primary/10"
                : "border-border bg-card",
              selectedImage ? "p-0" : "p-12"
            )}
          >
            {selectedImage ? (
              <div className="relative aspect-[4/3]">
                <img
                  src={selectedImage}
                  alt="Selected cattle"
                  className="w-full h-full object-cover"
                />
                {/* Cattle Outline Guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-3/4 border-4 border-primary/50 rounded-3xl border-dashed" />
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 rounded-xl"
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Image className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Drag & Drop Image
                </h3>
                <p className="text-muted-foreground mb-6">
                  or click to browse your files
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="gap-2 rounded-xl px-6"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </Button>
                  <Button
                    onClick={() => {
                      // Try to access camera
                      if (fileInputRef.current) {
                        fileInputRef.current.setAttribute('capture', 'environment');
                        fileInputRef.current.click();
                      }
                    }}
                    className="gap-2 rounded-xl px-6"
                  >
                    <Camera className="w-5 h-5" />
                    Open Camera
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* Cattle Guide */}
          <div className="mt-8 p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="text-xl">📸</span>
              Photo Guidelines
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Side Angle</p>
                  <p className="text-sm text-muted-foreground">Capture from the side for accurate weight estimation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Good Lighting</p>
                  <p className="text-sm text-muted-foreground">Natural daylight works best</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Full Body</p>
                  <p className="text-sm text-muted-foreground">Include the entire animal in frame</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">4</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Clear Image</p>
                  <p className="text-sm text-muted-foreground">Avoid blurry or dark photos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          {selectedImage && (
            <div className="mt-8 text-center animate-fade-in-up">
              <Button
                onClick={handleAnalyze}
                size="lg"
                className="gap-3 px-12 py-6 text-lg rounded-2xl shadow-glow hover:shadow-soft-lg transition-all"
              >
                <Zap className="w-6 h-6" />
                Analyze with AI
              </Button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
