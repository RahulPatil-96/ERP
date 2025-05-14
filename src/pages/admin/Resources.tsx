import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useState, useEffect, useRef } from 'react';
import { Spinner, Button } from 'reactstrap';
import { saveAs } from 'file-saver'; // For exporting charts
import { Moon, Sun, Server } from 'lucide-react'; // For dark mode toggle
import html2canvas from 'html2canvas'; // For exporting all charts as image
import { PageHeader } from '../../components/common/PageHeader';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Resources = () => {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false); // Dark mode toggle state
  const [chartData, setChartData] = useState<{
    storage: { labels: string[], datasets: any[] },
    license: { labels: string[], datasets: any[] },
    apiUsage: { labels: string[], datasets: any[] },
  }>({
    storage: { labels: [], datasets: [] },
    license: { labels: [], datasets: [] },
    apiUsage: { labels: [], datasets: [] },
  }); // To store real-time data

  const apiUsageChartRef = useRef<any>(null);

  // Simulate fetching data with useEffect and setTimeout for live data
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulating real-time data fetching and updates
      setChartData({
        storage: {
          labels: ['Used', 'Free'],
          datasets: [
            {
              label: 'Storage Usage',
              data: [Math.random() * 500, Math.random() * 500],
              backgroundColor: ['rgba(54, 162, 235, 0.7)', 'rgba(75, 192, 192, 0.7)'],
              hoverOffset: 4,
            },
          ],
        },
        license: {
          labels: ['Active', 'Expired'],
          datasets: [
            {
              label: 'License Status',
              data: [Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)],
              backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
              hoverOffset: 4,
            },
          ],
        },
        apiUsage: {
          labels: ['API Calls'],
          datasets: [
            {
              label: 'API Usage',
              data: [Math.floor(Math.random() * 5000)],
              backgroundColor: 'rgba(255, 159, 64, 0.7)',
            },
          ],
        },
      });
    }, 5000); // Data updates every 5 seconds

    setTimeout(() => {
      setLoading(false); // Simulate data fetch completion after a few seconds
    }, 2000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  const storageData = chartData?.storage || {};
  const licenseData = chartData?.license || {};
  const apiUsageData = chartData?.apiUsage || {};

  // Export all charts as a single image
  const exportAllChartsAsImage = () => {
    const chartsContainer = document.querySelector("#charts-container");
    if (chartsContainer) {
      html2canvas(chartsContainer as HTMLElement).then((canvas: HTMLCanvasElement) => {
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            saveAs(blob, 'charts.png'); // Save all charts as a PNG image
          }
        });
      });
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8 flex items-center justify-center">
        <div className="flex items-center justify-center space-x-3">
          <Spinner animation="border" role="status" />
          <div className="text-xl font-semibold text-gray-800">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="View and manage resource metrics"
        icon={Server}
      />
      <div className={`max-w-6xl mx-auto p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
        <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard - Resource Metrics</h1>

        {/* Dark Mode Toggle */}
        <div className="absolute top-16 right-8 z-10">
          <Button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full shadow-md transition-colors duration-300 ${darkMode ? 'bg-yellow-500' : 'bg-gray-700'}`}
          >
            {darkMode ? <Sun size={20} color="white" /> : <Moon size={20} color="white" />}
          </Button>
        </div>

        {/* Export All Charts as Image */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={exportAllChartsAsImage}
            className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 flex items-center space-x-2"
          >
            <span>Export All Charts</span>
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14m7-7l-7 7-7-7"></path>
            </svg>
          </Button>
        </div>

        {/* Chart Content */}
        <div id="charts-container" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Storage Data */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">Storage Usage</h2>
            <Doughnut
              data={storageData}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${(context.raw as number).toFixed(2)} GB`,
                    },
                  },
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>

          {/* License Data */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">License Information</h2>
            <Doughnut
              data={licenseData}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.label}: ${context.raw}`,
                    },
                  },
                  legend: {
                    position: 'top',
                  },
                },
              }}
            />
          </div>

          {/* API Usage Data */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-6">API Usage</h2>
            <Bar
              ref={apiUsageChartRef}
              data={apiUsageData}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: ${context.raw} calls`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'API Calls',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
