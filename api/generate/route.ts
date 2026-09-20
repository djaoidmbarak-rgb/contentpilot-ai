import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("OPENAI_API_KEY est absente");
}

const openai = new OpenAI({
  apiKey,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const image = body?.image;

    if (!image) {
      return Response.json(
        { error: "Aucune image reçue." },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY n'est pas configurée sur le serveur." },
        { status: 500 }
      );
    }

    if (
      typeof image !== "string" ||
      (!image.startsWith("data:image/") &&
        !image.startsWith("https://") &&
        !image.startsWith("http://"))
    ) {
      return Response.json(
        {
          error:
            "Format d'image invalide. L'image doit être une URL ou une image base64 data:image/...",
        },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: [
        {
          role: "developer",
          content: `
Tu es TradePilot AI, un assistant pédagogique spécialisé dans l'analyse technique des graphiques de trading.

Analyse uniquement ce qui est réellement visible sur l'image.

Recherche notamment :
- Actif et symbole si lisible
- Timeframe si lisible
- Tendance
- Structure du marché
- Supports
- Résistances
- Liquidité
- Breakout
- Retest
- Patterns visibles
- Scénario haussier
- Scénario baissier
- Risques

Règles :
- Ne jamais inventer un prix.
- Ne jamais inventer un timeframe.
- Ne jamais inventer un indicateur.
- Si quelque chose est illisible, indique-le.
- Ne présente jamais une hypothèse comme une certitude.
- Ne garantis jamais de bénéfice.
- Réponds en français.
- Sois clair et pédagogique.
          `,
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Analyse ce graphique.",
            },
            {
              type: "input_image",
              image_url: image,
              detail: "high",
            },
          ],
        },
      ],
    });

    return Response.json({
      analysis: response.output_text,
    });
  } catch (error) {
    console.error("ERREUR OPENAI:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue.",
      },
      { status: 500 }
    );
  }
}