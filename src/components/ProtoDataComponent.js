import React, { useEffect, useState } from 'react';
import protobuf from 'protobufjs';

const ProtoDataComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data from the API
                const response = await fetch('https://webapps.regionofwaterloo.ca/api/grt-routes/api/vehiclepositions', {
                    mode: 'no-cors',
                });
                const buffer = await response.arrayBuffer();

                // Load the Protocol Buffer schema
                const protoFile= require("../components/myProto.proto");
                // const root = await protobuf.load('./components/myProto.proto');
                protobuf.load(protoFile, (err, root) => {
                    const someMessage = root.lookup('SomeMessage');
                    const decodedData = someMessage.decode(new Uint8Array(buffer));
                    setData(decodedData);   
                    console.log('No damn error here:', decodedData); 
                });


                // Fetch SomeMessage
                // const someMessage = root.lookup('SomeMessage');

                // Decode the Protocol Buffers data
                // const decodedData = someMessage.decode(new Uint8Array(buffer));
                // setData(decodedData);
            } catch(error) {
                console.log('Error fetching or decoding data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Protocol Buffer Data</h1>
            { data && (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    );
};

export default ProtoDataComponent;