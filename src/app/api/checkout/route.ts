import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const PRICE_ONE_TIME = 1990; // R$19,90 in cents
const PRICE_MONTHLY = 7900; // R$79,00 in cents

interface CheckoutRequestBody {
  plano: "unico" | "mensal";
  laudoData: {
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
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { plano, laudoData } = body;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const lineItems =
      plano === "mensal"
        ? [
            {
              price_data: {
                currency: "brl",
                product_data: {
                  name: "Laudo Pago — Plano Ilimitado Mensal",
                  description:
                    "Gere quantos laudos quiser por R$79,00/mês. Cancele quando quiser.",
                },
                unit_amount: PRICE_MONTHLY,
                recurring: {
                  interval: "month" as const,
                },
              },
              quantity: 1,
            },
          ]
        : [
            {
              price_data: {
                currency: "brl",
                product_data: {
                  name: "Laudo Pago — Laudo Individual",
                  description:
                    "Geração de 1 laudo médico profissional em PDF formatado.",
                },
                unit_amount: PRICE_ONE_TIME,
              },
              quantity: 1,
            },
          ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: plano === "mensal" ? "subscription" : "payment",
      success_url: `${appUrl}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/criar`,
      metadata: {
        laudoData: JSON.stringify(laudoData),
        plano,
      },
      // Brazilian Portuguese
      locale: "pt-BR",
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar sessão de pagamento" },
      { status: 500 }
    );
  }
}
