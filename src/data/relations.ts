export interface WordRelations {
  syn: string[]
  ant: string[]
}

export const wordRelations: Record<string, WordRelations> = {
  advocate: { syn: ['support', 'promote'], ant: ['oppose'] },
  ambiguous: { syn: ['unclear', 'vague'], ant: ['clear'] },
  anticipate: { syn: ['expect', 'foresee'], ant: ['overlook'] },
  coherent: { syn: ['logical', 'consistent'], ant: ['incoherent'] },
  compelling: { syn: ['convincing', 'persuasive'], ant: ['weak'] },
  deteriorate: { syn: ['worsen', 'decline'], ant: ['improve'] },
  diminish: { syn: ['decrease', 'reduce'], ant: ['increase'] },
  elaborate: { syn: ['detailed', 'complex'], ant: ['simple'] },
  empirical: { syn: ['observed', 'experimental'], ant: ['theoretical'] },
  feasible: { syn: ['possible', 'workable'], ant: ['impossible'] },
  fluctuate: { syn: ['vary', 'waver'], ant: ['stabilize'] },
  inevitable: { syn: ['unavoidable', 'certain'], ant: ['avoidable'] },
  inhibit: { syn: ['restrain', 'hinder'], ant: ['encourage'] },
  intricate: { syn: ['complex', 'complicated'], ant: ['simple'] },
  legitimate: { syn: ['valid', 'lawful'], ant: ['illegal'] },
  manipulate: { syn: ['control', 'influence'], ant: ['release'] },
  notorious: { syn: ['infamous'], ant: ['reputable'] },
  obsolete: { syn: ['outdated', 'outmoded'], ant: ['modern'] },
  persistent: { syn: ['continuous', 'determined'], ant: ['temporary'] },
  plausible: { syn: ['believable', 'credible'], ant: ['implausible'] },
  profound: { syn: ['deep', 'intense'], ant: ['shallow'] },
  reluctant: { syn: ['unwilling', 'hesitant'], ant: ['willing'] },
  sophisticated: { syn: ['complex', 'refined'], ant: ['simple'] },
  substantial: { syn: ['considerable', 'significant'], ant: ['minor'] },
  tentative: { syn: ['provisional', 'uncertain'], ant: ['definite'] },
  undermine: { syn: ['weaken', 'sabotage'], ant: ['strengthen'] },
  viable: { syn: ['workable', 'feasible'], ant: ['unviable'] },
  vulnerable: { syn: ['exposed', 'fragile'], ant: ['protected'] },
}

export function relationsFor(id: string): WordRelations | undefined {
  return wordRelations[id]
}
