'use client';

import { useState } from 'react';
import { MapPin } from 'lucide-react';

/**
 * O iframe do Google só entra no DOM sob clique. O esqueleto tem proporção
 * fixa, então a troca não desloca nada (CLS zero), e o link direto para o
 * Google Maps funciona mesmo sem JavaScript.
 */
export function MapEmbed({ query, titulo }: { query: string; titulo: string }) {
  const [carregar, setCarregar] = useState(false);
  const q = encodeURIComponent(query);

  return (
    <div className="map-embed">
      {carregar ? (
        <iframe
          src={`https://www.google.com/maps?q=${q}&output=embed`}
          title={titulo}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="map-placeholder">
          <MapPin size={28} strokeWidth={1.5} aria-hidden="true" />
          <p>{query}</p>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setCarregar(true)}
          >
            Ver no mapa
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${q}`}
            target="_blank"
            rel="noopener"
          >
            Abrir no Google Maps
          </a>
        </div>
      )}
    </div>
  );
}
