import { useState } from 'react';
import ProtoDataComponent from './components/ProtoDataComponent';
import logo from './logo.svg';
import { GoogleMap, withScriptjs, withGoogleMap, Marker } from 'react-google-maps';
// import { GoogleMap, withScriptjs, withGoogleMap } from '@react-google-maps/api';
// import './App.css';

const Map = ( {vehiclePositions}) => {

  return (
    <GoogleMap 
      defaultZoom={15}
      defaultCenter={{lat: 43.479050, lng: -80.523410}}>


    {/* Map over the vehicle positions and create a Marker for each position */}
    {vehiclePositions.map((position, index) => (
        <Marker key={index} position={{ lat: position.latitude, lng: position.longitude }} />
    ))}


    </GoogleMap>
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

function App() {

  const [receivedVehiclePositions, setReceivedVehiclePositions] = useState([]);

  // Callback function to receive vehiclePositions from the child
  const handleVehiclePositionsUpdate = (positions) => {
    setReceivedVehiclePositions(positions);
  };


  return (
    <div style= {{ width: "100vw", height: "100vh"}} className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <WrappedMap 
      googleMapURL= {`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
      loadingElement = {<div style={{ height: "100%" }} />}
      containerElement   = {<div style={{ height: "100%" }} />}
      mapElement = {<div style={{ height: "100%" }} />}
      vehiclePositions={receivedVehiclePositions}
      />
      <ProtoDataComponent onVehiclePositionsUpdate={handleVehiclePositionsUpdate}/>
    </div>
  );
}

export default App;
