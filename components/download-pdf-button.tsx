// components/download-pdf-button.tsx
"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { HRNImageReport } from './HRNImageReport';

export function DownloadPdfButton({ formData }: { formData: any }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    const downloadReportPdf = async () => {
        if (!reportRef.current) return;
        setIsGenerating(true);

        try {
            // 1. Esperar a que las imágenes carguen (misma lógica que el de imagen)
            const images = Array.from(reportRef.current.querySelectorAll('img'));
            const loadPromises = images.map(img => {
                return new Promise((resolve) => {
                    if (img.complete && img.naturalHeight !== 0) resolve(true);
                    img.onload = () => resolve(true);
                    img.onerror = () => {
                        img.style.display = 'none';
                        resolve(false);
                    };
                });
            });

            await Promise.all(loadPromises);
            await new Promise(r => setTimeout(r, 500)); // Tiempo extra para renderizado de fuentes

            // 2. Capturar el componente como imagen de alta resolución
            const dataUrl = await toPng(reportRef.current, {
                pixelRatio: 2, // Mantiene la nitidez en el PDF
                cacheBust: true,
            });

            // 3. Configurar jsPDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: 'a4'
            });

            // Calcular dimensiones para que quepa en un A4
            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // 4. Añadir imagen al PDF y descargar
            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Reporte_HRN_${formData.machineName || 'Maquina'}.pdf`);

        } catch (err) {
            console.error("Error generando PDF:", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <>
            <Button
                variant="default"
                size="sm"
                onClick={downloadReportPdf}
                disabled={isGenerating}
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                    <FileText className="h-4 w-4 mr-1" />
                )}
                {isGenerating ? "Generando PDF..." : "PDF"}
            </Button>

            {/* Renderizamos el componente oculto para la captura */}
            <div style={{ position: 'absolute', top: '-10000px', left: '-10000px', pointerEvents: 'none' }}>
                <HRNImageReport ref={reportRef} data={formData} />
            </div>
        </>
    );
}