import React, { useEffect, useState } from 'react';
import protobuf, { BufferReader } from 'protobufjs';
import fetch from 'node-fetch';
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { Marker } from 'react-google-maps';

const ProtoDataComponent = ( {onVehiclePositionsUpdate}) => {
    const [data, setData] = useState(null);

    const [vehiclePositions, setVehiclePositions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the API
                // const response = await fetch('https://webapps.regionofwaterloo.ca/api/grt-routes/api/vehiclepositions', {
                //     mode: 'no-cors',
                // });
                // console.log('Response: ',response);
                // const buffer = await response.arrayBuffer();
                // console.log('Buffer: ', buffer);

                // Load the Protocol Buffer schema
                // const protoFile= require("../components/myProto.proto");
                // const root = await protobuf.load('./components/myProto.proto');
                // protobuf.load(protoFile, (err, root) => {
                //     const someMessage = root.lookup('Nested');
                //     const decodedData = someMessage.decode(new Uint8Array(buffer));
                //     setData(decodedData);   
                //     console.log('No damn error here:', decodedData); 
                // });


                // Fetch SomeMessage
                // const someMessage = root.lookup('SomeMessage');

                // Decode the Protocol Buffers data
                // const decodedData = someMessage.decode(new Uint8Array(buffer));
                // setData(decodedData);


                // const response = await fetch('https://webapps.regionofwaterloo.ca/api/grt-routes/api/vehiclepositions', {
                //     mode: 'no-cors',
                // });

                // if (!response.ok) {
                //     const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
                //     error.response = response;
                //     throw error;
                //     process.exit(1);
                // }

                // console.log('Response: ', response);

                // const buffer = await response.arrayBuffer();
                // console.log('Buffer: ', buffer);

                // Try decoding with base64
                // const decodedDataJSON = JSON.parse(new TextDecoder().decode(new Uint8Array(buffer)));
                // console.log(decodedDataJSON);

                // const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
                // console.log('Feed: ', feed);

                // feed.entity.forEach((entity) => {
                //     if (entity.tripUpdate) {
                //       console.log(entity.tripUpdate);
                //     }
                // });

                const response = await fetch("https://webapps.regionofwaterloo.ca/api/grt-routes/api/vehiclepositions", {
                    headers: {
                    //   "x-api-key": "AIzaSyBpxFj1OqTdOvhx0aNI4Sd2X98Ca8dUSuk",
                    //   "Accept" : "application/x-google-protobuf"
                      // replace with your GTFS-realtime source's auth token
                      // e.g. x-api-key is the header value used for NY's MTA GTFS APIs
                    },
                  });

                console.log('Response Status:', response.status);
                console.log('Response Status Text:', response.statusText);
                console.log('Response OK:', response.ok)

                // console.log('Response: ', response);
                // //   if (!response.ok) {
                // //     const error = new Error(`${response.url}: ${response.status} ${response.statusText}`);
                // //     error.response = response;
                // //     throw error;
                // //     process.exit(1);
                // //   }
                //   const buffer = await response.arrayBuffer();
                //   console.log('Buffer: ', new Uint8Array(buffer));
                //   const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));
                //   feed.entity.forEach((entity) => {
                //     if (entity.tripUpdate) {
                //       console.log(entity.tripUpdate);
                //     }
                //   });

                console.log(response.ok);

                if (!response.ok) {
                    throw new Error(`${response.url}: ${response.status} ${response.statusText}`);
                }

                const buffer = await response.arrayBuffer();

                console.log('Buffer: ', buffer);
                const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

                console.log('Feed: ', feed);

                const positions  = feed.entity
                .filter(entity => entity.vehicle)
                .map(entity => entity.vehicle.position);

                console.log('Imp console', feed.entity.filter(entity => entity.vehicle).map(entity => entity.vehicle.position));
      
                feed.entity.forEach((entity) => {
                    if (entity.vehicle) {
                        // console.log(entity.vehicle);
                        // console.log('Positions: ', entity.vehicle.position);
                    }
                });

                setVehiclePositions(positions);


                onVehiclePositionsUpdate(positions);


                // console.log('Proto Data Comp', vehiclePositions);

                // FINALLY IT WORKS FINALLY IT WORKS FIANLLY IT WORKS

                // CODE NEEDS WHOLE LOT OF EDITING YES BUT WE WILL GET THERE

                // FOR NOW? EUREKA AND LET US GET SOME GOOD NIGHT SLEEP FFS

                setData(feed); // Set the decoded feed data to state

            } catch(error) {
                console.log('Error fetching or decoding data:', error);
            }
        };

        fetchData();
    },[]);
    // }, [onVehiclePositionsUpdate, vehiclePositions]);

    console.log('Rendered vehiclePositions:', vehiclePositions);

    // return vehiclePositions;
    return null;
    
};

export default ProtoDataComponent;