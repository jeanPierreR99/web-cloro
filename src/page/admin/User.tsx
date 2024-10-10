// ManageGestores.tsx

import { useEffect, useState } from "react";
import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  notification,
  Select,
  Spin,
} from "antd";
import TableGestor from "../../components/TableGestor";
import { PlusOutlined } from "@ant-design/icons";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import appFirebase from "../../js/credentials";
import axios from "axios";
const db = getFirestore(appFirebase);
const { Option } = Select;
const { Search } = Input;

interface gestoresProp {
  gestor_create_at: string;
  gestor_id: string;
  gestor_name_complete: string;
  gestor_phone: string;
  id_centro_poblado: string;
  gestor_user: string;
  gestor_password: string;
  gestor_status: boolean;
}

function getDate() {
  const now = new Date();
  const localDate = now.toLocaleDateString();

  return localDate;
}

const User = () => {
  const [gestores, setGestores] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loadSearch, setLoadSearch] = useState(false);
  const [centros, setCentros] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [loadAdd, setLoaddAdd] = useState<boolean>(false);

  const fetchCenters = () => {
    try {
      const q = query(
        collection(db, "centros_poblados"),
        where("centro_status", "==", false)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const dataCentros: any = [];
        querySnapshot.forEach((doc) => {
          dataCentros.push(doc.data());
        });

        setCentros(dataCentros);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error al obtener datos en tiempo real: ", error);
    }
  };

  const fetchGestores = () => {
    try {
      const unsubscribe = onSnapshot(collection(db, "gestores"), (snapshot) => {
        const dataGestores: any = [];
        snapshot.docs.forEach((doc) => {
          dataGestores.push(doc.data());
        });

        setGestores(dataGestores);
        setIsLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error al obtener datos en tiempo real: ", error);
    }
  };

  const addData = async (values: gestoresProp) => {
    try {
      setLoaddAdd(true);
      const docRef = doc(collection(db, "gestores"));
      const client_id = docRef.id;

      values.gestor_create_at = getDate();
      values.gestor_id = client_id;
      values.gestor_status = true;

      const docRefCentro = doc(
        db,
        "centros_poblados",
        values.id_centro_poblado
      );
      await setDoc(docRef, values);
      await updateDoc(docRefCentro, { centro_status: true });
      form.resetFields();

      setIsAddModalVisible(false);

      notification.success({
        message: "Gestor Agregado",
        description: `El gestor ${values.gestor_name_complete} ha sido agregado con éxito.`,
        placement: "top",
      });
      setLoaddAdd(false);
    } catch (error) {
      console.error("Error al agregar datos: ", error);
      setLoaddAdd(false);
      notification.error({
        message: "Error",
        description: "No se pudo agregar el gestor.",
        placement: "top",
      });
    }
  };

  const handleEditGestor = (updatedGestor: any) => {
    setGestores((prevGestores) =>
      prevGestores.map((gestor) =>
        gestor.client_id === updatedGestor.client_id ? updatedGestor : gestor
      )
    );
  };

  const getNameByDNi = async (dni: string) => {
    try {
      if (dni.length >= 8) {
        setLoadSearch(true);
        const handleData = await axios.get(
          `https://api-dni-ruc.vercel.app/jp_api/reniec?dni=${dni}`
        );

        form.setFieldsValue({ gestor_name_complete: handleData.data.nombre });
        console.log(handleData.data.nombre);
        setLoadSearch(false);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const unsubscribeGestores = fetchGestores();
    const unsubscribeCenters = fetchCenters();
    fetchCenters();

    return () => {
      if (unsubscribeGestores) unsubscribeGestores();
      if (unsubscribeCenters) unsubscribeCenters();
    };
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
          Agregar Gestor
        </Button>

        <TableGestor
          gestores={gestores}
          onEdit={handleEditGestor}
          loading={isLoading}
        />

        <Modal
          title="Agregar Gestor"
          visible={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={addData}>
            <Form.Item
              name="gestor_dni"
              label="DNI"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese su DNI",
                },
              ]}
            >
              <Search
                onChange={(e) => {
                  getNameByDNi(e.target.value);
                }}
                loading={loadSearch}
                placeholder="DNI"
              />
            </Form.Item>
            <Form.Item
              name="gestor_name_complete"
              label="Nombre Completo"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el nombre completo",
                },
              ]}
            >
              <Input placeholder="Nombre completo del gestor" />
            </Form.Item>

            <Form.Item
              name="gestor_phone"
              label="Teléfono"
              rules={[
                { required: true, message: "Por favor ingrese el teléfono" },
              ]}
            >
              <Input placeholder="Teléfono del gestor" />
            </Form.Item>
            <Form.Item
              name="id_centro_poblado"
              label="Centro Poblado"
              rules={[{ required: true, message: "Seleccione la provincia" }]}
            >
              <Select placeholder="Selecciona el centro poblado">
                {centros.map((data, index) => (
                  <Option key={index} value={data.centro_id}>
                    {data.centro_nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="gestor_user"
              label="Usuario"
              rules={[
                { required: true, message: "Por favor ingrese el usuario" },
              ]}
            >
              <Input placeholder="Usuario del gestor" />
            </Form.Item>

            <Form.Item
              name="gestor_password"
              label="Contraseña"
              rules={[
                { required: true, message: "Por favor ingrese la contraseña" },
              ]}
            >
              <Input.Password placeholder="Contraseña del gestor" />
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

export default User;
