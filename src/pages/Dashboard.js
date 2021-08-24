import React, {
  /* useState,*/
  /* useContext */
} from 'react';
import PageTitle from '../components/common/PageTitle';


const Dashboard = () => {
  // const fetchContext = useContext(FetchContext);
  // const [dashboardData, setDashboardData] = useState();

  // useEffect(() => {
  //   const getDashboardData = async () => {
  //     try {
  //       const { data } = await fetchContext.authAxios.get(
  //         'dashboard-data'
  //       );
  //       setDashboardData(data);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   getDashboardData();
  // }, [fetchContext]);

  return (
    <>
      <PageTitle title="Panel de Control" />
    </>
  );
};

export default Dashboard;
