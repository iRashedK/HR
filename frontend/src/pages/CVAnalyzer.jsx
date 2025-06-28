import { useState } from 'react';

import Sidebar from '../components/Sidebar';

export default function CVAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    const resp = await fetch('/upload', { method: 'POST', body: form });
    const data = await resp.json();
    if (resp.ok) {
      const poll = async () => {
        const r = await fetch(`/results?job=${data.job_id}`);
        const d = await r.json();
        if (d.results[0].status === 'done' || d.results[0].status === 'error') {
          setResult(d.results[0]);
        } else {
          setTimeout(poll, 2000);
        }
      };
      poll();
    } else {
      setResult({ error: data.error });
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">CV Analyzer</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" accept=".pdf,.docx" onChange={handleChange} />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Upload</button>
        </form>
        {result && (
          <pre className="mt-4 bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </main>
    </div>
  );
}
