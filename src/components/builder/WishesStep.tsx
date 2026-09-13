import React from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WishesStepProps {
  wishes: string[];
  onChange: (wishes: string[]) => void;
}

export function WishesStep({ wishes, onChange }: WishesStepProps) {
  const maxWishes = 8;

  const handleAddWish = () => {
    if (wishes.length >= maxWishes) return;
    onChange([...wishes, ""]);
  };

  const handleUpdateWish = (index: number, text: string) => {
    const updated = [...wishes];
    updated[index] = text;
    onChange(updated);
  };

  const handleRemoveWish = (index: number) => {
    onChange(wishes.filter((_, i) => i !== index));
  };

  const handleMoveWish = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= wishes.length) return;

    const reordered = [...wishes];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    onChange(reordered);
  };

  return (
    <div className="space-y-6 opacity-100">
      <div className="border-b border-slate-200 dark:border-[#29374A] pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#26364A] dark:text-[#F5F7FA] font-serif flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-[#8E7CC3]/15 border border-[#8E7CC3]/30 text-[#8E7CC3] dark:bg-[#F1D9A6]/20 dark:border-[#F1D9A6]/40 dark:text-[#F1D9A6] flex items-center justify-center text-base shrink-0 shadow-sm">
              ✨
            </span>
            Add a few birthday wishes
          </h2>
          <span className="text-xs font-mono text-[#26364A] dark:text-[#F5F7FA] bg-[#F7FBFF] dark:bg-[#182436] px-2.5 py-1 rounded-md border border-[#D7E8F5] dark:border-[#29374A]">
            {wishes.length}/{maxWishes} wishes
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#60758D] dark:text-[#A8B6C8] mt-1.5 leading-relaxed font-normal">
          Add short bullet-point blessings or wishes for their upcoming year.
        </p>
      </div>

      <div className="space-y-3">
        {wishes.map((wish, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <span className="w-6 text-center text-xs font-bold text-[#1688D4] dark:text-[#F1D9A6]">
              #{index + 1}
            </span>
            <Input
              placeholder={`e.g. More adventures together ✈️ or Endless reasons to smile ❤️`}
              value={wish}
              onChange={(e) => handleUpdateWish(index, e.target.value)}
              maxLength={150}
            />
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => handleMoveWish(index, "up")}
                disabled={index === 0}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#26364A] dark:hover:text-white disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveWish(index, "down")}
                disabled={index === wishes.length - 1}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-[#26364A] dark:hover:text-white disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveWish(index)}
                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-500"
                title="Delete Wish"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {wishes.length === 0 && (
          <div className="text-center py-6 border border-dashed border-[#D7E8F5] dark:border-[#29374A] rounded-xl text-xs text-[#60758D] dark:text-[#A8B6C8]">
            No wishes added yet. Click below to add your first wish!
          </div>
        )}

        {wishes.length < maxWishes && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddWish}
            className="w-full gap-2 text-xs py-3 border-dashed border-[#1688D4]/40 hover:border-[#1688D4] dark:border-[#A99AF4]/40 dark:hover:border-[#A99AF4]"
          >
            <Plus className="w-4 h-4" /> Add Wish
          </Button>
        )}
      </div>
    </div>
  );
}
