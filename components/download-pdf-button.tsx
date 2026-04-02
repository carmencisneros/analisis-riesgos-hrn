"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { RiskPdfDocument } from "./risk-pdf-document";

// Importación dinámica para evitar errores de SSR
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

export function DownloadPdfButton({ formData, totalHNR }: { formData: any, totalHNR: number }) {
    return (
        <PDFDownloadLink
            document={<RiskPdfDocument data={formData} totalHNR={totalHNR} />}
            fileName={`HRN_${formData.machineName || 'Reporte'}.pdf`}
        >
            {({ loading }) => (
                <Button variant="default" size="sm" disabled={loading} className="bg-primary">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <FileDown className="h-4 w-4 mr-2" />
                    )}
                    {loading ? "Preparando..." : "Exportar PDF"}
                </Button>
            )}
        </PDFDownloadLink>
    );
}