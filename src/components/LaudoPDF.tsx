"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  DocumentProps,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #2563eb",
    paddingBottom: 15,
  },
  clinicName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: 4,
  },
  clinicSubtitle: {
    fontSize: 10,
    color: "#6b7280",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    color: "#1e3a5f",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2563eb",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 4,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    width: 80,
    color: "#4b5563",
  },
  value: {
    flex: 1,
  },
  textBlock: {
    marginBottom: 8,
    textAlign: "justify",
  },
  signatureBlock: {
    marginTop: 50,
    borderTop: "1px solid #d1d5db",
    paddingTop: 15,
  },
  signatureLine: {
    width: 250,
    borderBottom: "1px solid #000",
    marginBottom: 4,
  },
  signatureInfo: {
    fontSize: 9,
    color: "#6b7280",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 60,
    right: 60,
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
    borderTop: "1px solid #e5e7eb",
    paddingTop: 8,
  },
  stamp: {
    position: "absolute",
    top: 60,
    right: 60,
    width: 100,
    height: 100,
    border: "2px solid #d1d5db",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    transform: "rotate(-15deg)",
  },
  stampText: {
    fontSize: 8,
    color: "#d1d5db",
    textAlign: "center",
  },
});

export interface LaudoData {
  especialidade: string;
  pacienteNome: string;
  pacienteIdade: string;
  pacienteSexo: string;
  medicoNome: string;
  medicoCRM: string;
  medicoEspecialidade: string;
  achadosClinicos: string;
  diagnostico: string;
  recomendacoes: string;
  data: string;
}

interface LaudoPDFProps extends Omit<DocumentProps, "children"> {
  data: LaudoData;
}

export function LaudoPDF({ data, ...documentProps }: LaudoPDFProps) {
  return (
    <Document {...documentProps}>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.clinicName}>Laudo Pago</Text>
          <Text style={styles.clinicSubtitle}>
            Laudos médicos profissionais • Inteligência Artificial
          </Text>
        </View>

        {/* Watermark stamp */}
        <View style={styles.stamp}>
          <Text style={styles.stampText}>DOCUMENTO{"\n"}MÉDICO{"\n"}OFICIAL</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          LAUDO MÉDICO — {data.especialidade.toUpperCase()}
        </Text>

        {/* Patient Data */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DADOS DO PACIENTE</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{data.pacienteNome}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Idade:</Text>
            <Text style={styles.value}>{data.pacienteIdade} anos</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sexo:</Text>
            <Text style={styles.value}>{data.pacienteSexo}</Text>
          </View>
        </View>

        {/* Clinical Findings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACHADOS CLÍNICOS</Text>
          <Text style={styles.textBlock}>{data.achadosClinicos}</Text>
        </View>

        {/* Diagnosis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIAGNÓSTICO</Text>
          <Text style={styles.textBlock}>{data.diagnostico}</Text>
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>RECOMENDAÇÕES</Text>
          <Text style={styles.textBlock}>{data.recomendacoes}</Text>
        </View>

        {/* Signature Block */}
        <View style={styles.signatureBlock}>
          <View style={styles.signatureLine} />
          <Text style={{ fontWeight: "bold", marginTop: 4 }}>
            {data.medicoNome}
          </Text>
          <Text style={styles.signatureInfo}>
            CRM: {data.medicoCRM} | {data.medicoEspecialidade}
          </Text>
          <Text style={[styles.signatureInfo, { marginTop: 8 }]}>
            Data de emissão: {data.data}
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Documento gerado por Laudo Pago — Sistema inteligente de laudos médicos
          {"\n"}
          Este documento deve ser assinado digitalmente pelo profissional
          responsável.
        </Text>
      </Page>
    </Document>
  );
}

export function LaudoPDFViewer({ data }: { data: LaudoData }) {
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <LaudoPDF data={data} />
    </PDFViewer>
  );
}
