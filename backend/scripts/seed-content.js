/**
 * Importe dans MongoDB le contenu aujourd'hui figé en dur dans le site public
 * (user/src/lib/blog.ts et user/src/routes/formations.tsx), pour que le
 * back-office ait de la matière réelle à administrer.
 *
 *   node scripts/seed-content.js
 *
 * Idempotent : les enregistrements sont retrouvés par slug et mis à jour.
 */
require("../config/env");
const mongoose = require("mongoose");

const { connectDB } = require("../config/db");
const Formation = require("../models/Formation");
const Post = require("../models/Post");
const { slugify } = require("../utils/slug");

const FORMATIONS = [
  {
    category: "Ressources Humaines & Administration",
    items: [
      "Assistant(e) RH (Sage 100 i7 Paie & RH et Excel)",
      "Management RH (Sage 100 i7 Paie & RH)",
      "Gestion administrative du personnel (Excel)",
      "Secrétariat et Assistant(e) de Direction",
      "Secrétariat Comptable",
      "Techniques de recrutement et gestion des talents",
      "Gestion des conflits en entreprise",
      "Communication professionnelle",
    ],
  },
  {
    category: "Comptabilité & Gestion",
    items: [
      "Comptabilité (Sage 100 i7 Comptabilité)",
      "Gestion de Caisse (Sage 100 i7 Saisie de Caisse)",
      "Fiscalité d'entreprise",
      "Analyse financière",
      "Comptabilité générale et analytique",
      "Gestion budgétaire",
      "Initiation à l'audit comptable",
    ],
  },
  {
    category: "Informatique & Bureautique",
    items: [
      "Excel Débutant à Avancé",
      "Gestion de paie sur Excel",
      "Bureautique complète (Word, Excel, PowerPoint)",
      "Power BI & Tableaux de bord",
      "Informatique de base",
      "Maintenance informatique",
      "Initiation aux réseaux informatiques",
    ],
  },
  {
    category: "Commerce & Marketing",
    items: [
      "Gestion Commerciale (Sage 100 i7 Gescom)",
      "Vente en ligne",
      "E-commerce",
      "Community Management",
      "Marketing Digital",
      "Techniques de vente et négociation",
      "Service client et relation commerciale",
    ],
  },
  {
    category: "Logistique & Transit",
    items: [
      "Assistant(e) Logistique (Gescom et Excel)",
      "Gestion des Stocks & Approvisionnements",
      "Logistique et Transport",
      "Procédures douanières & Transit",
      "Gestion des opérations portuaires",
      "Chaîne logistique et Supply Chain",
    ],
  },
  {
    category: "QHSE & Industrie",
    items: [
      "Superviseur QHSE (Excel)",
      "QHSE : Qualité, Hygiène, Sécurité et Environnement",
      "Sécurité au travail",
      "Gestion des risques professionnels",
      "Sensibilisation HSE en entreprise",
    ],
  },
  {
    category: "Langues & Communication",
    items: [
      "Anglais professionnel",
      "Anglais des affaires",
      "Communication d'entreprise",
      "Techniques de prise de parole en public",
    ],
  },
];

