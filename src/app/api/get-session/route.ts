import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id é obrigatório" },
        { status: 400 }
      );
    }

    // Retrieve the Stripe session to get metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata?.laudoData) {
      return NextResponse.json(
        { error: "Dados do laudo não encontrados nesta sessão" },
        { status: 404 }
      );
    }

    const laudoData = JSON.parse(session.metadata.laudoData);

    return NextResponse.json({
      laudoData,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_details?.email,
    });
  } catch (error: any) {
    console.error("Session retrieve error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao recuperar sessão" },
      { status: 500 }
    );
  }
}
