import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return Response.json(
        {
          error: "Aucune image reçue.",
        },
        {
          status: 400,
        }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",

      input: [
        {
          role: "developer",

          content: `
Tu es TradePilot AI.

Tu es un assistant pédagogique spécialisé
dans l'analyse technique des graphiques de trading.

Analyse UNIQUEMENT ce qui est réellement visible
sur l'image.

Recherche notamment :

📊 ACTIF
- symbole si lisible
- timeframe si lisible

📈 TENDANCE
- haussière
- baissière
- latérale
- indéterminée

🏗️ STRUCTURE
- HH
- HL
- LH
- LL
- cassure de structure
- changement de structure

📍 NIVEAUX
- supports visibles
- résistances visibles
- zones importantes

💧 LIQUIDITÉ
- zones de liquidité potentielles
- sweep potentiel si visible

📐 PATTERNS
- breakout
- retest
- consolidation
- figures chartistes visibles

🟢 SCÉNARIO HAUSSIER
Explique ce qui pourrait soutenir ce scénario.

🔴 SCÉNARIO BAISSIER
Explique ce qui pourrait soutenir ce scénario.

⚠️ RISQUES
Explique ce qui pourrait invalider les scénarios.

RÈGLES IMPORTANTES :

- Ne jamais inventer un prix.
- Ne jamais inventer un timeframe.
- Ne jamais inventer un indicateur.
- Si quelque chose est illisible, indique-le.
- Ne présente jamais une hypothèse comme une certitude.
- Ne garantis jamais de bénéfice.
- Ne dis jamais qu'un trade est certain.
- Reste pédagogique.
- Réponds en français.
- Utilise des titres clairs.
- Utilise des emojis lorsque cela améliore la lisibilité.

Cette analyse est informative et ne constitue
pas un conseil financier personnalisé.
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
            },
          ],
        },
      ],
    });

    return Response.json({
      analysis: response.output_text,
    });
  } catch (error) {
    console.error(
      "Erreur analyse graphique :",
      error
    );

    return Response.json(
      {
        error:
          "Erreur lors de la communication avec l'IA.",
      },
      {
        status: 500,
      }
    );
  }
}