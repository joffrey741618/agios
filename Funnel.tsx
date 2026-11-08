"use client";

import { useState } from "react";

type Option = { label: string; value: number };

const QUESTIONS: { title: string; hint: string; options: Option[] }[] = [
  {
    title: "Ces 12 derniers mois, combien de fois ton compte est-il passé dans le rouge ?",
    hint: "Même pour quelques euros, même une seule journée.",
    options: [
      { label: "Jamais ou presque", value: 0 },
      { label: "Quelques fois (1 à 4)", value: 3 },
      { label: "Souvent (5 à 12)", value: 8 },
      { label: "Presque tous les mois", value: 15 },
    ],
  },
  {
    title: "Combien de frais bancaires vois-tu passer par mois ?",
    hint: "Commissions, rejets, cotisation de carte, options. Une estimation suffit.",
    options: [
      { label: "Moins de 10 €", value: 5 },
      { label: "Entre 10 et 25 €", value: 18 },
      { label: "Entre 25 et 50 €", value: 38 },
      { label: "Plus de 50 €", value: 60 },
    ],
  },
  {
    title: "As-tu déjà contesté un frais auprès de ta banque ?",
    hint: "Par courrier, par téléphone ou en agence.",
    options: [
      { label: "Jamais", value: 0 },
      { label: "Une fois", value: 1 },
      { label: "Plusieurs fois", value: 2 },
    ],
  },
];

const CONTESTED_TEXT = [
  "Tu n'as jamais contesté de frais : ta banque n'a donc jamais eu à justifier une seule ligne.",
  "Tu as déjà contesté une fois, donc tu sais que c'est possible. Agios rend la démarche plus rapide.",
  "Tu contestes déjà régulièrement. Agios t'évite de tout reconstituer à la main.",
];

function eur(n: number) {
  return `${n.toLocaleString("fr-FR")}\u00a0€`;
}

function Cta({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div className="sticky bottom-0 -mx-6 border-t border-stone-300/60 bg-creme px-6 pb-6 pt-4">
      <button
        type="button"
        onClick={onClick}
        className="h-14 w-full rounded-xl bg-sapin text-lg font-semibold text-white active:opacity-90"
      >
        {children}
      </button>
    </div>
  );
}

