'use server'

import config from "@/config/config";

// Server Action qui appelle l'API Gemini pour générer une liste de tâches
// à partir d'une simple description textuelle du projet
export async function generateTasksFromDescription(description) {
  // Appel à l'API Gemini (modèle gemini-3.6-flash) avec la clé API stockée en config
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${config.apiIAKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            // Prompt : on demande explicitement du JSON pur, sans markdown ni texte autour,
            // pour pouvoir le parser directement côté serveur
            text: `Tu génères des tâches de projet à partir d'une description. Réponds UNIQUEMENT en JSON, un tableau d'objets {name, description}, sans texte autour, sans markdown.\n\nDescription : ${description}`
          }]
        }]
      }),
    }
  );

  // Récupération du corps de la réponse (que la requête ait réussi ou non)
  const data = await response.json();

  // Si l'appel HTTP a échoué (erreur API, quota dépassé, clé invalide, etc.)
  // on logue l'erreur et on renvoie un tableau vide plutôt que de planter
  if (!response.ok) {
    console.error("Erreur API Gemini :", data);
    return [];
  }

  // Extraction du texte généré par le modèle
  // (chemin défensif avec optional chaining car la structure peut varier ou être absente)
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

  try {
    // Nettoyage au cas où le modèle aurait quand même entouré sa réponse de balises markdown
    const clean = text.replace(/```json|```/g, "").trim();
    // Parsing du JSON généré en tableau d'objets {name, description}
    return JSON.parse(clean);
  } catch (err) {
    // Si le modèle a renvoyé un JSON invalide, on logue pour debug et on renvoie un tableau vide
    console.error("Erreur parsing réponse IA :", err, text);
    return [];
  }
}