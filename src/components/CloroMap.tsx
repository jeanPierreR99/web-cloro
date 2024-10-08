import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const areas = [
  {
    name: "Centro Poblado Shintuya",
    coordinates: [
      [-12.556218, -69.208889],
      [-12.615191, -69.219875],
      [-12.616531, -69.200649],
      [-12.596093, -69.155674],
    ],
  },
  {
    name: "Centro Poblado Puerto Maldonado",
    coordinates: [
      [-12.5940, -70.1995],
      [-12.5945, -70.2000],
      [-12.5930, -70.2010],
      [-12.5925, -70.1990],
    ],
  },
  {
    name: "Centro Poblado Santo Domingo",
    coordinates: [
      [-12.5800, -70.2160],
      [-12.5805, -70.2170],
      [-12.5790, -70.2180],
      [-12.5785, -70.2155],
    ],
  },
];

// Componente para establecer el centro del mapa
const MapView = () => {
  const map = useMap();

  useEffect(() => {
    map.setView([-12.5862, -70.2410], 10); // Establece el centro y el zoom inicial
  }, [map]);

  return null; // Este componente no necesita renderizar nada
};

const CloroDashboard = () => (
  <MapContainer style={{ height: "400px", width: "100%" }}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      // La propiedad attribution se mueve al MapContainer
    />
    <MapView />
    {areas.map((area) => (
      <Polygon key={area.name} positions={area.coordinates}>
        <Popup>
          {area.name}
        </Popup>
      </Polygon>
    ))}
  </MapContainer>
);

const CloroMap = () => (
  <div>
    <h1>Monitoreo de Cloro en Madre de Dios</h1>
    <CloroDashboard />
  </div>
);

export default CloroMap;