export default function Funnel() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  function choose(value: number) {
    setAnswers([...answers.slice(0, step - 1), value]);
    setStep(step + 1);
  }

  function restart() {
    setAnswers([]);
    setStep(0);
  }

  const wrapper = "mx-auto flex min-h-dvh max-w-md flex-col px-6";

  // Écran 0 : page d'entrée
  if (step === 0) {
    return (
      <div className={wrapper}>
        <header className="pt-6 font-display text-2xl font-bold">Agios</header>
        <main className="flex-1 pt-10">
          <h1 className="font-display text-[2.6rem] font-bold leading-[1.05]">
            Ta banque t'a prélevé des frais en trop. Récupère-les.
          </h1>
          <div className="mt-8 border-y-2 border-dashed border-brique/50 py-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-brique">
              Le plafond légal
            </p>
            <p className="mt-2 text-lg leading-snug">
              Une commission d'intervention ne peut pas dépasser{" "}
              <strong>8 € par opération</strong> ni <strong>80 € par mois</strong>.
              Presque personne ne vérifie.
            </p>
          </div>
          <ol className="mt-8 space-y-5">
            {[
              "Toutes les lignes de frais repérées sur ton relevé.",
              "Comparées aux plafonds légaux, sur 12 mois.",
              "Un courrier de réclamation prêt à envoyer à ta banque.",
            ].map((text, i) => (
              <li key={text} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sapin font-display font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-lg leading-snug">{text}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 pb-6 text-sm text-stone-600">
            Trois questions, une minute, aucun relevé à envoyer pour commencer.
          </p>
        </main>
        <Cta onClick={() => setStep(1)}>Commencer, c'est gratuit</Cta>
      </div>
    );
  }

  // Écrans 1 à 3 : les questions
  if (step >= 1 && step <= 3) {
    const q = QUESTIONS[step - 1];
    return (
      <div className={wrapper}>
        <header className="pt-6">
          <div className="flex items-center justify-between text-sm font-semibold text-stone-600">
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="-ml-2 flex h-10 items-center px-2"
            >
              ← Retour
            </button>
            <span>Question {step} sur 3</span>
          </div>
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stone-300/60"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={3}
            aria-valuenow={step}
          >
            <div
              className="h-full rounded-full bg-sapin transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </header>
        <main className="flex-1 pb-8 pt-10">
          <h2 className="font-display text-3xl font-bold leading-tight">
            {q.title}
          </h2>
          <p className="mt-3 text-stone-600">{q.hint}</p>
          <div className="mt-8 space-y-3">
            {q.options.map((o) => (
              <button
                key={o.label}
                type="button"
                onClick={() => choose(o.value)}
                className={`flex min-h-14 w-full items-center rounded-xl border-2 px-5 text-left text-lg font-medium active:bg-sapin/10 ${
                  answers[step - 1] === o.value
                    ? "border-sapin bg-sapin/10"
                    : "border-stone-300 bg-white"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Écran 4 : le résultat personnalisé
  if (step === 4) {
    const [incidents, monthly, contested] = answers;
    const annual = monthly * 12;
    const maxCommission = Math.min(incidents * 8, 960);
    const quarter = Math.round(annual / 4);
    return (
      <div className={wrapper}>
        <header className="pt-6 font-display text-2xl font-bold">Agios</header>
        <main className="flex-1 pt-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-stone-600">
            Ton estimation
          </p>
          <p className="mt-2 font-display text-6xl font-bold leading-none text-brique">
            {eur(annual)}
          </p>
          <p className="mt-3 text-xl leading-snug">
            de frais bancaires par an, d'après tes réponses.
          </p>

          <div className="mt-8 rounded-xl border-2 border-dashed border-stone-400 bg-white p-5">
            <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-stone-300 pb-3">
              <span>Frais par mois (environ)</span>
              <span className="font-display text-xl font-bold">{eur(monthly)}</span>
            </div>
            {incidents > 0 && (
              <div className="border-b border-dashed border-stone-300 py-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span>Passages dans le rouge (environ)</span>
                  <span className="font-display text-xl font-bold">{incidents}</span>
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  Plafond légal de la commission d'intervention pour ces passages :{" "}
                  <strong>{eur(maxCommission)}</strong> (4 € par opération si ta
                  banque te classe en situation de fragilité).
                </p>
              </div>
            )}
            <div className="flex items-baseline justify-between gap-4 pt-3">
              <span>Si ta banque t'en rembourse seulement 1 sur 4</span>
              <span className="font-display text-xl font-bold text-sapin">
                {eur(quarter)}
              </span>
            </div>
          </div>

          <p className="mt-6 text-lg leading-snug">{CONTESTED_TEXT[contested]}</p>
          <p className="mt-4 text-lg leading-snug">
            Agios repère chaque ligne de frais sur ton relevé, la compare aux
            plafonds légaux et prépare le courrier à envoyer à ton agence.
          </p>
          <p className="mt-4 pb-6 text-sm text-stone-600">
            Cette estimation repose sur tes réponses, pas sur ton relevé. L'étape
            suivante le vérifie ligne par ligne.
          </p>
        </main>
        <Cta onClick={() => setStep(5)}>Voir ce que je peux récupérer</Cta>
      </div>
    );
  }

  // Écran 5 : provisoire, remplacé à la prochaine étape
  return (
    <div className={wrapper}>
      <header className="pt-6 font-display text-2xl font-bold">Agios</header>
      <main className="flex-1 pt-10">
        <h2 className="font-display text-3xl font-bold leading-tight">
          La suite arrive.
        </h2>
        <p className="mt-4 text-lg leading-snug">
          L'avant-goût de ton plan et le paiement seront construits à la
          prochaine étape.
        </p>
      </main>
      <Cta onClick={restart}>Recommencer</Cta>
    </div>
  );
}
