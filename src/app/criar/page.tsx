"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const ESPECIALIDADES = [
  "Radiologia",
  "Cardiologia",
  "Dermatologia",
  "Ortopedia",
  "Neurologia",
  "Pediatria",
  "Ginecologia",
  "Oftalmologia",
  "Psiquiatria",
  "Geral",
] as const;

interface FormData {
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
}

const initialFormData: FormData = {
  especialidade: "",
  pacienteNome: "",
  pacienteIdade: "",
  pacienteSexo: "",
  medicoNome: "",
  medicoCRM: "",
  medicoEspecialidade: "",
  achadosClinicos: "",
  diagnostico: "",
  recomendacoes: "",
};

function CriarForm() {
  const searchParams = useSearchParams();
  const planoDefault = searchParams.get("plano") || "unico";

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [plano, setPlano] = useState<string>(planoDefault);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);

  function updateField(field: keyof FormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Basic validation
    if (
      !formData.especialidade ||
      !formData.pacienteNome ||
      !formData.achadosClinicos
    ) {
      setError(
        "Preencha os campos obrigatórios: especialidade, nome do paciente e achados clínicos."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano, laudoData: formData }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao criar sessão de pagamento");
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900">Laudo Pago</span>
          </a>

          {/* Plan selector */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setPlano("unico")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                plano === "unico"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              R$19,90 /laudo
            </button>
            <button
              type="button"
              onClick={() => setPlano("mensal")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                plano === "mensal"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              R$79 /mês
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar novo laudo
          </h1>
          <p className="text-gray-600">
            Preencha os dados abaixo para gerar seu laudo médico profissional.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Plano info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-blue-800">
              {plano === "mensal"
                ? "Plano Ilimitado: R$79,00/mês — gere quantos laudos quiser. Cancele quando quiser."
                : "Laudo Individual: R$19,90 — pagamento único. Você será redirecionado ao Stripe para pagamento seguro."}
            </p>
          </div>

          {/* Seção 1: Especialidade */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              Especialidade
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecione a especialidade *
              </label>
              <select
                value={formData.especialidade}
                onChange={(e) => updateField("especialidade", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                required
              >
                <option value="">Selecione...</option>
                {ESPECIALIDADES.map((esp) => (
                  <option key={esp} value={esp}>
                    {esp}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Seção 2: Dados do Paciente */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              Dados do Paciente
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={formData.pacienteNome}
                  onChange={(e) => updateField("pacienteNome", e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade
                </label>
                <input
                  type="text"
                  value={formData.pacienteIdade}
                  onChange={(e) => updateField("pacienteIdade", e.target.value)}
                  placeholder="Ex: 45"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo
                </label>
                <select
                  value={formData.pacienteSexo}
                  onChange={(e) => updateField("pacienteSexo", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção 3: Dados do Médico */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              Dados do Médico
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do médico
                </label>
                <input
                  type="text"
                  value={formData.medicoNome}
                  onChange={(e) => updateField("medicoNome", e.target.value)}
                  placeholder="Ex: Dr. Carlos Oliveira"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CRM
                </label>
                <input
                  type="text"
                  value={formData.medicoCRM}
                  onChange={(e) => updateField("medicoCRM", e.target.value)}
                  placeholder="Ex: CRM-SP 123456"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade do médico
                </label>
                <input
                  type="text"
                  value={formData.medicoEspecialidade}
                  onChange={(e) =>
                    updateField("medicoEspecialidade", e.target.value)
                  }
                  placeholder="Ex: Radiologia"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Seção 4: Achados Clínicos */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              Achados Clínicos
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descreva os achados clínicos *
              </label>
              <textarea
                value={formData.achadosClinicos}
                onChange={(e) =>
                  updateField("achadosClinicos", e.target.value)
                }
                rows={5}
                placeholder="Descreva os achados do exame, observações clínicas relevantes..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
                required
              />
            </div>
          </div>

          {/* Seção 5: Diagnóstico */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                5
              </span>
              Diagnóstico
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnóstico / Conclusão
              </label>
              <textarea
                value={formData.diagnostico}
                onChange={(e) => updateField("diagnostico", e.target.value)}
                rows={4}
                placeholder="Diagnóstico ou conclusão do exame..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
              />
            </div>
          </div>

          {/* Seção 6: Recomendações */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
                6
              </span>
              Recomendações
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recomendações / Conduta
              </label>
              <textarea
                value={formData.recomendacoes}
                onChange={(e) => updateField("recomendacoes", e.target.value)}
                rows={4}
                placeholder="Recomendações de tratamento, conduta, retorno..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
              />
            </div>
          </div>

          {/* Preview Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {preview ? "Ocultar preview" : "Visualizar preview"}
            </button>
          </div>

          {/* Preview */}
          {preview && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Preview do Laudo
              </h3>
              <div className="prose prose-sm max-w-none border rounded-xl p-6 bg-gray-50 font-mono text-sm">
                <div className="text-center mb-6">
                  <p className="font-bold text-lg text-blue-700">Laudo Pago</p>
                  <p className="text-xs text-gray-500">
                    Laudos médicos profissionais
                  </p>
                </div>

                <h4 className="font-bold text-center text-base mb-4">
                  LAUDO MÉDICO —{" "}
                  {formData.especialidade?.toUpperCase() || "[ESPECIALIDADE]"}
                </h4>

                <div className="mb-4">
                  <p className="font-bold text-blue-700 text-xs uppercase mb-1">
                    DADOS DO PACIENTE
                  </p>
                  <p>
                    <strong>Nome:</strong> {formData.pacienteNome || "—"}
                  </p>
                  <p>
                    <strong>Idade:</strong>{" "}
                    {formData.pacienteIdade
                      ? `${formData.pacienteIdade} anos`
                      : "—"}
                  </p>
                  <p>
                    <strong>Sexo:</strong> {formData.pacienteSexo || "—"}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="font-bold text-blue-700 text-xs uppercase mb-1">
                    ACHADOS CLÍNICOS
                  </p>
                  <p className="text-justify">
                    {formData.achadosClinicos || "—"}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="font-bold text-blue-700 text-xs uppercase mb-1">
                    DIAGNÓSTICO
                  </p>
                  <p className="text-justify">
                    {formData.diagnostico || "—"}
                  </p>
                </div>

                <div className="mb-4">
                  <p className="font-bold text-blue-700 text-xs uppercase mb-1">
                    RECOMENDAÇÕES
                  </p>
                  <p className="text-justify">
                    {formData.recomendacoes || "—"}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-300">
                  <p className="border-b border-black w-48 mb-1"></p>
                  <p className="font-bold">
                    {formData.medicoNome || "[Nome do médico]"}
                  </p>
                  <p className="text-xs text-gray-500">
                    CRM: {formData.medicoCRM || "[CRM]"} |{" "}
                    {formData.medicoEspecialidade || "[Especialidade]"}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Data de emissão: {new Date().toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex flex-col items-center gap-3 pb-10">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-md bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Redirecionando para pagamento...
                </span>
              ) : (
                `Continuar para pagamento — ${
                  plano === "mensal" ? "R$79,00/mês" : "R$19,90"
                }`
              )}
            </button>
            <p className="text-xs text-gray-400">
              Pagamento seguro via Stripe. Seus dados são criptografados.
            </p>
          </div>
        </form>
      </main>
    </>
  );
}

export default function CriarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-gray-600">Carregando...</p>
          </div>
        }
      >
        <CriarForm />
      </Suspense>
    </div>
  );
}
