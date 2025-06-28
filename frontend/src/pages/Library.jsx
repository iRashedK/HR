import Sidebar from '../components/Sidebar';

export default function Library() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Library Page</h1>
      </main>
    </div>
  );
}
