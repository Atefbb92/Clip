"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  Edit,
  Trash2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Package,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import StatusCard from "@/components/statusCard";
import usePatientSearch from "@/hooks/usePatientSearch";
import { usePatientStep } from "@/hooks/use-patient-step";
import { HeadingTitle } from "@/components/HeadingTitle";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlayCircle, RotateCw, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TreatmentPlanViewer3D from "@/components/TreatmentPlanViewer3D";
import { useTranslation } from "@/hooks/useTranslation";

interface Patient {
  id: string;
  name: string;
  surname: string;
  age: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  email?: string;
  medicalHistory?: string;
  allergies?: string;
  currentMedications?: string;
  treatmentGoals?: string;
  notes?: string;
  status: number;
  archived: number;
  files?: string[];
  createdAt?: Timestamp | Date | null;
  validationDate?: Timestamp | Date | null;
  updatedAt?: Timestamp | Date | null;
  userId: string;
  patientType?: string;
  images?: {
    img2?: string;
  };
  conditions?: string[];
  photos?: any;
  approvedTPCheckUrl?: string | null;
}

const PatientsPage = () => {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const currentUserId = session?.user?.id || "";
  const { data: fetchedPatients, isLoading: trpcLoading } =
    trpc.patients.getAll.useQuery(
      { userId: currentUserId },
      { enabled: !!currentUserId },
    );

  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState<number | null>(null); // New state for Status filter
  const [counts, setCounts] = useState({
    drafts: 0,
    enplanification: 0,
    attente: 0,
    enproduction: 0,
    entraitement: 0,
    termine: 0,
  });
  const [viewerPatient, setViewerPatient] = useState<Patient | null>(null);
  const router = useRouter();
  const { t, language } = useTranslation();

  const activePatients = React.useMemo(() => {
    return patients.filter((patient) => {
      // 1. Status Filter (from StatusCard)
      if (statusFilter !== null) {
        if (patient.status !== statusFilter) return false;
      }

      // 2. Tab Filter
      if (activeTab === "all") return patient.archived !== 1;
      if (activeTab === "actions")
        return [0, 2, 3].includes(patient.status) && patient.archived !== 1;
      if (activeTab === "archived") return patient.archived === 1;
      return true;
    });
  }, [patients, statusFilter, activeTab]);

  const { searchTerm, setSearchTerm, filteredPatients } = usePatientSearch(
    activePatients,
    ["name", "surname"],
  );

  // Clear status filter when changing tabs, if desired.
  // Or keep them independent. For now, let's reset status filter if user clicks tab (optional UX choice)
  // But user request implies "clic on one of them filters the tab below".
  // So likely they work within "All patients" or override it.
  // Let's assume StatusFilter overrides tab or works in conjunction.
  // Actually, standard dashboards often reset other filters or apply on top.
  // Logic above applies both: must match status (if set) AND active tab.

  const handleStatusSelect = (statusId: number | null) => {
    setStatusFilter(statusId);
    // If user clicks a status, maybe switch to 'all' tab if we are in 'archived'?
    // For safety, let's ensure we display the patients.
    if (activeTab === "archived") setActiveTab("all");
  };

  // Sorting state and helpers (inside component)
  const [sortBy, setSortBy] = useState<
    "patient" | "status" | "category" | "date" | "validationDate"
  >("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (
    key: "patient" | "status" | "category" | "date" | "validationDate",
  ) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
  };

  const getSortIcon = (
    key: "patient" | "status" | "category" | "date" | "validationDate",
  ) => {
    if (sortBy !== key)
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-4 h-4 text-gray-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-gray-600" />
    );
  };

  const categoryOf = (ageStr?: string) => {
    const age = parseInt(ageStr || "0", 10);
    if (Number.isNaN(age)) return t("patients.categories.unknown");
    if (age >= 18) return t("patients.categories.adult");
    if (age <= 12) return t("patients.categories.child");
    return t("patients.categories.teen");
  };

  const dateOf = (d?: Timestamp | Date | null) => {
    if (!d) return null;
    if (d instanceof Date) return d;
    try {
      return d instanceof Timestamp ? d.toDate() : null;
    } catch {
      return null;
    }
  };

  const sortedPatients = React.useMemo(() => {
    const arr = [...filteredPatients];
    arr.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "patient") {
        const an = `${a.name || ""} ${a.surname || ""}`.trim().toLowerCase();
        const bn = `${b.name || ""} ${b.surname || ""}`.trim().toLowerCase();
        return an.localeCompare(bn) * dir;
      }
      if (sortBy === "status") {
        const as = a.status ?? 0;
        const bs = b.status ?? 0;
        return (as - bs) * dir;
      }
      if (sortBy === "category") {
        const ac = (a.patientType || categoryOf(a.age)).toLowerCase();
        const bc = (b.patientType || categoryOf(b.age)).toLowerCase();
        return ac.localeCompare(bc) * dir;
      }
      if (sortBy === "validationDate") {
        const ad = dateOf(a.validationDate)?.getTime() ?? 0;
        const bd = dateOf(b.validationDate)?.getTime() ?? 0;
        return (ad - bd) * dir;
      }
      const ad = dateOf(a.createdAt)?.getTime() ?? 0;
      const bd = dateOf(b.createdAt)?.getTime() ?? 0;
      return (ad - bd) * dir;
    });
    return arr;
  }, [filteredPatients, sortBy, sortDir]);

  useEffect(() => {
    if (!sessionPending && !session) {
      router.push("/signin");
    }
  }, [session, sessionPending, router]);

  useEffect(() => {
    if (!trpcLoading && fetchedPatients) {
      const formattedPatients: Patient[] = (fetchedPatients as any[]).map((p: any) => {
        let birthDateStr = "";
        if (p.birthDate && typeof p.birthDate === "object") {
          const bd = p.birthDate as any;
          if (bd.day && bd.month && bd.year) {
            birthDateStr = `${bd.year}-${bd.month.padStart(2, "0")}-${bd.day.padStart(2, "0")}`;
          }
        }

        let mappedStatus = 0;
        if (p.status === "Brouillon") {
          mappedStatus = 0;
        } else {
          switch (p.globalStatus) {
            case 'EN_PLANIFICATION': mappedStatus = 1; break;
            case 'EN_ATTENTE_DE_VALIDATION': mappedStatus = 2; break;
            case 'EN_PRODUCTION': mappedStatus = 3; break;
            case 'EN_TRAITEMENT': mappedStatus = 4; break;
            case 'TRAITEMENT_TERMINE': mappedStatus = 5; break;
            default: mappedStatus = 1; // Default to Planning if submitted but status unknown
          }
        }

        return {
          id: p.id,
          name: p.name,
          surname: p.surname,
          age: "", // Age can be derived later or mock for now
          birthDate: birthDateStr,
          gender: p.genre || "",
          address: "",
          phone: "",
          status: mappedStatus,
          approvedTPCheckUrl: p.approvedTPCheckUrl,
          archived: p.archived,
          userId: p.userId,
          createdAt: p.createdAt ? new Date(p.createdAt as any) : null,
          updatedAt: p.updatedAt ? new Date(p.updatedAt as any) : null,
          conditions: p.conditions || [],
          patientType: p.patientType || t('patients.categories.unknown'),
          photos: p.photos
        };
      });

      // Calculate counts
      const newCounts = {
        drafts: 0,
        enplanification: 0,
        attente: 0,
        enproduction: 0,
        entraitement: 0,
        termine: 0,
      };

      formattedPatients.forEach(p => {
        if (p.archived === 1) return;
        switch (p.status) {
          case 0: newCounts.drafts++; break;
          case 1: newCounts.enplanification++; break;
          case 2: newCounts.attente++; break;
          case 3: newCounts.enproduction++; break;
          case 4: newCounts.entraitement++; break;
          case 5: newCounts.termine++; break;
        }
      });

      setCounts(newCounts);
      setPatients(formattedPatients);
      setLoading(false);
    } else if (!trpcLoading && !fetchedPatients) {
      setLoading(false);
    }
  }, [fetchedPatients, trpcLoading, language]); // Use language instead of t to avoid infinite loop


  const handlePatientClick = (patient: Patient) => {
    router.push(`/patients/${patient.id}`);
  };

  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: { label: t("status.brouillon"), color: "bg-gray-100 text-gray-800" },
      1: { label: t("status.planning"), color: "bg-blue-100 text-blue-800" },
      2: {
        label: t("status.en-attente"),
        color: "bg-yellow-100 text-yellow-800",
      },
      3: {
        label: t("status.en-production"),
        color: "bg-orange-100 text-orange-800",
      },
      4: {
        label: t("status.en-traitement"),
        color: "bg-purple-100 text-purple-800",
      },
      5: { label: t("status.termine"), color: "bg-green-100 text-green-800" },
      6: { label: t("status.rejete"), color: "bg-red-100 text-red-800" },
    }[status] || {
      label: t("patients.categories.unknown"),
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.color}`}
      >
        {statusConfig.label}
      </span>
    );
  };

  const formatDate = (date: Timestamp | Date | null | undefined) => {
    if (!date) return "N/A";
    try {
      const d =
        date instanceof Date
          ? date
          : date instanceof Timestamp
            ? date.toDate()
            : null;
      const locale =
        language === "FR" ? "fr-FR" : language === "DE" ? "de-DE" : "en-US";
      return d ? d.toLocaleDateString(locale) : "N/A";
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <HeadingTitle
          title={t("patients.title")}
          subtitle={t("patients.subtitle")}
        />
        <Button variant="primary" asChild>
          <Link href="/patients/new" prefetch>
            <Plus className="size-4" />
            <span>{t("patients.new_patient")}</span>
          </Link>
        </Button>
      </div>

      {/* Status Cards */}
      <StatusCard
        selectedStatus={statusFilter}
        onStatusSelect={handleStatusSelect}
        counts={counts}
      />

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mt-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => {
                setActiveTab("all");
                setStatusFilter(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "all" && statusFilter === null
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {t("patients.tabs.all")}
            </button>
            <button
              onClick={() => {
                setActiveTab("actions");
                setStatusFilter(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === "actions" && statusFilter === null
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {t("patients.tabs.actions")}
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {
                  patients.filter(
                    (patient) =>
                      [0, 2, 3].includes(patient.status) &&
                      patient.archived !== 1,
                  ).length
                }
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("archived");
                setStatusFilter(null);
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "archived"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
            >
              {t("patients.tabs.archived")} (
              {patients.filter((p) => p.archived === 1).length})
            </button>
          </nav>
        </div>

        {/* Search and filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t("patients.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80 border-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => toggleSort("patient")}
                    className="inline-flex items-center gap-2 hover:text-gray-700"
                  >
                    {t("patients.table.patient")}
                    {getSortIcon("patient")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => toggleSort("status")}
                    className="inline-flex items-center gap-2 hover:text-gray-700"
                  >
                    {t("patients.table.status")}
                    {getSortIcon("status")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => toggleSort("category")}
                    className="inline-flex items-center gap-2 hover:text-gray-700"
                  >
                    {t("patients.table.category")}
                    {getSortIcon("category")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => toggleSort("date")}
                    className="inline-flex items-center gap-2 hover:text-gray-700"
                  >
                    {t("patients.table.submission_date")}
                    {getSortIcon("date")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => toggleSort("validationDate")}
                    className="inline-flex items-center gap-2 hover:text-gray-700"
                  >
                    {t("patients.table.validation_date")}
                    {getSortIcon("validationDate")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("patients.table.clinical_conditions")}
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-px whitespace-nowrap">
                  {t("patients.table.tp_check")}
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchTerm
                      ? t("patients.empty.no_results")
                      : t("patients.empty.no_patients")}
                  </td>
                </tr>
              ) : (
                sortedPatients.map((patient: Patient) => {
                  // category is now computed inline or uses patientType
                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handlePatientClick(patient)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={patient.photos?.image2?.url || patient.photos?.image1?.url} className="object-cover" />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-sm">
                              {patient.name?.charAt(0)}
                              {patient.surname?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {patient.name} {patient.surname}
                            </div>
                            <div className="text-[9px] text-gray-500">
                              {patient.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(patient.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {patient.patientType || categoryOf(patient.age)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(patient.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.validationDate
                          ? formatDate(patient.validationDate)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const conditions = patient.conditions || [];
                          if (conditions.length === 0) return null;

                          const maxDisplay = 3;
                          const remainingConditions =
                            conditions.slice(maxDisplay);

                          return (
                            <div className="flex flex-wrap items-center gap-2">
                              {conditions
                                .slice(0, maxDisplay)
                                .map((condition, index) => (
                                  <Badge
                                    key={index}
                                    style={{
                                      backgroundColor: "#0072B8",
                                      color: "white",
                                    }}
                                    className="border-none"
                                  >
                                    {condition}
                                  </Badge>
                                ))}

                              {remainingConditions.length > 0 && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge
                                        variant="secondary"
                                        className="cursor-pointer bg-blue-50 text-[#0072B8] hover:bg-blue-100 border-none"
                                      >
                                        +{remainingConditions.length}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white">
                                      <ul className="text-sm space-y-1">
                                        {remainingConditions.map(
                                          (condition, index) => (
                                            <li key={index}>{condition}</li>
                                          ),
                                        )}
                                      </ul>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center w-px">
                        {patient.status >= 2 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={!patient.approvedTPCheckUrl}
                            className={`h-9 w-9 rounded-full transition-colors ${patient.approvedTPCheckUrl
                              ? "text-[#0072B8] hover:text-[#00619c] hover:bg-blue-50"
                              : "text-slate-300 cursor-not-allowed"
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (patient.approvedTPCheckUrl) {
                                setViewerPatient(patient);
                              }
                            }}
                            title={patient.approvedTPCheckUrl ? "Voir le TP Check Validé" : "Aucun TP Check validé"}
                          >
                            <PlayCircle className={`h-6 w-6 ${patient.approvedTPCheckUrl ? "fill-[#0072B8]/10" : "fill-slate-100"}`} />
                          </Button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="bg-white shadow-xl border border-gray-200"
                          >
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (
                                  confirm(t("patients.actions.confirm_archive"))
                                ) {
                                  try {
                                    await updateDoc(
                                      doc(db, "patients", patient.id),
                                      {
                                        archived:
                                          patient.archived === 1 ? 0 : 1,
                                      },
                                    );
                                    // Refresh text or state
                                    setPatients((prev) =>
                                      prev.map((p) =>
                                        p.id === patient.id
                                          ? {
                                            ...p,
                                            archived:
                                              p.archived === 1 ? 0 : 1,
                                          }
                                          : p,
                                      ),
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error archiving patient:",
                                      error,
                                    );
                                  }
                                }
                              }}
                            >
                              <div className="flex items-center w-full">
                                <div className="w-4 h-4 mr-2 flex items-center justify-center">
                                  {patient.archived === 1 ? (
                                    <RotateCw className="w-4 h-4" />
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-archive"
                                    >
                                      <rect
                                        width="20"
                                        height="5"
                                        x="2"
                                        y="3"
                                        rx="1"
                                      />
                                      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
                                      <path d="M10 12h4" />
                                    </svg>
                                  )}
                                </div>
                                {patient.archived === 1
                                  ? t("patients.actions.unarchive")
                                  : t("patients.actions.archive")}
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (
                                  confirm(t("patients.actions.confirm_delete"))
                                ) {
                                  try {
                                    await deleteDoc(
                                      doc(db, "patients", patient.id),
                                    );
                                    setPatients((prev) =>
                                      prev.filter((p) => p.id !== patient.id),
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error deleting patient:",
                                      error,
                                    );
                                  }
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t("patients.actions.delete")}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog
        open={!!viewerPatient}
        onOpenChange={(open) => !open && setViewerPatient(null)}
      >
        <DialogContent className="!max-w-[95%] !w-[95%] h-[95%] p-0 overflow-hidden bg-white border-none rounded-lg flex flex-col [&>button]:hidden shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-white shrink-0">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center">
              <Package className="h-6 w-6 mr-2 text-[#0072B8]" />
              Visualiseur 3D - Plan de traitement : {viewerPatient?.name}{" "}
              {viewerPatient?.surname}
            </h2>
            <Button
              onClick={() => setViewerPatient(null)}
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 min-h-0 bg-slate-50">
            {viewerPatient && (
              <TreatmentPlanViewer3D
                patientName={`${viewerPatient.name} ${viewerPatient.surname}`}
                url={viewerPatient.approvedTPCheckUrl || undefined}
                versionLabel="Version Validée"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientsPage;
