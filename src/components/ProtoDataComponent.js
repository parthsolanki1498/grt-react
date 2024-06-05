import React, { useEffect, useState } from 'react';
import protobuf from 'protobufjs';
import fetch from 'node-fetch';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';

const ProtoDataComponent = ({ onVehiclePositionsUpdate }) => {
    const [data, setData] = useState(null);
    const [vehiclePositions, setVehiclePositions] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch("https://webapps.regionofwaterloo.ca/api/grt-routes/api/vehiclepositions", {
                headers: {
                    // "x-api-key": "Your API Key Here",
                    // "Accept": "application/x-google-protobuf"
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

            setVehiclePositions(positions);
            onVehiclePositionsUpdate(positions);
            setData(feed);
        } catch (error) {
            console.log('Error fetching or decoding data:', error);
        }
    };

    console.log('Vehicle Positions:', vehiclePositions);
    
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    return null;
};

export default ProtoDataComponent;
