import { useState } from 'react';
import ProtoDataComponent from './components/ProtoDataComponent';
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from 'react-google-maps';
import useMarkerAnimation from './components/UseMarkerAnimation';

const Map = ({ vehiclePositions }) => {
  return (
    <GoogleMap 
      defaultZoom={15}
      defaultCenter={{ lat: 43.479050, lng: -80.523410 }}>
      {vehiclePositions.map((position, index) => (
        <Marker key={index} position={{ lat: position.latitude, lng: position.longitude }} />
      ))}
    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

function App() {
  const [receivedVehiclePositions, setReceivedVehiclePositions] = useState([]);
  const currentPositions = useMarkerAnimation(receivedVehiclePositions);

  const handleVehiclePositionsUpdate = (positions) => {
    setReceivedVehiclePositions(positions);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="App">
      <WrappedMap 
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
        vehiclePositions={currentPositions}
      />
      <ProtoDataComponent onVehiclePositionsUpdate={handleVehiclePositionsUpdate} />
    </div>
  );
}

export default App;
