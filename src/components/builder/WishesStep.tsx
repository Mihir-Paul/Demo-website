import React from "react";
import { Sparkles, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    <Card className="p-6 sm:p-8 space-y-6">
      <CardHeader className="p-0 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-5 h-5" /> Add a few birthday wishes
          </CardTitle>
          <span className="text-xs font-mono text-slate-400">
            {wishes.length}/{maxWishes} wishes
          </span>
        </div>
        <CardDescription>
          Add short bullet-point blessings or wishes for their upcoming year.
        </CardDescription>
      </CardHeader>

      <div className="space-y-3">
        {wishes.map((wish, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <span className="w-6 text-center text-xs font-bold text-emerald-400">
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
                className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30"
                title="Move Up"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveWish(index, "down")}
                disabled={index === wishes.length - 1}
                className="p-1.5 text-slate-500 hover:text-white disabled:opacity-30"
                title="Move Down"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveWish(index)}
                className="p-1.5 text-slate-500 hover:text-rose-400"
                title="Delete Wish"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {wishes.length === 0 && (
          <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
            No wishes added yet. Click below to add your first wish!
          </div>
        )}

        {wishes.length < maxWishes && (
          <Button
            type="button"
            variant="outline"
            onClick={handleAddWish}
            className="w-full gap-2 text-xs py-3 border-dashed border-slate-700"
          >
            <Plus className="w-4 h-4" /> Add Wish
          </Button>
        )}
      </div>
    </Card>
  );
}
