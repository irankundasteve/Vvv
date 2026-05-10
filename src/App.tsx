/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw } from 'lucide-react';

// --- Constants & Types ---

const COLORS = {
  YELLOW: '#FFC90E',
  WHITE: '#FFFFFF',
  DARK: '#1E2228',
  TERRACOTTA: '#E07A4F',
  DUSTY_BLUE: '#6A9BC1',
  MUSTARD: '#DDB34A',
};

const FPS = 30;
const TOTAL_DURATION = 37.94; // seconds

// --- SVG Filters ---

const MotionBlurFilter = () => (
  <svg className="absolute w-0 h-0 invisible">
    <defs>
      <filter id="motionBlurHorizontal" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="15,0" />
      </filter>
      <filter id="motionBlurDiagonal" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5,5" />
      </filter>
    </defs>
  </svg>
);

// --- Component: Watermark ---

const Watermark = () => (
  <div id="watermark" className="absolute top-4 right-4 z-50 pointer-events-none opacity-90">
    <span className="text-white font-sans text-sm tracking-tight inline-flex items-center">
      fiverr<span className="text-[10px] align-top ml-0.5">®</span>
    </span>
  </div>
);

// --- Scenes ---

export default function App() {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(0);

  const startVideo = () => {
    setIsPlaying(true);
    startTimeRef.current = performance.now() - (time * 1000);
    const animate = (now: number) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      if (elapsed >= TOTAL_DURATION) {
        setTime(TOTAL_DURATION);
        setIsPlaying(false);
        return;
      }
      setTime(elapsed);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
  };

  const pauseVideo = () => {
    setIsPlaying(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const resetVideo = () => {
    pauseVideo();
    setTime(0);
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const sceneIndex = useMemo(() => {
    if (time < 2.83) return 0;
    if (time < 5.80) return 1;
    if (time < 9.20) return 2;
    if (time < 13.40) return 3;
    if (time < 17.80) return 4;
    if (time < 20.20) return 5;
    if (time < 22.20) return 6;
    if (time < 24.30) return 7;
    if (time < 29.30) return 8;
    if (time < 33.00) return 9;
    return 10;
  }, [time]);

  // Background color logic
  const bgColor = useMemo(() => {
    if (time >= 33.00) return COLORS.YELLOW;
    if (time >= 29.80) return COLORS.YELLOW;
    if (time >= 24.50) return COLORS.YELLOW;
    if (time >= 22.50) return COLORS.MUSTARD;
    if (time >= 20.60) return COLORS.DUSTY_BLUE;
    if (time >= 18.30) return COLORS.TERRACOTTA;
    return COLORS.YELLOW;
  }, [time]);

  const transitions = {
    snap: { type: "spring", stiffness: 400, damping: 30, restDelta: 0.001 },
    overshoot: { type: "spring", stiffness: 500, damping: 25, mass: 1 },
    linear: { duration: 0.1, ease: "linear" },
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans uppercase overflow-hidden">
      <MotionBlurFilter />
      
      {/* 1920x1080 Canvas (Scaled to fit) */}
      <div 
        id="video-container"
        className="relative bg-white shadow-2xl overflow-hidden aspect-video w-full max-w-[1280px] bg-[#FFC90E] transition-colors duration-200"
        style={{ 
          backgroundColor: bgColor,
          backgroundImage: time < 18.30 ? `radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 100%)` : 'none'
        }}
      >
        <Watermark />

        {/* --- SCENE 1: WANT TO INCREASE YOUR SALES! (0:00 - 2:83) --- */}
        {time < 2.83 && (
          <div className="absolute inset-0 flex flex-col items-start justify-center pl-[20%]">
            {time >= 0.33 && (
              <motion.div
                initial={{ x: "100%", opacity: 0, scaleX: 3 }}
                animate={{ x: 0, opacity: 1, scaleX: 1 }}
                transition={{ duration: 11/30, ease: [0.12, 0, 0.39, 0] }}
                className="text-4xl font-black text-dark tracking-tighter"
                style={{ filter: time < 0.70 ? 'url(#motionBlurHorizontal)' : 'none' }}
              >
                WANT TO
              </motion.div>
            )}
            {time >= 0.70 && (
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-8xl font-black text-white leading-[0.8]"
                style={{ filter: time < 1.16 ? 'url(#motionBlurHorizontal)' : 'none' }}
              >
                INCREASE
              </motion.div>
            )}
            <div className="flex items-end gap-4 mt-2">
              {time >= 1.16 && (
                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="text-5xl font-black text-[#1E2228]/80"
                  style={{ filter: time < 1.66 ? 'url(#motionBlurHorizontal)' : 'none' }}
                >
                  YOUR
                </motion.div>
              )}
              {time >= 1.16 && (
                <motion.div
                  initial={{ y: 50, scale: 0.85 }}
                  animate={{ y: 0, scale: 1 }}
                  transition={transitions.overshoot}
                  className="text-7xl font-black text-white flex items-center h-[1.1em]"
                >
                  SAL
                  {time >= 1.66 && (
                    <span className="flex">
                      <motion.span 
                        initial={{ x: 50, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        E
                      </motion.span>
                      <motion.span 
                        initial={{ x: 50, opacity: 0 }} 
                        animate={{ x: 0, opacity: 1 }} 
                        transition={{ delay: 3/30, duration: 0.2, ease: "easeOut" }}
                      >
                        S
                      </motion.span>
                    </span>
                  )}
                </motion.div>
              )}
              {time >= 2.16 && (
                <div className="relative w-12 h-20 ml-2">
                   <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: "70%" }} 
                    transition={{ duration: 0.15 }}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3 border-4 border-dark"
                  />
                   <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ delay: 0.2, duration: 0.1 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-dark"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- SCENE 2: NEED AN ANIMATED VIDEO (2.83 - 5.80) --- */}
        {time >= 2.83 && time < 6.00 && (
          <div className="absolute inset-0 bg-[#FFC90E]">
            {/* Transition from Scene 1 */}
            {time < 3.50 && (
               <motion.div 
               initial={{ rotate: 0, scale: 1, x: 0 }}
               animate={{ rotate: -90, scale: 0.35, x: "-35%" }}
               transition={{ duration: 20/30, ease: "easeOut" }}
               className="absolute inset-0 flex flex-col items-start justify-center pl-[20%] pointer-events-none opacity-40"
             >
                <div className="text-4xl font-black text-dark">WANT TO</div>
                <div className="text-8xl font-black text-white leading-[0.8]">INCREASE</div>
                <div className="flex items-end gap-4 mt-2">
                  <div className="text-5xl font-black text-[#1E2228]/80">YOUR</div>
                  <div className="text-7xl font-black text-white">SALES</div>
                </div>
             </motion.div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {time >= 3.50 && (
                <motion.div
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={transitions.overshoot}
                  className="text-6xl font-black text-white mb-2"
                >
                  NEED
                </motion.div>
              )}
              {time >= 4.10 && (
                <div className="flex gap-4">
                  <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={transitions.snap}
                    className="text-4xl font-black text-white"
                  >
                    AN
                  </motion.div>
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={transitions.snap}
                    className="text-4xl font-black text-dark"
                  >
                    ANIMATED
                  </motion.div>
                </div>
              )}
              {time >= 4.66 && (
                <div className="relative mt-2">
                   <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-8xl font-black text-white"
                  >
                    { "VIDEO".split("").map((l, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06, duration: 0.1 }}
                      >
                        {l}
                      </motion.span>
                    ))}
                  </motion.div>
                  {/* Ticks from O */}
                  {time >= 4.66 && time < 5.20 && (
                    <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-20 h-20">
                      {[...Array(12)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{ scale: [0, 1.2, 1], opacity: [1, 1, 0] }}
                          transition={{ duration: 0.2, delay: 4.66 - 4.66 }} // instant on landing
                          className="absolute w-4 h-0.5 bg-white left-1/2 top-1/2"
                          style={{ 
                            transform: `rotate(${i * 30}deg) translateX(40px)`,
                            transformOrigin: 'left'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              {time >= 5.20 && (
                <motion.div
                  initial={{ y: 0, opacity: 0.5 }}
                  animate={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute text-center"
                >
                  <div className="text-4xl font-black text-dark mt-[-2px]">ANIMATED</div>
                  <div className="text-8xl font-black text-white">VIDEO</div>
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* --- SCENE 3: UNIQUE TYPOGRAPHY PACK FOR YOUR PROJECT (6:00 - 9:20) --- */}
        {time >= 6.00 && time < 9.20 && (
          <motion.div 
            id="scene-3"
            animate={{ 
              rotate: time > 8.33 ? 20 : 0,
              scale: time > 8.33 ? 1.3 : 1,
              filter: time > 9.0 ? 'blur(10px)' : 'none'
            }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
             {time >= 6.00 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={transitions.overshoot}
                  className="text-[120px] font-black text-white leading-none"
                >
                  UNIQUE
                </motion.div>
              )}
              {time >= 6.50 && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={transitions.overshoot}
                  className="text-6xl font-black text-dark"
                >
                  TYPOGRAPHY
                </motion.div>
              )}
              {time >= 7.16 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-black text-dark mt-2 tracking-widest"
                >
                  PACK FOR YOUR
                </motion.div>
              )}
              {time >= 7.83 && (
                <motion.div
                  initial={{ x: "100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-8xl font-black text-white"
                  style={{ filter: 'url(#motionBlurHorizontal)' }}
                >
                  PROJECT
                </motion.div>
              )}
              {/* Floating circles */}
              {time >= 7.16 && [...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: (i % 2 === 0 ? -1 : 1) * (150 + Math.random() * 100), y: (i % 3 === 0 ? -1 : 1) * (100 + Math.random() * 50) }}
                  animate={{ scale: 1, y: "-=30" }}
                  transition={{ duration: 8/30, delay: i * 0.05 }}
                  className={`absolute rounded-full border-2 border-white ${i % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}
                  style={{ width: 10 + Math.random() * 30, height: 10 + Math.random() * 30 }}
                />
              ))}
          </motion.div>
        )}

        {/* --- SCENE 4: KINETIC TYPO USED TO PROMOTE YOUR BUSINESS (10:00 - 13:40) --- */}
        {time >= 10.00 && time < 13.50 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-12">
            <div className="flex items-center gap-4 w-full">
              <div className="text-6xl font-black text-white">KINETIC TYPO</div>
              {time >= 10.60 && (
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 16/30 }}
                  className="text-4xl font-black text-white whitespace-nowrap"
                  style={{ 
                    filter: time < 11.16 ? 'url(#motionBlurHorizontal)' : 'none',
                    letterSpacing: (time > 10.60 && time < 10.60 + 3/30) ? '-0.1em' : 'normal'
                  }}
                >
                  USED TO PROMOTE
                </motion.div>
              )}
            </div>
            <div className="flex items-center gap-8 mt-6 w-full justify-start">
              {time >= 11.16 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-7xl font-black text-dark"
                >
                  YOUR
                </motion.div>
              )}
              {time >= 11.16 && (
                <div className="flex">
                  {"BUSINESS".split("").map((l, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: 100, rotate: 15, opacity: 0 }}
                      animate={{ y: 0, rotate: i === 7 && time > 12.5 ? [0, -5, 5, 0] : 0, opacity: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      className="text-8xl font-black text-white"
                    >
                      {l}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {/* Ambient floaters */}
            {time >= 12.00 && [...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 300 + Math.random() * 100, y: 400, opacity: 0.6 }}
                animate={{ x: "-=100", y: -100 }}
                transition={{ duration: 5, repeat: Infinity, delay: i * 0.3 }}
                className={`absolute rounded-full border-2 border-white ${i % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}
                style={{ width: 10 + Math.random() * 20, height: 10 + Math.random() * 20, zIndex: i % 2 === 0 ? 10 : -1 }}
              />
            ))}
          </div>
        )}

        {/* --- SCENE 5: TITLES ANIMATION GRAPHIC PACK (13:50 - 17:80) --- */}
        {time >= 13.50 && time < 18.00 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {time >= 13.50 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-2 text-xl font-black text-dark tracking-[0.2em]"
              >
                TITLES ANIMATION GRAPHIC PACK
              </motion.div>
            )}
            <div className="relative h-20 w-[80%] max-w-[600px]">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-dark"
              />
              {time >= 14.16 && (
                <div className="absolute inset-0 flex items-center justify-center px-8">
                   {"STYLISH ANIMATED TITLES".split("").map((l, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 2/30 }}
                        className="text-2xl font-black text-white tracking-widest inline-block"
                      >
                        {l === " " ? "\u00A0" : l}
                        {/* Cursor Logic: Only show for the latest character */}
                        <motion.div 
                          className="h-[2px] bg-white absolute bottom-4 w-4"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          transition={{ delay: (i + 1) * 2/30 }}
                        />
                      </motion.span>
                   ))}
                </div>
              )}
              {/* Optional Pulsing Pulse element */}
              {time >= 15.33 && (
                <motion.div
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute bottom-[-10px] left-0 right-0 h-[1px] bg-white opacity-50"
                />
              )}
            </div>
          </div>
        )}

        {/* SCENE 6: CUSTOM COLORS (18:30 - 20:20) */}
        {time >= 18.30 && time < 20.20 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {time >= 18.80 && (
               <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-7xl font-black text-white mb-4"
              >
                CUSTOM
              </motion.div>
            )}
            {time >= 19.50 && (
              <div className="flex">
                 {"COLORS".split("").map((l, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1.2, 1], opacity: 1 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
                    className="text-9xl font-black text-white leading-none"
                  >
                    {l}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SCENE 7: CUSTOM FONTS (20:60 - 22:20) */}
        <AnimatePresence>
          {time >= 20.60 && time < 22.20 && (
            <motion.div
              initial={{ scale: 2, opacity: 0, filter: 'blur(20px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-8xl font-black text-white text-center leading-tight">
                CUSTOM<br/>FONTS
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SCENE 8: FULL HD (22:50 - 24:30) */}
        {time >= 22.50 && time < 24.30 && (
          <div className="absolute inset-0 flex items-center justify-center">
             {time >= 22.80 && (
              <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-[140px] font-black text-dark"
              >
                FULL HD
              </motion.div>
            )}
          </div>
        )}

        {/* SCENE 9: YOUR SCRIPTS TURNED INTO AMAZING VIDEOS (24:50 - 29:30) */}
        {time >= 24.50 && time < 29.30 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {time < 27.80 ? (
              <div className="flex flex-col items-center">
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: time >= 26.50 ? -10 : 0 }}
                    className="text-4xl font-black text-white"
                  >
                    YOUR
                  </motion.div>
                  {time >= 26.50 && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-8xl font-black text-dark my-2 relative"
                    >
                      TURNED
                      <div className="absolute inset-0 pointer-events-none">
                         {[...Array(16)].map((_, i) => (
                           <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1, 0] }}
                            transition={{ duration: 0.33 }}
                            className="absolute w-6 h-1 bg-dark left-1/2 top-1/2"
                            style={{ 
                              transform: `rotate(${i * 22.5}deg) translateX(120px)`,
                              transformOrigin: 'left'
                            }}
                           />
                         ))}
                      </div>
                    </motion.div>
                  )}
                  <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ opacity: 1, y: time >= 26.50 ? 10 : 0 }}
                    className="text-8xl font-black text-white drop-shadow-sm"
                  >
                    SCRIPTS
                  </motion.div>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="flex gap-4">
                  <div className="text-5xl font-black text-white">INTO</div>
                  <div className="text-7xl font-black text-dark">AMAZING</div>
                </div>
                {time >= 28.50 && (
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-9xl font-black text-white relative"
                  >
                    VIDEOS
                    <div className="absolute inset-0">
                       {[...Array(12)].map((_, i) => (
                           <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.2, 0] }}
                            transition={{ duration: 0.3 }}
                            className="absolute w-8 h-1 bg-white left-1/2 top-1/2"
                            style={{ 
                              transform: `rotate(${i * 30}deg) translateX(180px)`,
                              transformOrigin: 'left'
                            }}
                           />
                         ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* SCENE 10: EXCLUSIVELY ON (29:80 - 33:00) */}
        {time >= 29.80 && time < 33.00 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
             {time < 31.50 && (
               <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
                className="text-8xl font-black text-dark mb-4"
              >
                EXCLUSIVELY
              </motion.div>
             )}
             {time >= 30.80 && (
               <motion.div 
                animate={{ scale: time > 31.50 ? 1.05 : 1 }}
                className="text-9xl font-black text-[#1E2228] relative"
               >
                 ON
                 {time < 30.80 + 0.20 && (
                    <motion.div
                      className="absolute inset-0 text-white opacity-20"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      AVAILABLE
                    </motion.div>
                 )}
               </motion.div>
             )}
          </div>
        )}

        {/* SCENE 11: FIVERR END CARD (33:00 - 37:94) */}
        {time >= 33.00 && (
          <div className="absolute inset-0 bg-[#FFC90E] flex flex-col items-center justify-center">
             <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 20/30, ease: "easeOut" }}
              className="w-[260px] h-[260px] bg-dark rounded-full flex items-center justify-center"
            >
               <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 20/30 }}
                className="text-white font-black text-5xl tracking-tighter"
              >
                fiverr<span className="text-xl align-top ml-1">®</span>
              </motion.div>
            </motion.div>
            {time > 37.50 && (
              <motion.div 
                className="absolute inset-0 bg-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
              />
            )}
          </div>
        )}

        {/* Watermark Persistent */}
        <Watermark />
      </div>

      {/* Controls */}
      <div className="mt-8 flex flex-col items-center gap-4 w-full max-w-[736px] bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
        <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 h-full bg-yellow-400 transition-all duration-100 ease-linear"
            style={{ width: `${(time / TOTAL_DURATION) * 100}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between w-full">
          <div className="text-white font-mono text-lg font-bold">
            {time.toFixed(2)}s / {TOTAL_DURATION}s
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={resetVideo}
              className="p-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
            >
              <RotateCcw size={24} />
            </button>
            <button 
              onClick={isPlaying ? pauseVideo : startVideo}
              className="w-16 h-16 flex items-center justify-center bg-yellow-400 text-black rounded-full hover:scale-105 transition-transform active:scale-95"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <div className="w-10" /> {/* Spacer */}
          </div>

          <div className="text-gray-400 font-medium tracking-wider text-sm">
            SCENE {sceneIndex + 1}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 flex gap-4 text-xs text-gray-500 uppercase tracking-widest font-bold">
        <span>1920×1080 (FULL HD)</span>
        <span>•</span>
        <span>30 FPS</span>
        <span>•</span>
        <span>37.94s</span>
      </div>
    </div>
  );
}
