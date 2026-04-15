import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { getHazardLabel } from '@/components/hazard-accordion';
import { getEnergyLabel } from '@/components/energy-card';

const styles = StyleSheet.create({
    page: {
        paddingTop: 54,
        paddingBottom: 54,
        paddingLeft: 18,
        paddingRight: 18,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Helvetica',
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
    // --- ESTILOS INFO MÁQUINA ---
    infoTable: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#000',
        marginBottom: 5,
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
        flexDirection: 'row',
        fontSize: 8,
    },
    label: { fontWeight: 'bold', marginRight: 4 },
    value: { flex: 1 },

    // --- ESTILOS IMAGEN ---
    imageContainer: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center', // Centrado horizontal
        justifyContent: 'center', // Centrado vertical (si la imagen es más pequeña)
    },
    image: {
        // DEFINIR TAMAÑO ESTÁNDAR AQUÍ (en puntos PDF)
        width: 350,           // Ancho fijo
        height: 200,          // Alto fijo (crea un rectángulo estándar)

        // LA CLAVE: objectFit cover
        // Recorta la imagen para llenar el recuadro sin deformarla
        objectFit: 'cover',

        alignSelf: 'center',
        borderWidth: 1,       // Opcional: un borde fino para delimitar
        borderColor: '#000',
    },

    // --- ESTILOS TABLA ENERGÍAS (DISEÑO DOBLE COLUMNA) ---
    energyTable: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#000',
        marginTop: 5,
    },
    energyBlock: {
        width: '16.66%',
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
    contentRow: { flexDirection: 'row', height: 45 },
    iconColumn: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: '#000',
    },
    statusColumn: { width: '50%' },
    statusHeader: {
        backgroundColor: '#004a7c',
        color: 'white',
        fontSize: 5,
        textAlign: 'center',
        padding: 1,
        borderBottomWidth: 0.5,
    },
    optionRow: {
        flexDirection: 'row',
        flex: 1,
        borderBottomWidth: 0.5,
        borderColor: '#000',
        alignItems: 'center',
    },
    optionText: {
        width: '60%',
        fontSize: 7,
        textAlign: 'center',
        borderRightWidth: 0.5,
        borderColor: '#000',
        height: '100%',
        justifyContent: 'center',
        display: 'flex',
        paddingTop: 2,
    },
    dotBox: { width: '40%', justifyContent: 'center', alignItems: 'center' },
    greenDot: { width: 6, height: 6, backgroundColor: '#22c55e', borderRadius: 3 },
    footerRow: { flexDirection: 'row', height: 12, alignItems: 'center' },
    footerLabel: { width: '80%', fontSize: 6, paddingLeft: 3, borderRightWidth: 0.5, borderColor: '#000' },
    footerValue: { width: '20%', fontSize: 7, textAlign: 'center', fontWeight: 'bold' },

    // --- ESTILOS TABLA RIESGOS ---
    table: {
        width: '100%',
        borderWidth: 0.5,
        borderColor: '#000',
        marginTop: 5,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#004a7c',
        minHeight: 20,
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#000',
        minHeight: 50, // Aumentamos la altura para las subdivisiones
    },
    cell: {
        borderRightWidth: 0.5,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        display: 'flex',
    },
    // Celda con subdivisiones internas (Frec, Sev, Pers, Prob)
    splitCell: {
        width: '10%',
        borderRightWidth: 0.5,
        borderColor: '#000',
        flexDirection: 'column',
    },
    upperPart: {
        flex: 1,
        justifyContent: 'center',
        padding: 2,
        fontSize: 6,
    },
    lowerPart: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderColor: '#000',
        height: 12,
    },
    lowerLabel: {
        width: '50%',
        fontSize: 5,
        backgroundColor: '#f3f4f6',
        borderRightWidth: 0.5,
        borderColor: '#000',
        textAlign: 'center',
        paddingTop: 2,
    },
    lowerValue: {
        width: '50%',
        fontSize: 6,
        textAlign: 'center',
        paddingTop: 2,
        fontWeight: 'bold',
    },
    hazardIcon: {
        width: 32,
        height: 32,
        marginBottom: 0,
    },
    imageCell: {
        width: '12%',             // Mantener el ancho porcentual que definimos
        borderRightWidth: 0.5,
        borderColor: '#4b5563',
        padding: 0,                // ELIMINAR PADDING DE LA CELDA

        // Flexbox para centrado total:
        display: 'flex',
        justifyContent: 'center',  // Centrado Vertical
        alignItems: 'center',      // Centrado Horizontal
        textAlign: 'center',

        // Asegúrate de que la fila contenedora (.row) tenga minHeight suficiente
    },

    // Estilo para la imagen misma
    hazardImage: {
        width: 35,                 // Tamaño exacto solicitado
        height: 35,                // Tamaño exacto solicitado
        margin: 0,                 // ELIMINAR MÁRGENES
        alignSelf: 'center',       // Refuerzo de centrado horizontal
    },
});

