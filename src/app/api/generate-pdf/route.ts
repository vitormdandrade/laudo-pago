import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { renderToBuffer } from "@react-pdf/renderer";
import { LaudoPDF } from "@/components/LaudoPDF";
import React from "react";

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

    // Retrieve Stripe session to get laudo data from metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.metadata?.laudoData) {
      return NextResponse.json(
        { error: "Dados do laudo não encontrados" },
        { status: 404 }
      );
    }

    const laudoData = JSON.parse(session.metadata.laudoData);
    laudoData.data = new Date().toLocaleDateString("pt-BR");

    // Generate PDF using renderToBuffer (v4 API)
    const pdfBuffer = await renderToBuffer(
      React.createElement(LaudoPDF, { data: laudoData }) as any
    );

    // Generate a clean filename
    const filename = `laudo-${laudoData.pacienteNome
      ?.toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}.pdf`;

    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao gerar PDF" },
      { status: 500 }
    );
  }
}
