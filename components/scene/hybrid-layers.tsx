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
  onReady,
  onError,
}: {
  source: PlateSource | null;
  placeholder: string;
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
              const decodingSource = img.currentSrc;
              try {
                await img.decode();
                if (
                  !img.isConnected ||
                  img.currentSrc !== decodingSource ||
                  !img.complete
                )
                  return;
                setReady(true);
                onReady();
              } catch {
                // A responsive source change can cancel an older decode. The
                // replacement's load event owns readiness; it is not a failure.
                if (
                  img.isConnected &&
                  img.currentSrc === decodingSource &&
                  img.complete
                )
                  onError();
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
            onReady={() => plateReady('prepared')}
            onError={onError}
          />
        </div>
        <div className="hybrid-cocktail__served">
          <Plate
            source={hybridAssets.served}
            placeholder="/media/overhead/served-placeholder.svg"
            onReady={() => plateReady('served')}
            onError={onError}
          />
        </div>
      </div>
    </div>
  );
}
