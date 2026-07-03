"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [laudoData, setLaudoData] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Sessão não encontrada.");
      setLoading(false);
      return;
    }

    async function fetchSession() {
      try {
        const res = await fetch(`/api/get-session?session_id=${sessionId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Erro ao buscar dados da sessão");
        }
        const data = await res.json();
        setLaudoData(data.laudoData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId]);

  function handleDownload() {
    if (sessionId) {
      window.open(`/api/generate-pdf?session_id=${sessionId}`, "_blank");
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-center">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin w-10 h-10 text-blue-600"
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
          <p className="text-gray-600">Carregando dados do laudo...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Erro ao carregar
          </h2>
          <p className="text-red-600">{error}</p>
          <Link
            href="/criar"
            className="inline-block mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </Link>
        </div>
      ) : (
        <>
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Pagamento confirmado!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Seu laudo médico está pronto para download.
          </p>

          {/* Laudo Summary */}
          {laudoData && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">
                Resumo do Laudo
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Especialidade:</span>{" "}
                  <span className="font-medium">
                    {laudoData.especialidade}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Paciente:</span>{" "}
                  <span className="font-medium">
                    {laudoData.pacienteNome}
                  </span>
                </p>
                <p>
                  <span className="text-gray-500">Médico:</span>{" "}
                  <span className="font-medium">{laudoData.medicoNome}</span>
                  {laudoData.medicoCRM && (
                    <span className="text-gray-400">
                      {" "}
                      • CRM: {laudoData.medicoCRM}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleDownload}
              className="w-full max-w-md bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Baixar PDF
            </button>

            <button
              onClick={() => {
                const subject = encodeURIComponent(
                  `Laudo Médico — ${laudoData?.especialidade || ""}`
                );
                const body = encodeURIComponent(
                  `Segue em anexo o laudo médico.\n\nPaciente: ${laudoData?.pacienteNome || ""}\nEspecialidade: ${laudoData?.especialidade || ""}`
                );
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
              className="w-full max-w-md border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-gray-300 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Enviar por email
            </button>

            <Link
              href="/criar"
              className="w-full max-w-md border-2 border-blue-200 text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Criar outro laudo
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default function SucessoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-2">
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
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-600">Carregando...</p>
          </div>
        }
      >
        <SucessoContent />
      </Suspense>
    </div>
  );
}
