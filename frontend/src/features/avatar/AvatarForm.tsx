import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type PointerEvent,
} from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUploadAvatar } from "./useUploadAvatar";

export function AvatarForm() {
  const cropSize = 280;
  const [image, setImage] = useState<{ url: string; width: number; height: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [editorError, setEditorError] = useState<string | null>(null);
  const imageElement = useRef<HTMLImageElement>(null);
  const dragStart = useRef<{ x: number; y: number; position: { x: number; y: number } } | null>(null);
  const { submit, status, error, successMessage } = useUploadAvatar();

  const baseScale = image ? cropSize / Math.min(image.width, image.height) : 1;
  const scale = baseScale * zoom;

  useEffect(() => () => {
    if (image) URL.revokeObjectURL(image.url);
  }, [image]);

  function constrain(next: { x: number; y: number }, nextScale = scale) {
    if (!image) return next;
    const imageWidth = image.width * nextScale;
    const imageHeight = image.height * nextScale;
    return {
      x: Math.min(0, Math.max(cropSize - imageWidth, next.x)),
      y: Math.min(0, Math.max(cropSize - imageHeight, next.y)),
    };
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setEditorError(null);

    const url = URL.createObjectURL(file);
    const preview = new Image();
    preview.onload = () => {
      setImage({ url, width: preview.naturalWidth, height: preview.naturalHeight });
      const initialScale = cropSize / Math.min(preview.naturalWidth, preview.naturalHeight);
      setZoom(1);
      setPosition({
        x: (cropSize - preview.naturalWidth * initialScale) / 2,
        y: (cropSize - preview.naturalHeight * initialScale) / 2,
      });
    };
    preview.onerror = () => {
      URL.revokeObjectURL(url);
      setEditorError("Não foi possível abrir a imagem selecionada.");
    };
    preview.src = url;
  }

  function handleZoom(nextZoom: number) {
    if (!image) return;
    const nextScale = baseScale * nextZoom;
    const centerX = cropSize / 2;
    const centerY = cropSize / 2;
    const ratio = nextScale / scale;
    setPosition(constrain({
      x: centerX - (centerX - position.x) * ratio,
      y: centerY - (centerY - position.y) * ratio,
    }, nextScale));
    setZoom(nextZoom);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!image) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, y: event.clientY, position };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart.current) return;
    setPosition(constrain({
      x: dragStart.current.position.x + event.clientX - dragStart.current.x,
      y: dragStart.current.position.y + event.clientY - dragStart.current.y,
    }));
  }

  function createCroppedFile() {
    if (!image) return Promise.reject(new Error("Escolha uma imagem para continuar."));
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const context = canvas.getContext("2d");
    if (!context) return Promise.reject(new Error("Não foi possível preparar a imagem."));

    if (!imageElement.current) {
      return Promise.reject(new Error("Não foi possível ler a imagem selecionada."));
    }

    context.drawImage(
      imageElement.current,
      -position.x / scale,
      -position.y / scale,
      cropSize / scale,
      cropSize / scale,
      0,
      0,
      400,
      400,
    );

    return new Promise<File>((resolve, reject) => canvas.toBlob((blob) => {
      if (!blob) return reject(new Error("Não foi possível gerar a imagem."));
      resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
    }, "image/jpeg", 0.92));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      await submit(await createCroppedFile());
    } catch (err) {
      setEditorError(err instanceof Error ? err.message : "Não foi possível preparar a imagem.");
    }
  }

  if (status === "success") {
    return (
      <p className="success-message">
        {successMessage ?? "Foto de perfil enviada com sucesso."}{" "}
        <Link className="text-link" to="/">
          Ir para a página inicial
        </Link>
      </p>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p className="field-hint">
        Escolha e ajuste a foto. Enviaremos apenas o recorte quadrado de 400 × 400 pixels.
      </p>
      <Input
        id="avatar"
        label="Foto de perfil"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        required
      />

      {image && (
        <div className="avatar-editor">
          <div
            aria-label="Arraste a imagem para ajustar o recorte"
            className="avatar-cropper"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => { dragStart.current = null; }}
            onPointerCancel={() => { dragStart.current = null; }}
          >
            <img
              alt="Prévia do recorte do avatar"
              className="avatar-cropper-image"
              draggable={false}
              ref={imageElement}
              src={image.url}
              style={{
                width: image.width * scale,
                height: image.height * scale,
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            />
          </div>
          <label className="avatar-zoom" htmlFor="avatar-zoom">
            Zoom
            <input
              id="avatar-zoom"
              max="3"
              min="1"
              onChange={(event) => handleZoom(Number(event.target.value))}
              step="0.01"
              type="range"
              value={zoom}
            />
          </label>
          <p className="field-hint">Arraste para reposicionar e use o controle para ampliar.</p>
        </div>
      )}

      {(editorError || error) && <p className="error-message">{editorError || error}</p>}

      <Button type="submit" disabled={status === "loading" || !image}>
        {status === "loading" ? "Enviando..." : "Enviar foto"}
      </Button>
    </form>
  );
}
