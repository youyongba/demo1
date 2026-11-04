import React, { useEffect, useState } from 'react';

interface ContainerScaleProps {
  children: React.ReactNode;
}

export const ContainerScale: React.FC<ContainerScaleProps> = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 1920;
      const targetHeight = 1080;
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      const scaleX = currentWidth / targetWidth;
      const scaleY = currentHeight / targetHeight;
      const computedScale = Math.min(scaleX, scaleY);
      setScale(computedScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#050b1a] relative flex items-center justify-center select-none">
      <div
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          marginLeft: '-960px',
          marginTop: '-540px',
        }}
        className="overflow-hidden bg-[#060d1f] text-slate-100 flex flex-col shadow-2xl"
      >
        {children}
      </div>
    </div>
  );
};
