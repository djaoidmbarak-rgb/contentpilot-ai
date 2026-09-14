import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM = `Tu es ContentPilot AI, un stratège senior en contenu et croissance.
Tu écris en français, avec un style clair, direct, moderne et concret.
Tu refuses les clichés et les phrases vagues. Tu privilégies les hooks spécifiques, les angles différenciants et les scripts réellement publiables.
Tu adaptes toujours la réponse à la plateforme, au format, à l'objectif et à la marque.
Retourne UNIQUEMENT un objet JSON valide, sans markdown, sans commentaire.`;

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY n'est pas configurée sur Vercel." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const {
      mode,
      theme,
      platform,
      format,
      objective,
      brand,
      opportunity,
    } = body;

    const context = JSON.stringify({
      theme,
      platform,
      format,
      objective,
      brand,
      opportunity,
    });

    let task = "";

    if (mode === "generate") {
      task = `Crée une nouvelle opportunité de contenu à partir de ce contexte: ${context}

Retourne exactement ces clés:
title, score, hook, angle, concept, script, cta, why, gap, timing.

score doit être un entier entre 75 et 99.
Le script doit être assez concret pour servir de base à une vraie publication.`;

    } else if (mode === "optimize") {
      task = `Optimise fortement cette opportunité existante pour la rendre plus persuasive et plus spécifique: ${context}

Retourne exactement ces clés:
title, score, hook, angle, concept, script, cta, why, gap, timing, critique.

score doit être un entier entre 70 et 100.

critique doit être un tableau de 4 à 6 remarques courtes, utiles et honnêtes.

Ne change pas le sujet sans raison.`;

    } else if (mode === "variants") {
      task = `Transforme cette opportunité en 3 variantes natives pour les réseaux sociaux: ${context}

Retourne exactement une clé variants contenant les clés:
Instagram, TikTok et LinkedIn.

Chaque valeur doit être un texte directement exploitable, adapté aux codes de la plateforme, avec hook et CTA.`;

    } else {
      return NextResponse.json(
        { error: "Mode IA inconnu." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-5.5",
          instructions: SYSTEM,
          input: task,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            data?.error?.message ||
            "OpenAI a refusé la requête.",
        },
        { status: response.status }
      );
    }

    const text = data.output_text || "";

    const cleaned = text
      .replace(/^```json\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const result = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error("ContentPilot AI error", error);

    return NextResponse.json(
      {
        error:
          "Impossible de générer le contenu IA pour le moment.",
      },
      { status: 500 }
    );
  }
}
