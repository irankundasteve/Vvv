import React from 'react';
import { Composition } from 'remotion';
import { PromoVideo } from './PromoVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={1138} // 37.94s * 30fps = 1138.2 -> 1138
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
