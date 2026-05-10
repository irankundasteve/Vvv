import React from 'react';
import { 
  AbsoluteFill, 
  Sequence, 
  interpolate, 
  useCurrentFrame, 
  useVideoConfig, 
  spring,
  Easing
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';

const { fontFamily } = loadFont();

// Styles
const containerStyle: React.CSSProperties = {
  backgroundColor: '#FFC90E',
  fontFamily,
  textTransform: 'uppercase',
  overflow: 'hidden',
};

const watermarkStyle: React.CSSProperties = {
  position: 'absolute',
  top: 40,
  right: 40,
  color: 'white',
  fontSize: 24,
  fontWeight: 400,
  opacity: 0.9,
  zIndex: 100,
};

const vignetteStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'radial-gradient(circle, rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 100%)',
  pointerEvents: 'none',
  zIndex: 90,
};

// --- Animations & Transitions ---

const fastBounce = (frame: number, fps: number, delay: number = 0) => {
  return spring({
    frame: frame - delay,
    fps,
    config: {
      stiffness: 200,
      damping: 10,
    },
  });
};

const snapyEaseOut = (frame: number, duration: number, delay: number = 0) => {
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });
};

// --- Scene Components ---

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // WANT TO: 0:33–0:70 (10–21f)
  const showWantTo = frame >= 10;
  const wantToOpacity = interpolate(frame - 10, [0, 11], [0, 1], { extrapolateLeft: 'clamp' });
  const wantToScaleX = interpolate(frame - 10, [0, 11], [3, 1], { extrapolateLeft: 'clamp' });
  const wantToX = interpolate(frame - 10, [0, 11], [200, 0], { 
    extrapolateLeft: 'clamp', 
    easing: Easing.out(Easing.poly(4)) 
  });
  
  // INCREASE: 0:70–1:16 (21–35f)
  const showIncrease = frame >= 21;
  const increaseOpacity = interpolate(frame - 21, [0, 5], [0, 1], { extrapolateLeft: 'clamp' });
  const increaseX = interpolate(frame - 21, [0, 14], [-500, 0], { 
    easing: Easing.bezier(0.12, 0, 0.39, 0),
    extrapolateLeft: 'clamp' 
  });
  const increaseBlur = interpolate(frame - 21, [0, 14], [40, 0], { extrapolateLeft: 'clamp' });

  // YOUR & SAL: 1:16–1:66 (35–50f)
  const showYourSal = frame >= 35;
  const yourX = interpolate(frame - 35, [0, 10], [500, 0], { extrapolateLeft: 'clamp', easing: Easing.out(Easing.quad) });
  const yourOpacity = interpolate(frame - 35, [0, 5], [0, 1], { extrapolateLeft: 'clamp' });
  const salBounce = spring({ 
    frame: frame - 35, 
    fps, 
    config: { stiffness: 150, damping: 10, mass: 1 } 
  });

  // E S: 1:66–2:16 (50–65f)
  const showES = frame >= 50;

  // !: 2:16–2:83 (65–85f)
  const showBang = frame >= 65;
  const bangStrokeH = interpolate(frame - 65, [0, 5], [0, 150], { extrapolateRight: 'clamp' });
  const bangDotScale = spring({ frame: frame - 71, fps, config: { stiffness: 200 } });

  return (
    <AbsoluteFill>
      {showWantTo && (
        <div style={{
          position: 'absolute',
          left: '65%', top: '30%',
          fontSize: 70, fontWeight: 900, color: '#1E2228',
          opacity: wantToOpacity,
          transform: `translateX(${wantToX}px) scaleX(${wantToScaleX})`,
          filter: frame < 21 ? 'blur(10px)' : 'none',
        }}>
          WANT TO
        </div>
      )}
      {showIncrease && (
        <div style={{
          position: 'absolute',
          left: '15%', top: '38%',
          fontSize: 240, fontWeight: 900, color: 'white',
          opacity: increaseOpacity,
          transform: `translateX(${increaseX}px)`,
          filter: `blur(${increaseBlur}px)`,
          lineHeight: 0.8
        }}>
          INCREASE
        </div>
      )}

      <div style={{ 
        position: 'absolute', left: '15%', top: '58%', 
        display: 'flex', alignItems: 'flex-end' 
      }}>
        {showYourSal && (
          <div style={{
            fontSize: 100, fontWeight: 900, color: '#1E2228', opacity: yourOpacity,
            transform: `translateX(${yourX}px)`,
            marginRight: 40
          }}>
            YOUR
          </div>
        )}
        {showYourSal && (
          <div style={{
            fontSize: 200, fontWeight: 900, color: 'white',
            transform: `scale(${1 + (1 - salBounce) * 0.15})`,
            display: 'flex'
          }}>
            SAL
            {showES && (
              <>
                <span style={{ 
                   display: 'inline-block',
                   opacity: interpolate(frame - 50, [0, 5], [0, 1]),
                   transform: `translateX(${interpolate(frame - 50, [0, 10], [50, 0])}px)`
                }}>E</span>
                <span style={{ 
                   display: 'inline-block',
                   opacity: interpolate(frame - 53, [0, 5], [0, 1]),
                   transform: `translateX(${interpolate(frame - 53, [0, 10], [50, 0])}px)`
                }}>S</span>
              </>
            )}
          </div>
        )}

        {showBang && (
          <div style={{ position: 'relative', width: 40, height: 200, marginLeft: 20 }}>
            <div style={{
              position: 'absolute', top: 0, left: 10, width: 25,
              height: bangStrokeH,
              border: '8px solid #1E2228',
              backgroundColor: 'transparent'
            }} />
            {frame >= 71 && (
              <div style={{
                position: 'absolute', bottom: 0, left: 10, width: 25, height: 25,
                backgroundColor: '#1E2228',
                transform: `scale(${bangDotScale})`
              }} />
            )}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// Note: Scene 2 starts at 2.83s (85 frames)
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 2:83–3:50 (0–20f): Transition from S1
  const transitionRotate = interpolate(frame, [0, 20], [0, -90], { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });
  const transitionScale = interpolate(frame, [0, 20], [1, 0.35], { extrapolateRight: 'clamp' });
  const transitionX = interpolate(frame, [0, 20], [0, -([1920*0.15])], { extrapolateRight: 'clamp' });

  // 3:50–4:10 (20–38f): NEED
  const showNeed = frame >= 20;
  const needScale = spring({ frame: frame - 20, fps, config: { stiffness: 250, damping: 20 } });
  
  // 4:10–4:66 (38–55f): AN & ANIMATED
  const showAnAnimated = frame >= 38;
  const anX = interpolate(frame - 38, [0, 17], [-300, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.poly(3)) });
  const animatedX = interpolate(frame - 38, [0, 17], [300, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.poly(3)) });

  // 4:66–5:20 (55–71f): VIDEO
  const showVideo = frame >= 55;
  
  // 5:20–5:80 (71–89f): Echo
  const showEcho = frame >= 71;

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E' }}>
      {/* S1 Pivot Transition */}
      {frame < 40 && (
         <div style={{
          position: 'absolute', left: '15%', top: '50%',
          transform: `translateX(${transitionX}px) rotate(${transitionRotate}deg) scale(${transitionScale})`,
          transformOrigin: 'left center',
          opacity: interpolate(frame, [20, 30], [0.4, 0])
        }}>
          <div style={{ fontSize: 60, fontWeight: 900, color: '#1E2228' }}>WANT TO</div>
          <div style={{ fontSize: 220, fontWeight: 900, color: 'white', lineHeight: 0.8 }}>INCREASE</div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
             <div style={{ fontSize: 80, fontWeight: 900, color: '#1E2228', marginRight: 30 }}>YOUR</div>
             <div style={{ fontSize: 150, fontWeight: 900, color: 'white' }}>SALES</div>
          </div>
        </div>
      )}

      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%',
        paddingLeft: '10%'
      }}>
         {showNeed && (
           <div style={{ 
             fontSize: 140, color: 'white', fontWeight: 900,
             transform: `scale(${interpolate(needScale, [0, 1], [1.1, 1])})`,
             opacity: interpolate(frame - 20, [0, 5], [0, 1])
           }}>
             NEED
           </div>
         )}
         {showAnAnimated && (
           <div style={{ display: 'flex', gap: 30, marginTop: 20 }}>
              <div style={{ fontSize: 90, color: 'white', fontWeight: 900, transform: `translateX(${anX}px)` }}>AN</div>
              <div style={{ fontSize: 90, color: '#1E2228', fontWeight: 900, transform: `translateX(${animatedX}px)` }}>ANIMATED</div>
           </div>
         )}
         {showVideo && (
           <div style={{ fontSize: 180, color: 'white', fontWeight: 900, position: 'relative', marginTop: 10 }}>
              {"VIDEO".split('').map((l, i) => (
                <span key={i} style={{ 
                   display: 'inline-block',
                   opacity: interpolate(frame - (55 + i * 2), [0, 1], [0, 1])
                }}>{l}</span>
              ))}
              
              {/* Radiating Ticks from O */}
              {frame >= 63 && frame < 75 && (
                 <div style={{ position: 'absolute', left: '85%', top: '50%' }}>
                    {[...Array(12)].map((_, i) => (
                      <div key={i} style={{
                        position: 'absolute', width: 40, height: 4, backgroundColor: 'white',
                        transformOrigin: 'left center',
                        transform: `rotate(${i * 30}deg) translateX(40px)`,
                        opacity: interpolate(frame - 63, [0, 6, 12], [0, 1, 0])
                      }} />
                    ))}
                 </div>
              )}
           </div>
         )}

         {showEcho && (
            <div style={{
              position: 'absolute', top: 'calc(50% + 50px)', opacity: 0.5,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              transform: 'translateY(10px)'
            }}>
               <div style={{ fontSize: 90, color: '#1E2228', fontWeight: 900, opacity: 0.3 }}>ANIMATED</div>
               <div style={{ fontSize: 180, color: 'white', fontWeight: 900, opacity: 0.3 }}>VIDEO</div>
            </div>
         )}
      </div>
    </AbsoluteFill>
  );
};

