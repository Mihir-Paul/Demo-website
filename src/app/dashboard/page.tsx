import Link from "next/link";
import { Gift, Plus, Sparkles, LayoutDashboard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DashboardPlaceholderPage() {
  return (
    <div className="relative min-h-screen bg-midnight-950 text-slate-100 py-10 px-4 sm:px-6">
      <div className="ambient-glow-pink top-[10%] left-[20%] opacity-30" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-rose-400" />
            <span className="font-serif font-semibold text-lg text-white">
              Creator Dashboard
            </span>
          </div>
        </div>

        {/* Dashboard Banner */}
        <Card className="p-8 border-rose-500/30">
          <CardHeader className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-medium border border-rose-500/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Coming Soon in Phase 2
              </div>
              <CardTitle className="text-2xl sm:text-3xl">
                Your Created Surprises
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Manage, edit, and track your active digital birthday gifts from one place.
              </CardDescription>
            </div>

            <Link href="/create">
              <Button size="lg" className="gap-2 shrink-0 shadow-lg shadow-rose-500/25">
                <Plus className="w-5 h-5" /> Create New Surprise
              </Button>
            </Link>
          </CardHeader>
        </Card>

        {/* Placeholder List */}
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
            <Gift className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-semibold text-white">
            No active dashboard surprises yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Once user accounts and management are enabled, your created surprises will appear here.
          </p>
          <Link href="/create" className="inline-block pt-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Start Creating
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
