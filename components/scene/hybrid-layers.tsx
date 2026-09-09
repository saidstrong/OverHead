'use client';
/* oxlint-disable next/no-img-element -- Pre-optimized registered alpha plates use native picture sources; no runtime crop/image proxy may alter registration. Mounted only inside the existing lazy boundary. */

import { useCallback, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { hybridAssets } from './hybrid-assets';
import type { PlateSource } from './hybrid-assets';
import './hybrid-layers.css';

function Plate({
  source,
  placeholder,
  label,
  onReady,
  onError,
}: {
  source: PlateSource | null;
  placeholder: string;
  label: string;
  onReady: () => void;
  onError: () => void;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="hybrid-plate"
      data-asset-ready={ready}
      data-asset-failed={failed}
    >
      {!ready && (
        <img
          src={placeholder}
          alt=""
          width={1000}
          height={1250}
          decoding="async"
          onLoad={() => {
            if (!source) onReady();
          }}
        />
      )}
      {source && !failed && (
        <picture style={{ opacity: ready ? 1 : 0 }}>
          {source.mobile && (
            <source media="(max-width: 600px)" srcSet={source.mobile} />
          )}
          <img
            src={source.desktop}
            alt=""
            decoding="async"
            onLoad={async (event) => {
              const img = event.currentTarget;
              try {
                await img.decode();
                if (!img.isConnected) return;
                setReady(true);
                onReady();
              } catch {
                if (img.isConnected) onError();
              }
            }}
            onError={() => {
              setReady(false);
              setFailed(true);
              onError();
            }}
          />
        </picture>
      )}
      {!ready && (
        <span className="hybrid-asset-label">
          {label}
          <br />
          {failed ? 'Asset unavailable' : 'Placeholder · artwork pending'}
        </span>
      )}
    </div>
  );
}

export function HybridLayers({
  composite,
  onReady,
  onError,
}: {
  composite: RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onError: () => void;
}) {
  const decoded = useRef(new Set<string>());
  const plateReady = useCallback(
    (slot: string) => {
      decoded.current.add(slot);
      if (decoded.current.size === 3) onReady();
    },
    [onReady],
  );
  return (
    <div
      ref={composite}
      className="hybrid-layers"
      aria-hidden="true"
      data-hybrid-layers
    >
      <div className="hybrid-stage">
        <Plate
          source={hybridAssets.stage}
          placeholder="/media/overhead/stage-placeholder.svg"
          label="LIVE STAGE PLATE"
          onReady={() => plateReady('stage')}
          onError={onError}
        />
      </div>
      <div className="hybrid-cocktail" data-hybrid-cocktail>
        <div className="hybrid-cocktail__contact" />
        <div className="hybrid-cocktail__prepared">
          <Plate
            source={hybridAssets.prepared}
            placeholder="/media/overhead/prepared-placeholder.svg"
            label="RECEIVING GLASS"
            onReady={() => plateReady('prepared')}
            onError={onError}
          />
        </div>
        <div className="hybrid-cocktail__served">
          <Plate
            source={hybridAssets.served}
            placeholder="/media/overhead/served-placeholder.svg"
            label="RENDERED COCKTAIL"
            onReady={() => plateReady('served')}
            onError={onError}
          />
        </div>
      </div>
    </div>
  );
}