// Scene 3 starts at 6.00s (180 frames)
const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Offset 6 frames because of black cut in Sequence
  const sceneFrame = frame;

  // 6:00–6:50 (0–15f): UNIQUE
  const uniqueScale = interpolate(sceneFrame, [0, 15], [0.8, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.poly(3)) });
  const uniqueOpacity = interpolate(sceneFrame, [0, 5], [0, 1], { extrapolateRight: 'clamp' });

  // 6:50–7:16 (15–35f): TYPOGRAPHY
  const typoY = interpolate(sceneFrame - 15, [0, 20], [-200, 0], { 
    extrapolateRight: 'clamp', 
    easing: Easing.out(Easing.bounce) 
  });
  
  // 7:16–7:83 (35–55f): PACK & Circles
  const showPack = sceneFrame >= 35;
  
  // 7:83–8:33 (55–70f): PROJECT
  const projectX = interpolate(sceneFrame - 55, [0, 15], [1000, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.poly(2)) });
  const projectBlur = interpolate(sceneFrame - 55, [0, 15], [40, 0], { extrapolateRight: 'clamp' });

  // 8:33–9:20 (70–102f): Rotate/Scale/Wipe
  const finalRotate = interpolate(sceneFrame - 70, [0, 32], [0, 20], { extrapolateRight: 'clamp', easing: Easing.in(Easing.poly(2)) });
  const finalScale = interpolate(sceneFrame - 70, [0, 32], [1, 1.4], { extrapolateRight: 'clamp', easing: Easing.in(Easing.poly(2)) });
  const finalBlur = interpolate(sceneFrame - 95, [0, 7], [0, 20], { extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: '#FFC90E', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transform: `rotate(${finalRotate}deg) scale(${finalScale})`,
      filter: `blur(${finalBlur}px)`,
      overflow: 'hidden'
    }}>
       <div style={{ 
         fontSize: 220, color: 'white', fontWeight: 900, 
         transform: `scale(${uniqueScale})`, 
         opacity: uniqueOpacity 
       }}>
         UNIQUE
       </div>
       {sceneFrame >= 15 && (
         <div style={{ 
           fontSize: 110, color: '#1E2228', fontWeight: 900,
           transform: `translateY(${typoY}px)`,
           opacity: interpolate(sceneFrame - 15, [0, 5], [0, 1])
         }}>
           TYPOGRAPHY
         </div>
       )}
       {showPack && (
          <div style={{ fontSize: 50, color: '#1E2228', fontWeight: 900, letterSpacing: 10, marginTop: 10 }}>
            PACK FOR YOUR
          </div>
       )}
       {sceneFrame >= 55 && (
          <div style={{ 
            fontSize: 180, color: 'white', fontWeight: 900, 
            transform: `translateX(${projectX}px)`,
            filter: `blur(${projectBlur}px)`
          }}>
            PROJECT
          </div>
       )}
       
       {/* Drifting Circles */}
       {sceneFrame >= 35 && [...Array(8)].map((_, i) => {
         const pop = spring({ frame: sceneFrame - (35 + i * 4), fps, config: { stiffness: 200 } });
         return (
          <div key={i} style={{
            position: 'absolute', border: '5px solid white', borderRadius: '50%',
            width: 20 + (i % 3) * 15, height: 20 + (i % 3) * 15,
            left: (i * 240 + 100) % 1920, top: (i * 320 + 200) % 1080,
            backgroundColor: i % 2 === 0 ? 'white' : 'transparent',
            transform: `scale(${pop}) translateY(-${(sceneFrame-35) * 2}px)`,
            opacity: interpolate(pop, [0, 1], [0, 1])
          }} />
         );
       })}
    </AbsoluteFill>
  );
};

