import React, { useEffect, useState } from "react";
import { Avatar, List, Spin } from "antd";
import { getFirestore, collection, onSnapshot, doc, getDoc, query, where } from "firebase/firestore";
import appFirebase from "../js/credentials";

const db = getFirestore(appFirebase);

interface Gestor {
    gestor_name_complete: string;
    gestor_image: string
}

interface Centro {
    centro_nombre: string;
}

interface MonitorCloro {
    id: string;
    monitor_cloro_id: string;
    monitor_cloro_date: string;
    monitor_cloro_gestor_id?: string;
    monitor_cloro_populate_center_id?: string;
    monitor_cloro_punto: string;
    monitor_cloro_tipo: string;
    monitor_cloro_value: number;
    monitor_cloro_observaciones: string;
    monitor_cloro_images: { url: string }[];
    gestor?: Gestor | null;
    center?: Centro | null;
}

const ListMonitor: React.FC = () => {
    const [monitoringData, setMonitoringData] = useState<MonitorCloro[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [dateNow, setDateNow] = useState<string>("");

    useEffect(() => {
        const today = new Date().toLocaleDateString()

        setDateNow(today);

        const q = query(collection(db, "monitor_cloro"), where("monitor_cloro_date", "==", today));

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as MonitorCloro[];

            const enrichedData = await Promise.all(
                docs.map(async (df: MonitorCloro) => {
                    const gestorRef = df.monitor_cloro_gestor_id
                        ? getDoc(doc(db, "gestores", df.monitor_cloro_gestor_id))
                        : null;
                    const centerRef = df.monitor_cloro_populate_center_id
                        ? getDoc(doc(db, "centros_poblados", df.monitor_cloro_populate_center_id))
                        : null;

                    const [gestorSnap, centerSnap] = await Promise.all([gestorRef, centerRef]);

                    return {
                        ...df,
                        gestor: gestorSnap?.exists() ? (gestorSnap.data() as Gestor) : null,
                        center: centerSnap?.exists() ? (centerSnap.data() as Centro) : null,
                    };
                })
            );
            setMonitoringData(enrichedData);
            console.log(enrichedData)
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="list-monitoring" style={{ width: "30%", height: "400px", overflowY: "auto", marginTop: 40, paddingRight:10 }}>
            {loading ? (
                <Spin />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={monitoringData}
                    header={<span style={{ color: "gray" }}>Monitoreos del día: {dateNow}</span>}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar size={60} src={`${item.gestor?.gestor_image}`} />}
                                title={<span style={{ fontWeight: 600 }}>{item.gestor?.gestor_name_complete} - {item.center?.centro_nombre}</span>}
                                description={
                                    <div style={{display:"flex", flexDirection:"column"}}>
                                        <span>{item.monitor_cloro_tipo} - {item.monitor_cloro_punto}</span>
                                        <span style={{fontWeight:700, textAlign:"right"}}>{item.monitor_cloro_value}</span>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </div>
    );
};

export default ListMonitor;
