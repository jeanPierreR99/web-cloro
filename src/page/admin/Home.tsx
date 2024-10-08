import CloroGlobalChart from "../../components/CloroGlobalChart";
import CloroColumnChart from "../../components/CloroColumnChart";

const Home = () => {
  return (
    <>
      <div>
        <div>
          <span>Promedio de Cloro Por Centro Poblado</span>
          <CloroGlobalChart />
          <span>Promedio de Cloro Por Mes</span>
          <CloroColumnChart></CloroColumnChart>
        </div>
      </div>
    </>
  );
};

export default Home;
