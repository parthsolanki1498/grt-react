import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow } from "react-google-maps";
import useMarkerAnimation from "./components/UseMarkerAnimation";
import routeGeoJSON from "./components/routes/GRT_Routes.geojson"; // Import your local GeoJSON file
import ProtoDataComponent from "./components/ProtoDataComponent"; // Ensure this is imported
import ReactDOM from "react-dom";

const Map = ({ vehiclePositions, geoJsonRoute }) => {
  const mapRef = useRef(null);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    if (mapRef.current && geoJsonRoute) {
      // Load the GeoJSON into the map
      const map = mapRef.current.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      map.data.addGeoJson(geoJsonRoute);

      // Set the style to grayscale by default
      map.data.setStyle({
        strokeColor: "gray",
        strokeWeight: 2,
        fillColor: "gray",
        fillOpacity: 0.4,
      });

      // Add event listener for click on GeoJSON features
      map.data.addListener("click", (event) => {
        setSelectedFeature(event.feature);
        // Highlight the selected route
        map.data.setStyle((feature) => {
          if (feature === event.feature) {
            return {
              strokeColor: "blue",
              strokeWeight: 4,
              fillColor: "blue",
              fillOpacity: 0.7,
            };
          }
          return {
            strokeColor: "gray",
            strokeWeight: 2,
            fillColor: "gray",
            fillOpacity: 0.4,
          };
        });
      });
    }
  }, [geoJsonRoute]);

  const renderProperties = () => {
    if (selectedFeature) {
      // Log the selected feature to debug its properties
      // console.log(selectedFeature.getProperties());

      // Access specific properties directly
      // const name = selectedFeature.getProperty("name") || "No name available";
      // const description = selectedFeature.getProperty("description") || "No description available";

      return (
        <div>
          <h3>Route Information</h3>
          {/* <p>Name: {name}</p>
          <p>Description: {description}</p> */}
        </div>
      );
    }
    return null;
  };

  const renderInfoWindow = () => {
    if (selectedFeature) {
      const position = selectedFeature.getGeometry().getAt(0); // Get the first point of the geometry to place the InfoWindow
      return ReactDOM.createPortal(
        <InfoWindow position={position} onCloseClick={() => setSelectedFeature(null)}>
          {renderProperties()}
        </InfoWindow>,
        document.getElementById("info-window-container") // Create a portal container outside the map
      );
    }
    return null;
  };

  return (
    <GoogleMap defaultZoom={15} defaultCenter={{ lat: 43.479050, lng: -80.523410 }} ref={mapRef}>
      {/* Display Vehicle Markers */}
      {vehiclePositions.map((position, index) => (
        <Marker key={index} position={{ lat: position.latitude, lng: position.longitude }} />
      ))}

      {/* Show InfoWindow when a route is selected */}
      {renderInfoWindow()}
    </GoogleMap>
  );
};

const WrappedMap = withScriptjs(withGoogleMap(Map));

function App() {
  const [receivedVehiclePositions, setReceivedVehiclePositions] = useState([]);
  const [geoJsonRoute, setGeoJsonRoute] = useState(null);
  const currentPositions = useMarkerAnimation(receivedVehiclePositions);

  const handleVehiclePositionsUpdate = (positions) => {
    setReceivedVehiclePositions(positions);
  };

  useEffect(() => {
    // Fetch and load GeoJSON data
    const fetchGeoJsonRoute = async () => {
      try {
        const response = await fetch(routeGeoJSON); // Assuming the GeoJSON is stored locally in the "routes" folder
        const data = await response.json();
        setGeoJsonRoute(data); // Set the GeoJSON data to state
      } catch (error) {
        console.error("Error loading GeoJSON route:", error);
      }
    };
    fetchGeoJsonRoute();
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }} className="App">
      <div id="info-window-container"></div> {/* Create an element to render the InfoWindow outside the map */}
      <WrappedMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
        loadingElement={<div style={{ height: "100%" }} />}
        containerElement={<div style={{ height: "100%" }} />}
        mapElement={<div style={{ height: "100%" }} />}
        vehiclePositions={currentPositions}
        geoJsonRoute={geoJsonRoute} // Pass geoJsonRoute to the map component
      />
      <ProtoDataComponent onVehiclePositionsUpdate={handleVehiclePositionsUpdate} />
    </div>
  );
}

export default App;
