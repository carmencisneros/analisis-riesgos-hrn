"use client";

import { useState, useEffect } from "react";
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

    // ESCUCHA DE CAMBIOS AUTOMÁTICA
    useEffect(() => {
        // Si el usuario escribe o cambia algo y el botón estaba en modo "Descargar",
        // lo reseteamos automáticamente para recuperar la velocidad.
        if (ready) {
            setReady(false);
        }
    }, [formData]); // Se dispara cada vez que el formulario cambia

    if (!ready) {
        return (
            <Button
                variant="default"
                size="sm"
                onClick={() => setReady(true)}
                className="bg-primary"
            >
                <FileDown className="h-4 w-4 mr-2" />
                Generar PDF
            </Button>
        );
    }

    return (
        <div className="flex flex-col items-center gap-1">
            <PDFDownloadLink
                document={<RiskPdfDocument data={formData} totalHNR={totalHNR} />}
                fileName={`HRN_${formData.machineName || 'Reporte'}.pdf`}
            >
                {({ loading }) => (
                    <Button variant="default" size="sm" disabled={loading} className="bg-green-600 hover:bg-green-700">
                        {loading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <FileDown className="h-4 w-4 mr-2" />
                        )}
                        {loading ? "Generando..." : "Descargar PDF"}
                    </Button>
                )}
            </PDFDownloadLink>

            {/* Texto informativo discreto */}
            <span className="text-[9px] text-muted-foreground italic">
                Cualquier cambio desactivará esta descarga para mantener la fluidez.
            </span>
        </div>
    );
}