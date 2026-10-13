import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Modal } from "@/components/ui/Modal";

type Format = "square" | "portrait";

const FORMATS: Record<Format, { label: string; width: number; height: number }> = {
  square: { label: "Quadrada 1:1", width: 1080, height: 1080 },
  portrait: { label: "Retrato 4:5", width: 1080, height: 1350 },
};

const CROP_WIDTH = 300;
const KEY_STEP = 10;

interface ImageCropModalProps {
  file: File;
  onConfirm: (file: File) => void;
  onCancel: () => void;
}

export function ImageCropModal({ file, onConfirm, onCancel }: ImageCropModalProps) {
  const [format, setFormat] = useState<Format>("square");
  const [image, setImage] = useState<{ url: string; width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string | null>(null);
  const imageElement = useRef<HTMLImageElement>(null);
  const dragStart = useRef<{ x: number; y: number; position: { x: number; y: number } } | null>(null);

  const target = FORMATS[format];
  const cropWidth = CROP_WIDTH;
  const cropHeight = Math.round((CROP_WIDTH * target.height) / target.width);
  const baseScale = image ? Math.max(cropWidth / image.width, cropHeight / image.height) : 1;
  const scale = baseScale * zoom;

  useEffect(() => {
    let cancelled = false;
    const url = URL.createObjectURL(file);
    const preview = new Image();
    preview.onload = () => {
      if (!cancelled) setImage({ url, width: preview.naturalWidth, height: preview.naturalHeight });
    };
    preview.onerror = () => {
      if (!cancelled) setError("Não foi possível abrir a imagem selecionada.");
    };
    preview.src = url;

    return () => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    if (!image) return;
    const initialScale = Math.max(cropWidth / image.width, cropHeight / image.height);
    setZoom(1);
    setPosition({
      x: (cropWidth - image.width * initialScale) / 2,
      y: (cropHeight - image.height * initialScale) / 2,
    });
  }, [image, cropWidth, cropHeight]);

  function constrain(next: { x: number; y: number }, nextScale = scale) {
    if (!image) return next;
    return {
      x: Math.min(0, Math.max(cropWidth - image.width * nextScale, next.x)),
      y: Math.min(0, Math.max(cropHeight - image.height * nextScale, next.y)),
    };
  }

  function handleZoom(nextZoom: number) {
    if (!image) return;
    const nextScale = baseScale * nextZoom;
    const ratio = nextScale / scale;
    const centerX = cropWidth / 2;
    const centerY = cropHeight / 2;
    setPosition(
      constrain(
        {
          x: centerX - (centerX - position.x) * ratio,
          y: centerY - (centerY - position.y) * ratio,
        },
        nextScale,
      ),
    );
    setZoom(nextZoom);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!image) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY, position };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return;
    setPosition(
      constrain({
        x: dragStart.current.position.x + event.clientX - dragStart.current.x,
        y: dragStart.current.position.y + event.clientY - dragStart.current.y,
      }),
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0],
      ArrowRight: [KEY_STEP, 0],
      ArrowUp: [0, -KEY_STEP],
      ArrowDown: [0, KEY_STEP],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setPosition(constrain({ x: position.x + move[0], y: position.y + move[1] }));
  }

  function handleConfirm() {
    if (!image || !imageElement.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = target.width;
    canvas.height = target.height;
    const context = canvas.getContext("2d");
    if (!context) {
      setError("Não foi possível preparar a imagem.");
      return;
    }

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      imageElement.current,
      -position.x / scale,
      -position.y / scale,
      cropWidth / scale,
      cropHeight / scale,
      0,
      0,
      target.width,
      target.height,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("Não foi possível gerar a imagem.");
          return;
        }
        onConfirm(new File([blob], "post.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9,
    );
  }

  return (
    <Modal title="Ajustar foto" onClose={onCancel}>
      <div className="crop-body">
        <div className="segmented" role="group" aria-label="Formato da foto">
          {(Object.keys(FORMATS) as Format[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={format === key}
              className={format === key ? "segmented-item is-active" : "segmented-item"}
              onClick={() => setFormat(key)}
            >
              {FORMATS[key].label}
            </button>
          ))}
        </div>

        <div
          className="crop-area"
          style={{ width: cropWidth, height: cropHeight }}
          tabIndex={0}
          role="group"
          aria-label="Área de recorte. Arraste ou use as setas do teclado para reposicionar a imagem."
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={() => {
            dragStart.current = null;
          }}
          onPointerCancel={() => {
            dragStart.current = null;
          }}
          onKeyDown={handleKeyDown}
        >
          {image && (
            <img
              ref={imageElement}
              className="crop-image"
              src={image.url}
              alt="Prévia do recorte"
              draggable={false}
              style={{
                width: image.width * scale,
                height: image.height * scale,
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            />
          )}
        </div>

        <label className="crop-zoom" htmlFor="crop-zoom">
          Zoom
          <input
            id="crop-zoom"
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(event) => handleZoom(Number(event.target.value))}
          />
        </label>
        <p className="field-hint">
          Arraste para reposicionar. A foto será enviada em {target.width} × {target.height}.
        </p>

        {error && <p className="error-message" role="alert">{error}</p>}
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="button" className="btn" onClick={handleConfirm} disabled={!image}>
          Usar foto
        </button>
      </div>
    </Modal>
  );
}
