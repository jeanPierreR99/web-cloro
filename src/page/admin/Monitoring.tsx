import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import CloroGlobalLine from "../../components/CloroGlobalLine";
import { Button, Col, Row, Select, Spin, Table, Tag } from "antd";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import appFirebase from "../../js/credentials";
import { DownloadOutlined } from "@ant-design/icons";
import { Gestor } from "../../components/TableGestor";
import { CentroPoblado } from "../../components/TablePopulateCenter";
const db = getFirestore(appFirebase);
const { Option } = Select;

interface MonitorCLoro {
  monitor_cloro_date: string;
  monitor_cloro_gestor_id: string;
  monitor_cloro_id: string;
  monitor_cloro_observaciones: string;
  monitor_cloro_populate_center_id: string;
  monitor_cloro_punto: string;
  monitor_cloro_tipo: string;
  monitor_cloro_value: number;
}

interface MonitorCloroUserCenter {
  monitoring: MonitorCLoro[];
  gestor: Gestor;
  centro_poblado: CentroPoblado;
}

const obtenerMesTexto = (date: string) => {
  const fecha = new Date(date.split("/").reverse().join("-"));

  return fecha.toLocaleString("es-ES", { month: "long" });
};

const Monitoring = () => {
  const [centros, setCentros] = useState<any[]>([]);
  const [selected, setSected] = useState<string>("all");
  const [infoAll, setInfoAll] = useState<MonitorCloroUserCenter | null>(null);
  const [load, setLoad] = useState(false);

  const fetchCenters = async () => {
    const dataCentros: any = [];
    try {
      const querySnapshot = await getDocs(collection(db, "centros_poblados"));
      querySnapshot.docs.forEach((doc) => {
        dataCentros.push(doc.data());
      });

      setCentros(dataCentros);
    } catch (error) {
      console.error("Error al obtener datos: ", error);
    }
  };

  const handleMonitor = async () => {
    setLoad(true);

    if (selected === "all") {
      try {
        const querySnapshotMonitor = await getDocs(
          collection(db, "monitor_cloro")
        );
        const querySnapshotGestor = await getDocs(collection(db, "gestores"));
        const querySnapshoCenter = await getDocs(
          collection(db, "centros_poblados")
        );

        const allMonitoring: any = [];
        const allGestor: any = [];
        const allCenter: any = [];

        querySnapshotMonitor.forEach((doc) => {
          const docData = doc.data();
          allMonitoring.push({ ...docData });
        });

        querySnapshotGestor.forEach((doc) => {
          const docData = doc.data();
          allGestor.push({ ...docData });
        });

        querySnapshoCenter.forEach((doc) => {
          const docData = doc.data();
          allCenter.push({ ...docData });
        });

        const infoAll: MonitorCloroUserCenter = {
          monitoring: allMonitoring as MonitorCLoro[],
          gestor: allGestor as Gestor,
          centro_poblado: allCenter as CentroPoblado,
        };
        console.log(infoAll);
        setLoad(false);
        setInfoAll(infoAll);
      } catch (error) {
        setInfoAll(null);
        setLoad(false);
        console.error("Error al obtener datos: ", error);
      }

      return;
    }

    try {
      const MonitorQuery = query(
        collection(db, "monitor_cloro"),
        where("monitor_cloro_populate_center_id", "==", selected)
      );

      const querySnapshotMonitoring = await getDocs(MonitorQuery);
      const filterMonitoring: any = [];

      querySnapshotMonitoring.forEach((doc) => {
        const docData = doc.data();
        filterMonitoring.push({ ...docData });
      });

      const docRefGestor = doc(
        db,
        "gestores",
        filterMonitoring[0].monitor_cloro_gestor_id
      );
      const gestorSnap = await getDoc(docRefGestor);
      const gestorData = gestorSnap.data();

      const docRefCentro = doc(
        db,
        "centros_poblados",
        filterMonitoring[0].monitor_cloro_populate_center_id
      );
      const centroSnap = await getDoc(docRefCentro);

      const centroData = centroSnap.data();

      const infoAll: MonitorCloroUserCenter = {
        monitoring: filterMonitoring as MonitorCLoro[],
        gestor: gestorData as Gestor,
        centro_poblado: centroData as CentroPoblado,
      };
      console.log(infoAll);
      setLoad(false);
      setInfoAll(infoAll);
    } catch (error) {
      setInfoAll(null);
      setLoad(false);
      console.error("Error al obtener datos: ", error);
    }
  };

  const handleExport = () => {
    // Crear una nueva hoja de cálculo a partir de los datos JSON

    const centro_nombre = infoAll?.centro_poblado?.centro_nombre;
    const centro_provincia = infoAll?.centro_poblado?.centro_provincia;
    const centro_distrito = infoAll?.centro_poblado?.centro_distrito;
    const gestor_name_complete = infoAll?.gestor?.gestor_name_complete;
    const gestor_dni = infoAll?.gestor?.gestor_dni;
    const centro_latitud = infoAll?.centro_poblado.centro_latitud;
    const centro_longitud = infoAll?.centro_poblado.centro_longitud;
    const metaFed = infoAll?.centro_poblado.centro_enMeta;

    const monitoringData = infoAll?.monitoring;

    const excelData: any[] = [];

    monitoringData?.forEach((monitor: any) => {
      const monitorRecord = {
        gestor: gestor_name_complete,
        dni: gestor_dni,
        centro_poblado: centro_nombre,
        provincia: centro_provincia,
        distrito: centro_distrito,
        Fecha: monitor.monitor_cloro_date,
        periodo: monitor.monitor_cloro_tipo,
        cloro: monitor.monitor_cloro_value,
        latitud: centro_latitud,
        longitud: centro_longitud,
        punto: monitor.monitor_cloro_punto,
        observaciones: monitor.monitor_cloro_observaciones,
        metFed: metaFed ? "META FED" : "NO FED",
        mes: obtenerMesTexto(monitor.monitor_cloro_date),
      };
      excelData.push(monitorRecord);
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    XLSX.writeFile(
      workbook,
      `vivienda_datos_${infoAll?.centro_poblado.centro_nombre}.xlsx`
    );
  };

  const columns = [
    {
      title: "Fecha",
      dataIndex: "monitor_cloro_date",
      key: "monitor_cloro_date",
      sorter: (a: any, b: any) =>
        a.monitor_cloro_date.localeCompare(b.monitor_cloro_date),
    },
    {
      title: "Cloro",
      dataIndex: "monitor_cloro_value",
      key: "monitor_cloro_value",
      render: (data: number) => (
        <Tag color={data <= 0.5 ? "red" : "green"}>{data}</Tag>
      ),
    },
    {
      title: "Punto Estrategico",
      dataIndex: "monitor_cloro_punto",
      key: "monitor_cloro_punto",
    },
    {
      title: "Observaciones",
      dataIndex: "monitor_cloro_observaciones",
      key: "monitor_cloro_observaciones",
    },
    {
      title: "Periodo",
      dataIndex: "monitor_cloro_tipo",
      key: "monitor_cloro_tipo",
    },
  ];

  useEffect(() => {
    fetchCenters();
    handleMonitor();
  }, [selected]);

  return (
    <div>
      <Select
        placeholder="Centro Poblado"
        onChange={(value) => {
          setSected(value);
        }}
        style={{ width: "220px" }}
      >
        {centros.map((data, index) => (
          <Option key={index} value={data.centro_id}>
            {data.centro_nombre}
          </Option>
        ))}
        <Option value="all">Todos</Option>
      </Select>
      <Button
        style={{ marginLeft: 10 }}
        type="primary"
        onClick={() => {
          handleExport();
        }}
        icon={<DownloadOutlined />}
        size={"middle"}
      >
        Download
      </Button>
      <Spin spinning={load} tip={"...cargando"}>
        {infoAll?.monitoring && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              fontSize: 12,
              marginTop: 10,
            }}
          >
            {!infoAll && <span>Sin datos</span>}
            <span>
              <strong>DNI: </strong>
              {infoAll?.gestor.gestor_dni}
            </span>
            <span>
              <strong>Gestor: </strong>
              {infoAll?.gestor.gestor_name_complete}
            </span>
            <span>
              <strong>Telefono: </strong>
              {infoAll?.gestor.gestor_phone}
            </span>
          </div>
        )}
      </Spin>
      <Row>
        <Col xs={24} md={12}>
          {!infoAll && <span>Sin datos</span>}
          <Spin spinning={load} tip={"...cargando"}>
            {infoAll?.monitoring && (
              <CloroGlobalLine data={infoAll?.monitoring}></CloroGlobalLine>
            )}
          </Spin>
        </Col>
        <Col xs={24} md={12}>
          {!infoAll && <span>Sin datos</span>}
          <Spin spinning={load} tip={"...cargando"}>
            {infoAll?.monitoring && (
              <Table
                dataSource={infoAll?.monitoring}
                columns={columns}
                rowKey="gestor_id"
              />
            )}
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default Monitoring;
