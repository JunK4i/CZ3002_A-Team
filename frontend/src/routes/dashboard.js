import { React, useEffect, useState } from "react";
import { Card, Container, Row, Spinner } from "react-bootstrap";
import { Doughnut, Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import "../styles/Typography.css";

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const donutDict = {
  Oil: 0,
  Meat: 1,
  Grain: 2,
  Vegetable: 3,
  Fruit: 4,
  Dairy: 5,
  Condiments: 6,
};

const barChartLabelDict = {
  1: "Jan",
  2: "Feb",
  3: "Mar",
  4: "Apr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Aug",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dec",
};

const donutLabels = [
  "Oil",
  "Meat",
  "Grain",
  "Vegetables",
  "Fruit",
  "Dairy",
  "Spice",
];
const donutColors = [
  "#F5820E",
  "#F08D8D",
  "#EDB996",
  "#9DE8A2",
  "#DDED66",
  "#9BEAFC",
  "#955F08",
];
const Dashboard = () => {
  const [donutData, setDonutData] = useState({
    labels: [],
    datasets: [
      {
        label: "Food Wastage",
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Food Wastage",
        data: [],
        backgroundColor: [],
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [noDonutData, setNoDonutData] = useState(false);
  const [noBarData, setNoBarData] = useState(false);

  useEffect(() => {
    setLoading(true);
    const uid = localStorage.getItem("uid");
    axios
      .get("http://localhost:8000/getStats", {
        headers: {
          userid: `${uid}`,
        },
      })
      .then(
        (response) => {
          var categoryFoodWastageData = [0, 0, 0, 0, 0, 0, 0];
          var monthlyFoodWastageData = [];
          var monthlyLabels = [];

          const categoryData = response.data["groupByCategory"];
          if (categoryData["error"] != true) {
            for (var i = 0; i < categoryData.length; i++) {
              var index = donutDict[categoryData[i]["category"]];
              categoryFoodWastageData[index] = categoryData[i]["SUM(quantity)"];
            }

            setDonutData({
              labels: donutLabels,
              datasets: [
                {
                  label: "Food Wastage",
                  data: categoryFoodWastageData,
                  backgroundColor: donutColors,
                  borderColor: donutColors,
                  borderWidth: 1,
                },
              ],
            });
          } else {
            setNoDonutData(true);
          }

          const monthlyData = response.data["groupByMonth"];
          let monthNumericArray = [];
          let dataDict = {};
          if (monthlyData["error"] != true) {
            for (var i = 0; i < monthlyData.length; i++) {
              var month = monthlyData[i]["MONTH(expiry)"];
              var quantity = monthlyData[i]["SUM(quantity)"];
              monthNumericArray.push(month);
              dataDict[month] = quantity;
            }
            monthNumericArray.sort(function (a, b) {
              if (a > b) return 1;
              if (a < b) return -1;
              return 0;
            });
            for (var i = 0; i < monthNumericArray.length; i++) {
              monthlyLabels.push(barChartLabelDict[monthNumericArray[i]]);
              monthlyFoodWastageData.push(dataDict[monthNumericArray[i]]);
            }

            setBarChartData({
              labels: monthlyLabels,
              datasets: [
                {
                  label: "Food Wastage",
                  data: monthlyFoodWastageData,
                  backgroundColor: [
                    "#0263FF",
                    "#FF7723",
                    "#8E30FF",
                    "#955F08",
                    "#3D8807",
                  ],
                },
              ],
            });
          } else {
            setNoBarData(true);
          }
        },
        (error) => {}
      );
    setLoading(false);
  }, []);

  return (
    <Container>
      <div className="header1">Dashboard</div>
      <div className="header-caption mb-4">Manage your food wastage here</div>
      <Row>
        <Card
          border="light"
          style={{ width: "100%", paddingTop: "0.5em", borderRadius: "30px" }}
        >
          <Card.Title>Discarded Ingredients</Card.Title>
          <div style={{ height: "20em", marginBottom: "1em" }}>
            {loading ? (
              <Spinner />
            ) : noDonutData ? (
              <p>No Data to Show</p>
            ) : (
              <Doughnut
                data={donutData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                  },
                }}
              />
            )}
          </div>
        </Card>
      </Row>
      <Row>
        <Card
          border="light"
          style={{
            width: "100%",
            paddingTop: "0.5em",
            marginTop: "1.5em",
            borderRadius: "30px",
            marginBottom: "2em",
          }}
        >
          <Card.Title>Food Wastage</Card.Title>
          <div style={{ height: "20em", marginBottom: "1em" }}>
            {loading ? (
              <Spinner />
            ) : noBarData ? (
              <p>No data to show</p>
            ) : (
              <Bar
                data={barChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                }}
              />
            )}
          </div>
        </Card>
      </Row>
    </Container>
  );
};

export default Dashboard;
