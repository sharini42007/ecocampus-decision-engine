import React, { useState } from 'react';
import { X, Code2, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface JavaMigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JavaMigrationModal: React.FC<JavaMigrationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'controllers' | 'services' | 'entities'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Java Spring Boot Migration Architecture
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400 text-slate-950">
                  JAVA PBL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                PBL Course – JAVA PROGRAMMING • Chennai Institute of Technology
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Architecture Overview
          </button>
          <button
            onClick={() => setActiveTab('controllers')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'controllers'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Routes → Spring Controllers
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'services'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Services → Java Business Logic
          </button>
          <button
            onClick={() => setActiveTab('entities')}
            className={`py-3 px-4 border-b-2 transition-all ${
              activeTab === 'entities'
                ? 'border-emerald-600 text-emerald-700 font-bold bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            SQLite → JPA Entities & Repos
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto grow text-slate-700 space-y-4">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h4 className="text-sm font-bold text-emerald-900 mb-1">
                  Why a Prototype-First Architecture for PBL?
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  For the PBL Java Programming submission, this interactive Node.js & SQLite prototype provides rapid visual verification of the mathematical sustainability scoring engine, scenario simulations, and database schemas. The entire architecture is deliberately decoupled into a clean MVC layer that maps 1:1 with standard Java Spring Boot conventions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Node.js Prototype Layer
                  </h5>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                      <span>Express Route Handlers</span>
                      <code className="text-blue-600 font-mono text-[11px]">routes/*.js</code>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                      <span>Business Logic Layer</span>
                      <code className="text-blue-600 font-mono text-[11px]">services/*.js</code>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                      <span>SQLite Local DB</span>
                      <code className="text-blue-600 font-mono text-[11px]">better-sqlite3</code>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-slate-50">
                      <span>REST Endpoints</span>
                      <code className="text-blue-600 font-mono text-[11px]">/api/*</code>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Java Spring Boot Migration
                  </h5>
                  <ul className="text-xs space-y-2 text-slate-600">
                    <li className="flex items-center justify-between p-2 rounded bg-emerald-50/50">
                      <span>Spring REST Controllers</span>
                      <code className="text-emerald-700 font-mono text-[11px]">@RestController</code>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-emerald-50/50">
                      <span>Java Service Beans</span>
                      <code className="text-emerald-700 font-mono text-[11px]">@Service</code>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-emerald-50/50">
                      <span>Spring Data JPA / Hibernate</span>
                      <code className="text-emerald-700 font-mono text-[11px]">JpaRepository</code>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-emerald-50/50">
                      <span>Spring Boot REST APIs</span>
                      <code className="text-emerald-700 font-mono text-[11px]">@GetMapping / @PostMapping</code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'controllers' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Express Routes → Spring Boot Controllers
              </h4>
              <p className="text-xs text-slate-600">
                Express route declarations map directly to Spring Boot <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">@RestController</code> classes with <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">@RequestMapping("/api")</code>.
              </p>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                <pre>{`// Java Spring Boot Controller Example
package com.cit.ecocampus.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.cit.ecocampus.service.ScoringService;
import com.cit.ecocampus.model.SimulationRequest;
import com.cit.ecocampus.model.SimulationResult;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class SustainabilityController {

    @Autowired
    private ScoringService scoringService;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard() {
        return ResponseEntity.ok(scoringService.getDashboardData());
    }

    @PostMapping("/scenarios/simulate")
    public ResponseEntity<SimulationResult> simulateScenario(@RequestBody SimulationRequest request) {
        SimulationResult result = scoringService.simulateScenario(request);
        return ResponseEntity.ok(result);
    }
}`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                Node.js Services → Java Service Classes
              </h4>
              <p className="text-xs text-slate-600">
                The pure mathematical algorithms (<code className="font-mono text-slate-800">Electricity × 0.20 + Water × 0.15 + ...</code>) in <code className="font-mono text-slate-800">scoringService.js</code> translate directly into thread-safe, injectable Java services using <code className="font-mono text-slate-800">@Service</code>:
              </p>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                <pre>{`// Java Service Class Example
package com.cit.ecocampus.service;

import org.springframework.stereotype.Service;

@Service
public class ScoringService {

    private static final double WEIGHT_ELECTRICITY = 0.20;
    private static final double WEIGHT_WATER = 0.15;
    private static final double WEIGHT_WASTE = 0.20;
    private static final double WEIGHT_TRANSPORT = 0.15;
    private static final double WEIGHT_GREEN = 0.15;
    private static final double WEIGHT_RENEWABLE = 0.15;

    public int calculateScore(double electricity, double water, double waste,
                              double transport, double green, double renewable) {
        double raw = (electricity * WEIGHT_ELECTRICITY)
                   + (water * WEIGHT_WATER)
                   + (waste * WEIGHT_WASTE)
                   + (transport * WEIGHT_TRANSPORT)
                   + (green * WEIGHT_GREEN)
                   + (renewable * WEIGHT_RENEWABLE);

        return (int) Math.round(raw);
    }

    public String getStatus(int score) {
        if (score >= 80) return "GREEN CAMPUS";
        if (score >= 60) return "MODERATE";
        return "NEEDS IMPROVEMENT";
    }
}`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'entities' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900">
                SQLite Tables → JPA Entities & Spring Data Repositories
              </h4>
              <p className="text-xs text-slate-600">
                The SQLite schema (<code className="font-mono">departments</code>, <code className="font-mono">sustainability_records</code>) maps seamlessly to Hibernate JPA Entities:
              </p>

              <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto">
                <pre>{`// Java Entity Example
package com.cit.ecocampus.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "departments")
@Data
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private Integer score;
    private String status;
}

// Spring Data Repository
package com.cit.ecocampus.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cit.ecocampus.entity.Department;
import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findAllByOrderByScoreDesc();
}`}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Prepared for Viva & Project Defense • Chennai Institute of Technology
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

export default JavaMigrationModal;
