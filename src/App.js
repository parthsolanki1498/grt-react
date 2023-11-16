import ProtoDataComponent from './components/ProtoDataComponent';
import logo from './logo.svg';
import { GoogleMap, withScriptjs, withGoogleMap } from 'react-google-maps';
// import { GoogleMap, withScriptjs, withGoogleMap } from '@react-google-maps/api';
// import './App.css';

function Map() {
  return (
    <GoogleMap 
      defaultZoom={10}
      defaultCenter={{lat: 43.479050, lng: -80.523410}}
    />
  );
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

function App() {
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
      />

      <ProtoDataComponent/>
    </div>
  );
}

export default App;
