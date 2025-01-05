import React, { useEffect } from 'react';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const ProtoDataComponent = ({ onVehiclePositionsUpdate }) => {

    const fetchData = async () => {
        try {
            const response = await fetch("https://webapps.regionofwaterloo.ca/api/grt-routes/api/vehiclepositions", {
                headers: {
                    // Replace with your GTFS-realtime source's auth token if necessary
                },
            });

            if (!response.ok) {
                throw new Error(`${response.url}: ${response.status} ${response.statusText}`);
            }

            const buffer = await response.arrayBuffer();
            const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

            const positions = feed.entity
                .filter(entity => entity.vehicle)
                .map(entity => entity.vehicle.position);

            onVehiclePositionsUpdate(positions);
            
            console.log('Vehicle positions updated:', positions)
        } catch (error) {
            console.log('Error fetching or decoding data:', error);
        }
    };


    useEffect(() => {
        fetchData(); // Initial fetch

        const intervalId = setInterval(() => {
            fetchData();
        }, 5000); // Fetch data every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, []); // Empty dependency array ensures this runs only once

    return null;
};

export default ProtoDataComponent;
