"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    if (typeof window === "undefined") {
      return;
    }

    const phoneNumber = "5511999999999";
    const message = "Olá! Preciso de ajuda com a plataforma Drin.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 md:bottom-6 md:right-6">
      {isOpen && (
        <div className="absolute bottom-12 right-0 mb-2 bg-popover border border-border rounded-md p-3 shadow-md min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-foreground font-medium text-sm">Suporte</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground text-xs mb-3">
            Precisa de ajuda? Entre em contato conosco via WhatsApp
          </p>
          <Button onClick={handleWhatsAppClick} size="sm" className="w-full text-sm">
            <MessageCircle className="h-4 w-4 text-primary-foreground" />
            Abrir WhatsApp
          </Button>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon-sm"
        className="h-10 w-10 rounded-full shadow-md"
        aria-label="Abrir suporte"
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );
}
