import { React, useEffect } from "react";
import { Card, Container, Row } from "react-bootstrap";
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

const labels = ["May", "Jun", "Jul", "Aug", "Sep"];
const donutLabels = [
  "Oil",
  "Meat",
  "Grain",
  "Vegetables",
  "Fruit",
  "Dairy",
  "Condiments",
];
const Dashboard = () => {
  const doughnutData = {
    labels: donutLabels,
    datasets: [
      {
        label: "Food Wastage",
        data: [3, 4, 2, 8, 7, 2, 1],
        backgroundColor: [
          "#F5820E",
          "#F08D8D",
          "#EDB996",
          "#9DE8A2",
          "#DDED66",
          "#9BEAFC",
          "#955F08",
        ],
        borderColor: [
          "#F5820E",
          "#F08D8D",
          "#EDB996",
          "#9DE8A2",
          "#DDED66",
          "#9BEAFC",
          "#955F08",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "Food Wastage",
        data: [40, 88, 60, 32, 14],
        backgroundColor: [
          "#0263FF",
          "#FF7723",
          "#8E30FF",
          "#955F08",
          "#3D8807",
        ],
      },
    ],
  };

  useEffect(() => {}, []);

  return (
    <Container>
      <div className="header1">Dashboard</div>
      <div className="header-caption mb-4">Manage your food wastage here.</div>
      <Row>
        <Card
          border="light"
          style={{ width: "100%", paddingTop: "0.5em", borderRadius: "30px" }}
        >
          <Card.Title>Discarded Ingredients</Card.Title>
          <div style={{ height: "20em", marginBottom: "1em" }}>
            <Doughnut
              data={doughnutData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
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
          </div>
        </Card>
      </Row>
    </Container>
  );
};

export default Dashboard;
