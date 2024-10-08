import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Select,
  Modal,
  Checkbox,
  Space,
  notification,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TablePopulateCenter from "../../components/TablePopulateCenter";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import appFirebase from "../../js/credentials";
import { getDatabase, ref, set } from "firebase/database";
const db = getFirestore(appFirebase);
const database = getDatabase(appFirebase);

const { Option } = Select;

export interface centrosProp {
  centro_id: string;
  centro_nombre: string;
  centro_provincia: string;
  centro_distrito: string;
  centro_latitud: string;
  centro_longitud: string;
  centro_enMeta: boolean;
}

interface MonitorAuxiliar {
  centro_name: string;
  val_cloro: number;
}

const PopulateCenter: React.FC = () => {
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadAdd, setLoadAdd] = useState<boolean>(false);
  const [centros, setCentros] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [selectedProvincia, setSelectedProvincia] = useState<string | null>(
    null
  );

  const provincias: any = {
    Manu: ["Manu", "Fitzcarrald", "Madre de Dios", "Huepetue"],
    Tahuamanu: ["Tahuamanu", "Iñapari"],
    Tambopata: ["Tambopata", "Inambari", "Las piedras", "Laberinto"],
  };

  const fetchCenters = async () => {
    const dataCentros: any = [];
    try {
      const querySnapshot = await getDocs(collection(db, "centros_poblados"));
      querySnapshot.docs.forEach((doc) => {
        dataCentros.push(doc.data());
      });

      setCentros(dataCentros);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener datos: ", error);
    }
  };

  const addData = async (values: centrosProp) => {
    setLoadAdd(true);
    try {
      const docRef = doc(collection(db, "centros_poblados"));
      const client_id = docRef.id;

      values.centro_id = client_id;

      await setDoc(docRef, values);

      const objAuxiliar: MonitorAuxiliar = {
        centro_name: values.centro_nombre,
        val_cloro: 0.0,
      };

      const dbRefAuxiliar = ref(database, `monitor_auxiliar/${client_id}`); // Usar la marca de tiempo como ID único

      await set(dbRefAuxiliar, objAuxiliar);

      setCentros([...centros, values]);
      form.resetFields();
      setIsAddModalVisible(false);
      setLoadAdd(false);
      notification.success({
        message: "Centro Poblado Agregado",
        description: `El C.P ${values.centro_nombre} ha sido agregado con éxito.`,
        placement: "top",
      });
    } catch (error) {
      setIsAddModalVisible(false);
      setLoadAdd(false);
      console.error("Error al agregar datos: ", error);
      notification.error({
        message: "Error",
        description: "No se pudo agregar el centro poblado.",
        placement: "top",
      });
    }
  };

  const handleProvinciaChange = (value: string) => {
    setSelectedProvincia(value);
    form.setFieldsValue({ distrito: null }); // Resetea el valor del distrito
  };

  const handleEditCentro = (updatedCentro: any) => {
    setCentros((prevCentro) =>
      prevCentro.map((centro) =>
        centro.client_id === updatedCentro.client_id ? updatedCentro : centro
      )
    );
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalVisible(true)}
          style={{ marginBottom: 16 }}
        >
          Agregar Centro Poblado
        </Button>

        <TablePopulateCenter
          centros={centros}
          onEdit={handleEditCentro}
          loading={isLoading}
        ></TablePopulateCenter>
        <Modal
          title="Agregar Centro Poblado"
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={addData}>
            <Form.Item
              name="centro_nombre"
              label="Nombre"
              rules={[
                { required: true, message: "Por favor ingrese el nombre" },
              ]}
            >
              <Input placeholder="Nombre del centro poblado" />
            </Form.Item>

            <Form.Item
              name="centro_provincia"
              label="Provincia"
              rules={[{ required: true, message: "Seleccione la provincia" }]}
            >
              <Select
                placeholder="Selecciona la provincia"
                onChange={handleProvinciaChange}
              >
                <Option value="Manu">Manu</Option>
                <Option value="Tahuamanu">Tahuamanu</Option>
                <Option value="Tambopata">Tambopata</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="centro_distrito"
              label="Distrito"
              rules={[
                { required: true, message: "Por favor seleccione el distrito" },
              ]}
            >
              <Select
                placeholder="Selecciona el distrito"
                disabled={!selectedProvincia}
              >
                {selectedProvincia &&
                  provincias[selectedProvincia]?.map((distrito: string) => (
                    <Option key={distrito} value={distrito}>
                      {distrito}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="centro_latitud"
              label="Latitud"
              rules={[
                { required: true, message: "Por favor ingrese la latitud" },
              ]}
            >
              <Input placeholder="Latitud" />
            </Form.Item>

            <Form.Item
              name="centro_longitud"
              label="Longitud"
              rules={[
                { required: true, message: "Por favor ingrese la longitud" },
              ]}
            >
              <Input placeholder="Longitud" />
            </Form.Item>

            <Form.Item
              name="centro_enMeta"
              valuePropName="checked"
              label="En Meta"
              initialValue={false}
              style={{ marginBottom: 0 }}
            >
              <Checkbox>¿Está en Meta?</Checkbox>
            </Form.Item>

            <Form.Item>
              <Spin spinning={loadAdd}>
                <Button type="primary" htmlType="submit" block>
                  Guardar
                </Button>
              </Spin>
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </div>
  );
};

export default PopulateCenter;
