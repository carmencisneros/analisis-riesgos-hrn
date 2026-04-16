// components/DownloadImageButton.tsx
"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FileImage, Loader2 } from "lucide-react";
import { toPng } from 'html-to-image';
import { HRNImageReport } from './HRNImageReport';

export function DownloadImageButton({ formData }: { formData: any }) {
    const [isGenerating, setIsGenerating] = useState(false);

    // Referencia al componente oculto que vamos a capturar
    const reportRef = useRef<HTMLDivElement>(null);

    const downloadReportImage = async () => {
        if (!reportRef.current) return;
        setIsGenerating(true);

        try {
            const images = Array.from(reportRef.current.querySelectorAll('img'));

            // Filtramos solo las imágenes que cargaron correctamente
            const loadPromises = images.map(img => {
                return new Promise((resolve) => {
                    if (img.complete && img.naturalHeight !== 0) resolve(true);
                    img.onload = () => resolve(true);
                    img.onerror = () => {
                        // Si la imagen falla, la ocultamos para que no rompa el generador
                        img.style.display = 'none';
                        resolve(false);
                    };
                });
            });

            await Promise.all(loadPromises);
            await new Promise(r => setTimeout(r, 400));

            const dataUrl = await toPng(reportRef.current, {
                pixelRatio: 2,
                // Esta opción ayuda si hay problemas con imágenes externas
                cacheBust: true,
            });

            const link = document.createElement('a');
            link.download = `Reporte_HRN.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error("Error en la captura:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            {/* Botón visible para el usuario */}
            <Button
                variant="default"
                size="sm"
                onClick={downloadReportImage}
                disabled={isGenerating}
                className="bg-green-600 hover:bg-green-700"
            >
                {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                    <FileImage className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? "Generando Imagen..." : "Exportar Imagen"}
            </Button>

            {/* COMPONENTE OCULTO (fuera de la pantalla) PARA LA CAPTURA */}
            <div style={{ position: 'absolute', top: '-10000px', left: '-10000px' }}>
                <HRNImageReport ref={reportRef} data={formData} />
            </div>
        </>
    );
}