const getRiskColor = (hnr: number) => {
    if (hnr > 1000) return '#7f1d1d';
    if (hnr > 500) return '#b91c1c';
    if (hnr > 50) return '#ef4444';
    if (hnr > 20) return '#f97316';
    if (hnr > 10) return '#fdfd00';
    if (hnr > 5) return '#00af4f';
    if (hnr > 1) return '#00af4f';
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

const EnergySection = ({ energies }: { energies: any[] }) => (
    <View style={styles.energyTable}>
        <Text style={[styles.headerBlue, { fontSize: 8 }]}>
            Energías Presentes en la Máquina, Herramienta y/o Equipo:
        </Text>
        <View style={{ flexDirection: 'row' }}>
            {energies.map((energy, index) => (
                <View key={index} style={[styles.energyBlock, index === energies.length - 1 ? {} : {}]}>
                    <Text style={styles.energyHeader}>{getEnergyLabel(energy.type)}</Text>
                    <View style={styles.contentRow}>
                        <View style={styles.iconColumn}>
                            <Image src={`/icons/${energy.type}.png`} style={{ width: 35, height: 35 }} />
                        </View>
                        <View style={styles.statusColumn}>
                            <Text style={styles.statusHeader}>Energía presente</Text>
                            <View style={styles.optionRow}>
                                <Text style={styles.optionText}>Si</Text>
                                <View style={styles.dotBox}>{energy.present && <View style={styles.greenDot} />}</View>
                            </View>
                            <View style={[styles.optionRow]}>
                                <Text style={styles.optionText}>No</Text>
                                <View style={styles.dotBox}>{!energy.present && <View style={styles.greenDot} />}</View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.footerRow}>
                        <Text style={styles.footerLabel}>Requiere bloqueo</Text>
                        <Text style={styles.footerValue}>{energy.requiresLockout ? 'S' : 'N'}</Text>
                    </View>
                </View>
            ))}
        </View>
    </View>
);

