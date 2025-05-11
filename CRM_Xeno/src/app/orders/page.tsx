'use client';
import { useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);
  const [prompt, setPrompt] = useState('');
  const [UploadId, setUploadId] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setInsights(null);
    setError(null);
    setSuccess(null);
    setCsvPreview([]);
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
      setUploadId(data.uploadId); 
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
        body: JSON.stringify({ prompt , uploadId:UploadId}),
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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-sm my-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Order Upload & Product Insights</h1>

      {/* Upload Section */}
      <Card className="border-slate-200 mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">Upload Orders CSV</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <input type="file" accept=".csv" onChange={handleFileChange} className="block" />
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full md:w-auto"
            >
              {uploading ? 'Uploading...' : 'Upload Orders'}
            </Button>
          </div>
          {success && <Alert variant="success" className="mb-2 border border-green-400 bg-green-100"><AlertTitle>Success</AlertTitle><AlertDescription>{success}</AlertDescription></Alert>}
          {error && <Alert variant="destructive" className="mb-2"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
         {csvPreview.length > 0 && (
  <div className="mt-4">
    <div className="font-semibold mb-1">CSV Preview (first 5 rows):</div>
    <div className="overflow-x-auto border rounded">
      <table className="min-w-full text-xs">
        <thead>
          <tr>
            {Object.keys(csvPreview[0]).map((col) => (
              <th key={col} className="px-2 py-1 bg-gray-100 border-b text-center">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {csvPreview.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((val, j) => (
                <td key={j} className="px-2 py-1 border-b text-center">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}
        </CardContent>
      </Card>

      {/* Prompt Section */}
      <Card className="border-slate-200 mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-800">Ask Product Insights (AI)</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="block font-medium mb-1">Ask about your orders:</label>
          <textarea
            value={prompt}
            placeholder='Which product has the maximum sales?'
            onChange={e => setPrompt(e.target.value)}
            rows={5}
            className="w-full border rounded p-2 mb-2"
          />
          <Button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full md:w-auto"
          >
            {analyzing ? 'Analyzing...' : 'Analyze Products'}
          </Button>
        </CardContent>
      </Card>

      {/* Chart Type Selector */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="chartType" className="font-medium">Chart Type:</label>
        <select
          id="chartType"
          value={chartType}
          onChange={e => setChartType(e.target.value as 'bar' | 'pie')}
          className="border rounded px-2 py-1"
        >
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
        </select>
      </div>

      {/* Insights Section */}
      {insights && (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="font-semibold mb-2">Product Insights</CardTitle>
          </CardHeader>
          <CardContent>
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
          <th className="px-3 py-2 bg-gray-100 border-b text-center">Product</th>
          <th className="px-3 py-2 bg-gray-100 border-b text-center">Sales Count</th>
          <th className="px-3 py-2 bg-gray-100 border-b text-center">Status</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(insights.productSales)
          .sort((a, b) => Number(b[1]) - Number(a[1]))
          .map(([product, count], idx, arr) => {
            const max = Math.max(...Object.values(insights.productSales));
            const min = Math.min(...Object.values(insights.productSales));
            let status = '';
            if (Number(count) === max) status = 'Hero Product';
            else if (Number(count) === min) status = 'Failed Product';
            return (
              <tr key={product}>
                <td className="px-3 py-2 border-b text-center">{product}</td>
                <td className="px-3 py-2 border-b text-center">{count}</td>
                <td className="px-3 py-2 border-b text-center">
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

           {/* Chart Section */}
{insights.productSales && (
  <div className="mt-6 w-full max-w-md mx-auto">
    <div className="font-medium mb-1 text-center">Sales Chart:</div>
    {chartType === 'bar' ? (
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
                if (Number(count) === max) return 'rgba(34,197,94,0.7)';
                if (Number(count) === min) return 'rgba(239,68,68,0.7)';
                return 'rgba(59,130,246,0.7)';
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
        height={120}
      />
    ) : (
      <Pie
        data={{
          labels: Object.keys(insights.productSales),
          datasets: [
            {
              data: Object.values(insights.productSales),
              backgroundColor: Object.entries(insights.productSales).map(([product, count]) => {
                const max = Math.max(...Object.values(insights.productSales));
                const min = Math.min(...Object.values(insights.productSales));
                if (Number(count) === max) return 'rgba(34,197,94,0.7)';
                if (Number(count) === min) return 'rgba(239,68,68,0.7)';
                return 'rgba(59,130,246,0.7)';
              }),
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true, position: 'bottom' },
            tooltip: { enabled: true },
          },
        }}
        height={120}
      />
    )}
  </div>
)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}