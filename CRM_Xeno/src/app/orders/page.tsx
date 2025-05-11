'use client';
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
function parseCSVPreview(csvText: string): any[] {
  const [headerLine, ...lines] = csvText.trim().split('\n');
  const headers = headerLine.split(',');
  return lines.slice(0, 5).map(line => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h.trim()] = values[i]?.trim() || ''));
    return row;
  });
}

export default function OrdersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [prompt, setPrompt] = useState(
    `Which product has the maximum sales?`
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setInsights(null);
    setError(null);
    setSuccess(null);
    setCsvPreview([]);
    // Show preview
    if (e.target.files?.[0]) {
      const text = await e.target.files[0].text();
      setCsvPreview(parseCSVPreview(text));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/orders', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(`Orders uploaded! (${data.count} orders)`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    setInsights(null);
    try {
      const res = await fetch('/api/llm/product-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      setInsights(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Order Upload & Product Insights</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} className="mb-4" />
      {csvPreview.length > 0 && (
        <div className="mb-4">
          <div className="font-semibold mb-1">CSV Preview (first 5 rows):</div>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-xs">
              <thead>
                <tr>
                  {Object.keys(csvPreview[0]).map((col) => (
                    <th key={col} className="px-2 py-1 bg-gray-100 border-b">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvPreview.map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-2 py-1 border-b">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded mr-2"
      >
        {uploading ? 'Uploading...' : 'Upload Orders'}
      </button>
      {success && <div className="text-green-600 mt-2">{success}</div>}
      <div className="mt-6">
        <label className="block font-medium mb-1">Ask about your orders:</label>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          rows={5}
          className="w-full border rounded p-2 mb-2"
        />
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {analyzing ? 'Analyzing...' : 'Analyze Products'}
        </button>
      </div>
      {error && <div className="text-red-600 mt-4">{error}</div>}
      {insights && (
        <div className="mt-6 p-4 bg-gray-50 border rounded">
          <h2 className="font-semibold mb-2">Product Insights</h2>
          {/* Summary */}
          {insights.summary && (
            <div className="mb-4 text-gray-800 whitespace-pre-line">
              <span className="font-medium">Summary:</span>
              <div className="mt-1">{insights.summary}</div>
            </div>
          )}

          {/* Product Sales Table */}
          {insights.productSales && (
            <div className="mb-4">
              <div className="font-medium mb-1">Product Sales:</div>
              <table className="min-w-full text-sm border rounded overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-3 py-2 bg-gray-100 border-b text-left">Product</th>
                    <th className="px-3 py-2 bg-gray-100 border-b text-left">Sales Count</th>
                    <th className="px-3 py-2 bg-gray-100 border-b text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(insights.productSales)
                    .sort((a, b) => Number(b[1]) - Number(a[1]))
                    .map(([product, count], idx, arr) => {
                      // Find max and min sales for highlighting
                      const max = Math.max(...Object.values(insights.productSales));
                      const min = Math.min(...Object.values(insights.productSales));
                      let status = '';
                      if (Number(count) === max) status = 'Hero Product';
                      else if (Number(count) === min) status = 'Failed Product';
                      return (
                        <tr key={product}>
                          <td className="px-3 py-2 border-b">{product}</td>
                          <td className="px-3 py-2 border-b">{count}</td>
                          <td className="px-3 py-2 border-b">
                            {status && (
                              <span className={`px-2 py-1 rounded text-xs font-semibold
                                ${status === 'Hero Product' ? 'bg-green-100 text-green-700' : ''}
                                ${status === 'Failed Product' ? 'bg-red-100 text-red-700' : ''}
                              `}>
                                {status}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}

          {/* Real Bar Chart */}
          {insights.productSales && (
            <div className="mt-6">
              <div className="font-medium mb-1">Sales Chart:</div>
              <Bar
                data={{
                  labels: Object.keys(insights.productSales),
                  datasets: [
                    {
                      label: 'Sales Count',
                      data: Object.values(insights.productSales),
                      backgroundColor: Object.entries(insights.productSales).map(([product, count]) => {
                        const max = Math.max(...Object.values(insights.productSales));
                        const min = Math.min(...Object.values(insights.productSales));
                        if (Number(count) === max) return 'rgba(34,197,94,0.7)'; // green for hero
                        if (Number(count) === min) return 'rgba(239,68,68,0.7)'; // red for failed
                        return 'rgba(59,130,246,0.7)'; // blue for normal
                      }),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } },
                  },
                }}
                height={200}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}