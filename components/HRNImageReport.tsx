import React from 'react';
import { getHazardLabel } from '@/components/hazard-accordion';
import { getEnergyLabel } from '@/components/energy-card';

// Mantenemos la lógica de colores de tu PDF
const getRiskColor = (hnr: number) => {
    if (hnr > 1000) return '#7f1d1d';
    if (hnr > 500) return '#b91c1c';
    if (hnr > 50) return '#ef4444';
    if (hnr > 20) return '#f97316';
    if (hnr > 10) return '#fdfd00';
    return '#00af4f';
};

const getRiskText = (hnr: number) => {
    if (hnr > 1000) return 'Inaceptable';
    if (hnr > 500) return 'Extremo';
    if (hnr > 50) return 'Muy alto';
    if (hnr > 20) return 'Alto';
    if (hnr > 10) return 'Medio';
    if (hnr > 5) return 'Bajo';
    if (hnr > 1) return 'Muy bajo';
    return 'Despreciable';
};

export const HRNImageReport = React.forwardRef(({ data }: { data: any }, ref: React.Ref<HTMLDivElement>) => {
    if (!data) return null;

    return (
        <div ref={ref} className="w-[1000px] bg-white p-1 font-sans text-[11px] leading-tight text-black">
            {/* --- INFO MÁQUINA --- */}
            <div className="border-[0.5px] border-black mb-2">
                <div className="bg-[#004a7c] text-white text-center py-1 font-bold text-[14px] border-b-[0.5px] border-black">
                    Análisis de Riesgo de Maquinaria y Equipo
                </div>
                <div className="bg-[#004a7c] text-white text-center py-0.5 font-bold text-[12px] border-b-[0.5px] border-black">
                    Método HRN
                </div>
                <div className="grid grid-cols-[70%_30%] border-b-[0.5px] border-black">
                    <div className="p-1 border-r-[0.5px] border-black flex gap-2">
                        <span className="font-bold">Máquina:</span> {data.machineName || '-'}
                    </div>
                    <div className="p-1 flex gap-2">
                        <span className="font-bold">Ubicación:</span> {data.location || '-'}
                    </div>
                </div>
                <div className="grid grid-cols-[45%_40%_15%]">
                    <div className="p-1 border-r-[0.5px] border-black flex gap-2">
                        <span className="font-bold">Serie/Modelo:</span> {data.serieModel || '-'}
                    </div>
                    <div className="p-1 border-r-[0.5px] border-black flex gap-2">
                        <span className="font-bold">Lugar:</span> {data.evaluationLocation || '-'}
                    </div>
                    <div className="p-1 flex gap-2">
                        <span className="font-bold">Fecha:</span> {data.date || '-'}
                    </div>
                </div>
            </div>

            {/* --- IMAGEN DE LA MÁQUINA --- */}
            {data.machineImage && (
                <div className="flex justify-center mb-4 border border-black p-2">
                    <img src={data.machineImage} alt="Máquina" className="max-w-[500px] h-auto object-cover" />
                </div>
            )}

            {/* --- ENERGÍAS --- */}
            <div className="border-[2px] border-black mb-2 bg-white">
                <div className="bg-[#004a7c] text-white text-center py-1 font-bold text-[14px] border-b-[2px] border-black">
                    Energías Presentes en la Máquina, Herramienta y/o Equipo
                </div>
                <div className="flex">
                    {data.energies?.map((energy: any, i: number) => (
                        <div key={i} className="flex-1 border-r-[1px] border-black last:border-r-0 flex flex-col">
                            {/* Encabezado */}
                            <div className="bg-[#004a7c] text-white text-center py-0.5 text-[10px] border-b-[2px] border-black">
                                {getEnergyLabel(energy.type)}
                            </div>

                            {/* Bloque Central */}
                            <div className="flex h-16 border-b-[2px] border-black">
                                {/* Columna Izquierda (Icono) - Ancho 50% */}
                                <div className="w-1/2 flex items-center justify-center border-r-[2px] border-black bg-white">
                                    <img
                                        src={`/icons/${energy.type}.png`}
                                        className="w-10 h-10"
                                        alt=""
                                        crossOrigin="anonymous"
                                    />
                                </div>

                                {/* Columna Derecha (Estado) - Ancho 50% */}
                                <div className="w-1/2 flex flex-col text-[10px]">
                                    <div className="bg-[#004a7c] text-white text-center p-0.5 border-b-[2px] border-black">
                                        Presente
                                    </div>
                                    {/* Fila SI */}
                                    <div className="flex-1 flex items-center border-b-[2px] border-black">
                                        {/* Texto Si - Ancho 60% de la columna derecha (30% del total) */}
                                        <div className="w-3/5 border-r-[2px] border-black h-full flex items-center justify-center">Si</div>
                                        {/* Círculo - Ancho 40% de la columna derecha (20% del total) */}
                                        <div className="w-2/5 flex items-center justify-center h-full">
                                            {energy.present && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                                        </div>
                                    </div>
                                    {/* Fila NO */}
                                    <div className="flex-1 flex items-center">
                                        <div className="w-3/5 border-r-[2px] border-black h-full flex items-center justify-center">No</div>
                                        <div className="w-2/5 flex items-center justify-center h-full">
                                            {!energy.present && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer: Requiere Bloqueo ALINEADO --- */}
                            <div className="flex items-center text-[10px] font-bold h-6">
                                {/* Etiqueta - Debe sumar el ancho del Icono + Texto "Si/No" (50% + 30% = 80%) */}
                                <div className="w-[80%] border-r-[2px] border-black h-full flex items-center px-1.5">
                                    Requiere bloqueo
                                </div>
                                {/* Valor (S/N) - Debe ocupar el mismo ancho que el círculo verde (20%) */}
                                <div className="w-[20%] text-center h-full flex items-center justify-center">
                                    {energy.requiresLockout ? 'S' : 'N'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- PELIGROS --- */}
            <div className="border-[2px] border-black">
                <div className="bg-[#004a7c] text-white text-center py-1 font-bold text-[14px] border-b-[0.5px] border-black">
                    Identificación de Peligros y Evaluación de Riesgos
                </div>
                {/* Header Peligros */}
                <div className="grid grid-cols-[12%_13%_10%_10%_10%_10%_8%_12%_15%] bg-[#004a7c] text-white text-center font-bold text-[12px] border-b-[0.5px] border-black">
                    <div className="p-1 border-r border-black/30">Tipo</div>
                    <div className="p-1 border-r border-black/30">Origen</div>
                    <div className="p-1 border-r border-black/30">Frecuencia</div>
                    <div className="p-1 border-r border-black/30">Severidad</div>
                    <div className="p-1 border-r border-black/30">No Personas</div>
                    <div className="p-1 border-r border-black/30">Probabilidad</div>
                    <div className="p-1 border-r border-black/30">HNR</div>
                    <div className="p-1 border-r border-black/30">Riesgo</div>
                    <div className="p-1">Acción</div>
                </div>

                {data.hazards?.map((hazard: any, index: number) => {
                    const hnr = (parseFloat(hazard.frequency) || 0) * (parseFloat(hazard.severity) || 0) * (parseFloat(hazard.numberOfPersons) || 0) * (parseFloat(hazard.probability) || 0);
                    const isEvaluated = hnr > 0;
                    return (
                        <div key={index} className="grid grid-cols-[12%_13%_10%_10%_10%_10%_8%_12%_15%] text-center border-b-[2px] border-black last:border-b-0 min-h-[60px]">
                            {/* Celda Tipo con Título Azul */}
                            <div className="border-r-[2px] border-black flex flex-col">
                                <div className="bg-[#004a7c] text-white text-[10px] p-0.5 font-bold mb-auto">
                                    {getHazardLabel(hazard.type)}
                                </div>
                                <div className="flex-1 flex items-center justify-center p-1">
                                    <img src={`/icons/${hazard.type}.png`} className="w-10 h-10" alt="" />
                                </div>
                            </div>

                            <div className="p-1 border-r-[2px] border-black flex items-center justify-center text-[10px]">
                                {hazard.origin || '-'}
                            </div>

                            {/* Celdas Divididas */}
                            {[
                                { val: hazard.frequency, label: hazard.frequencyLabel },
                                { val: hazard.severity, label: hazard.severityLabel },
                                { val: hazard.numberOfPersons, label: hazard.personsLabel },
                                { val: hazard.probability, label: hazard.probabilityLabel }
                            ].map((param, i) => (
                                <div key={i} className="border-r border-black flex flex-col h-full bg-white overflow-hidden">
                                    {/* Parte Superior: Descripción */}
                                    <div className="flex-1 flex items-center justify-center p-1 text-[10px] leading-tight text-center">
                                        {param.label || '-'}
                                    </div>

                                    {/* Parte Inferior: "Valor" y Número */}
                                    {/* Agregamos una clase de utilidad para forzar el borde superior siempre */}
                                    <div
                                        className="flex w-full text-[10px] h-[18px] shrink-0"
                                        style={{ borderTop: '1px solid black' }} // Inline style para máxima prioridad
                                    >
                                        <div className="w-1/2 bg-gray-100 border-r border-black flex items-center justify-center font-medium">
                                            Valor
                                        </div>
                                        <div className="w-1/2 font-bold flex items-center justify-center">
                                            {param.val}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex items-center justify-center font-bold text-[10px] border-r-[2px] border-black">
                                {hnr > 0 && hnr < 1 ? hnr.toFixed(1) : hnr.toFixed(0)}
                            </div>

                            {/* Celda de Riesgo Condicionada */}
                            <div className="flex items-center justify-center font-bold text-[10px] border-r-[2px] border-black"
                                 style={{ backgroundColor: isEvaluated ? getRiskColor(hnr) : 'transparent' }}>
                                {isEvaluated ? getRiskText(hnr) : ''}
                            </div>

                            {/* Celda de Acción Condicionada */}
                            <div className="p-1 flex items-center justify-center text-[10px]"
                                 style={{ backgroundColor: isEvaluated ? getRiskColor(hnr) : 'transparent' }}>
                                {hazard.action || '-'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

HRNImageReport.displayName = 'HRNImageReport';