const POSTS = [
  {
    title: "Comment réussir un entretien d'embauche ?",
    slug: "reussir-entretien-embauche",
    category: "Conseils candidats",
    readTime: "5 min",
    featured: true,
    excerpt:
      "Préparation, posture, questions clés et erreurs à éviter pour décrocher le poste de vos rêves.",
    content: `L'entretien d'embauche est le moment décisif de tout processus de recrutement. Une bonne préparation fait souvent la différence entre deux candidats aux compétences équivalentes.

## Préparer en amont

Renseignez-vous sur l'entreprise, son secteur, ses valeurs et l'actualité récente. Relisez l'offre et identifiez les compétences attendues, puis préparez des exemples concrets tirés de votre parcours.

- Étudiez l'entreprise et le poste en profondeur
- Préparez 3 à 5 réalisations chiffrées
- Anticipez les questions classiques et vos réponses
- Préparez vos propres questions à poser au recruteur

## Soigner sa posture

Ponctualité, tenue adaptée, écoute active et sourire : la première impression se joue dans les premières secondes. Restez authentique, structurez vos réponses et illustrez toujours par des faits.

## Les erreurs à éviter

- Arriver sans connaître l'entreprise
- Dénigrer un ancien employeur
- Rester vague ou réciter un discours appris
- Oublier de relancer après l'entretien`,
  },
  {
    title: "Les compétences les plus recherchées en 2026",
    slug: "competences-recherchees-2026",
    category: "Tendances",
    readTime: "6 min",
    excerpt:
      "Soft skills, maîtrise digitale et expertise métier : panorama des nouvelles attentes des recruteurs.",
    content: `Le marché du travail évolue vite. En 2026, les recruteurs recherchent un équilibre entre compétences techniques, agilité digitale et savoir-être.

## Les soft skills en tête

- Adaptabilité et apprentissage continu
- Communication et travail en équipe
- Résolution de problèmes et esprit critique
- Intelligence émotionnelle

## La maîtrise digitale

La bureautique avancée (Excel, Power BI), les outils de gestion (Sage) et une compréhension des usages de l'IA deviennent des prérequis dans de nombreux métiers.`,
  },
  {
    title: "Pourquoi former son personnel ?",
    slug: "pourquoi-former-personnel",
    category: "Formation",
    readTime: "4 min",
    excerpt:
      "ROI de la formation continue et impact sur la performance, l'engagement et la rétention.",
    content: `Investir dans la formation de ses équipes n'est pas une dépense, mais un levier de performance mesurable.

## Des bénéfices concrets

- Gain de productivité et de qualité
- Engagement et fidélisation des collaborateurs
- Réduction des erreurs et des risques
- Attractivité de la marque employeur

Un plan de formation structuré, aligné sur les objectifs de l'entreprise, génère un retour sur investissement rapide et durable.`,
  },
  {
    title: "Conseils RH pour entreprises en croissance",
    slug: "conseils-rh-entreprises-croissance",
    category: "Conseils RH",
    readTime: "5 min",
    excerpt:
      "Structurer la fonction RH, anticiper les besoins en talents et fidéliser vos meilleurs collaborateurs.",
    content: `La croissance met la fonction RH sous tension. Structurer tôt permet d'éviter les crises de croissance.

- Formaliser les processus de recrutement et d'onboarding
- Mettre en place des entretiens et un suivi des compétences
- Anticiper les besoins en talents à 12 mois
- Construire une politique de rémunération cohérente`,
  },
  {
    title: "Externalisation paie : avantages et limites",
    slug: "externalisation-paie",
    category: "Externalisation",
    readTime: "6 min",
    excerpt:
      "Quand externaliser, comment choisir son prestataire, points de vigilance contractuels.",
    content: `Externaliser la paie permet de sécuriser un processus sensible tout en libérant du temps pour les équipes internes.

## Les avantages

- Conformité réglementaire assurée
- Réduction des risques d'erreur
- Gain de temps et d'expertise

## Points de vigilance

Vérifiez les engagements de service, la confidentialité des données et la réversibilité du contrat avant de vous engager.`,
  },
  {
    title: "QHSE : une priorité stratégique",
    slug: "qhse-priorite-strategique",
    category: "QHSE",
    readTime: "4 min",
    excerpt: "Mettre en place une démarche QHSE durable et efficace dans votre entreprise.",
    content: `La démarche QHSE (Qualité, Hygiène, Sécurité, Environnement) protège vos collaborateurs et renforce la performance globale.

- Évaluer les risques professionnels
- Former et sensibiliser les équipes
- Mettre en place des procédures claires
- Mesurer et améliorer en continu`,
  },
  {
    title: "5 erreurs à éviter dans un recrutement",
    slug: "erreurs-recrutement",
    category: "Recrutement",
    readTime: "5 min",
    excerpt:
      "Brief flou, biais inconscients, processus trop long : les pièges qui font fuir les meilleurs talents.",
    content: `Un recrutement raté coûte cher. Voici les erreurs les plus fréquentes et comment les éviter.

- Un brief de poste imprécis
- Un processus trop long et peu réactif
- Des biais inconscients dans la sélection
- Négliger l'expérience candidat
- Oublier l'intégration après l'embauche`,
  },
  {
    title: "Manager hybride : le nouveau défi RH",
    slug: "manager-hybride",
    category: "Management",
    readTime: "6 min",
    excerpt: "Posture, outils et rituels pour piloter une équipe entre présentiel et distanciel.",
    content: `Le travail hybride redéfinit le rôle du manager, qui doit conjuguer confiance, clarté et cohésion à distance.

- Fixer des objectifs clairs et mesurables
- Instaurer des rituels d'équipe réguliers
- Favoriser la communication asynchrone
- Veiller à l'équité entre présentiel et distanciel`,
  },
  {
    title: "Construire un plan de formation efficace",
    slug: "plan-formation-efficace",
    category: "Formation",
    readTime: "5 min",
    excerpt:
      "Méthode pas à pas pour identifier les besoins, prioriser et mesurer l'impact des formations.",
    content: `Un plan de formation efficace s'appuie sur une analyse rigoureuse des besoins et un suivi de l'impact.

- Identifier les écarts de compétences
- Prioriser selon les enjeux stratégiques
- Choisir les bons formats et prestataires
- Évaluer les résultats et ajuster`,
  },
];

async function run() {
  await connectDB();

  let formations = 0;
  for (const [categoryIndex, group] of FORMATIONS.entries()) {
    for (const [itemIndex, title] of group.items.entries()) {
      await Formation.findOneAndUpdate(
        { slug: slugify(title) },
        {
          $set: {
            title,
            category: group.category,
            slug: slugify(title),
            published: true,
            order: categoryIndex * 100 + itemIndex,
          },
          $setOnInsert: { description: "", program: [] },
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
      );
      formations += 1;
    }
  }

  let posts = 0;
  for (const post of POSTS) {
    await Post.findOneAndUpdate(
      { slug: post.slug },
      { $set: { ...post, published: true, publishedAt: new Date() } },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true },
    );
    posts += 1;
  }

  console.log(`Contenu importé : ${formations} formations, ${posts} articles.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
