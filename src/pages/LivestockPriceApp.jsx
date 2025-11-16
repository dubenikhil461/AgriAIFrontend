import { useQuery } from "@tanstack/react-query";
import Ax from "../utils/Axios.js"

const LivestockPriceApp = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["prices"],
    queryFn: () => Ax.get("/statewise-prices").then(res => res.data)
  });

  const dbRecords = data?.data || [];

  // Flatten data - each document has records array
  const allRecords = dbRecords.flatMap(doc => 
    (doc.records || []).map(record => ({
      ...record,
      state: doc.state,
      commodity_name: doc.commodity_name
    }))
  );

  // Get dates dynamically from first record
  const getFormattedDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const [day, month, year] = dateStr.split("-");
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  // Extract dates from first record if available
  const firstRecord = allRecords[0] || {};
  const todayDate = getFormattedDate(firstRecord.reported_date);
  
  // Calculate previous dates
  const getDateBefore = (dateStr, daysBefore) => {
    if (!dateStr) return "N/A";
    const [day, month, year] = dateStr.split("-");
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - daysBefore);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const oneDayAgoDate = getDateBefore(firstRecord.reported_date, 1);
  const twoDaysAgoDate = getDateBefore(firstRecord.reported_date, 2);

  const getTrendIcon = (trend) => {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "−";
  };

  const getTrendColor = (trend) => {
    if (trend === "up") return "text-green-700";
    if (trend === "down") return "text-red-600";
    return "text-gray-500";
  };

  const formatNumber = (num) => {
    if (!num) return "−";
    return parseFloat(num).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleDownloadCSV = () => {
    if (!allRecords.length) {
      alert("No data available to download");
      return;
    }

    // CSV Headers
    const headers = [
      "Commodity",
      "Commodity Group",
      "MSP (Rs./Quintal)",
      `Price ${todayDate}`,
      `Price ${oneDayAgoDate}`,
      `Price ${twoDaysAgoDate}`,
      `Arrival ${todayDate}`,
      `Arrival ${oneDayAgoDate}`,
      `Arrival ${twoDaysAgoDate}`,
      "Trend"
    ];

    // CSV Rows
    const rows = allRecords.map(record => [
      record.cmdt_name || "N/A",
      record.cmdt_grp_name || "N/A",
      record.msp_price || "N/A",
      record.as_on_price || "N/A",
      record.one_day_ago_price || "N/A",
      record.two_day_ago_price || "N/A",
      record.as_on_arrival || "N/A",
      record.one_day_ago_arrival || "N/A",
      record.two_day_ago_arrival || "N/A",
      record.trend || "N/A"
    ]);

    // Create CSV content
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(","))
      .join("\n");

    // Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `commodity_prices_${todayDate.replace(/\s/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mb-4"></div>
          <p className="text-green-700 font-medium">Loading price data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">🌾 Kerala State Commodity Prices</h1>
              <p className="text-green-100 text-lg">Real-time Agricultural Market Data</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Alert Banner */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-500 p-5 mb-6 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <span className="inline-block w-3 h-3 bg-amber-500 rounded-full animate-pulse mt-1"></span>
            <div>
              <p className="text-amber-900 font-semibold text-lg">
                ⏰ Daily Updates at <span className="font-bold text-amber-700">11:30 PM</span>
              </p>
              <p className="text-amber-700 text-sm mt-1">
                Note: Some prices may remain unchanged if Agmarknet 2.0 has not updated the data.
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Table Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-green-100">
          {/* Table Header with Download Button */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-4 border-b border-green-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-green-800">Commodity Price List</h2>
              <p className="text-sm text-green-600 mt-1">Total: {allRecords.length} commodities</p>
            </div>
            <button
              onClick={handleDownloadCSV}
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md flex items-center gap-2"
            >
              <span className="text-lg">📥</span>
              Export Today data
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <th className="px-6 py-4 text-left font-bold border-r border-green-500" rowSpan="2">
                    Commodity
                  </th>
                  <th className="px-6 py-4 text-center font-bold border-r border-green-500" rowSpan="2">
                    MSP (Rs./Quintal)<br/>
                    <span className="text-sm font-normal text-green-100">2025-26</span>
                  </th>
                  <th className="px-6 py-4 text-center font-bold border-r border-green-500" colSpan="3">
                    💰 Price (Rs./Quintal)
                  </th>
                  <th className="px-6 py-4 text-center font-bold" colSpan="3">
                    📦 Arrival (Metric Tonnes)
                  </th>
                </tr>
                <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <th className="px-4 py-3 text-center text-sm font-semibold border-r border-green-400">{todayDate}</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold border-r border-green-400">{oneDayAgoDate}</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold border-r border-green-500">{twoDaysAgoDate}</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold border-r border-green-400">{todayDate}</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold border-r border-green-400">{oneDayAgoDate}</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">{twoDaysAgoDate}</th>
                </tr>
              </thead>
              <tbody>
                {allRecords.map((record, idx) => (
                  <tr 
                    key={idx}
                    className={`${idx % 2 === 0 ? 'bg-white' : 'bg-green-50'} hover:bg-emerald-100 transition-colors duration-150`}
                  >
                    <td className="px-6 py-4 border-b border-green-100">
                      <div className="font-semibold text-gray-800 text-base">{record.cmdt_name}</div>
                      <div className="text-xs text-green-600 font-medium mt-1">{record.cmdt_grp_name}</div>
                    </td>
                    <td className="px-6 py-4 text-center border-b border-green-100">
                      <span className="font-bold text-gray-700 text-base">
                        {record.msp_price ? formatNumber(record.msp_price) : "−"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center border-b border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-bold text-xl ${getTrendColor(record.trend)}`}>
                          {getTrendIcon(record.trend)}
                        </span>
                        <span className="font-bold text-gray-900 text-base">
                          {formatNumber(record.as_on_price)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center border-b border-green-100">
                      <span className="text-gray-700 font-medium">{formatNumber(record.one_day_ago_price)}</span>
                    </td>
                    <td className="px-6 py-4 text-center border-b border-green-100">
                      <span className="text-gray-700 font-medium">{formatNumber(record.two_day_ago_price)}</span>
                    </td>
                    <td className="px-6 py-4 text-center border-b border-green-100 bg-gradient-to-br from-emerald-50 to-green-50">
                      <span className="font-bold text-gray-900 text-base">{formatNumber(record.as_on_arrival)}</span>
                    </td>
                    <td className="px-6 py-4 text-center border-b border-green-100">
                      <span className="text-gray-700 font-medium">{formatNumber(record.one_day_ago_arrival)}</span>
                    </td>
                    <td className="px-6 py-4 text-center border-b border-green-100">
                      <span className="text-gray-700 font-medium">{formatNumber(record.two_day_ago_arrival)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="bg-white rounded-lg py-3 px-6 inline-block shadow-sm border border-green-100">
            Showing <span className="font-bold text-green-700">{allRecords.length}</span> commodities
          </p>
        </div>
      </div>
    </div>
  );
};

export default LivestockPriceApp;