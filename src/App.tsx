/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player } from '@remotion/player';
import { PromoVideo } from './remotion/PromoVideo';
import { RotateCcw } from 'lucide-react';
import { useRef } from 'react';

const TOTAL_DURATION_SEC = 37.94;
const FPS = 30;
const DURATION_IN_FRAMES = Math.floor(TOTAL_DURATION_SEC * FPS);

export default function App() {
  const playerRef = useRef<{ seekTo: (frame: number) => void; play: () => void; pause: () => void }>(null);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 font-sans uppercase overflow-hidden text-white">
      
      {/* 1920x1080 Canvas (Scaled to fit via Player) */}
      <div 
        id="video-container"
        className="relative bg-white shadow-2xl overflow-hidden aspect-video w-full max-w-[1280px] bg-[#FFC90E] transition-colors duration-200 border border-gray-800 rounded-xl"
      >
        <Player
          ref={playerRef as any}
          component={PromoVideo}
          durationInFrames={DURATION_IN_FRAMES}
          compositionWidth={1920}
          compositionHeight={1080}
          fps={FPS}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          autoPlay
          loop
        />
      </div>

      {/* Info & Secondary Controls */}
      <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-[1280px] bg-gray-900/50 p-6 rounded-2xl border border-gray-800 backdrop-blur-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <span className="text-gray-400 font-mono text-xs tracking-widest mb-1">REMOTION RENDER ENGINE</span>
            <div className="text-white font-mono text-lg font-bold">
              {TOTAL_DURATION_SEC}s / {FPS} FPS
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => playerRef.current?.seekTo(0)}
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-colors flex items-center gap-2 text-xs font-bold"
            >
              <RotateCcw size={18} />
              RESTART
            </button>
          </div>

          <div className="text-gray-400 font-medium tracking-wider text-xs flex flex-col items-end">
            <span>COMPOSITION: PROMO_VIDEO</span>
            <span>1920×1080 (FULL HD)</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex gap-4 text-xs text-gray-600 uppercase tracking-[0.3em] font-bold">
        <span>Powered by Remotion</span>
        <span>•</span>
        <span>Kinetic Typography</span>
      </div>
    </div>
  );
}
