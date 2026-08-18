export type EvidenceTip = {
  id: string;
  title: string;
  body: string;
  sourceName: string;
  sourceUrl: string;
  reviewedAt: string;
};

export const evidenceTips: EvidenceTip[] = [
  {
    id: 'consistency',
    title: '複雑さより、続けられる全身運動',
    body: '主要な筋肉を週2日以上動かし、できた内容から少しずつ増やします。毎回限界まで行う必要はありません。',
    sourceName: 'ACSM 2026 Resistance Training Position Stand',
    sourceUrl: 'https://acsm.org/resistance-training-guidelines-update-2026/',
    reviewedAt: '2026-08-18',
  },
  {
    id: 'protein_total',
    title: 'プロテインより先に、1日の合計',
    body: '健康な運動習慣のある成人では、食事を含む1日1.4〜2.0g/kgが目安です。補助は不足しそうな食事へ足します。',
    sourceName: 'ISSN Position Stand: Protein and Exercise',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/',
    reviewedAt: '2026-08-18',
  },
  {
    id: 'protein_timing',
    title: '「直後だけ」が正解ではありません',
    body: '1日の合計を優先し、20〜40g程度を数回に分けます。運動前後は、続けやすい食事や補助へ入れれば十分です。',
    sourceName: 'ISSN Position Stand: Nutrient Timing',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5596471/',
    reviewedAt: '2026-08-18',
  },
  {
    id: 'sleep',
    title: '回復も、トレーニングの一部',
    body: '成人は普段から7時間以上の睡眠が推奨されています。短く眠った日は、無理に前回を超えなくて大丈夫です。',
    sourceName: 'AASM / Sleep Research Society Consensus',
    sourceUrl: 'https://www.aasm.org/resources/pdf/adultsleepdurationconsensus.pdf',
    reviewedAt: '2026-08-18',
  },
];
