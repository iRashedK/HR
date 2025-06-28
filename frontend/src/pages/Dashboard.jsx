import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Dashboard Page</h1>
      </main>
    </div>
  );
}