// Scene 4: 10.00s (300 frames)
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 10:00–10:60 (0–18f): Initial reveal
  const zoomScale = interpolate(frame, [0, 18], [1.5, 1], { extrapolateRight: 'clamp' });
  const zoomBlur = interpolate(frame, [0, 18], [20, 0], { extrapolateRight: 'clamp' });

  // 10:60–11:16 (18–35f): USED TO PROMOTE
  const usedX = interpolate(frame - 18, [0, 17], [600, 0], { extrapolateRight: 'clamp' });
  // Space correction: 3f touch then correct
  const topromoteSpace = frame - 18 < 3 ? 0 : 50;

  // 11:16–12:00 (35–60f): YOUR & BUSINESS
  const showBusiness = frame >= 35;

  return (
    <AbsoluteFill style={{ 
      backgroundColor: '#FFC90E', 
      padding: 100, 
      transform: `scale(${zoomScale})`, 
      filter: `blur(${zoomBlur}px)` 
    }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginTop: 150 }}>
          <div style={{ fontSize: 130, color: 'white', fontWeight: 900 }}>KINETIC TYPO</div>
          {frame >= 18 && (
            <div style={{ 
              fontSize: 70, color: 'white', fontWeight: 900, 
              transform: `translateX(${usedX}px)`,
              filter: frame < 35 ? 'blur(10px)' : 'none'
            }}>
              USED <span style={{ marginLeft: topromoteSpace }}>TO PROMOTE</span>
            </div>
          )}
       </div>
       <div style={{ display: 'flex', alignItems: 'center', gap: 60, marginTop: 40 }}>
          {showBusiness && (
            <div style={{ 
              fontSize: 110, color: '#1E2228', fontWeight: 900,
              opacity: interpolate(frame - 35, [0, 10], [0, 1])
            }}>YOUR</div>
          )}
          {showBusiness && (
            <div style={{ display: 'flex' }}>
              {"BUSINESS".split('').map((l, i) => {
                const f = frame - (35 + i * 2);
                const cascadeY = interpolate(f, [0, 10], [300, 0], { extrapolateRight: 'clamp' });
                const cascadeRotate = interpolate(f, [0, 12], [15, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.poly(2)) });
                const wiggle = i === 7 && frame > 60 ? Math.sin((frame - 60) * 0.4) * 8 : 0;
                
                return (
                  <div key={i} style={{
                    fontSize: 200, color: 'white', fontWeight: 900,
                    transform: `translateY(${cascadeY}px) rotate(${cascadeRotate}deg) translateX(${wiggle}px)`,
                    opacity: interpolate(f, [0, 5], [0, 1]),
                  }}>{l}</div>
                );
              })}
            </div>
          )}
       </div>

       {/* Floating parallax circles: 12:00–13:40 (60–126f) */}
       {frame >= 60 && [...Array(14)].map((_, i) => {
          const moveX = (frame - 60) * 2;
          const moveY = (frame - 60) * 4;
          return (
            <div key={i} style={{
              position: 'absolute', width: 40, height: 40, borderRadius: '50%',
              border: '4px solid white', backgroundColor: i % 2 === 0 ? 'white' : 'transparent',
              right: 100 + (i * 120) % 800, bottom: -100 + moveY,
              transform: `translateX(-${moveX}px)`,
              opacity: interpolate(frame-60, [0, 80], [0.6, 0]),
              zIndex: i % 2 === 0 ? 50 : -1
            }} />
          );
       })}
    </AbsoluteFill>
  );
};

