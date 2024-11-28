import { useState } from "react";
import { auditTrailController } from "@/controllers/AuditTrailController";
import AuditRecord from "@/types/AuditRecord";

const ROLES = [
  "Mining Companies",
  "Cutting Companies",
  "Rating Labs",
  "Manufacturers",
  "Retailers",
] as const;

type Role = (typeof ROLES)[number];

// 角色颜色映射函数
const getRoleColor = (role: Role) => {
  switch (role) {
    case "Mining Companies":
      return "bg-amber-100 text-amber-800 group-hover:bg-amber-200";
    case "Cutting Companies":
      return "bg-blue-100 text-blue-800 group-hover:bg-blue-200";
    case "Rating Labs":
      return "bg-purple-100 text-purple-800 group-hover:bg-purple-200";
    case "Manufacturers":
      return "bg-green-100 text-green-800 group-hover:bg-green-200";
    case "Retailers":
      return "bg-pink-100 text-pink-800 group-hover:bg-pink-200";
    default:
      return "bg-gray-100 text-gray-800 group-hover:bg-gray-200";
  }
};

export default function AuditTrailsPage() {
  // Form states
  const [actorId, setActorId] = useState("");
  const [uniqueId, setUniqueId] = useState("");
  const [batchCode, setBatchCode] = useState("");

  // Query states
  const [queryUniqueId, setQueryUniqueId] = useState("");
  const [audits, setAudits] = useState<AuditRecord[]>([]);
  const [status, setStatus] = useState("");

  const [selectedRole, setSelectedRole] = useState<Role | "">("");

  const addAuditRecord = async () => {
    try {
      setStatus("Adding record...");
      await auditTrailController.addAuditRecord({
        actorId,
        uniqueId,
        batchCode,
        role: selectedRole,
      });

      setStatus("Record added successfully!");
      // Clear form
      setActorId("");
      setUniqueId("");
      setBatchCode("");
      setSelectedRole('');
    } catch (error) {
      console.error(error);
      setStatus(
        error instanceof Error ? error.message : "Failed to add record!"
      );
    }
  };

  const fetchAuditRecords = async () => {
    try {
      setStatus("Searching...");
      const records = await auditTrailController.getAllAuditRecords(
        queryUniqueId
      );
      setAudits(records);
      setStatus("Search successful!");
    } catch (error) {
      console.error(error);
      setStatus(error instanceof Error ? error.message : "Search failed!");
      setAudits([]);
    }
  };

  const getRoleColor = (role: Role) => {
    switch (role) {
      case "Mining Companies":
        return "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20";
      case "Cutting Companies":
        return "bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20";
      case "Rating Labs":
        return "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20";
      case "Manufacturers":
        return "bg-green-500/10 text-green-400 ring-1 ring-green-500/20";
      case "Retailers":
        return "bg-pink-500/10 text-pink-400 ring-1 ring-pink-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c1d] bg-opacity-95 relative overflow-hidden">
      {/* 动态背景网格 */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* 动态光晕效果 */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
      <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-75" />
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow delay-150" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* 标题部分 */}
        <div className="text-center mb-12 relative">
          <div className="inline-block">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 animate-gradient-x mb-4">
              Audit Trail Management
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse-slow" />
          </div>
          <p className="mt-4 text-gray-300 text-lg">
            Blockchain-based Audit Tracking Platform
          </p>
          {status && (
            <div className={`mt-4 text-sm ${status.includes("fail") ? "text-red-400" : "text-green-400"}`}>
              {status}
            </div>
          )}
        </div>

        {/* 表单部分 */}
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl p-8 mb-8 
          border border-gray-700/50 hover:border-purple-500/50
          transform transition-all duration-500 hover:scale-[1.01]
          relative overflow-hidden group">
          {/* 表单闪光效果 */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          
          <div className="relative">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-purple-500/10 rounded-xl mr-4">
                <span className="text-2xl">📝</span>
              </div>
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Add Audit Record
              </h2>
            </div>

            {/* 表单输入框 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Actor ID</label>
                <input
                  type="text"
                  value={actorId}
                  onChange={(e) => setActorId(e.target.value)}
                  className="w-full rounded-xl bg-gray-800/50 border border-gray-700/50 
                    text-gray-300 placeholder-gray-500 
                    focus:border-purple-500 focus:ring-purple-500/20 
                    transition-all duration-300 px-4 py-3
                    hover:border-purple-500/50"
                  placeholder="Enter actor ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Unique ID</label>
                <input
                  type="text"
                  value={uniqueId}
                  onChange={(e) => setUniqueId(e.target.value)}
                  className="w-full rounded-xl bg-gray-800/50 border border-gray-700/50 
                    text-gray-300 placeholder-gray-500 
                    focus:border-purple-500 focus:ring-purple-500/20 
                    transition-all duration-300 px-4 py-3
                    hover:border-purple-500/50"
                  placeholder="Enter unique ID"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Batch Code</label>
                <input
                  type="text"
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  className="w-full rounded-xl bg-gray-800/50 border border-gray-700/50 
                    text-gray-300 placeholder-gray-500 
                    focus:border-purple-500 focus:ring-purple-500/20 
                    transition-all duration-300 px-4 py-3
                    hover:border-purple-500/50"
                  placeholder="Enter batch code"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="w-full rounded-xl bg-gray-800/50 border border-gray-700/50 
                    text-gray-300
                    focus:border-purple-500 focus:ring-purple-500/20 
                    transition-all duration-300 px-4 py-3
                    hover:border-purple-500/50"
                >
                  <option value="">Select Role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              onClick={addAuditRecord}
              className="mt-8 w-full bg-gradient-to-r from-purple-500 to-pink-500 
                text-white font-medium rounded-xl py-3 px-4
                transform transition-all duration-300 
                hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25
                active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden group">
              <span className="relative z-10">Add Audit Record</span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                transition-transform duration-300 bg-gradient-to-r from-transparent 
                via-white/10 to-transparent" />
            </button>
          </div>
        </div>

        {/* 表格部分 */}
        <div className="bg-gray-900/40 backdrop-blur-xl rounded-2xl overflow-hidden
          border border-gray-700/50 transition-all duration-300
          hover:border-purple-500/50">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500/10 rounded-xl mr-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h2 className="text-2xl font-semibold bg-clip-text text-transparent 
                  bg-gradient-to-r from-purple-400 to-pink-400">
                  Audit Records
                </h2>
              </div>
              
              {/* 搜索栏 */}
              <div className="flex gap-4">
                <input
                  type="text"
                  value={queryUniqueId}
                  onChange={(e) => setQueryUniqueId(e.target.value)}
                  placeholder="Search by Unique ID"
                  className="rounded-xl bg-gray-800/50 border border-gray-700/50 
                    text-gray-300 placeholder-gray-500 
                    focus:border-purple-500 focus:ring-purple-500/20 
                    transition-all duration-300 px-4 py-2
                    hover:border-purple-500/50"
                />
                <button
                  onClick={fetchAuditRecords}
                  className="px-6 bg-gradient-to-r from-purple-500 to-pink-500 
                    text-white rounded-xl transform transition-all duration-300 
                    hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25
                    active:scale-[0.98]">
                  Search
                </button>
              </div>
            </div>

            {/* 表格 */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700/50">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actor ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Unique ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Batch Code
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50">
                  {audits.map((audit, index) => (
                    <tr key={index} 
                      className="group transition-colors duration-200 hover:bg-purple-500/5">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {audit.actorId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {audit.uniqueId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {audit.batchCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                          ${getRoleColor(audit.role as Role)}`}>
                          {audit.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(audit.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
