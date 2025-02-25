import CloroMap from "../../components/CloroMap";
import ListMonitor from "../../components/ListMonitor";

const Home = () => {
  return (
    <>
      <div className="content-map" style={{ display: "flex", width: "100%", height: "100%", gap: 10 }}>
        <CloroMap></CloroMap>
        <ListMonitor />
      </div>
    </>
  );
};

export default Home;
