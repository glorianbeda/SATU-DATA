import React, { useEffect, useRef, useState } from 'react';

/**
 * Lottie Player Component
 * Uses lottie-web from CDN to play Lottie animations
 */
const LottiePlayer = ({ animationData, loop = true, autoplay = true, className }) => {
    const containerRef = useRef(null);
    const [lottie, setLottie] = useState(null);

    useEffect(() => {
        // Load lottie-web from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
        script.async = true;
        
        script.onload = () => {
            if (containerRef.current && window.lottie) {
                const anim = window.lottie.loadAnimation({
                    container: containerRef.current,
                    renderer: 'svg',
                    loop: loop,
                    autoplay: autoplay,
                    animationData: animationData
                });
                setLottie(anim);
            }
        };

        document.body.appendChild(script);

        return function cleanup() {
            if (lottie) {
                lottie.destroy();
            }
            document.body.removeChild(script);
        };
    }, [animationData, loop, autoplay]);

    return (
        <div 
            ref={containerRef} 
            className={className}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default LottiePlayer;
