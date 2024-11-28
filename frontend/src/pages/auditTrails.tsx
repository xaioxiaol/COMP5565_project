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
  const [role, setRole] = useState<Role | "">("");

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
        role,
      });

      setStatus("Record added successfully!");
      // Clear form
      setActorId("");
      setUniqueId("");
      setBatchCode("");
      setRole("");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Audit Trail Management System
          </h1>
          <p className="text-gray-600">
            Blockchain-based Audit Tracking Platform
          </p>
          {status && (
            <div
              className={`mt-4 text-sm ${
                status.includes("failed") ? "text-red-600" : "text-green-600"
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
            <h2 className="text-2xl font-bold text-gray-900">
              Add Audit Record
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Actor ID
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
                Unique ID
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
                Batch Code
              </label>
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full rounded-lg border-gray-300 shadow-sm 
                    focus:border-indigo-500 focus:ring-indigo-500
                    appearance-none bg-white pl-3 pr-10 py-2.5
                    transition-all duration-300 hover:bg-gray-50"
                >
                  <option value="" disabled>
                    Select Role
                  </option>
                  {ROLES.map((roleOption) => (
                    <option key={roleOption} value={roleOption}>
                      {roleOption}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={addAuditRecord}
            className="mt-8 w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Add Audit Record
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
            <h2 className="text-2xl font-bold text-gray-900">
              Search Audit Record
            </h2>
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              value={queryUniqueId}
              onChange={(e) => setQueryUniqueId(e.target.value)}
              placeholder="Enter Unique ID to search"
              className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              onClick={fetchAuditRecords}
              className="px-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
            >
              Search
            </button>
            {/* 角色选择下拉框 */}
            <div className="rounded-lg border border-gray-300 shadow-sm">
              <div className="relative">
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  className="block w-full pl-3 pr-10 py-2.5 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-xl bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                >
                  <option value="">All Roles</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Audit Records Display */}
          {audits && audits.length > 0 && (
            <div className="mt-8 overflow-hidden bg-gray-50 rounded-xl border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actor ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unique ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Batch Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {audits
                    .filter(
                      (audit) => !selectedRole || audit.role === selectedRole
                    )
                    .map((audit, index) => (
                      <tr
                        key={index}
                        className="group transition-all duration-200 hover:bg-purple-50/50 backdrop-blur-sm"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {audit.actorId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {audit.uniqueId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {audit.batchCode}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${getRoleColor(
                              audit.role as Role
                            )}`}
                          >
                            {audit.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(audit.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
