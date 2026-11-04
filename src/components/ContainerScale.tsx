import React, { useEffect, useState } from 'react';

interface ContainerScaleProps {
  children: React.ReactNode;
}

export const ContainerScale: React.FC<ContainerScaleProps> = ({ children }) => {
  const [scale, setScale] = useState({ scaleX: 1, scaleY: 1 });

  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 1920;
      const targetHeight = 1080;
      const currentWidth = window.innerWidth;
      const currentHeight = window.innerHeight;

      // Full-bleed stretch scaling: spans 100% of viewport width and height
      // Guaranteed zero empty space/black bars on both left and right sides
      const scaleX = currentWidth / targetWidth;
      const scaleY = currentHeight / targetHeight;

      setScale({ scaleX, scaleY });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full h-full min-w-full min-h-full overflow-hidden bg-[#060d1f] relative select-none">
      <div
        style={{
          width: '1920px',
          height: '1080px',
          transform: `scale(${scale.scaleX}, ${scale.scaleY})`,
          transformOrigin: '0 0',
          position: 'absolute',
          left: 0,
          top: 0,
        }}
        className="overflow-hidden bg-[#060d1f] text-slate-100 flex flex-col"
      >
        {children}
      </div>
    </div>
  );
};
