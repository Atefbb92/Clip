'use client'

import React, { useState } from 'react'
import {
  Download,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Send,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HeadingTitle } from '@/components/HeadingTitle'
import StatCard from '@/components/StatCard/StatCard'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTranslation } from '@/hooks/useTranslation'

interface Bill {
  id: number
  patientName: string
  submitDate: string
  validationDate: string
  priceHT: number
  remise: number
  tva: number
  paid: number
  status: 'paid' | 'pending' | 'overdue' | 'partial'
}

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
  const { t, language } = useTranslation()

  // Sample data extended with status
  const [bills] = useState<Bill[]>([
    {
      id: 1,
      patientName: 'Jean Dupont',
      submitDate: '2024-10-15',
      validationDate: '2024-10-16',
      priceHT: 1200.0,
      remise: 10,
      tva: 20,
      paid: 1000.0,
      status: 'partial',
    },
    {
      id: 2,
      patientName: 'Marie Martin',
      submitDate: '2024-10-18',
      validationDate: '2024-10-19',
      priceHT: 850.0,
      remise: 5,
      tva: 20,
      paid: 0,
      status: 'pending',
    },
    {
      id: 3,
      patientName: 'Pierre Bernard',
      submitDate: '2024-10-20',
      validationDate: '2024-10-21',
      priceHT: 1500.0,
      remise: 15,
      tva: 20,
      paid: 1530.0,
      status: 'paid',
    },
    {
      id: 4,
      patientName: 'Sophie Dubois',
      submitDate: '2024-10-22',
      validationDate: '2024-10-23',
      priceHT: 650.0,
      remise: 0,
      tva: 20,
      paid: 650.0,
      status: 'paid',
    },
    {
      id: 5,
      patientName: 'Luc Moreau',
      submitDate: '2024-10-25',
      validationDate: '2024-10-26',
      priceHT: 2000.0,
      remise: 20,
      tva: 20,
      paid: 500.0,
      status: 'overdue',
    },
    {
      id: 6,
      patientName: 'Isabelle Petit',
      submitDate: '2024-10-28',
      validationDate: '2024-10-29',
      priceHT: 450.0,
      remise: 0,
      tva: 20,
      paid: 0,
      status: 'pending',
    },
  ])

  // Calculation helpers
  const calculatePriceAfterRemise = (priceHT: number, remise: number) => {
    return priceHT - (priceHT * remise) / 100
  }

  const calculatePrixTTC = (priceHT: number, remise: number, tva: number) => {
    const priceAfterRemise = calculatePriceAfterRemise(priceHT, remise)
    return priceAfterRemise + (priceAfterRemise * tva) / 100
  }

  const calculateRemaining = (
    priceHT: number,
    remise: number,
    tva: number,
    paid: number
  ) => {
    const prixTTC = calculatePrixTTC(priceHT, remise, tva)
    return Math.max(0, prixTTC - paid)
  }

  const formatCurrency = (amount: number) => {
    const locale = language === 'FR' ? 'fr-TN' : language === 'DE' ? 'de-DE' : 'en-US'
    const currency = language === 'FR' ? 'TND' : language === 'DE' ? 'EUR' : 'USD'
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const locale = language === 'FR' ? 'fr-FR' : language === 'DE' ? 'de-DE' : 'en-US'
    return new Date(dateString).toLocaleDateString(locale)
  }

  // Derived Statistics
  const totalRevenue = bills.reduce(
    (acc, bill) => acc + calculatePrixTTC(bill.priceHT, bill.remise, bill.tva),
    0
  )
  const totalPaid = bills.reduce((acc, bill) => acc + bill.paid, 0)
  const totalPending = bills.reduce(
    (acc, bill) =>
      acc + calculateRemaining(bill.priceHT, bill.remise, bill.tva, bill.paid),
    0
  )
  const totalBills = bills.length

  // Filter Logic
  const filteredBills = bills.filter((bill) => {
    const matchesSearch = bill.patientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    if (activeTab === 'all') return matchesSearch
    if (activeTab === 'paid') return matchesSearch && bill.status === 'paid'
    if (activeTab === 'partial') return matchesSearch && bill.status === 'partial'
    if (activeTab === 'pending') return matchesSearch && bill.status === 'pending'
    if (activeTab === 'overdue') return matchesSearch && bill.status === 'overdue'

    return matchesSearch
  })

  // Status Badge Helper
  const getStatusBadge = (status: Bill['status']) => {
    const styles = {
      paid: 'bg-green-100 text-green-800 hover:bg-green-100',
      pending: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      partial: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      overdue: 'bg-red-100 text-red-800 hover:bg-red-100',
    }

    const labels = {
      paid: t('billing.status.paid'),
      pending: t('billing.status.pending'),
      partial: t('billing.status.partial'),
      overdue: t('billing.status.overdue'),
    }

    return (
      <Badge className={`${styles[status]} border-none`}>
        {labels[status]}
      </Badge>
    )
  }

  return (
    <div className="min-h-screen space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <HeadingTitle
          title={t('billing.title')}
          subtitle={t('billing.subtitle')}
        />

      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          value={formatCurrency(totalRevenue)}
          label={t('billing.stats.revenue')}
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          value={formatCurrency(totalPending)}
          label={t('billing.stats.pending')}
          color="yellow"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          value={formatCurrency(totalPaid)}
          label={t('billing.stats.paid_amount')}
          color="green"
        />
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          value={totalBills}
          label={t('billing.stats.total_bills')}
          color="purple"
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tabs & Search */}
        <div className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
            {/* Tabs */}
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {[
                { id: 'all', label: t('billing.tabs.all') },
                { id: 'paid', label: t('billing.tabs.paid') },
                { id: 'partial', label: t('billing.tabs.partial') },
                { id: 'pending', label: t('billing.tabs.pending') },
                { id: 'overdue', label: t('billing.tabs.overdue') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('billing.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('billing.table.patient')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('billing.table.date')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('billing.table.status')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('billing.table.amount_ttc')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('billing.table.remaining')}
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {t('billing.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchTerm
                      ? t('billing.empty.no_results')
                      : t('billing.empty.no_category')}
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => {
                  const prixTTC = calculatePrixTTC(bill.priceHT, bill.remise, bill.tva)
                  const remaining = calculateRemaining(
                    bill.priceHT,
                    bill.remise,
                    bill.tva,
                    bill.paid
                  )

                  return (
                    <tr
                      key={bill.id}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {bill.patientName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {t('billing.popup.invoice_num')}{bill.id.toString().padStart(5, '0')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm text-gray-900">
                            {formatDate(bill.submitDate)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t('billing.popup.due_date')}: {formatDate(bill.validationDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(bill.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(prixTTC)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`text-sm font-medium ${remaining > 0 ? 'text-red-600' : 'text-green-600'
                            }`}
                        >
                          {formatCurrency(remaining)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 bg-white shadow-xl border border-gray-200">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => setSelectedBill(bill)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              {t('billing.actions.details')}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="w-4 h-4 mr-2" />
                              {t('billing.actions.download')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-4">
            <span>
              {t('billing.footer.displaying')
                .replace('{{count}}', filteredBills.length.toString())
                .replace('{{total}}', bills.length.toString())}
            </span>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{t('billing.footer.paid')}: {formatCurrency(bills.filter(b => b.status === 'paid').reduce((acc, b) => acc + calculatePrixTTC(b.priceHT, b.remise, b.tva), 0))}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="font-medium text-red-600">{t('billing.footer.remaining')}: {formatCurrency(totalPending)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Invoice Details Popup */}
      <Dialog open={!!selectedBill} onOpenChange={(open) => !open && setSelectedBill(null)}>
        <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden border-none rounded-xl">
          <DialogHeader className="bg-slate-900 text-white p-6">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-xl font-bold">{t('billing.popup.title')}</DialogTitle>
              <Badge className="bg-blue-600 text-white border-none">
                {selectedBill && getStatusBadge(selectedBill.status)}
              </Badge>
            </div>
          </DialogHeader>

          {selectedBill && (
            <div className="p-8 space-y-8">
              {/* Header Info */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-6">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('billing.popup.patient_info')}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedBill.patientName}</h3>
                  <p className="text-sm text-gray-500">{t('billing.popup.invoice_num')}{selectedBill.id.toString().padStart(5, '0')}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{t('billing.popup.submission_date')}</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(selectedBill.submitDate)}</p>
                  <p className="text-xs text-gray-500 mt-2 uppercase font-bold tracking-wider">{t('billing.popup.due_date')}</p>
                  <p className="text-sm font-medium text-slate-900">{formatDate(selectedBill.validationDate)}</p>
                </div>
              </div>

              {/* Summary Table */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('billing.popup.amount_ht')}</span>
                      <span className="font-medium">{formatCurrency(selectedBill.priceHT)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('billing.popup.discount')} ({selectedBill.remise}%)</span>
                      <span className="text-red-600">-{formatCurrency((selectedBill.priceHT * selectedBill.remise) / 100)}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t('billing.popup.tva')} ({selectedBill.tva}%)</span>
                      <span className="font-medium">{formatCurrency((calculatePriceAfterRemise(selectedBill.priceHT, selectedBill.remise) * selectedBill.tva) / 100)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                      <span className="font-bold text-slate-900">{t('billing.popup.total_ttc')}</span>
                      <span className="font-bold text-blue-600">{formatCurrency(calculatePrixTTC(selectedBill.priceHT, selectedBill.remise, selectedBill.tva))}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-slate-900 rounded-xl p-6 text-white flex justify-between items-center shadow-lg">
                <div>
                  <p className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-1">{t('billing.popup.already_paid')}</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedBill.paid)}</p>
                </div>
                <div className="text-right">
                  <p className="text-red-300 text-xs font-bold uppercase tracking-wider mb-1">{t('billing.popup.remaining')}</p>
                  <p className="text-2xl font-bold text-red-400">
                    {formatCurrency(calculateRemaining(selectedBill.priceHT, selectedBill.remise, selectedBill.tva, selectedBill.paid))}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex gap-4 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-12 gap-2 shadow-lg shadow-blue-100">
                  <Download className="w-4 h-4" /> {t('billing.actions.download_full')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 h-12 border-gray-200"
                  onClick={() => setSelectedBill(null)}
                >
                  {t('billing.actions.close')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