const HazardTable = ({ hazards }: { hazards: any[] }) => {
    if (!hazards || !Array.isArray(hazards) || hazards.length === 0) {
        return <View style={styles.table}><Text>No hay datos.</Text></View>;
    }

    return (
        <View style={styles.table}>
            {/* Título de la sección */}
            <View style={{ backgroundColor: '#004a7c', padding: 2 }}>
                <Text style={{ color: 'white', fontSize: 8, textAlign: 'center', fontWeight: 'bold' }}>
                    Identificación de Peligros y Evaluación de Riesgos
                </Text>
            </View>

            {/* Encabezado de columnas */}
            <View style={styles.headerRow}>
                <Text style={[styles.cell, { width: '12%', color: 'white', fontSize: 7 }]}>Tipo</Text>
                <Text style={[styles.cell, { width: '13%', color: 'white', fontSize: 7 }]}>Origen</Text>
                <Text style={[styles.cell, { width: '10%', color: 'white', fontSize: 7 }]}>Frecuencia</Text>
                <Text style={[styles.cell, { width: '10%', color: 'white', fontSize: 7 }]}>Severidad</Text>
                <Text style={[styles.cell, { width: '10%', color: 'white', fontSize: 7 }]}>No Personas</Text>
                <Text style={[styles.cell, { width: '10%', color: 'white', fontSize: 7 }]}>Probabilidad</Text>
                <Text style={[styles.cell, { width: '8%', color: 'white', fontSize: 7 }]}>HNR</Text>
                <Text style={[styles.cell, { width: '12%', color: 'white', fontSize: 7 }]}>Riesgo</Text>
                <Text style={[styles.cell, { width: '15%', color: 'white', fontSize: 7, borderRightWidth: 0 }]}>Acción</Text>
            </View>

            {hazards.map((hazard, index) => {
                const hnrValue = (Number(hazard.frequency) || 0) * (Number(hazard.severity) || 0) * (Number(hazard.numberOfPersons) || 0) * (Number(hazard.probability) || 0);

                return (
                    <View key={index} style={styles.row}>
                        {/* Columna Tipo (Icono + Título Azul) - CORREGIDA */}
                        <View style={[styles.cell, { width: '12%', padding: 0, justifyContent: 'flex-start' }]}>
                            {/* Título Azul: Ahora es parte del flujo, no absoluto */}
                            <View style={{ backgroundColor: '#004a7c', width: '100%', padding: 2, marginBottom: 'auto' }}>
                                <Text style={{ color: 'white', fontSize: 6, textAlign: 'center', fontWeight: 'bold' }}>
                                    {getHazardLabel(hazard.type)}
                                </Text>
                            </View>

                            {/* Contenedor de Imagen: Se encarga de centrar el icono en el espacio restante */}
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingTop: 2, paddingBottom: 2 }}>
                                <Image
                                    src={`/icons/${hazard.type}.png`}
                                    style={{ width: 35, height: 35 }}
                                />
                            </View>
                        </View>

                        {/* Columna Origen */}
                        <View style={[styles.cell, { width: '13%', padding: 2 }]}>
                            <Text style={{ fontSize: 7 }}>{hazard.origin || '-'}</Text>
                        </View>

                        {/* Celdas Divididas (Frec, Sev, Pers, Prob) */}
                        {[
                            { val: hazard.frequency, text: hazard.frequencyLabel, label: 'Frecuencia' },
                            { val: hazard.severity, text: hazard.severityLabel, label: 'Severidad' },
                            { val: hazard.numberOfPersons, text: hazard.personsLabel, label: 'Personas' },
                            { val: hazard.probability, text: hazard.probabilityLabel, label: 'Probabilidad' }
                        ].map((param, i) => (
                            <View key={i} style={styles.splitCell}>
                                {/* Parte Superior: Ahora muestra el texto descriptivo */}
                                <View style={styles.upperPart}>
                                    <Text style={{ fontSize: 6, textAlign: 'center' }}>
                                        {param.text || '-'}
                                    </Text>
                                </View>

                                {/* Parte Inferior: Muestra la etiqueta "Valor" y el número */}
                                <View style={styles.lowerPart}>
                                    <Text style={styles.lowerLabel}>Valor</Text>
                                    <Text style={styles.lowerValue}>{param.val}</Text>
                                </View>
                            </View>
                        ))}

                        {/* HNR */}
                        <View style={[styles.cell, { width: '8%' }]}>
                            <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{hnrValue.toFixed(0)}</Text>
                        </View>

                        {/* Riesgo */}
                        <View style={[styles.cell, { width: '12%', backgroundColor: getRiskColor(hnrValue) }]}>
                            <Text style={{ fontSize: 7, fontWeight: 'bold', color: 'black' }}>
                                {getRiskText(hnrValue)}
                            </Text>
                        </View>

                        {/* Acción */}
                        <View style={[styles.cell, { width: '15%', borderRightWidth: 0, padding: 2, backgroundColor: getRiskColor(hnrValue)  }]}>
                            <Text style={{ fontSize: 6, color: 'black' }}>{hazard.action || '-'}</Text>
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

export const RiskPdfDocument = ({ data }: { data: any }) => (
    <Document title={`Analisis_HRN_${data.machineName}`}>
        <Page size="A4" style={styles.page}>
            <View style={styles.infoTable}>
                <Text style={styles.headerBlue}>Análisis de Riesgo de Maquinaria y Equipo</Text>
                <Text style={[styles.headerBlue, { fontSize: 9 }]}>Método HRN</Text>
                <View style={styles.infoRow}>
                    <View style={[styles.infoCell, { width: '70%' }]}><Text style={styles.label}>Máquina:</Text><Text style={styles.value}>{data.machineName || '-'}</Text></View>
                    <View style={[styles.infoCell, { width: '30%', borderRightWidth: 0 }]}><Text style={styles.label}>Ubicación:</Text><Text style={styles.value}>{data.location || '-'}</Text></View>
                </View>
                <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                    <View style={[styles.infoCell, { width: '45%' }]}><Text style={styles.label}>Serie/Modelo:</Text><Text style={styles.value}>{data.serieModel || '-'}</Text></View>
                    <View style={[styles.infoCell, { width: '40%' }]}><Text style={styles.label}>Lugar:</Text><Text style={styles.value}>{data.evaluationLocation || '-'}</Text></View>
                    <View style={[styles.infoCell, { width: '15%', borderRightWidth: 0 }]}><Text style={styles.label}>Fecha:</Text><Text style={styles.value}>{data.date || '-'}</Text></View>
                </View>
            </View>
            <View style={styles.imageContainer}>
                {data.machineImage && (
                    <View style={styles.imageContainer}>
                        <Image
                            src={data.machineImage}
                            style={styles.image}
                        />
                    </View>
                )}
            </View>
            <EnergySection energies={data.energies} />
            <HazardTable hazards={data.hazards} />
        </Page>
    </Document>
);