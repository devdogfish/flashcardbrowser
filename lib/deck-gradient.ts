const GRADIENTS = [
  "from-slate-700 to-slate-900",
  "from-zinc-600 to-zinc-800",
  "from-stone-600 to-stone-800",
  "from-neutral-600 to-neutral-800",
  "from-gray-600 to-gray-900",
  "from-slate-600 to-zinc-800",
  "from-zinc-700 to-stone-900",
  "from-stone-700 to-neutral-900",
];

export function cardGradient(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return GRADIENTS[hash % GRADIENTS.length];
}
