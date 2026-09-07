import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Department, SustainabilityRecord } from '../types';

interface DataFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<SustainabilityRecord>) => Promise<void>;
  initialData?: SustainabilityRecord | null;
  departments: Department[];
}

export const DataFormModal: React.FC<DataFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  departments
}) => {
  const [departmentId, setDepartmentId] = useState<number>(departments[0]?.id || 1);
  const [electricity, setElectricity] = useState<number>(75);
  const [water, setWater] = useState<number>(80);
  const [waste, setWaste] = useState<number>(85);
  const [transportation, setTransportation] = useState<number>(80);
  const [green, setGreen] = useState<number>(85);
  const [renewable, setRenewable] = useState<number>(75);
  const [recordDate, setRecordDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialData) {
      setDepartmentId(initialData.department_id);
      setElectricity(initialData.electricity_consumption);
      setWater(initialData.water_usage);
      setWaste(initialData.waste_recycling_rate);
      setTransportation(initialData.transportation_impact);
      setGreen(initialData.green_coverage);
      setRenewable(initialData.renewable_energy_usage);
      setRecordDate(initialData.record_date || new Date().toISOString().split('T')[0]);
    } else {
      setDepartmentId(departments[0]?.id || 1);
      setElectricity(75);
      setWater(80);
      setWaste(85);
      setTransportation(80);
      setGreen(85);
      setRenewable(75);
      setRecordDate(new Date().toISOString().split('T')[0]);
    }
    setErrors({});
  }, [initialData, isOpen, departments]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!departmentId) errs.department = 'Please select a department';
    if (isNaN(electricity) || electricity < 0 || electricity > 100) errs.electricity = 'Must be between 0 and 100';
    if (isNaN(water) || water < 0 || water > 100) errs.water = 'Must be between 0 and 100';
    if (isNaN(waste) || waste < 0 || waste > 100) errs.waste = 'Must be between 0 and 100';
    if (isNaN(transportation) || transportation < 0 || transportation > 100) errs.transportation = 'Must be between 0 and 100';
    if (isNaN(green) || green < 0 || green > 100) errs.green = 'Must be between 0 and 100';
    if (isNaN(renewable) || renewable < 0 || renewable > 100) errs.renewable = 'Must be between 0 and 100';
    if (!recordDate) errs.recordDate = 'Please select a record date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        department_id: Number(departmentId),
        electricity_consumption: Number(electricity),
        water_usage: Number(water),
        waste_recycling_rate: Number(waste),
        transportation_impact: Number(transportation),
        green_coverage: Number(green),
        renewable_energy_usage: Number(renewable),
        record_date: recordDate
      });
      onClose();
    } catch (err: any) {
      setErrors({ form: err.response?.data?.message || err.message || 'Submission failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {initialData ? 'Edit Sustainability Record' : 'Add Sustainability Data'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Updates will automatically recalculate department rankings and campus sustainability score
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.form && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                value={departmentId}
                onChange={(e) => setDepartmentId(Number(e.target.value))}
                className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {errors.department && <p className="text-[11px] text-red-500 mt-1">{errors.department}</p>}
            </div>

            {/* Record Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Record Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
              {errors.recordDate && <p className="text-[11px] text-red-500 mt-1">{errors.recordDate}</p>}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Environmental Indicators (0 - 100 Metric)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Electricity */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Electricity Consumption</label>
                  <span className="text-xs font-mono font-bold text-slate-600">{electricity}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={electricity}
                  onChange={(e) => setElectricity(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                {errors.electricity && <p className="text-[11px] text-red-500 mt-1">{errors.electricity}</p>}
              </div>

              {/* Water Usage */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Water Usage</label>
                  <span className="text-xs font-mono font-bold text-slate-600">{water}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={water}
                  onChange={(e) => setWater(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                {errors.water && <p className="text-[11px] text-red-500 mt-1">{errors.water}</p>}
              </div>

              {/* Waste Recycling */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Waste Recycling Rate (%)</label>
                  <span className="text-xs font-mono font-bold text-slate-600">{waste}%</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={waste}
                  onChange={(e) => setWaste(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                {errors.waste && <p className="text-[11px] text-red-500 mt-1">{errors.waste}</p>}
              </div>

              {/* Transportation Impact */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Transportation Impact</label>
                  <span className="text-xs font-mono font-bold text-slate-600">{transportation}</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={transportation}
                  onChange={(e) => setTransportation(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                {errors.transportation && <p className="text-[11px] text-red-500 mt-1">{errors.transportation}</p>}
              </div>

              {/* Green Coverage */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Green Coverage (%)</label>
                  <span className="text-xs font-mono font-bold text-slate-600">{green}%</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={green}
                  onChange={(e) => setGreen(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                {errors.green && <p className="text-[11px] text-red-500 mt-1">{errors.green}</p>}
              </div>

              {/* Renewable Energy Usage */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Renewable Energy Usage (%)</label>
                  <span className="text-xs font-mono font-bold text-slate-600">{renewable}%</span>
                </div>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={renewable}
                  onChange={(e) => setRenewable(Number(e.target.value))}
                  className="w-full text-xs rounded-lg border border-slate-300 py-2 px-3 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
                {errors.renewable && <p className="text-[11px] text-red-500 mt-1">{errors.renewable}</p>}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-all disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Record' : 'Save Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataFormModal;