// Scene 5: 13.50s (405 frames)
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
       {/* 13:50–14:16 (0–8f) */}
       {frame >= 0 && (
         <div style={{ fontSize: 35, color: '#1E2228', fontWeight: 900, letterSpacing: 10, opacity: interpolate(frame, [0, 8], [0, 1]) }}>
           TITLES ANIMATION GRAPHIC PACK
         </div>
       )}
       <div style={{ position: 'relative', height: 180, width: 1400, marginTop: 40, border: '4px solid #1E2228', backgroundColor: '#1E2228', transform: `scaleX(${interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'})})` }}>
          {frame >= 11 && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              {"STYLISH ANIMATED TITLES".split('').map((l, i) => {
                const f = frame - (11 + i * 2);
                return (
                  <span key={i} style={{ 
                    fontSize: 55, color: 'white', fontWeight: 900, letterSpacing: 15,
                    opacity: interpolate(f, [0, 1], [0, 1])
                  }}>
                    {l === ' ' ? '\u00A0' : l}
                    {/* Cursor */}
                    {i === Math.floor((frame - 11) / 2) && frame < 11 + 22*2 && (
                      <div style={{ position: 'absolute', bottom: 40, width: 30, height: 4, backgroundColor: 'white' }} />
                    )}
                  </span>
                );
              })}
            </div>
          )}
          {/* Pulsing line: 15:33+ (40f+) */}
          {frame >= 40 && (
            <div style={{
              position: 'absolute', bottom: -30, left: 0, right: 0, height: 2, backgroundColor: 'white',
              opacity: interpolate(Math.sin((frame - 40) * 0.1), [-1, 1], [0.4, 0.8])
            }} />
          )}
          {/* Faint circular timer: 15:60 (48f) */}
          {frame >= 48 && frame < 78 && (
            <div style={{ 
              position: 'absolute', top: -100, right: 50, width: 100, height: 100, 
              border: '4px solid #1E2228', borderRadius: '50%',
              opacity: interpolate(frame - 48, [0, 5, 25, 30], [0, 0.2, 0.2, 0])
            }} />
          )}
       </div>
    </AbsoluteFill>
  );
};

