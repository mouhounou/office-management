import imgRecrutement from "@/assets/entretien-recrutement.jpg";
import imgFormation from "@/assets/training.jpg";
import imgManagement from "@/assets/reunion-conseil.jpg";
import imgConseil from "@/assets/consultant-rh.jpg";
import imgQHSE from "@/assets/technical.jpg";
import imgTeam from "@/assets/team.jpg";
import imgCouloir from "@/assets/equipe-couloir.jpg";
import imgHero from "@/assets/hero.jpg";

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] };

export type Post = {
  slug: string;
  t: string;
  d: string;
  c: string;
  e: string;
  img: string;
  readTime: string;
  featured?: boolean;
  content: BlogBlock[];
};

export const categories = [
  "Tous", "Conseils candidats", "Tendances", "Management",
  "Conseils RH", "Externalisation", "QHSE", "Formation", "Recrutement",
];

export const posts: Post[] = [
  {
    slug: "reussir-entretien-embauche",
    t: "Comment réussir un entretien d'embauche ?",
    d: "12 mai 2026", c: "Conseils candidats", img: imgRecrutement, readTime: "5 min", featured: true,
    e: "Préparation, posture, questions clés et erreurs à éviter pour décrocher le poste de vos rêves.",
    content: [
      { type: "p", text: "L'entretien d'embauche est le moment décisif de tout processus de recrutement. Une bonne préparation fait souvent la différence entre deux candidats aux compétences équivalentes." },
      { type: "h", text: "Préparer en amont" },
      { type: "p", text: "Renseignez-vous sur l'entreprise, son secteur, ses valeurs et l'actualité récente. Relisez l'offre et identifiez les compétences attendues, puis préparez des exemples concrets tirés de votre parcours." },
      { type: "ul", items: [
        "Étudiez l'entreprise et le poste en profondeur",
        "Préparez 3 à 5 réalisations chiffrées",
        "Anticipez les questions classiques et vos réponses",
        "Préparez vos propres questions à poser au recruteur",
      ]},
      { type: "h", text: "Soigner sa posture" },
      { type: "p", text: "Ponctualité, tenue adaptée, écoute active et sourire : la première impression se joue dans les premières secondes. Restez authentique, structurez vos réponses et illustrez toujours par des faits." },
      { type: "h", text: "Les erreurs à éviter" },
      { type: "ul", items: [
        "Arriver sans connaître l'entreprise",
        "Dénigrer un ancien employeur",
        "Rester vague ou réciter un discours appris",
        "Oublier de relancer après l'entretien",
      ]},
    ],
  },
  {
    slug: "competences-recherchees-2026",
    t: "Les compétences les plus recherchées en 2026",
    d: "5 mai 2026", c: "Tendances", img: imgHero, readTime: "6 min",
    e: "Soft skills, maîtrise digitale et expertise métier : panorama des nouvelles attentes des recruteurs.",
    content: [
      { type: "p", text: "Le marché du travail évolue vite. En 2026, les recruteurs recherchent un équilibre entre compétences techniques, agilité digitale et savoir-être." },
      { type: "h", text: "Les soft skills en tête" },
      { type: "ul", items: [
        "Adaptabilité et apprentissage continu",
        "Communication et travail en équipe",
        "Résolution de problèmes et esprit critique",
        "Intelligence émotionnelle",
      ]},
      { type: "h", text: "La maîtrise digitale" },
      { type: "p", text: "La bureautique avancée (Excel, Power BI), les outils de gestion (Sage) et une compréhension des usages de l'IA deviennent des prérequis dans de nombreux métiers." },
    ],
  },
  {
    slug: "pourquoi-former-personnel",
    t: "Pourquoi former son personnel ?",
    d: "28 avril 2026", c: "Formation", img: imgFormation, readTime: "4 min",
    e: "ROI de la formation continue et impact sur la performance, l'engagement et la rétention.",
    content: [
      { type: "p", text: "Investir dans la formation de ses équipes n'est pas une dépense, mais un levier de performance mesurable." },
      { type: "h", text: "Des bénéfices concrets" },
      { type: "ul", items: [
        "Gain de productivité et de qualité",
        "Engagement et fidélisation des collaborateurs",
        "Réduction des erreurs et des risques",
        "Attractivité de la marque employeur",
      ]},
      { type: "p", text: "Un plan de formation structuré, aligné sur les objectifs de l'entreprise, génère un retour sur investissement rapide et durable." },
    ],
  },
  {
    slug: "conseils-rh-entreprises-croissance",
    t: "Conseils RH pour entreprises en croissance",
    d: "20 avril 2026", c: "Conseils RH", img: imgConseil, readTime: "5 min",
    e: "Structurer la fonction RH, anticiper les besoins en talents et fidéliser vos meilleurs collaborateurs.",
    content: [
      { type: "p", text: "La croissance met la fonction RH sous tension. Structurer tôt permet d'éviter les crises de croissance." },
      { type: "ul", items: [
        "Formaliser les processus de recrutement et d'onboarding",
        "Mettre en place des entretiens et un suivi des compétences",
        "Anticiper les besoins en talents à 12 mois",
        "Construire une politique de rémunération cohérente",
      ]},
    ],
  },
  {
    slug: "externalisation-paie",
    t: "Externalisation paie : avantages et limites",
    d: "10 avril 2026", c: "Externalisation", img: imgManagement, readTime: "6 min",
    e: "Quand externaliser, comment choisir son prestataire, points de vigilance contractuels.",
    content: [
      { type: "p", text: "Externaliser la paie permet de sécuriser un processus sensible tout en libérant du temps pour les équipes internes." },
      { type: "h", text: "Les avantages" },
      { type: "ul", items: [
        "Conformité réglementaire assurée",
        "Réduction des risques d'erreur",
        "Gain de temps et d'expertise",
      ]},
      { type: "h", text: "Points de vigilance" },
      { type: "p", text: "Vérifiez les engagements de service, la confidentialité des données et la réversibilité du contrat avant de vous engager." },
    ],
  },
  {
    slug: "qhse-priorite-strategique",
    t: "QHSE : une priorité stratégique",
    d: "1 avril 2026", c: "QHSE", img: imgQHSE, readTime: "4 min",
    e: "Mettre en place une démarche QHSE durable et efficace dans votre entreprise.",
    content: [
      { type: "p", text: "La démarche QHSE (Qualité, Hygiène, Sécurité, Environnement) protège vos collaborateurs et renforce la performance globale." },
      { type: "ul", items: [
        "Évaluer les risques professionnels",
        "Former et sensibiliser les équipes",
        "Mettre en place des procédures claires",
        "Mesurer et améliorer en continu",
      ]},
    ],
  },
  {
    slug: "erreurs-recrutement",
    t: "5 erreurs à éviter dans un recrutement",
    d: "25 mars 2026", c: "Recrutement", img: imgTeam, readTime: "5 min",
    e: "Brief flou, biais inconscients, processus trop long : les pièges qui font fuir les meilleurs talents.",
    content: [
      { type: "p", text: "Un recrutement raté coûte cher. Voici les erreurs les plus fréquentes et comment les éviter." },
      { type: "ul", items: [
        "Un brief de poste imprécis",
        "Un processus trop long et peu réactif",
        "Des biais inconscients dans la sélection",
        "Négliger l'expérience candidat",
        "Oublier l'intégration après l'embauche",
      ]},
    ],
  },
  {
    slug: "manager-hybride",
    t: "Manager hybride : le nouveau défi RH",
    d: "15 mars 2026", c: "Management", img: imgCouloir, readTime: "6 min",
    e: "Posture, outils et rituels pour piloter une équipe entre présentiel et distanciel.",
    content: [
      { type: "p", text: "Le travail hybride redéfinit le rôle du manager, qui doit conjuguer confiance, clarté et cohésion à distance." },
      { type: "ul", items: [
        "Fixer des objectifs clairs et mesurables",
        "Instaurer des rituels d'équipe réguliers",
        "Favoriser la communication asynchrone",
        "Veiller à l'équité entre présentiel et distanciel",
      ]},
    ],
  },
  {
    slug: "plan-formation-efficace",
    t: "Construire un plan de formation efficace",
    d: "5 mars 2026", c: "Formation", img: imgFormation, readTime: "5 min",
    e: "Méthode pas à pas pour identifier les besoins, prioriser et mesurer l'impact des formations.",
    content: [
      { type: "p", text: "Un plan de formation efficace s'appuie sur une analyse rigoureuse des besoins et un suivi de l'impact." },
      { type: "ul", items: [
        "Identifier les écarts de compétences",
        "Prioriser selon les enjeux stratégiques",
        "Choisir les bons formats et prestataires",
        "Évaluer les résultats et ajuster",
      ]},
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}
