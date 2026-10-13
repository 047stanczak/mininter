import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { ImageCropModal } from "./ImageCropModal";

interface PostImagePickerProps {
  value: File | null;
  onChange: (file: File | null) => void;
  addLabel?: string;
}

function PhotoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

export function PostImagePicker({ value, onChange, addLabel = "Foto" }: PostImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  function handleSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file && file.type.startsWith("image/")) setSelected(file);
  }

  return (
    <div className="image-picker">
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleSelect} />

      {previewUrl && (
        <div className="image-preview">
          <img src={previewUrl} alt="Prévia da imagem do post" />
        </div>
      )}

      <div className="image-picker-actions">
        <button type="button" className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
          <PhotoIcon />
          {value ? "Trocar foto" : addLabel}
        </button>
        {value && (
          <button type="button" className="btn btn-ghost" onClick={() => onChange(null)}>
            Remover
          </button>
        )}
      </div>

      {selected && (
        <ImageCropModal
          file={selected}
          onCancel={() => setSelected(null)}
          onConfirm={(cropped) => {
            onChange(cropped);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