// Scene 6: 18.30s (549 frames)
const Scene6: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 18:80–19:50 (15–36f): CUSTOM
  const showCustom = frame >= 15;
  
  // 19:50–20:20 (36–57f): COLORS
  const showColors = frame >= 36;

  return (
    <AbsoluteFill style={{ backgroundColor: '#E07A4F' }}>
       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          {showCustom && (
             <div style={{ fontSize: 180, color: 'white', fontWeight: 900, opacity: interpolate(frame - 15, [0, 10], [0, 1]) }}>
               CUSTOM
             </div>
          )}
          {showColors && (
            <div style={{ display: 'flex' }}>
              {"COLORS".split('').map((l, i) => {
                const b = spring({ frame: frame - (36 + i * 3), fps, config: { stiffness: 200, damping: 10 } });
                const extraO = (l === 'O' && b > 0.8) ? (1 - b) * 0.1 : 0;
                return (
                  <span key={i} style={{ 
                    fontSize: 260, color: 'white', fontWeight: 900, 
                    transform: `scale(${interpolate(b, [0, 1], [0.5, 1]) + extraO})`, 
                    opacity: b 
                  }}>
                    {l}
                  </span>
                );
              })}
            </div>
          )}
       </div>
    </AbsoluteFill>
  );
};

// Scene 7: 20.60s (618 frames)
const Scene7: React.FC = () => {
  const frame = useCurrentFrame();
  
  // 21:00–21:66 (12–32f): Blur Zoom
  const blur = interpolate(frame - 12, [0, 20], [60, 0], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame - 12, [0, 20], [8, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame - 12, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#6A9BC1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       {frame >= 12 && (
         <div style={{ 
           fontSize: 240, color: 'white', fontWeight: 900, textAlign: 'center',
           opacity, transform: `scale(${scale})`, filter: `blur(${blur}px)`
         }}>
           CUSTOM<br/>FONTS
         </div>
       )}
    </AbsoluteFill>
  );
};

