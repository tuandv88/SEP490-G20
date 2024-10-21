// import { Chart } from "./Chart/Chart";
export default function Dashboard() {
  return (
    <div className="p-6 mx-auto space-y-8 max-w-7xl">
      {/* Phần đầu: 3 card */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-bold">Card 1</h2>
          <p>Nội dung card 1</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-bold">Card 2</h2>
          <p>Nội dung card 2</p>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-bold">Card 3</h2>
          <p>Nội dung card 3</p>
        </div>
      </section>

      {/* Phần giữa: 2 chart */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-bold">Biểu đồ 1</h2>
          <div className="h-64">{/* <Chart /> */}</div>
        </div>
        <div className="p-6 bg-white shadow-lg rounded-xl">
          <h2 className="mb-4 text-xl font-bold">Biểu đồ 2</h2>
          <div className="h-64">
            <p>Chart 2</p> {/* Thay bằng biểu đồ thực tế */}
          </div>
        </div>
      </section>

      {/* Phần cuối: Table */}
      <section className="p-6 bg-white shadow-lg rounded-xl">
        <h2 className="mb-4 text-xl font-bold">Danh sách dữ liệu</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-6 py-3 text-sm font-medium text-left">
                  Cột 1
                </th>
                <th className="px-6 py-3 text-sm font-medium text-left">
                  Cột 2
                </th>
                <th className="px-6 py-3 text-sm font-medium text-left">
                  Cột 3
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 border">Dữ liệu 1</td>
                <td className="px-6 py-4 border">Dữ liệu 2</td>
                <td className="px-6 py-4 border">Dữ liệu 3</td>
              </tr>
              <tr>
                <td className="px-6 py-4 border">Dữ liệu 4</td>
                <td className="px-6 py-4 border">Dữ liệu 5</td>
                <td className="px-6 py-4 border">Dữ liệu 6</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
