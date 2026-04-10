import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { getHazardLabel } from '@/components/hazard-accordion';
import { getEnergyLabel } from '@/components/energy-card';
const styles = StyleSheet.create({
    page: {
        // Aplicamos los márgenes "Estrecho"
        paddingTop: 54,
        paddingBottom: 54,
        paddingLeft: 18,
        paddingRight: 18,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
    },
    header: {
        position: 'absolute',
        top: 22,
        left: 18,
        right: 18,
        fontSize: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 22,
        left: 18,
        right: 18,
        fontSize: 10,
        textAlign: 'center',
    },
    //page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
    //header: { marginBottom: 20, borderBottom: 1, pb: 10 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { fontSize: 10, color: '#666' },
    section: { marginTop: 15, padding: 10, backgroundColor: '#f9fafb', borderRadius: 4 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, borderBottom: 0.5, borderColor: '#e5e7eb' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    field: { width: '45%', marginBottom: 5 },
    label: { color: '#6b7280', fontSize: 8 },
    value: { fontSize: 10, fontWeight: 'medium' },
    image: {
        maxWidth: 400,        // Limita el ancho máximo
        height: 'auto',       // Permite que la altura se ajuste proporcionalmente
        marginTop: 5,         // Reducimos el margen superior
        alignSelf: 'center',  // Centra la imagen
    },
    imageContainer: {
        marginTop: 5,
        marginBottom: 5,
        alignItems: 'center', // Centra el contenido
    },
    badge: { padding: 4, borderRadius: 4, color: 'white', marginTop: 5, textAlign: 'center', width: 60 },
    table: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#4b5563',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#004a7c',
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 6,
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#4b5563',
        minHeight: 35,
    },
    cell: {
        borderRightWidth: 0.5,
        borderColor: '#4b5563',
        padding: 4,
        //justifyContent: 'center',
        //alignItems: 'center',
        fontSize: 6,

        // ESTO CENTRA EL TEXTO:
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    // Colores de riesgo según tu imagen
    riskMedio: { backgroundColor: '#ffff00' },
    riskBajo: { backgroundColor: '#00b050', color: '#fff' },
    infoTable: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#000',
        marginBottom: 10,
    },
    headerBlue: {
        backgroundColor: '#004a7c',
        color: '#ffffff',
        textAlign: 'center',
        padding: 3,
        fontSize: 10,
        fontWeight: 'bold',
        borderBottomWidth: 0.5,
        borderColor: '#000',
    },
    infoRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#000',
    },
    infoCell: {
        padding: 4,
        borderRightWidth: 0.5,
        borderColor: '#000',
        flexDirection: 'row', // Para poner etiqueta y valor en la misma línea
        fontSize: 8,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 4,
    },
    value: {
        flex: 1,
    },
    energyTable: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#000',
        marginTop: 10,
    },
    energyColumn: {
        width: '16.66%', // 100% dividido entre 6 tipos de energía
        borderRightWidth: 0.5,
        borderColor: '#000',
    },
    energyHeader: {
        backgroundColor: '#004a7c',
        color: 'white',
        fontSize: 7,
        textAlign: 'center',
        padding: 2,
        borderBottomWidth: 0.5,
    },
    iconBox: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 0.5,
    },
    yesNoRow: {
        flexDirection: 'row',
        height: 15,
        borderBottomWidth: 0.5,
        alignItems: 'center',
    },
    yesNoLabel: {
        width: '60%',
        fontSize: 7,
        paddingLeft: 4,
        borderRightWidth: 0.5,
    },
    dotContainer: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    greenDot: {
        width: 6,
        height: 6,
        backgroundColor: '#22c55e',
        borderRadius: 3,
    },
    lockRow: {
        flexDirection: 'row',
        fontSize: 7,
        padding: 2,
        justifyContent: 'space-between',
    }
});
const getRiskColor = (hnr: number) => {
    if (hnr > 1000) return '#7f1d1d';     // Inaceptable (Rojo muy oscuro)
    if (hnr > 500) return '#b91c1c';      // Extremo (Rojo oscuro)
    if (hnr > 50) return '#ef4444';       // Muy alto (Rojo)
    if (hnr > 20) return '#f97316';       // Alto (Naranja)
    if (hnr > 10) return '#fdfd00';       // Medio (Amarillo)
    if (hnr > 5) return '#00af4f';        // Bajo (Verde)
    if (hnr > 1) return '#00af4f';        // Muy bajo (Verde claro)
    return '#00af4f';                     // Despreciable (Gris muy claro)
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
const HazardTable = ({ hazards }: { hazards: any[] }) => {
    console.log('Hazards:', hazards)
    // VALIDACIÓN EXTRA: Si no es un arreglo o está vacío, mostramos una fila de error limpia
    if (!hazards || !Array.isArray(hazards) || hazards.length === 0) {
        return (
            <View style={styles.table}>
                <View style={styles.row}>
                    <Text style={[styles.cell, { width: '100%' }]}>
                        No hay datos de peligros disponibles para generar la tabla.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.table}>
            {/* Encabezado azul oscuro */}
            <View style={[styles.row, { backgroundColor: '#004a7c' }]}>
                <Text style={[styles.cell, { width: '15%', color: 'white' }]}>Tipo</Text>
                <Text style={[styles.cell, { width: '15%', color: 'white' }]}>Origen</Text>
                <Text style={[styles.cell, { width: '10%', color: 'white' }]}>Frecuencia</Text>
                <Text style={[styles.cell, { width: '10%', color: 'white' }]}>Severidad</Text>
                <Text style={[styles.cell, { width: '10%', color: 'white' }]}>No Personas</Text>
                <Text style={[styles.cell, { width: '10%', color: 'white' }]}>Probabilidad</Text>
                <Text style={[styles.cell, { width: '10%', color: 'white' }]}>HRN</Text>
                <Text style={[styles.cell, { width: '20%', color: 'white' }]}>Riesgo</Text>
                <Text style={[styles.cell, { width: '40%', color: 'white' }]}>Acción</Text>
            </View>

            {/* Filas Dinámicas */}
            {hazards.map((hazard, index) => {
                // Cálculo basado en las 4 variables que manejas en tu formulario
                const hnrValue =
                    (Number(hazard.frequency) || 0) * (Number(hazard.severity) || 0) * (Number(hazard.numberOfPersons) || 0) * (Number(hazard.probability) || 0);
                return (
                    <View key={index} style={styles.row}>
                        <Text style={[styles.cell, { width: '15%' }]}>
                            {/* USAMOS LA FUNCIÓN AQUÍ */}
                            {getHazardLabel(hazard.type)}
                        </Text>
                        <Text style={[styles.cell, { width: '15%' }]}>{hazard.origin || '-'}</Text>
                        <Text style={[styles.cell, { width: '10%' }]}>{hazard.frequency}</Text>
                        <Text style={[styles.cell, { width: '10%' }]}>{hazard.severity}</Text>
                        <Text style={[styles.cell, { width: '10%' }]}>{hazard.numberOfPersons}</Text>
                        <Text style={[styles.cell, { width: '10%' }]}>{hazard.probability}</Text>
                        <Text style={[styles.cell, { width: '10%' }]}>{hnrValue.toFixed(0)}</Text>

                        <View style={[
                            styles.cell,
                            {
                                width: '20%',
                                backgroundColor: getRiskColor(hnrValue),
                            }
                        ]}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 7,
                                color: hnrValue > 5 && hnrValue <= 50 ? 'black' : 'white'
                            }}>
                                {getRiskText(hnrValue)}
                            </Text>
                        </View>
                        <Text style={[styles.cell, { width: '40%' }]}>{hazard.action}</Text>
                    </View>
                );
            })}
        </View>
    );
};
const EnergySection = ({ energies }: { energies: any[] }) => {
    return (
        <View style={styles.energyTable}>
            {/* Título Superior */}
            <Text style={[styles.headerBlue, { fontSize: 8 }]}>
                Energías Presentes en la Máquina, Herramienta y/o Equipo:
            </Text>

            <View style={{ flexDirection: 'row' }}>
                {energies.map((energy, index) => (
                    <View key={index} style={[
                        styles.energyColumn,
                        index === energies.length - 1 ? { borderRightWidth: 0 } : {}
                    ]}>
                        {/* Nombre de Energía */}
                        <Text style={styles.energyHeader}>{getEnergyLabel(energy.type)}</Text>

                        {/* Icono (Asegúrate de tener estas imágenes en public/icons/) */}
                        <View style={styles.iconBox}>
                            <Image
                                src={`/icons/${energy.type}.png`}
                                style={{ width: 35, height: 35 }}
                            />
                        </View>

                        {/* Selector Si / No */}
                        <View style={styles.yesNoRow}>
                            <Text style={styles.yesNoLabel}>Si</Text>
                            <View style={styles.dotContainer}>
                                {energy.present && <View style={styles.greenDot} />}
                            </View>
                        </View>
                        <View style={styles.yesNoRow}>
                            <Text style={styles.yesNoLabel}>No</Text>
                            <View style={styles.dotContainer}>
                                {!energy.present && <View style={styles.greenDot} />}
                            </View>
                        </View>

                        {/* Requiere Bloqueo */}
                        <View style={styles.lockRow}>
                            <Text style={{ fontSize: 6 }}>Req. Bloqueo</Text>
                            <Text style={{ fontWeight: 'bold' }}>
                                {energy.requiresLockout ? 'S' : 'N'}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};
export const RiskPdfDocument = ({ data, totalHNR }: { data: any, totalHNR: number }) => (
    <Document title={`Analisis_HRN_${data.machineName}`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.infoTable}>
                {/* Encabezado Principal */}
                <Text style={styles.headerBlue}>Análisis de Riesgo de Maquinaria y Equipo</Text>
                <Text style={[styles.headerBlue, { fontSize: 9 }]}>Método HRN</Text>

                {/* Fila 1: Máquina y Ubicación */}
                <View style={styles.infoRow}>
                    <View style={[styles.infoCell, { width: '70%' }]}>
                        <Text style={styles.label}>Máquina, Herramienta y/o Equipo:</Text>
                        <Text style={styles.value}>{data.machineName || '-'}</Text>
                    </View>
                    <View style={[styles.infoCell, { width: '30%', borderRightWidth: 0 }]}>
                        <Text style={styles.label}>Ubicación:</Text>
                        <Text style={styles.value}>{data.location || '-'}</Text>
                    </View>
                </View>

                {/* Fila 2: Serie, Lugar y Fecha */}
                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                    <View style={[styles.infoCell, { width: '45%' }]}>
                        <Text style={styles.label}>Número de Serie y/o Modelo:</Text>
                        <Text style={styles.value}>{data.serieModel || '-'}</Text>
                    </View>
                    <View style={[styles.infoCell, { width: '40%' }]}>
                        <Text style={styles.label}>Lugar de Evaluación:</Text>
                        <Text style={styles.value}>{data.evaluationLocation || '-'}</Text>
                    </View>
                    <View style={[styles.infoCell, { width: '15%', borderRightWidth: 0 }]}>
                        <Text style={styles.label}>Fecha:</Text>
                        <Text style={styles.value}>{data.date || '-'}</Text>
                    </View>
                </View>
            </View>

            {/* Info Máquina */}
            <View style={styles.imageContainer}>
                {data.machineImage && (
                    <Image
                        src={data.machineImage}
                        style={styles.image}
                    />
                )}
            </View>
            {/* Energías */}
            <EnergySection energies={data.energies} />
            <HazardTable hazards={data.hazards} />
        </Page>
    </Document>
);