import React, {
  /* useState,*/
  /* useContext */
} from 'react';
import PageTitle from '../components/common/PageTitle';
//import DashboardMetric from './../components/DashboardMetric';
//import Card from '../components/common/Card';
// import {
//   faChartArea,
//   faDollarSign,
//   faUserPlus
// } from '@fortawesome/free-solid-svg-icons';
// import { FetchContext } from '../context/FetchContext';
// import { formatCurrency } from './../util';
// import DashboardChart from './../components/DashboardChart';

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
      <PageTitle title="Dashboard" />
    </>
  );
};

export default Dashboard;
