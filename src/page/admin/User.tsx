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
  Upload,
  Avatar,
  InputNumber,
} from "antd";
import TableGestor from "../../components/TableGestor";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import appFirebase from "../../js/credentials";
import axios from "axios";
const db = getFirestore(appFirebase);
const storage = getStorage(appFirebase);
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";

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
  gestor_image: string;
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
        where("centro_status", "==", false),
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
      const q = query(collection(db, "gestores"), orderBy("gestor_create_at", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
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

  const imageDefault: any = "https://firebasestorage.googleapis.com/v0/b/api-node-e6599.appspot.com/o/profiles%2Fperfil-empty.png?alt=media&token=381ba653-57fd-4586-9fe0-deb24c624faa"
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      notification.warning({
        message: "Alerta",
        description: "Solo puedes subir imágenes",
        placement: "top",
      });
    }
    return isImage || Upload.LIST_IGNORE;
  };

  const handleFileChange = (info: any) => {
    const file = info.file.originFileObj;
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file);
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

      let imageUrl;
      if (file) {
        imageUrl = await uploadFile(file);
        values.gestor_image = imageUrl as string;
      }
      else {
        values.gestor_image = imageDefault;
      }

      const docRefCentro = doc(
        db,
        "centros_poblados",
        values.id_centro_poblado,
      );
      await setDoc(docRef, values);
      await updateDoc(docRefCentro, { centro_status: true });

      form.resetFields();
      setFile(null);
      setIsAddModalVisible(false);

      notification.success({
        message: "Gestor Agregado",
        description: `El gestor ${values.gestor_name_complete} ha sido agregado con éxito.`,
        placement: "top",
      });
    } catch (error) {
      console.error("Error al agregar datos: ", error);
      notification.error({
        message: "Error",
        description: "No se pudo agregar el gestor.",
        placement: "top",
      });
    } finally {
      setLoaddAdd(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file) return;

    const storageRef = ref(storage, `profiles/${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Archivo subido:", snapshot);

      const url = await getDownloadURL(storageRef);
      console.log("URL del archivo:", url);
      return url;
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  };

  const getNameByDNi = async (dni: string) => {
    try {
      if (dni.length >= 8) {
        setLoadSearch(true);
        const handleData = await axios.get(
          `https://api-dni-ruc.vercel.app/jp_api/reniec?dni=${dni}`,
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
          onClick={() => {
            setIsAddModalVisible(true); form.resetFields();
            file && setFile(null);
            previewUrl && setPreviewUrl(null);
          }}
          style={{ marginBottom: 16 }}
        >
          Agregar
        </Button>

        <TableGestor gestores={gestores} loading={isLoading} />

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
              rules={[{ required: true, message: "Por favor ingrese su DNI" }]}
            >
              <Search
                onChange={(e) => getNameByDNi(e.target.value)}
                loading={loadSearch}
                placeholder="DNI"
              />
            </Form.Item>

            <Form.Item label="Fotografía">
              <div style={{ display: "flex", alignItems: "center", gap: "10px", }}>
                <Upload beforeUpload={beforeUpload} onChange={handleFileChange} showUploadList={false}>
                  <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
                </Upload>
                {previewUrl ? (
                  <Avatar src={previewUrl} size={55} />
                ) : (
                  <Avatar src={imageDefault} size={55} />)}
              </div>
            </Form.Item>

            <Form.Item
              name="gestor_name_complete"
              label="Nombre Completo"
              rules={[{ required: true, message: "Por favor ingrese el nombre completo" }]}
            >
              <Input placeholder="Nombre completo del gestor" />
            </Form.Item>

            <Form.Item
              name="gestor_phone"
              label="Teléfono"
              rules={[{ required: true, message: "Por favor ingrese el teléfono" }]}
            >
              <InputNumber style={{width:"100%"}} placeholder="Teléfono del gestor" />
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
              rules={[{ required: true, message: "Por favor ingrese el usuario" }]}
            >
              <Input placeholder="Usuario del gestor" />
            </Form.Item>

            <Form.Item
              name="gestor_password"
              label="Contraseña"
              rules={[{ required: true, message: "Por favor ingrese la contraseña" }]}
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
    </div >
  );
};

export default User;
