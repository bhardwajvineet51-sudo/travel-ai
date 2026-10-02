interface Props {
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
  multi?: boolean;
}

export default function PreferenceSelector({ options, selected, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-300"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
