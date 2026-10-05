"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "./ui";
import { COUNTRIES, searchUniversities, type University } from "@/lib/universities";

interface Props {
  value: University | null;
  onChange: (university: University) => void;
  label?: string;
  required?: boolean;
  hint?: string;
}

/**
 * A searchable university combobox. The results panel is absolutely positioned
 * from `sm` up and falls back to an in-flow panel on small screens, so it can
 * never spill outside a phone viewport.
 */
export function UniversityPicker({ value, onChange, label = "School or university", required, hint }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState<University[]>([]);
  const [adding, setAdding] = useState(false);
  const [active, setActive] = useState(0);
  const [manual, setManual] = useState({ name: "", country: "", city: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const inputId = useId();

  const results = useMemo(() => searchUniversities(query, custom), [query, custom]);

  const grouped = useMemo(() => {
    if (query.trim()) return [{ letter: "Best matches", items: results }];
    const map = new Map<string, University[]>();
    for (const u of results) {
      const letter = u.name[0]?.toUpperCase() ?? "#";
      map.set(letter, [...(map.get(letter) ?? []), u]);
    }
    return [...map.entries()].map(([letter, items]) => ({ letter, items }));
  }, [results, query]);

  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setAdding(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (u: University) => {
    onChange(u);
    setQuery("");
    setOpen(false);
    setAdding(false);
    setError(null);
  };

  const addManual = async () => {
    const name = manual.name.trim();
    const country = manual.country.trim();
    if (name.length < 3) return setError("Enter the full name of your university.");
    if (!country) return setError("Choose the country.");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/universities", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, country, city: manual.city.trim() }),
      });
      const data = (await res.json()) as { university?: University; error?: string };
      if (!res.ok || !data.university) {
        setError(data.error ?? "We could not save that university.");
        return;
      }
      const created = data.university;
      setCustom((c) => (c.some((x) => x.id === created.id) ? c : [...c, created]));
      pick(created);
      setManual({ name: "", country: "", city: "" });
    } catch {
      setError("Network problem — please try again.");
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && open && flat[active]) {
      e.preventDefault();
      pick(flat[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      setAdding(false);
    }
  };

  let index = -1;

  return (
    <div ref={boxRef} className="relative">
      <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-semibold">
        {label}
        {required ? <span className="text-accentx"> *</span> : null}
      </label>

      {value ? (
        <div className="tagshape flex items-center gap-3 border border-rule bg-raised px-4 py-3">
          <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-accent/15 text-accentx">
            <Icon name="cap" size={16} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-semibold">{value.name}</span>
            <span className="block truncate text-[12px] text-ink3">
              {[value.city, value.country].filter(Boolean).join(", ")}
            </span>
          </span>
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              setQuery("");
            }}
            className="flex-none rounded-full border border-rule px-3 py-1.5 text-[12px] font-semibold text-ink2 hover:border-ink/30 hover:text-ink"
          >
            Change
          </button>
        </div>
      ) : (
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink3">
            <Icon name="search" size={16} />
          </span>
          <input
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && flat[active] ? `${listId}-${flat[active].id}` : undefined}
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(0);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder="Search your university…"
            className="w-full rounded-full border border-rule bg-transparent py-3 pl-11 pr-4 text-[14px] outline-none placeholder:text-ink3 focus:border-accent"
          />
        </div>
      )}

      {hint ? <p className="mt-1.5 text-[12px] text-ink3">{hint}</p> : null}

      {open && !value ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Universities"
          className="mt-2 max-h-[46vh] overflow-y-auto overscroll-contain border border-rule bg-raised p-2 tagshape sm:absolute sm:z-30 sm:max-h-[340px] sm:w-full sm:shadow-[0_18px_40px_-18px_var(--shadow)]"
        >
          {flat.length === 0 ? (
            <p className="px-3 py-4 text-[13px] text-ink3">
              No university matches “{query}”. Add it manually below.
            </p>
          ) : (
            grouped.map((group) => (
              <div key={group.letter} className="mb-1">
                <div className="eyebrow px-3 py-2">{group.letter}</div>
                {group.items.map((u) => {
                  index += 1;
                  const isActive = index === active;
                  return (
                    <button
                      key={u.id}
                      id={`${listId}-${u.id}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      onMouseEnter={() => setActive(flat.indexOf(u))}
                      onClick={() => pick(u)}
                      className={`flex w-full items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-left transition-colors ${
                        isActive ? "bg-accent/15" : "hover:bg-ink/5"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-semibold">{u.name}</span>
                        <span className="block truncate text-[11.5px] text-ink3">
                          {[u.city, u.country].filter(Boolean).join(", ")}
                        </span>
                      </span>
                      <span className="flex-none text-[10.5px] font-semibold uppercase tracking-wide text-ink3">
                        {u.region}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      ) : null}

      {!value ? (
        <div className="mt-3">
          {!adding ? (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accentx underline underline-offset-4"
            >
              <Icon name="plus" size={14} />
              Can’t find your university? Add it manually
            </button>
          ) : (
            <div className="tagshape border border-rule bg-raised p-4">
              <div className="eyebrow mb-3">Add your university</div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-[12.5px] font-semibold">University name</span>
                  <input
                    value={manual.name}
                    onChange={(e) => setManual((m) => ({ ...m, name: e.target.value }))}
                    placeholder="e.g. Eduardo Mondlane University"
                    className="w-full rounded-full border border-rule bg-transparent px-4 py-2.5 text-[13.5px] outline-none placeholder:text-ink3 focus:border-accent"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold">Country</span>
                  <input
                    list={`${listId}-countries`}
                    value={manual.country}
                    onChange={(e) => setManual((m) => ({ ...m, country: e.target.value }))}
                    placeholder="Start typing…"
                    className="w-full rounded-full border border-rule bg-transparent px-4 py-2.5 text-[13.5px] outline-none placeholder:text-ink3 focus:border-accent"
                  />
                  <datalist id={`${listId}-countries`}>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12.5px] font-semibold">
                    City <span className="font-normal text-ink3">(optional)</span>
                  </span>
                  <input
                    value={manual.city}
                    onChange={(e) => setManual((m) => ({ ...m, city: e.target.value }))}
                    className="w-full rounded-full border border-rule bg-transparent px-4 py-2.5 text-[13.5px] outline-none focus:border-accent"
                  />
                </label>
              </div>
              {error ? <p className="mt-3 text-[12.5px] text-negative">{error}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={addManual}
                  disabled={busy}
                  className="rounded-full bg-accent px-4 py-2 text-[13px] font-semibold text-onaccent disabled:opacity-60"
                >
                  {busy ? "Saving…" : "Save university"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false);
                    setError(null);
                  }}
                  className="rounded-full border border-rule px-4 py-2 text-[13px] font-semibold text-ink2"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
