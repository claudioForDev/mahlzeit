import { useState } from 'react';
import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  className?: string;
}

// Natives Teilen-Menü (Handy, Safari, Edge); sonst Link in die Zwischenablage kopieren
export function ShareButton({ title, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User hat das Teilen-Menü geschlossen, kein Fehler
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button type="button" className={className} onClick={handleShare}>
      <Share2 size={18} /> {copied ? 'Link kopiert' : 'Teilen'}
    </button>
  );
}