// Scene 8: 22.50s (675 frames)
const Scene8: React.FC = () => {
  const frame = useCurrentFrame();
  // 22:80–23:50 (9–30f)
  const scale = interpolate(frame - 9, [0, 15], [1.5, 1], { easing: Easing.out(Easing.poly(3)), extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#DDB34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       {frame >= 9 && (
         <div style={{ fontSize: 350, color: '#1E2228', fontWeight: 900, transform: `scale(${scale})`, opacity: interpolate(frame - 9, [0, 5], [0, 1]) }}>
           FULL HD
         </div>
       )}
    </AbsoluteFill>
  );
};

// Scene 9: 24.50s (735 frames)
const Scene9: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 24:50–25:80 (0–39f): YOUR & SCRIPTS
  // 26:50–27:20 (60–81f): TURNED
  const isTurnedEntry = frame >= 60;
  const isTransition = frame >= 99; // 27:80

  const scriptShadow = frame >= 60 ? '0 8px 10px rgba(0,0,0,0.3)' : '0 2px 0 rgba(0,0,0,0.2)';

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
       {!isTransition && (
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: 100, color: 'white', fontWeight: 900, transform: `translateY(${isTurnedEntry ? -40 : 0}px)`, opacity: interpolate(frame, [0, 10], [0, 1]) }}>YOUR</div>
            {isTurnedEntry && (
              <div style={{ position: 'relative', fontSize: 180, color: '#1E2228', fontWeight: 900, transform: `scale(${spring({frame: frame-60, fps, config:{stiffness:200}})})` }}>
                TURNED
                {frame < 75 && (
                  <div style={{ position: 'absolute', inset: 0 }}>
                    {[...Array(16)].map((_, i) => (
                      <div key={i} style={{
                        position: 'absolute', width: 60, height: 8, backgroundColor: '#1E2228',
                        left: '50%', top: '50%', transform: `rotate(${i * 22.5}deg) translateX(300px)`,
                        opacity: interpolate(frame - 60, [0, 10], [1, 0])
                      }} />
                    ))}
                  </div>
                )}
              </div>
            )}
            <div style={{ 
              fontSize: 220, color: 'white', fontWeight: 900, 
              boxShadow: scriptShadow,
              transform: `translateY(${isTurnedEntry ? 40 : 0}px)`,
              opacity: interpolate(frame, [0, 10], [0, 1])
            }}>SCRIPTS</div>
         </div>
       )}

       {/* S9 Part B: AMAZIN VIDEO */}
       {isTransition && (
         <div style={{ 
           position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center',
           transform: `scale(${interpolate(frame - 99, [0, 15], [0.8, 1], {extrapolateRight: 'clamp'})})`,
           opacity: interpolate(frame - 99, [0, 10], [0, 1])
         }}>
            <div style={{ display: 'flex', gap: 50 }}>
              <div style={{ fontSize: 120, color: 'white', fontWeight: 900 }}>INTO</div>
              <div style={{ fontSize: 160, color: '#1E2228', fontWeight: 900 }}>AMAZING</div>
            </div>
            {frame >= 120 && (
              <div style={{ position: 'relative', fontSize: 280, color: 'white', fontWeight: 900 }}>
                 VIDEOS
                 {frame >= 120 && frame < 135 && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                      {[...Array(12)].map((_, i) => (
                        <div key={i} style={{
                          position: 'absolute', width: 80, height: 10, backgroundColor: 'white',
                          left: '50%', top: '50%', transform: `rotate(${i * 30}deg) translateX(550px)`,
                          opacity: interpolate(frame - 120, [0, 10], [1, 0])
                        }} />
                      ))}
                    </div>
                 )}
              </div>
            )}
         </div>
       )}
    </AbsoluteFill>
  );
};

