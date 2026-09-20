import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image manquante" },
        { status: 400 }
      );
    }

    const response = await openai.responses.create({
      model: "gpt-5.6-luna",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
Tu es un assistant d'analyse de graphiques de trading.

Analyse uniquement ce qui est visible sur l'image.

Donne :
1. Le marché ou symbole identifiable
2. L'unité de temps si elle est visible
3. La tendance visible
4. Les supports et résistances visibles
5. Les structures ou configurations visibles
6. Les éléments qui pourraient invalider l'analyse
7. Les informations manquantes

Ne présente pas ton analyse comme une certitude et ne garantis jamais un résultat financier.

Réponds en français de manière claire et structurée.
              `,
            },
            {
              type: "input_image",
              image_url: image,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      analysis: response.output_text,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Erreur pendant l'analyse IA",
      },
      {
        status: 500,
      }
    );
  }
}