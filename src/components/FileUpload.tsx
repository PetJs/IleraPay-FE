import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  accept?: string;
  label: string;
}

export function FileUpload({
  onFileChange,
  accept = "image/*,.pdf",
  label,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    onFileChange(selectedFile);

    // Generate preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
      " " +
      sizes[i]
    );
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">{label}</Label>

      {!file ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            Images, PDFs up to 10MB
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4 bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              {preview ? (
                <img
                  src={preview}
                  alt="Receipt preview"
                  className="w-12 h-12 object-cover rounded border"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="flex-shrink-0 h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
    </div>
  );
}