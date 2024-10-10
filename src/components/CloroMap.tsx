import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Popup,
  useMap,
  Marker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import appFirebase from "../js/credentials";
const db = getFirestore(appFirebase);

const areas: any = [
  {
    name: "MADRE DE DIOS",
    coordinates: [
      [-9.849038, -70.618279],
      [-10.992076, -70.610582],
      [-10.990558, -69.569583],
      [-12.531315, -68.651379],
      [-13.033356, -68.870803],
      [-13.353803, -69.723178],
      [-13.312744, -71.056598],
      [-12.110822, -72.170594],
      [-11.044311, -72.179033],
    ],
  },
];

const MapView = () => {
  const map = useMap();

  useEffect(() => {
    map.setView([-12.5862, -70.241], 6);
  }, [map]);

  return null;
};

const CloroDashboard = ({ centros }: any) => {
  const customIcon = new L.Icon({
    iconUrl:
      "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png", // Reemplaza con la ruta a tu ícono
    iconSize: [50, 50],
    iconAnchor: [12, 41],
  });

  return (
    <MapContainer style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapView />
      {areas.map((area: any) => (
        <Polygon key={area.name} positions={area.coordinates}>
          <Popup>{area.name}</Popup>
        </Polygon>
      ))}
      {centros &&
        centros.map((data: any, index: any) => (
          <Marker
            key={index}
            position={[
              parseFloat(data.centro_latitude),
              parseFloat(data.centro_longitud),
            ]}
            icon={customIcon}
          >
            <Popup>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span>
                  <strong>Centro poblado:</strong> {data.centro_name}
                </span>
                <span>
                  <strong>Gestor:</strong> {data.gestor_name}
                </span>
                <span>
                  <strong>DNI:</strong> {data.gestor_dni}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

const CloroMap = () => {
  const [data, setData] = useState<any[]>([]);

  const fectchGestores = async () => {
    const dataGestores: any = [];
    try {
      const querySnapshot = await getDocs(collection(db, "gestores"));
      querySnapshot.docs.forEach((doc) => {
        dataGestores.push(doc.data());
      });

      return await dataGestores;
    } catch (error) {
      console.error("Error al obtener datos: ", error);
    }
  };

  const fetchCenters = async () => {
    const dataCentros: any = [];
    try {
      const querySnapshot = await getDocs(collection(db, "centros_poblados"));
      querySnapshot.docs.forEach((doc) => {
        dataCentros.push(doc.data());
      });

      return await dataCentros;
    } catch (error) {
      console.error("Error al obtener datos: ", error);
    }
  };

  const fetchCentersAndGestor = async () => {
    const centers = await fetchCenters();
    const gestors = await fectchGestores();

    var dataArray: any[] = [];
    gestors.forEach((data: any) => {
      centers.forEach((element: any) => {
        if (data.id_centro_poblado == element.centro_id) {
          dataArray.push({
            centro_name: element.centro_nombre,
            centro_latitude: element.centro_latitud,
            centro_longitud: element.centro_longitud,
            gestor_name: data.gestor_name_complete,
            gestor_dni: data.gestor_dni,
          });
        }
      });
    });
    setData(dataArray);
  };

  useEffect(() => {
    fetchCentersAndGestor();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <h1>Madre de Dios</h1>
      <CloroDashboard centros={data} />
    </div>
  );
};

export default CloroMap;
