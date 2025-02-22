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
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import appFirebase from "../js/credentials";
import PING from "../assets/pin.png";
import { Avatar, Select } from "antd";
const db = getFirestore(appFirebase);
const { Option } = Select;
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

const MapView = ({ coor }: any) => {
  const map = useMap();
  const coorSplit = coor.split(",");

  useEffect(() => {
    map.setView([coorSplit[0], coorSplit[1]], coorSplit[2]);
  }, [map, coor]);

  return null;
};

const CloroDashboard = ({ centros, coor }: any) => {

  return (
    <MapContainer style={{ height: "90%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapView coor={coor} />
      {areas.map((area: any) => (
        <Polygon fillColor="#888" key={area.name} positions={area.coordinates}>
          {/* <Popup>{area.name}</Popup> */}
        </Polygon>
      ))}
      {centros &&
        centros.map((data: any, index: any) => {
          const customIcon = new L.Icon({
            iconUrl: data.gestor_image || PING,
            iconSize: [50, 50],
            iconAnchor: [12, 41],
            className: "rounded-icon",
          });
          return (
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
                  <Avatar src={data.gestor_image} size={55} />
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
          )
        })}
    </MapContainer>
  );
};

const CloroMap = () => {
  const [data, setData] = useState<any[]>([]);
  const [centros, setCentros] = useState<any[]>([]);
  const [selected, setSected] = useState<any>("-11.8137652,-71.1348947, 7");

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
      const centrosRef = collection(db, "centros_poblados");
      const q = query(centrosRef, where("centro_status", "==", true));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        dataCentros.push(doc.data());
      });

      return dataCentros;
    } catch (error) {
      console.error("Error al obtener datos: ", error);
    }
  };

  const fetchCentersAndGestor = async () => {
    const centers = await fetchCenters();
    const gestors = await fectchGestores();

    setCentros(centers);

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
            gestor_image: data.gestor_image,
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
      <Select
        placeholder="Centro Poblado"
        onChange={(value) => {
          setSected(value);
        }}
        style={{ width: "220px" }}
      >
        {centros.map((data, index) => (
          <Option key={index} value={`${data.centro_latitud},${data.centro_longitud}, 14`}>
            {data.centro_nombre}
          </Option>
        ))}
        <Option value="-11.8137652,-71.1348947, 7">Madre de dios</Option>
      </Select>
      <br /><br />
      <CloroDashboard centros={data} coor={selected} />
    </div>
  );
};

export default CloroMap;
