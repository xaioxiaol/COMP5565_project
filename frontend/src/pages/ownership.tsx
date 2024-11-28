import { useState } from "react";
import { auditTrailController } from "@/controllers/AuditTrailController";
import AuditRecord from "@/types/AuditRecord";

export default function AuditTrailsPage() {
  // Form states
  const [actorId, setActorId] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [role, setRole] = useState("");

  // Query states
  const [queryUniqueId, setQueryUniqueId] = useState("");
  const [audit, setAudit] = useState<AuditRecord | null>(null);
  const [status, setStatus] = useState("");

  const addAuditRecord = async () => {
    try {
      setStatus("正在添加记录...");
      await auditTrailController.addAuditRecord({
        actorId,
        uniqueId,
        batchCode,
        role,
      });

      setStatus("记录添加成功！");
      // Clear form
      setActorId("");
      setUniqueId("");
      setBatchCode("");
      setRole("");
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "添加记录失败！");
    }
  };

  const fetchAuditRecords = async () => {
    try {
      setStatus("正在查询...");
      const record = await auditTrailController.getAuditRecord(queryUniqueId);
      setAudit(record);
      setStatus("查询成功！");
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "查询失败！");
      setAudit(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Audit Trail 管理系统
          </h1>
          <p className="text-gray-600">基于区块链的审计追踪平台</p>
          {status && (
            <div
              className={`mt-4 text-sm ${
                status.includes("失败") ? "text-red-600" : "text-green-600"
              }`}
            >
              {status}
            </div>
          )}
        </div>

        {/* Add Audit Record Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 rounded-lg p-3 mr-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">添加审计记录</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                操作人 ID
              </label>
              <input
                type="text"
                value={actorId}
                onChange={(e) => setActorId(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                唯一标识 (Unique ID)
              </label>
              <input
                type="text"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                批次号
              </label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">角色</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={addAuditRecord}
            className="mt-8 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            添加审计记录
          </button>
        </div>

        {/* Query Audit Record Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 rounded-lg p-3 mr-4">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">查询审计记录</h2>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={queryUniqueId}
              onChange={(e) => setQueryUniqueId(e.target.value)}
              placeholder="输入唯一标识 (Unique ID)"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={fetchAuditRecords}
              className="px-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              查询
            </button>
          </div>

          {/* Audit Record Display */}
          {audit && (
            <div className="mt-8 overflow-hidden bg-gray-50 rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      字段
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      内容
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Actor ID
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit.actorId}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Unique ID
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit.uniqueId}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Batch Code
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit.batchCode}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Role
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {audit.role}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Timestamp
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(audit.timestamp).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
