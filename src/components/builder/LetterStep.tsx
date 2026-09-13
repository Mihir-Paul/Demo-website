import React from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";

interface LetterStepProps {
  letter: string;
  onChange: (letter: string) => void;
  error?: string;
}

export function LetterStep({ letter, onChange, error }: LetterStepProps) {
  const maxLength = 3000;
  const currentLength = letter.length;

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <CardHeader className="p-0 border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-pink-400">
            <MessageSquare className="w-5 h-5" /> Write something from the heart
          </CardTitle>
          <span className="text-xs font-mono text-slate-400">
            {currentLength}/{maxLength}
          </span>
        </div>
        <CardDescription>
          This is the personal letter or note they will discover and unwrap during their story experience.
        </CardDescription>
      </CardHeader>

      <div className="space-y-3">
        <Textarea
          placeholder={`Dear Shalini,\n\nI wanted to make something special for your birthday to remind you of how much you mean to everyone around you...`}
          value={letter}
          onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
          error={error}
          rows={10}
          className="font-sans text-sm leading-relaxed"
        />

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Line breaks and formatting will be preserved in the recipient view.</span>
          <span className={currentLength >= maxLength ? "text-rose-400 font-semibold" : ""}>
            {maxLength - currentLength} characters remaining
          </span>
        </div>
      </div>
    </Card>
  );
}
