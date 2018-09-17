import React, { Component } from 'react'
import { withGoogleMap, GoogleMap, Polyline } from "react-google-maps"

const pathStyle = {
    strokeColor: '#ff2527',
    strokeOpacity: 0.9,
    strokeWeight: 2
};

export default class MapContainer extends Component {

    render() {
        console.log(this.props, this.refs);
        const paths = geoDataToPath(this.props.geo_data);
        const GMap = withGoogleMap(props => (
            <GoogleMap
                ref={map => map && map.fitBounds(getPathBounds(this.props.geo_data))}
                defaultCenter={{ lat: 52.497651, lng: 13.430622 }}
                defaultZoom={13}
                defaultMapTypeId={'satellite'}
                defaultOptions={{
                    fullscreenControl: false,
                    panControl: false,
                    streetViewControl: false,
                    scaleControl: false,
                    mapTypeControl: false
                }}
            >
                {[...paths]}
            </GoogleMap>
        ));

        return (
            <div>
                <h3>{`${this.props.name}`}</h3>
                <GMap
                    containerElement={<div style={{ height: "60vh", width: "100%" }} />}
                    mapElement={<div style={{ height: "60vh", width: "100%" }} />}
                />
                <p style={{ fontSize: "0.7em" }}>
                    {this.props.description || "No description available"}
                </p>
            </div>
        );

    }
}

function getPathBounds(geoData) {
    //Fit all points in a LatLngBounds so gmaps knows where to center the map
    if (!geoData) return [];
    const bounds = new window.google.maps.LatLngBounds();
    geoData.coordinates.forEach(gd => {
        gd.forEach(coords => {
            bounds.extend(new window.google.maps.LatLng(coords[1], coords[0]));
        });
    });
    console.log(bounds);
    return bounds;
}

function geoDataToPath(geoData) {
    if (!geoData) return [];
    let mapComponents;
    //could extend to support different types of adventure visualizations
    if (geoData.type === "MultiLineString") {
        mapComponents = geoData.coordinates.map((line, i) => {
            const points = line.map(coords => {
                return {
                    lat: coords[1],
                    lng: coords[0]
                }
            })
            return <Polyline key={i} path={points} options={pathStyle} />
        });
    }
    return mapComponents;
}
