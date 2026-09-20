import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUploadAvatar } from "./useUploadAvatar";
export function AvatarForm() {
    const cropSize = 280;
    const [image, setImage] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [editorError, setEditorError] = useState(null);
    const imageElement = useRef(null);
    const dragStart = useRef(null);
    const { submit, status, error, successMessage } = useUploadAvatar();
    const baseScale = image ? cropSize / Math.min(image.width, image.height) : 1;
    const scale = baseScale * zoom;
    useEffect(() => () => {
        if (image)
            URL.revokeObjectURL(image.url);
    }, [image]);
    function constrain(next, nextScale = scale) {
        if (!image)
            return next;
        const imageWidth = image.width * nextScale;
        const imageHeight = image.height * nextScale;
        return {
            x: Math.min(0, Math.max(cropSize - imageWidth, next.x)),
            y: Math.min(0, Math.max(cropSize - imageHeight, next.y)),
        };
    }
    function handleFileChange(event) {
        const file = event.target.files?.[0];
        if (!file || !file.type.startsWith("image/"))
            return;
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
        preview.onerror = () => URL.revokeObjectURL(url);
        preview.src = url;
    }
    function handleZoom(nextZoom) {
        if (!image)
            return;
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
    function handlePointerDown(event) {
        if (!image)
            return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStart.current = { x: event.clientX, y: event.clientY, position };
    }
    function handlePointerMove(event) {
        if (!dragStart.current)
            return;
        setPosition(constrain({
            x: dragStart.current.position.x + event.clientX - dragStart.current.x,
            y: dragStart.current.position.y + event.clientY - dragStart.current.y,
        }));
    }
    function createCroppedFile() {
        if (!image)
            return Promise.reject(new Error("Escolha uma imagem para continuar."));
        const canvas = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 400;
        const context = canvas.getContext("2d");
        if (!context)
            return Promise.reject(new Error("Não foi possível preparar a imagem."));
        if (!imageElement.current) {
            return Promise.reject(new Error("Não foi possível ler a imagem selecionada."));
        }
        context.drawImage(imageElement.current, -position.x / scale, -position.y / scale, cropSize / scale, cropSize / scale, 0, 0, 400, 400);
        return new Promise((resolve, reject) => canvas.toBlob((blob) => {
            if (!blob)
                return reject(new Error("Não foi possível gerar a imagem."));
            resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
        }, "image/jpeg", 0.92));
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await submit(await createCroppedFile());
        }
        catch (err) {
            setEditorError(err instanceof Error ? err.message : "Não foi possível preparar a imagem.");
        }
    }
    if (status === "success") {
        return (_jsxs("p", { className: "success-message", children: [successMessage ?? "Foto de perfil enviada com sucesso.", " ", _jsx(Link, { className: "text-link", to: "/", children: "Ir para a p\u00E1gina inicial" })] }));
    }
    return (_jsxs("form", { className: "form", onSubmit: handleSubmit, children: [_jsx("p", { className: "field-hint", children: "Escolha e ajuste a foto. Enviaremos apenas o recorte quadrado de 400 \u00D7 400 pixels." }), _jsx(Input, { id: "avatar", label: "Foto de perfil", type: "file", accept: "image/*", onChange: handleFileChange, required: true }), image && (_jsxs("div", { className: "avatar-editor", children: [_jsx("div", { "aria-label": "Arraste a imagem para ajustar o recorte", className: "avatar-cropper", onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: () => { dragStart.current = null; }, onPointerCancel: () => { dragStart.current = null; }, children: _jsx("img", { alt: "Pr\u00E9via do recorte do avatar", className: "avatar-cropper-image", draggable: false, ref: imageElement, src: image.url, style: {
                                width: image.width * scale,
                                height: image.height * scale,
                                transform: `translate(${position.x}px, ${position.y}px)`,
                            } }) }), _jsxs("label", { className: "avatar-zoom", htmlFor: "avatar-zoom", children: ["Zoom", _jsx("input", { id: "avatar-zoom", max: "3", min: "1", onChange: (event) => handleZoom(Number(event.target.value)), step: "0.01", type: "range", value: zoom })] }), _jsx("p", { className: "field-hint", children: "Arraste para reposicionar e use o controle para ampliar." })] })), (editorError || error) && _jsx("p", { className: "error-message", children: editorError || error }), _jsx(Button, { type: "submit", disabled: status === "loading" || !image, children: status === "loading" ? "Enviando..." : "Enviar foto" })] }));
}
