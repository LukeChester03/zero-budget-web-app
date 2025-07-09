"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  section: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
};

export default function AddCategoryModal({ open, section, onClose, onConfirm }: Props) {
  const [input, setInput] = useState("");

  const handleConfirm = () => {
    const trimmed = input.trim();
    if (trimmed.length > 0) {
      onConfirm(trimmed);
      setInput("");
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center transition-colors duration-500">
      <div className="w-full max-w-sm bg-[var(--surface)] text-[var(--foreground)] p-6 rounded-lg shadow-xl space-y-4 border border-[var(--border)]">
        <h3 className="text-lg font-semibold">Add to {section}</h3>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--border)] rounded-md bg-[var(--surface-muted)] text-[var(--foreground)]"
          placeholder="e.g. Vet Bills"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded bg-[var(--surface-muted)] text-[var(--foreground)] border border-[var(--border)] hover:brightness-110"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm rounded bg-[var(--accent)] text-white hover:brightness-110"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
