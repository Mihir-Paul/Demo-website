import React from "react";
import { Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";

interface RecipientStepProps {
  recipientName: string;
  message: string;
  onChange: (fields: { recipientName?: string; message?: string }) => void;
  errors: { recipientName?: string; message?: string };
}

export function RecipientStep({
  recipientName,
  message,
  onChange,
  errors,
}: RecipientStepProps) {
  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <CardHeader className="p-0 border-b border-slate-800 pb-4">
        <CardTitle className="flex items-center gap-2 text-rose-400">
          <Heart className="w-5 h-5" /> Who is this surprise for?
        </CardTitle>
        <CardDescription>
          Personalize the main opening screen they will see when unwrapping their gift.
        </CardDescription>
      </CardHeader>

      <div className="space-y-5">
        <div>
          <Input
            label="Recipient's Name *"
            placeholder="e.g. Shalini, Alex, Mom..."
            value={recipientName}
            onChange={(e) => onChange({ recipientName: e.target.value })}
            error={errors.recipientName}
            maxLength={100}
          />
          <p className="text-[11px] text-slate-400 mt-1">
            The name will be prominently displayed on their story cover.
          </p>
        </div>

        <div>
          <Textarea
            label="Main Birthday Headline / Message *"
            placeholder="e.g. Happy Birthday! ❤️ Wishing you the happiest day ever!"
            value={message}
            onChange={(e) => onChange({ message: e.target.value })}
            error={errors.message}
            rows={3}
            maxLength={300}
          />
          <p className="text-[11px] text-rose-300/80 mt-1 italic">
            Tip: Make the first message something they'll instantly recognize.
          </p>
        </div>
      </div>
    </Card>
  );
}