// Scene 10: 29.80s (894 frames)
const Scene10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 29:80–30:50 (0–21f): EXCLUSIVELY
  const elastic = spring({ frame, fps, config: { stiffness: 100, damping: 8, mass: 1 } });
  
  // 30:80–31:50 (30–51f): ON
  const showOn = frame >= 30;
  const onOpacity = interpolate(frame - 30, [0, 10], [0, 1]);
  
  // Ghost AVAILABLE
  const showAvailable = frame >= 30 && frame < 36;

  // 31:50–33:00 (51–96f): Scale
  const slowScale = interpolate(frame - 51, [0, 45], [1, 1.05], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
       {frame < 51 && (
         <div style={{ 
           fontSize: 180, color: '#1E2228', fontWeight: 900, 
           transform: `translateX(${(1-elastic) * -1200}px)` 
         }}>
           EXCLUSIVELY
         </div>
       )}
       {showOn && (
         <div style={{ 
           position: 'relative', fontSize: 280, color: '#1E2228', fontWeight: 900, 
           transform: `scale(${slowScale})`,
           opacity: onOpacity
         }}>
           ON
           {showAvailable && (
             <div style={{ 
               position: 'absolute', inset: 0, fontSize: 130, color: 'white', 
               opacity: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' 
             }}>AVAILABLE</div>
           )}
         </div>
       )}
    </AbsoluteFill>
  );
};

// Scene 11: 33.00s (990 frames)
const Scene11: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 33:00–33:66 (0–20f): Circle
  const circleScale = spring({ frame, fps, config: { stiffness: 100, damping: 15 } });
  
  // 33:66 (20f): Logo
  const logoOpacity = interpolate(frame - 20, [0, 15], [0, 1]);
  
  // 37:50–37:94 (135–148f): Fade
  const outDim = interpolate(frame - 135, [0, 13], [0, 0.15], {extrapolateLeft: 'clamp'});
  const outFade = interpolate(frame - 135, [0, 13], [1, 0], {extrapolateLeft: 'clamp'});

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E', opacity: outFade }}>
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
         <div style={{
           width: 550, height: 550, backgroundColor: '#1E2228', borderRadius: '50%',
           display: 'flex', alignItems: 'center', justifyContent: 'center',
           transform: `scale(${circleScale})`
         }}>
            <div style={{ fontSize: 110, color: 'white', fontWeight: 900, opacity: logoOpacity }}>
              fiverr<span style={{ fontSize: 45, verticalAlign: 'top' }}>®</span>
            </div>
         </div>
       </div>
       <div style={{ position: 'absolute', inset: 0, backgroundColor: 'black', opacity: outDim, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

// --- MAIN EXPORT ---

export const PromoVideo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={containerStyle}>
      <Watermark />
      <div style={vignetteStyle} />

      <Sequence from={0} durationInFrames={85}>
        <Scene1 />
      </Sequence>
      
      <Sequence from={85} durationInFrames={89}>
        <Scene2 />
      </Sequence>

      <Sequence from={174} durationInFrames={6}>
        <AbsoluteFill style={{ backgroundColor: 'black' }} />
      </Sequence>

      <Sequence from={180} durationInFrames={96}>
        <Scene3 />
      </Sequence>

      <Sequence from={276} durationInFrames={126}>
        <Scene4 />
      </Sequence>

      <Sequence from={402} durationInFrames={132}>
        <Scene5 />
      </Sequence>

      <Sequence from={534} durationInFrames={84}>
        <Scene6 />
      </Sequence>

      <Sequence from={618} durationInFrames={48}>
        <Scene7 />
      </Sequence>

      <Sequence from={666} durationInFrames={63}>
        <Scene8 />
      </Sequence>

      <Sequence from={729} durationInFrames={150}>
        <Scene9 />
      </Sequence>

      <Sequence from={879} durationInFrames={111}>
        <Scene10 />
      </Sequence>

      <Sequence from={990} durationInFrames={148}>
        <Scene11 />
      </Sequence>

    </AbsoluteFill>
  );
};

const Watermark: React.FC = () => {
  return (
    <div style={watermarkStyle}>
      fiverr<span style={{ fontSize: 14, verticalAlign: 'top' }}>®</span>
    </div>
  );
};
