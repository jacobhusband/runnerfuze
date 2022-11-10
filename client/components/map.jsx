import React from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.API,
  version: 'weekly',
  libraries: ['drawing', 'places']
});

const google = window.google;

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapCenter: { lat: 33.634929, lng: -117.7405074 }
    };
    this.showMap();
    this.mapDivRef = React.createRef();
  }

  showMap(event) {
    loader.load().then(() => {
      this.map = new google.maps.Map(this.mapDivRef.current, {
        center: this.state.mapCenter,
        zoom: 18,
        minZoom: 17,
        maxZoom: 19
      });
      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYLINE,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYLINE]
        },
        polylineOptions: {
          editable: true,
          clickable: true
        },
        circleOptions: {
          fillColor: '#ffff00',
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          zIndex: 1
        }
      });
      this.drawingManager.setMap(this.map);
    });
  }

  render() {
    return (
      <div className='map' ref={this.mapDivRef} />
    );
  }
}