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

  const wantToOpacity = interpolate(frame, [0, 11], [0, 1], { extrapolateLeft: 'clamp' });
  const wantToScaleX = interpolate(frame, [0, 11], [3, 1], { extrapolateLeft: 'clamp' });
  const wantToX = interpolate(frame, [0, 11], [100, 0], { extrapolateLeft: 'clamp' });

  const increaseBlur = interpolate(frame - 11, [0, 14], [20, 0], { extrapolateLeft: 'clamp' });
  const increaseX = interpolate(frame - 11, [0, 14], [-100, 0], { extrapolateLeft: 'clamp' });
  const increaseOpacity = interpolate(frame - 11, [0, 5], [0, 1], { extrapolateLeft: 'clamp' });

  const yourX = interpolate(frame - 25, [0, 10], [100, 0], { extrapolateLeft: 'clamp' });
  const yourOpacity = interpolate(frame - 25, [0, 5], [0, 1], { extrapolateLeft: 'clamp' });

  const salBounce = spring({ frame: frame - 25, fps, config: { stiffness: 150, damping: 10 } });
  
  return (
    <AbsoluteFill style={{ paddingLeft: '15%', paddingTop: '10%' }}>
      {frame >= 0 && (
        <div style={{
          fontSize: 60, fontWeight: 900, color: '#1E2228',
          opacity: wantToOpacity,
          transform: `translateX(${650 + wantToX}px) translateY(100px) scaleX(${wantToScaleX})`,
          filter: frame < 11 ? 'blur(10px)' : 'none',
        }}>
          WANT TO
        </div>
      )}
      {frame >= 11 && (
        <div style={{
          fontSize: 200, fontWeight: 900, color: 'white',
          opacity: increaseOpacity,
          transform: `translateX(${increaseX}px) translateY(120px)`,
          filter: `blur(${increaseBlur}px)`,
          lineHeight: 0.8
        }}>
          INCREASE
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 20 }}>
        {frame >= 25 && (
          <div style={{
            fontSize: 80, fontWeight: 900, color: '#1E2228', opacity: 0.8,
            transform: `translateX(${yourX}px)`,
          }}>
            YOUR
          </div>
        )}
        {frame >= 25 && (
          <div style={{
            fontSize: 140, fontWeight: 900, color: 'white', marginLeft: 40,
            transform: `scale(${1 + (1 - salBounce) * 0.15})`,
          }}>
            SAL
            {frame >= 40 && (
              <>
                <span style={{ 
                  display: 'inline-block',
                  opacity: interpolate(frame - 40, [0, 5], [0, 1]),
                  transform: `translateX(${interpolate(frame - 40, [0, 10], [50, 0])}px)`
                }}>E</span>
                <span style={{ 
                  display: 'inline-block',
                  opacity: interpolate(frame - 43, [0, 5], [0, 1]),
                  transform: `translateX(${interpolate(frame - 43, [0, 10], [50, 0])}px)`
                }}>S</span>
              </>
            )}
          </div>
        )}
        {frame >= 55 && (
          <div style={{ position: 'relative', width: 60, height: 120, marginLeft: 20 }}>
            <div style={{
              position: 'absolute', top: 0, left: 20, width: 20,
              height: interpolate(frame - 55, [0, 5], [0, 80]),
              border: '6px solid #1E2228',
              backgroundColor: 'transparent'
            }} />
            {frame >= 61 && (
              <div style={{
                position: 'absolute', bottom: 10, left: 20, width: 20, height: 20,
                backgroundColor: '#1E2228',
                transform: `scale(${spring({ frame: frame - 61, fps, config: { stiffness: 200 } })})`
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

  const transitionRotate = interpolate(frame, [0, 20], [0, -90], { extrapolateRight: 'clamp' });
  const transitionScale = interpolate(frame, [0, 20], [1, 0.35], { extrapolateRight: 'clamp' });
  const transitionX = interpolate(frame, [0, 20], [0, -400], { extrapolateRight: 'clamp' });

  const needScale = spring({ frame: frame - 20, fps, config: { stiffness: 200 } });
  
  const anX = interpolate(frame - 38, [0, 15], [-200, 0], { extrapolateRight: 'clamp' });
  const animatedX = interpolate(frame - 38, [0, 15], [200, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E' }}>
      {/* Ghost/Transition piece from Scene 1 */}
      {frame < 30 && (
         <div style={{
          position: 'absolute', left: '15%', top: '10%',
          transform: `translateX(${transitionX}px) rotate(${transitionRotate}deg) scale(${transitionScale})`,
          transformOrigin: 'left center',
          opacity: interpolate(frame, [15, 25], [1, 0])
        }}>
          <div style={{ fontSize: 60, color: '#1E2228' }}>WANT TO</div>
          <div style={{ fontSize: 200, color: 'white' }}>INCREASE</div>
          <div style={{ fontSize: 140, color: 'white' }}>YOUR SALES</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
         {frame >= 20 && (
           <div style={{ 
             fontSize: 120, color: 'white', fontWeight: 900,
             transform: `scale(${interpolate(needScale, [0, 1], [1.1, 1])})`,
             opacity: interpolate(frame - 20, [0, 5], [0, 1])
           }}>
             NEED
           </div>
         )}
         {frame >= 38 && (
           <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ fontSize: 80, color: 'white', fontWeight: 900, transform: `translateX(${anX}px)` }}>AN</div>
              <div style={{ fontSize: 80, color: '#1E2228', fontWeight: 900, transform: `translateX(${animatedX}px)` }}>ANIMATED</div>
           </div>
         )}
         {frame >= 55 && (
           <div style={{ fontSize: 160, color: 'white', fontWeight: 900, position: 'relative' }}>
              {"VIDEO".split('').map((l, i) => (
                <span key={i} style={{ 
                  display: 'inline-block',
                  opacity: interpolate(frame - (55 + i * 2), [0, 5], [0, 1])
                }}>{l}</span>
              ))}
              {/* Ticks */}
              {frame >= 55 && frame < 61 && (
                 <div style={{ position: 'absolute', right: -60, top: '50%' }}>
                    {[...Array(12)].map((_, i) => (
                      <div key={i} style={{
                        position: 'absolute', width: 40, height: 4, backgroundColor: 'white',
                        transform: `rotate(${i * 30}deg) translateX(60px)`,
                        opacity: interpolate(frame - 55, [0, 6], [1, 0])
                      }} />
                    ))}
                 </div>
              )}
           </div>
         )}
         {/* Kinetic Echo */}
         {frame >= 71 && (
            <div style={{
              position: 'absolute', top: 'calc(50% + 10px)', opacity: 0.5,
              display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
               <div style={{ fontSize: 80, color: '#1E2228', fontWeight: 900 }}>ANIMATED</div>
               <div style={{ fontSize: 160, color: 'white', fontWeight: 900 }}>VIDEO</div>
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

  const sceneRotate = interpolate(frame - 70, [0, 26], [0, 20], { extrapolateRight: 'clamp' });
  const sceneScale = interpolate(frame - 70, [0, 26], [1, 1.3], { extrapolateRight: 'clamp' });

  const projectX = interpolate(frame - 55, [0, 15], [800, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ 
      backgroundColor: '#FFC90E', 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transform: `rotate(${sceneRotate}deg) scale(${sceneScale})`,
      filter: frame > 90 ? 'blur(10px)' : 'none'
    }}>
       <div style={{ fontSize: 240, color: 'white', fontWeight: 900, transform: `scale(${interpolate(frame, [0, 15], [0.8, 1], {extrapolateRight: 'clamp'})})`, opacity: interpolate(frame, [0, 5], [0, 1]) }}>
         UNIQUE
       </div>
       {frame >= 15 && (
         <div style={{ 
           fontSize: 100, color: '#1E2228', fontWeight: 900,
           transform: `translateY(${interpolate(frame - 15, [0, 15], [-100, 0], {extrapolateRight: 'clamp'})}px)`,
           opacity: interpolate(frame - 15, [0, 5], [0, 1])
         }}>
           TYPOGRAPHY
         </div>
       )}
       {frame >= 35 && (
          <div style={{ fontSize: 40, color: '#1E2228', fontWeight: 900, letterSpacing: 10 }}>
            PACK FOR YOUR
          </div>
       )}
       {frame >= 55 && (
          <div style={{ fontSize: 160, color: 'white', fontWeight: 900, transform: `translateX(${projectX}px)` }}>
            PROJECT
          </div>
       )}
       {/* Circles */}
       {frame >= 35 && [...Array(8)].map((_, i) => (
         <div key={i} style={{
           position: 'absolute', border: '4px solid white', borderRadius: '50%',
           width: 20 + (i % 3) * 10, height: 20 + (i % 3) * 10,
           left: (i * 200) % 1920, top: (i * 300) % 1080,
           backgroundColor: i % 2 === 0 ? 'white' : 'transparent',
           transform: `scale(${interpolate(frame - 35, [0, 8], [0, 1], {extrapolateRight: 'clamp'})}) translateY(-${(frame-35) * 3}px)`
         }} />
       ))}
    </AbsoluteFill>
  );
};

// Scene 4: 10.00s (300 frames)
const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const usedX = interpolate(frame - 18, [0, 17], [500, 0], { extrapolateRight: 'clamp' });
  const topromoteTouch = frame - 18 < 3 ? 0 : 40;

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E', padding: 100 }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <div style={{ fontSize: 120, color: 'white', fontWeight: 900 }}>KINETIC TYPO</div>
          {frame >= 18 && (
            <div style={{ 
              fontSize: 80, color: 'white', fontWeight: 900, 
              transform: `translateX(${usedX}px)`,
              filter: frame < 35 ? 'blur(10px)' : 'none'
            }}>
              USED <span style={{ marginLeft: topromoteTouch }}>TO PROMOTE</span>
            </div>
          )}
       </div>
       <div style={{ display: 'flex', alignItems: 'center', gap: 60, marginTop: 40 }}>
          {frame >= 35 && <div style={{ fontSize: 140, color: '#1E2228', fontWeight: 900 }}>YOUR</div>}
          {frame >= 35 && (
            <div style={{ display: 'flex' }}>
              {"BUSINESS".split('').map((l, i) => (
                <div key={i} style={{
                  fontSize: 180, color: 'white', fontWeight: 900,
                  transform: `translateY(${interpolate(frame - (35 + i * 2), [0, 10], [200, 0], {extrapolateRight: 'clamp'})}px) rotate(${interpolate(frame - (35 + i * 2), [0, 10], [15, 0], {extrapolateRight: 'clamp'})}deg)`,
                  opacity: interpolate(frame - (35 + i * 2), [0, 5], [0, 1]),
                  marginLeft: i === 7 && frame > 60 ? Math.sin(frame * 0.5) * 5 : 0
                }}>{l}</div>
              ))}
            </div>
          )}
       </div>
       {/* Floating parallax circles */}
       {frame >= 60 && [...Array(14)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', width: 30, height: 30, borderRadius: '50%',
            border: '2px solid white', backgroundColor: i % 2 === 0 ? 'white' : 'transparent',
            right: 100 + (i * 100) % 500, bottom: -100 + (frame-60) * 5,
            transform: `translateX(-${(frame-60) * 2}px)`,
            opacity: interpolate(frame-60, [0, 100], [0.6, 0])
          }} />
       ))}
    </AbsoluteFill>
  );
};

// Scene 5: 13.50s (405 frames)
const Scene5: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
       {frame >= 0 && (
         <div style={{ fontSize: 40, color: '#1E2228', fontWeight: 900, letterSpacing: 10, opacity: interpolate(frame, [0, 10], [0, 1]) }}>
           TITLES ANIMATION GRAPHIC PACK
         </div>
       )}
       <div style={{ position: 'relative', height: 160, width: 1200, marginTop: 40 }}>
          <div style={{ 
            position: 'absolute', inset: 0, border: '4px solid #1E2228',
            transform: `scaleX(${interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'})})`,
            backgroundColor: '#1E2228'
          }} />
          {frame >= 20 && (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              {"STYLISH ANIMATED TITLES".split('').map((l, i) => (
                <span key={i} style={{ 
                  fontSize: 50, color: 'white', fontWeight: 900, letterSpacing: 15,
                  opacity: interpolate(frame - (20 + i * 2), [0, 1], [0, 1])
                }}>
                  {l === ' ' ? '\u00A0' : l}
                  {/* Cursor */}
                  {i === Math.floor((frame - 20) / 2) && (
                    <div style={{ position: 'absolute', bottom: 20, width: 30, height: 4, backgroundColor: 'white' }} />
                  )}
                </span>
              ))}
            </div>
          )}
          {/* Pulsing line */}
          {frame >= 50 && (
            <div style={{
              position: 'absolute', bottom: -20, left: 0, right: 0, height: 2, backgroundColor: 'white',
              opacity: interpolate(Math.sin(frame * 0.1), [-1, 1], [0.6, 1])
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

  return (
    <AbsoluteFill style={{ backgroundColor: '#E07A4F' }}>
       <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          {frame >= 15 && (
             <div style={{ fontSize: 160, color: 'white', fontWeight: 900, opacity: interpolate(frame - 15, [0, 10], [0, 1]) }}>
               CUSTOM
             </div>
          )}
          {frame >= 36 && (
            <div style={{ display: 'flex' }}>
              {"COLORS".split('').map((l, i) => {
                const b = spring({ frame: frame - (36 + i * 3), fps, config: { stiffness: 200 } });
                return (
                  <span key={i} style={{ fontSize: 240, color: 'white', fontWeight: 900, transform: `scale(${interpolate(b, [0, 1], [0.5, 1])})`, opacity: b }}>
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
  
  const blur = interpolate(frame - 12, [0, 20], [40, 0], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame - 12, [0, 20], [4, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(frame - 12, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#6A9BC1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       {frame >= 12 && (
         <div style={{ 
           fontSize: 200, color: 'white', fontWeight: 900, textAlign: 'center',
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
  const scale = interpolate(frame - 9, [0, 21], [1.5, 1], { easing: Easing.out(Easing.quad), extrapolateRight: 'clamp' });
  
  return (
    <AbsoluteFill style={{ backgroundColor: '#DDB34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       {frame >= 9 && (
         <div style={{ fontSize: 320, color: '#1E2228', fontWeight: 900, transform: `scale(${scale})`, opacity: interpolate(frame - 9, [0, 5], [0, 1]) }}>
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

  const isAfterTurned = frame >= 60;
  const globalScale = frame >= 99 ? 0.8 : 1;
  const globalOpacity = frame >= 99 ? 0.4 : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
       <div style={{ transform: `scale(${globalScale})`, opacity: globalOpacity }}>
          <div style={{ fontSize: 80, color: 'white', fontWeight: 900, transform: `translateY(${isAfterTurned ? -20 : 0}px)` }}>YOUR</div>
          {isAfterTurned && (
            <div style={{ position: 'relative', fontSize: 160, color: '#1E2228', fontWeight: 900 }}>
              TURNED
              {frame >= 60 && frame < 70 && (
                <div style={{ position: 'absolute', inset: 0 }}>
                  {[...Array(16)].map((_, i) => (
                    <div key={i} style={{
                      position: 'absolute', width: 40, height: 6, backgroundColor: '#1E2228',
                      left: '50%', top: '50%', transform: `rotate(${i * 22.5}deg) translateX(250px)`
                    }} />
                  ))}
                </div>
              )}
            </div>
          )}
          <div style={{ 
            fontSize: 180, color: 'white', fontWeight: 900, 
            textShadow: '0 4px 0 rgba(0,0,0,0.2)',
            transform: `translateY(${isAfterTurned ? 20 : 0}px)` 
          }}>SCRIPTS</div>
       </div>
       {frame >= 99 && (
         <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 40 }}>
              <div style={{ fontSize: 100, color: 'white', fontWeight: 900 }}>INTO</div>
              <div style={{ fontSize: 140, color: '#1E2228', fontWeight: 900 }}>AMAZING</div>
            </div>
            {frame >= 120 && (
              <div style={{ position: 'relative', fontSize: 240, color: 'white', fontWeight: 900 }}>
                 VIDEOS
                 {frame >= 120 && frame < 130 && (
                    <div style={{ position: 'absolute', inset: 0 }}>
                      {[...Array(12)].map((_, i) => (
                        <div key={i} style={{
                          position: 'absolute', width: 60, height: 8, backgroundColor: 'white',
                          left: '50%', top: '50%', transform: `rotate(${i * 30}deg) translateX(450px)`
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

  const bounce = spring({ frame: frame, fps, config: { stiffness: 100, damping: 10, mass: 1 } });
  const scale = frame >= 51 ? interpolate(frame - 51, [0, 45], [1, 1.05], {extrapolateRight: 'clamp'}) : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
       {frame < 51 && (
         <div style={{ fontSize: 180, color: '#1E2228', fontWeight: 900, transform: `translateX(${(1-bounce) * -800}px)` }}>
           EXCLUSIVELY
         </div>
       )}
       {frame >= 30 && (
         <div style={{ position: 'relative', fontSize: 240, color: '#1E2228', fontWeight: 900, transform: `scale(${scale})` }}>
           ON
           {frame >= 30 && frame < 36 && (
             <div style={{ position: 'absolute', inset: 0, fontSize: 120, color: 'white', opacity: 0.2 }}>AVAILABLE</div>
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

  const circleScale = spring({ frame, fps, config: { stiffness: 100, damping: 15 } });
  const logoOpacity = interpolate(frame - 20, [0, 10], [0, 1]);
  const outFade = interpolate(frame - (37.5 * 30 - 990), [0, 15], [0, 0.1], {extrapolateLeft: 'clamp'});

  return (
    <AbsoluteFill style={{ backgroundColor: '#FFC90E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       <div style={{
         width: 500, height: 500, backgroundColor: '#1E2228', borderRadius: '50%',
         display: 'flex', alignItems: 'center', justifyContent: 'center',
         transform: `scale(${circleScale * 0.8})`
       }}>
          <div style={{ fontSize: 100, color: 'white', fontWeight: 900, opacity: logoOpacity }}>
            fiverr<span style={{ fontSize: 40, verticalAlign: 'top' }}>®</span>
          </div>
       </div>
       {/* Out fade */}
       <div style={{ position: 'absolute', inset: 0, backgroundColor: 'black', opacity: outFade }} />
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
      
      <Sequence from={85} durationInFrames={95}>
        <Scene2 />
      </Sequence>

      <Sequence from={180} durationInFrames={120}>
        <Scene3 />
      </Sequence>

      <Sequence from={300} durationInFrames={105}>
        <Scene4 />
      </Sequence>

      <Sequence from={405} durationInFrames={129}>
        <Scene5 />
      </Sequence>

      <Sequence from={549} durationInFrames={69}>
        <Scene6 />
      </Sequence>

      <Sequence from={618} durationInFrames={48}>
        <Scene7 />
      </Sequence>

      <Sequence from={675} durationInFrames={60}>
        <Scene8 />
      </Sequence>

      <Sequence from={735} durationInFrames={159}>
        <Scene9 />
      </Sequence>

      <Sequence from={894} durationInFrames={96}>
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
