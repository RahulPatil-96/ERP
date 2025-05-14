import { useState, useEffect } from 'react';
import { Wifi, Server, RefreshCw } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { PageHeader } from '../../components/common/PageHeader';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function Infrastructure() {
  // Simulated data for monitoring
  const [serverStatus, setServerStatus] = useState('Online');
  const [memoryUsage, setMemoryUsage] = useState(60);
  const [storageUsage, setStorageUsage] = useState(70);
  const [networkStatus] = useState('Active');
  const [networkUsage, setNetworkUsage] = useState({ upload: 20, download: 50 });
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'CPU Usage',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Memory Usage',
        data: [],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
      {
        label: 'Storage Usage',
        data: [],
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
    ],
  });

  // Update data every 3 seconds to simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulating real-time changes in resource usage
      const newCpuUsage = Math.floor(Math.random() * 100);
      const newMemoryUsage = Math.floor(Math.random() * 100);
      const newStorageUsage = Math.floor(Math.random() * 100);
      const newUploadSpeed = Math.floor(Math.random() * 50);
      const newDownloadSpeed = Math.floor(Math.random() * 50);

      setMemoryUsage(newMemoryUsage);
      setStorageUsage(newStorageUsage);
      setNetworkUsage({ upload: newUploadSpeed, download: newDownloadSpeed });

      // Update chart data
      setChartData((prevData: any) => {
        const updatedData = { ...prevData };
        const newLabel = new Date().toLocaleTimeString();
        updatedData.labels.push(newLabel);
        updatedData.datasets[0].data.push(newCpuUsage);
        updatedData.datasets[1].data.push(newMemoryUsage);
        updatedData.datasets[2].data.push(newStorageUsage);

        // Keep the last 10 data points
        if (updatedData.labels.length > 10) {
          updatedData.labels.shift();
          updatedData.datasets.forEach((dataset: any) => dataset.data.shift());
        }

        return updatedData;
      });

      // Set alert for high resource usage
      if (newCpuUsage > 80 || newMemoryUsage > 80 || newStorageUsage > 80) {
        setAlertMessage('Warning: High resource usage detected!');
      } else {
        setAlertMessage(null);
      }

      // Log updates
      setLogs((prevLogs) => [
        ...prevLogs,
        `Updated at ${new Date().toLocaleTimeString()}: CPU ${newCpuUsage}%, Memory ${newMemoryUsage}%, Storage ${newStorageUsage}%`,
      ]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Admin actions like restarting server
  const restartServer = () => {
    setServerStatus('Restarting...');
    setTimeout(() => {
      setServerStatus('Online');
      setLogs((prevLogs) => [...prevLogs, 'Server restarted successfully']);
    }, 5000);
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Infrastructure Dashboard" 
        subtitle="Monitor and manage the server and network resources"
        icon={Server}
      />

      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-8">
        {/* Server and Network Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Server Status */}
          <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
            <Server className="w-12 h-12 text-indigo-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Server Status</h3>
              <p className={`text-xl ${serverStatus === 'Online' ? 'text-green-500' : 'text-red-500'}`}>
                {serverStatus}
              </p>
            </div>
          </div>

          {/* Network Status */}
          <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
            <Wifi className="w-12 h-12 text-indigo-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Network Status</h3>
              <p className={`text-xl ${networkStatus === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                {networkStatus}
              </p>
              <p className="text-sm text-gray-600">Upload: {networkUsage.upload} Mbps</p>
              <p className="text-sm text-gray-600">Download: {networkUsage.download} Mbps</p>
            </div>
          </div>
        </div>

        {/* Resource Usage with Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Memory Usage */}
          <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
            <div className="mr-4">
              <h3 className="text-lg font-semibold text-gray-900">Memory Usage</h3>
              <p className={`text-xl ${memoryUsage > 80 ? 'text-red-500' : 'text-green-500'}`}>{memoryUsage}%</p>
            </div>
          </div>

          {/* Storage Usage */}
          <div className="p-6 bg-white rounded-lg shadow-md flex items-center">
            <div className="mr-4">
              <h3 className="text-lg font-semibold text-gray-900">Storage Usage</h3>
              <p className={`text-xl ${storageUsage > 80 ? 'text-red-500' : 'text-green-500'}`}>{storageUsage}%</p>
            </div>
          </div>
        </div>

        {/* Resource Usage Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900">Resource Usage Analytics</h3>
          <Line data={chartData} options={{ responsive: true }} />
        </div>

        {/* Alerts */}
        {alertMessage && (
          <div className="p-4 bg-yellow-200 text-yellow-800 rounded-lg mb-6">
            <p className="font-semibold">{alertMessage}</p>
          </div>
        )}

        {/* Logs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold text-gray-900">System Logs</h3>
          <div className="space-y-2 mt-4 text-sm text-gray-600 max-h-60 overflow-y-auto">
            {logs.length === 0 ? (
              <div>No logs yet...</div>
            ) : (
              logs.map((log, index) => <div key={index}>{log}</div>)
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Admin Controls</h3>
            <p className="text-sm text-gray-600">Manage infrastructure settings and restart server.</p>
          </div>
          <button
            onClick={restartServer}
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
          >
            <RefreshCw className="w-5 h-5 inline-block mr-2" />
            Restart Server
          </button>
        </div>
      </div>
    </div>
  );
}