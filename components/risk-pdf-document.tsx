import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
    header: { marginBottom: 20, borderBottom: 1, pb: 10 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { fontSize: 10, color: '#666' },
    section: { marginTop: 15, padding: 10, backgroundColor: '#f9fafb', borderRadius: 4 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, borderBottom: 0.5, borderColor: '#e5e7eb' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    field: { width: '45%', marginBottom: 5 },
    label: { color: '#6b7280', fontSize: 8 },
    value: { fontSize: 10, fontWeight: 'medium' },
    image: { width: 200, height: 150, objectFit: 'contain', marginTop: 10, alignSelf: 'center' },
    badge: { padding: 4, borderRadius: 4, color: 'white', marginTop: 5, textAlign: 'center', width: 60 }
});

export const RiskPdfDocument = ({ data, totalHNR }: { data: any, totalHNR: number }) => (
    <Document title={`Analisis_HRN_${data.machineName}`}>
        <Page size="A4" style={styles.page}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.title}>Análisis de Riesgo HRN</Text>
                <Text style={styles.subtitle}>Generado el {new Date().toLocaleDateString()}</Text>
            </View>

            {/* Info Máquina */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información del Equipo</Text>
                <View style={styles.grid}>
                    <View style={styles.field}><Text style={styles.label}>Máquina:</Text><Text style={styles.value}>{data.machineName || '-'}</Text></View>
                    <View style={styles.field}><Text style={styles.label}>Modelo/Serie:</Text><Text style={styles.value}>{data.serieModel || '-'}</Text></View>
                    <View style={styles.field}><Text style={styles.label}>Ubicación:</Text><Text style={styles.value}>{data.location || '-'}</Text></View>
                    <View style={styles.field}><Text style={styles.label}>Fecha:</Text><Text style={styles.value}>{data.date}</Text></View>
                </View>
                {data.machineImage && <Image src={data.machineImage} style={styles.image} />}
            </View>

            {/* Energías */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Energías Presentes</Text>
                <Text>{data.energies.filter((e: any) => e.present).map((e: any) => e.label).join(', ') || 'Ninguna'}</Text>
            </View>

            {/* Resultado */}
            <View style={[styles.section, { backgroundColor: '#eff6ff' }]}>
                <Text style={styles.sectionTitle}>Resultado de Evaluación</Text>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>HNR Total: {totalHNR.toFixed(2)}</Text>
            </View>
        </Page>
    </Document>
);