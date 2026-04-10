"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { RiskPdfDocument } from "./risk-pdf-document";

const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

export function DownloadPdfButton({ formData, totalHNR }: { formData: any, totalHNR: number }) {
    const [ready, setReady] = useState(false);

    // Si no está listo, mostramos un botón normal que activa la preparación
    if (!ready) {
        return (
            <Button
                variant="default"
                size="sm"
                onClick={() => setReady(true)}
                className="bg-primary"
            >
                <FileDown className="h-4 w-4 mr-2" />
                Preparar Exportación
            </Button>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <PDFDownloadLink
                document={<RiskPdfDocument data={formData} totalHNR={totalHNR} />}
                fileName={`HRN_${formData.machineName || 'Reporte'}.pdf`}
            >
                {({ loading, error }) => (
                    <Button variant="default" size="sm" disabled={loading} className="bg-green-600">
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <FileDown className="h-4 w-4 mr-2" />
                        )}
                        {loading ? "Generando..." : "Descargar PDF Ahora"}
                    </Button>
                )}
            </PDFDownloadLink>
            {/* Botón para resetear y permitir cambios fluidos de nuevo */}
            <button
                onClick={() => setReady(false)}
                className="text-[10px] text-muted-foreground underline"
            >
                Seguir editando (mejora velocidad)
            </button>
        </div>
    );
}