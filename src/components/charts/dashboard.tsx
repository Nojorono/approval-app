import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import { EnPoint } from "../../utils/EndPoint";

type DashboardData = {
  summary: {
    assignedApproval: number;
    slaCompliance: number;
    avgResponseTime: string;
    highRisk: number;
  };
  approvalPerformance: {
    categories: string[];
    approve: number[];
    reject: number[];
    pending: number[];
  };
  percentageApprovals: {
    labels: string[];
    series: number[];
  };
  slaVsAnomalies: {
    categories: string[];
    anomalies: number[];
    slaCompliance: number[];
  };
  approvers: {
    fastest: { name: string; avg: string }[];
    bottleneck: { name: string; avg: string }[];
  };
};

const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">(
    "weekly"
  );
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${EnPoint}dashboard?period=${period}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        // Adapt API response to DashboardData shape
        const api = res.data?.data;

        const approvalPerformance = {
          categories:
            api?.approvalRequests?.dailyTrend?.map((d: any) => d.date) || [],
          approve: api?.approvalProcesses
            ? [api.approvalProcesses.approved]
            : [],
          reject: api?.approvalProcesses
            ? [api.approvalProcesses.rejected]
            : [],
          pending: api?.approvalProcesses
            ? [api.approvalProcesses.pending]
            : [],
        };

        const percentageApprovals = {
          labels: ["Approved", "Rejected", "Pending"],
          series: api?.approvalProcesses
            ? [
                api.approvalProcesses.approved || 0,
                api.approvalProcesses.rejected || 0,
                api.approvalProcesses.pending || 0,
              ]
            : [0, 0, 0],
        };

        const slaVsAnomalies = {
          categories: approvalPerformance.categories,
          anomalies:
            api?.approvalRequests?.dailyTrend?.map(
              (d: any) => d.anomalies || 0
            ) || [],
          slaCompliance:
            api?.approvalRequests?.dailyTrend?.map(
              (d: any) => d.slaCompliance || 0
            ) || [],
        };

        const approvers = {
          fastest: [], // No data in API, leave empty or mock if needed
          bottleneck: [],
        };

        setData({
          summary: {
            assignedApproval: api?.approvalProcesses?.total || 0,
            slaCompliance: api?.approvalProcesses?.approvalRate
              ? Math.round(api.approvalProcesses.approvalRate)
              : 0,
            avgResponseTime: api?.approvalProcesses?.averageResponseTime
              ? `${Math.round(
                  Number(api.approvalProcesses.averageResponseTime)
                )} min`
              : "0 min",
            highRisk: 0, // No data in API, leave 0 or mock if needed
          },
          approvalPerformance,
          percentageApprovals,
          slaVsAnomalies,
          approvers,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading || !data) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  // ===== Chart Configs =====
  const lineOptions: ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    stroke: { curve: "smooth" },
    markers: { size: 4 },
    xaxis: { categories: data.approvalPerformance.categories },
    legend: { position: "top" },
  };

  const lineSeries = [
    { name: "Approve", data: data.approvalPerformance.approve },
    { name: "Reject", data: data.approvalPerformance.reject },
    { name: "Pending", data: data.approvalPerformance.pending },
  ];

  const pieOptions: ApexOptions = {
    labels: data.percentageApprovals.labels,
    legend: { position: "bottom" },
    colors: ["#66cea8ff", "#f87171", "#fbbf24"],
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts?: any) {
        return `${opts.w.globals.labels[opts.seriesIndex]}: ${val.toFixed(1)}%`;
      },
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        colors: ["#000"],
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      theme: "light",
      style: {
        fontSize: "16px",
      },
    },
  };
  const pieSeries = data.percentageApprovals.series;

  const barOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    xaxis: { categories: data.slaVsAnomalies.categories },
    yaxis: [
      { title: { text: "Anomalies Count" } },
      { opposite: true, title: { text: "SLA Compliance (%)" } },
    ],
  };
  const barSeries = [
    {
      name: "Anomalies Count",
      type: "column",
      data: data.slaVsAnomalies.anomalies,
    },
    {
      name: "SLA Compliance",
      type: "line",
      data: data.slaVsAnomalies.slaCompliance,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Approval Process Dashboard</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="border rounded px-3 py-1 text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Assigned Approval</p>
          <p className="text-xl font-semibold">
            {data.summary.assignedApproval}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">SLA Compliance Rate</p>
          <p className="text-xl font-semibold text-orange-500">
            {data.summary.slaCompliance}%
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Average Response Time</p>
          <p className="text-xl font-semibold">
            {data.summary.avgResponseTime}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">High Risk Approvals</p>
          <p className="text-xl font-semibold text-red-500">
            {data.summary.highRisk}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Approval Performance</h2>
          <Chart
            options={lineOptions}
            series={lineSeries}
            type="line"
            height={300}
          />
        </div> */}
        {/* <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">
            Percentage of Total Approvals
          </h2>
          <Chart
            options={pieOptions}
            series={pieSeries}
            type="pie"
            height={500}
          />
        </div> */}
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-2">
          Percentage of Total Approvals
        </h2>
        <Chart
          options={pieOptions}
          series={pieSeries}
          type="donut"
          height={500}
        />
      </div>

      {/* <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">
            SLA Compliance vs Anomalies (Weekly)
          </h2>
          <Chart
            options={barOptions}
            series={barSeries}
            type="line"
            height={300}
          />
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Approvers Insights</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Top Fastest Approvers</h3>
              <table className="w-full text-sm mt-2">
                <tbody>
                  {data.approvers.fastest.map((f, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-1">{f.name}</td>
                      <td className="py-1 text-right">{f.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3 className="font-medium">Top Bottleneck Approvers</h3>
              <table className="w-full text-sm mt-2">
                <tbody>
                  {data.approvers.bottleneck.map((b, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-1">{b.name}</td>
                      <td className="py-1 text-right">{b.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}

      <p className="text-md text-gray-500 mt-4">
        Last updated at {new Date().toLocaleString()} | Source: Approval System
      </p>
    </div>
  );
};

export default Dashboard;
