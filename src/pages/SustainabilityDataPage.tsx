import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Database,
  RefreshCw,
  Search,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  getSustainabilityData,
  getDepartments,
  addSustainabilityData,
  updateSustainabilityData,
  deleteSustainabilityData
} from '../services/api';
import type { SustainabilityRecord, Department } from '../types';
import DataFormModal from '../components/DataFormModal';
import ConfirmDialog from '../components/ConfirmDialog';

export const SustainabilityDataPage: React.FC = () => {
  const [records, setRecords] = useState<SustainabilityRecord[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<SustainabilityRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recordsData, deptsData] = await Promise.all([
        getSustainabilityData(),
        getDepartments()
      ]);
      setRecords(recordsData);
      setDepartments(deptsData);
    } catch (err: any) {
      console.error('Failed to load sustainability records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdate = async (data: Partial<SustainabilityRecord>) => {
    try {
      if (editingRecord) {
        await updateSustainabilityData(editingRecord.id, data);
        setFeedbackMessage({
          text: `Record #${editingRecord.id} updated and scores recalculated in SQLite!`,
          type: 'success'
        });
      } else {
        await addSustainabilityData(data);
        setFeedbackMessage({
          text: 'New sustainability record persisted and campus engine synchronized!',
          type: 'success'
        });
      }
      setIsModalOpen(false);
      setEditingRecord(null);
      await fetchData();
      setTimeout(() => setFeedbackMessage(null), 5000);
    } catch (err: any) {
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteSustainabilityData(deleteTargetId);
      setFeedbackMessage({
        text: `Record #${deleteTargetId} removed. Scores automatically resynchronized.`,
        type: 'success'
      });
      setDeleteTargetId(null);
      await fetchData();
      setTimeout(() => setFeedbackMessage(null), 5000);
    } catch (err: any) {
      setFeedbackMessage({
        text: err.response?.data?.message || 'Failed to delete record',
        type: 'error'
      });
    }
  };

  const filteredRecords = records.filter(
    (r) =>
      r.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.record_date?.includes(searchTerm) ||
      String(r.id).includes(searchTerm)
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-300 uppercase tracking-wider">
              SQLite CRUD Telemetry
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">Auto-Recalculating Decision Engine</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sustainability Telemetry Data
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Live database records feeding the multi-criteria sustainability engine. Submitting or editing any record immediately updates SQLite, recalculates department scores, adjusts risk alerts, and refreshes campus analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh Table"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setEditingRecord(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sustainability Data</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by department, date, or record ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong className="text-slate-800">{filteredRecords.length}</strong> records in SQLite database
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4 w-12 text-center">ID</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 text-center">Electricity</th>
                <th className="py-3.5 px-4 text-center">Water</th>
                <th className="py-3.5 px-4 text-center">Waste Recyc.</th>
                <th className="py-3.5 px-4 text-center">Transport</th>
                <th className="py-3.5 px-4 text-center">Green Cover</th>
                <th className="py-3.5 px-4 text-center">Renewable</th>
                <th className="py-3.5 px-4 text-center">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    Loading telemetry records...
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-500">
                      #{rec.id}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {rec.department}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                      {rec.electricity_consumption}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                      {rec.water_usage}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                      {rec.waste_recycling_rate}%
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                      {rec.transportation_impact}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                      {rec.green_coverage}%
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-sky-700">
                      {rec.renewable_energy_usage}%
                    </td>

                    <td className="py-3.5 px-4 text-center text-slate-500 font-mono text-[11px]">
                      {rec.record_date}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingRecord(rec);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(rec.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <DataFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingRecord}
        departments={departments}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="Delete Sustainability Record"
        message={`Are you sure you want to permanently delete record #${deleteTargetId}? The backend scoring engine will immediately recalculate department rankings and overall campus status.`}
        confirmText="Delete Record"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
        isDestructive={true}
      />
    </div>
  );
};

export default SustainabilityDataPage;
