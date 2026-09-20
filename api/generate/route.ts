import OpenAI from "openai";
export async function POST() {
  return Response.json({
    ok: true,
    message: "La route /api/generate fonctionne !",
  });
}

    const { image } = await req.json();

    if (!image) {
      return Response.json(
        { error: "Aucune image reçue." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

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
    console.error("Erreur analyse graphique :", error);

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