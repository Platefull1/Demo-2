"use client";

import { StoreCarousel } from "@/components/store-carousel";
import { ReportsSection } from "@/components/reports-section";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { IfoodDashboard } from "@/components/ifood/IfoodDashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="w-full px-6 py-6 md:px-8 space-y-6 pb-24">
        {/* iFood Dashboard */}
        <section>
          <IfoodDashboard />
        </section>

        {/* Divisor */}
        <div className="border-t border-border" />

        {/* Store Carousel (Saipos) — tokens/spacing leves apenas */}
        <section className="space-y-4">
          <StoreCarousel />
        </section>

        {/* Reports Section (Saipos) — tokens/spacing leves apenas */}
        <section className="space-y-4">
          <ReportsSection />
        </section>
      </main>

      <WhatsAppButton />
    </div>
  );
}
