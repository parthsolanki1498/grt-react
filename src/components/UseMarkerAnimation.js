import { useEffect, useState, useRef } from 'react';

const useMarkerAnimation = (targetPositions) => {
    const [currentPositions, setCurrentPositions] = useState([]);
    const animationFrameId = useRef(null);

    useEffect(() => {
        if (targetPositions.length === 0) return;

        const animateMarkers = () => {
            setCurrentPositions((prevPositions) =>
                prevPositions.map((pos, index) => {
                    const target = targetPositions[index];
                    if (!target) return pos;

                    const lat = pos.latitude + (target.latitude - pos.latitude) * 0.1;
                    const lng = pos.longitude + (target.longitude - pos.longitude) * 0.1;

                    return { latitude: lat, longitude: lng };
                })
            );

            animationFrameId.current = requestAnimationFrame(animateMarkers);
        };

        animationFrameId.current = requestAnimationFrame(animateMarkers);

        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [targetPositions]);

    useEffect(() => {
        setCurrentPositions(targetPositions);
    }, [targetPositions]);

    return currentPositions;
};

export default useMarkerAnimation;
