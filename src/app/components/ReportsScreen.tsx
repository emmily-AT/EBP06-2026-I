import { FileText, Download, Trash2, TrendingUp, TrendingDown, BarChart2, X } from 'lucide-react';
import { SidebarLayout } from './SidebarLayout';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

type ReportType = 'expenses' | 'incomes' | 'general';

interface ReportHistory {
  id: string;
  name: string;
  generatedAt: string;
  type: ReportType;
}

interface ReportsScreenProps {
  onNavigate: (page: 'home' | 'budgets' | 'incomes' | 'expenses' | 'reports') => void;
  onProfileClick: () => void;
}

const typeLabel: Record<ReportType, string> = {
  expenses: 'Gastos',
  incomes: 'Ingresos',
  general: 'General',
};

const expenseCategories = [
  { id: 'food', name: 'Alimentación' },
  { id: 'transport', name: 'Transporte' },
  { id: 'housing', name: 'Vivienda' },
  { id: 'entertainment', name: 'Entretenimiento' },
  { id: 'health', name: 'Salud' },
  { id: 'education', name: 'Educación' },
  { id: 'shopping', name: 'Compras' },
  { id: 'other', name: 'Otros' },
];

const incomeCategories = [
  { id: 'salary', name: 'Salario' },
  { id: 'freelance', name: 'Freelance' },
  { id: 'investment', name: 'Inversión' },
  { id: 'bonus', name: 'Bono' },
  { id: 'gift', name: 'Regalo' },
  { id: 'savings', name: 'Ahorros' },
  { id: 'refund', name: 'Reembolso' },
  { id: 'other', name: 'Otros' },
];

export function ReportsScreen({ onNavigate, onProfileClick }: ReportsScreenProps) {
  const { user } = useAuth();

  const [reportType, setReportType] = useState<ReportType>('general');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [history, setHistory] = useState<ReportHistory[]>([]);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`report_history_${user?.id}`) || '[]');
    setHistory(stored);
  }, [user]);

  const parseAmount = (str: string) => parseInt(str.replace(/[^\d]/g, '')) || 0;

  const getFilteredData = () => {
    if (!user) return { incomes: [], expenses: [] };

    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo + 'T23:59:59') : null;

    const allIncomes: any[] = JSON.parse(localStorage.getItem('incomes') || '[]')
      .filter((x: any) => {
        if (x.userId !== user.id) return false;
        const d = new Date(x.date);
        if (from && d < from) return false;
        if (to && d > to) return false;
        if (categoryFilter && x.categoryId !== categoryFilter) return false;
        return true;
      });

    const allExpenses: any[] = JSON.parse(localStorage.getItem('expenses') || '[]')
      .filter((x: any) => {
        if (x.userId !== user.id) return false;
        const d = new Date(x.date);
        if (from && d < from) return false;
        if (to && d > to) return false;
        if (categoryFilter && x.categoryId !== categoryFilter) return false;
        return true;
      });

    return { incomes: allIncomes, expenses: allExpenses };
  };

  const { incomes, expenses } = getFilteredData();

  const showIncomes = reportType === 'incomes' || reportType === 'general';
  const showExpenses = reportType === 'expenses' || reportType === 'general';

  const totalIncome = showIncomes ? incomes.reduce((s, x) => s + parseAmount(x.amount), 0) : 0;
  const totalExpenses = showExpenses ? expenses.reduce((s, x) => s + parseAmount(x.amount), 0) : 0;
  const recordCount = (showIncomes ? incomes.length : 0) + (showExpenses ? expenses.length : 0);
  const balance = totalIncome - totalExpenses;

  const availableCategories = reportType === 'incomes' ? incomeCategories
    : reportType === 'expenses' ? expenseCategories
    : [
        ...expenseCategories.map(c => ({ ...c, id: `expense-${c.id}` })),
        ...incomeCategories.map(c => ({ ...c, id: `income-${c.id}` }))
      ];

  const clearFilters = () => {
    setReportType('general');
    setDateFrom('');
    setDateTo('');
    setCategoryFilter('');
  };

  const generatePDF = () => {
    // Validar que haya datos en el período seleccionado
    const hasIncomesData = showIncomes && incomes.length > 0;
    const hasExpensesData = showExpenses && expenses.length > 0;

    if (!hasIncomesData && !hasExpensesData) {
      // No hay datos para generar el reporte
      return;
    }

    const fromLabel = dateFrom || 'Inicio';
    const toLabel = dateTo || 'Hoy';
    const name = `Reporte ${typeLabel[reportType]} ${fromLabel} - ${toLabel}`;

    const rows = [
      ...(showIncomes ? incomes.map((x: any) => ({ ...x, _type: 'Ingreso' })) : []),
      ...(showExpenses ? expenses.map((x: any) => ({ ...x, _type: 'Gasto' })) : []),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Build summary cards based on report type
    let summaryCards = '';
    if (reportType === 'incomes') {
      summaryCards = `<div class="card"><div class="card-label">Total ingresos</div><div class="card-value income">$${totalIncome.toLocaleString('es-ES')}</div></div>`;
    } else if (reportType === 'expenses') {
      summaryCards = `<div class="card"><div class="card-label">Total gastos</div><div class="card-value expense">$${totalExpenses.toLocaleString('es-ES')}</div></div>`;
    } else {
      // general
      summaryCards = `<div class="card"><div class="card-label">Total ingresos</div><div class="card-value income">$${totalIncome.toLocaleString('es-ES')}</div></div>
    <div class="card"><div class="card-label">Total gastos</div><div class="card-value expense">$${totalExpenses.toLocaleString('es-ES')}</div></div>
    <div class="card"><div class="card-label">Balance</div><div class="card-value balance">$${balance.toLocaleString('es-ES')}</div></div>`;
    }

    // Build table headers and rows based on report type
    const showTypeColumn = reportType === 'general';
    const tableHeaders = showTypeColumn
      ? '<tr><th>Fecha</th><th>Tipo</th><th>Categoría</th><th>Descripción</th><th>Monto</th></tr>'
      : '<tr><th>Fecha</th><th>Categoría</th><th>Descripción</th><th>Monto</th></tr>';

    const tableRows = rows.map(r => {
      const typeCell = showTypeColumn ? `<td>${r._type}</td>` : '';
      return `<tr><td>${r.date}</td>${typeCell}<td>${r.categoryName}</td><td>${r.description || '-'}</td><td>${r._type === 'Ingreso' ? '+' : '-'}$${parseAmount(r.amount).toLocaleString('es-ES')}</td></tr>`;
    }).join('');

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>${name}</title>
  <style>
    * { color: #000 !important; background: #fff !important; }
    body { font-family: Arial, sans-serif; padding: 32px; font-size: 13px; }
    h1 { font-size: 20px; margin-bottom: 4px; border-bottom: 2px solid #000; padding-bottom: 8px; }
    .sub { margin-bottom: 24px; font-size: 12px; color: #444 !important; }
    .summary { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .card { border: 1px solid #000; padding: 12px 16px; min-width: 130px; }
    .card-label { font-size: 11px; margin-bottom: 4px; }
    .card-value { font-size: 18px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { border: 1px solid #000; padding: 8px 10px; text-align: left; font-weight: bold; background: #e8e8e8 !important; }
    td { padding: 7px 10px; border: 1px solid #ccc; }
    tr:nth-child(even) td { background: #f5f5f5 !important; }
    @media print { body { padding: 16px; } * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <h1>Generación de Reportes</h1>
  <p class="sub">Tipo: ${typeLabel[reportType]} &nbsp;|&nbsp; Período: ${fromLabel} → ${toLabel} &nbsp;|&nbsp; Registros: ${recordCount}</p>
  <div class="summary">
    ${summaryCards}
  </div>
  <table>
    <thead>${tableHeaders}</thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(html);
      win.document.close();
    }

    const newEntry: ReportHistory = {
      id: Math.random().toString(36).slice(2),
      name,
      generatedAt: new Date().toLocaleString('es-ES'),
      type: reportType,
    };
    const updated = [newEntry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(`report_history_${user?.id}`, JSON.stringify(updated));
  };

  const deleteHistory = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem(`report_history_${user?.id}`, JSON.stringify(updated));
  };

  const cardBase = 'bg-white rounded-2xl shadow-sm border border-[#D8D0F0] p-5 md:p-6';

  return (
    <SidebarLayout currentPage="reports" onNavigate={onNavigate} onProfileClick={onProfileClick}>
      <div className="flex-1 p-4 pt-8 md:p-6 xl:p-8 pb-24 xl:pb-8 bg-[#F7F5F0]">
        <div className="w-full max-w-md md:max-w-3xl xl:max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-[#3D2C8D] text-[30px]">Generación de Reportes</h1>
            <p className="mt-1 text-[#8c86a0] text-[#314158]">Genera reportes financieros en formato PDF</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left column: filters + preview + actions */}
            <div className="xl:col-span-2 space-y-5">

              {/* Filters */}
              <div className={cardBase}>
                <h2 className="text-[#3D2C8D] mb-5 text-[19px]">Filtros de reporte</h2>

                {/* Report type */}
                <div className="mb-5">
                  <label className="block text-slate-700 mb-2 text-[15px]">Tipo de reporte</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['expenses', 'incomes', 'general'] as ReportType[]).map((t) => {
                      const Icon = t === 'expenses' ? TrendingDown : t === 'incomes' ? TrendingUp : BarChart2;
                      const activeColors = t === 'expenses'
                        ? 'border-[#F87171] bg-[#FEE2E2] text-[#F87171]'
                        : t === 'incomes'
                        ? 'border-[#28AF5A] bg-[#E9FFF4] text-[#28AF5A]'
                        : 'border-[#3D2C8D] bg-[#EEEDFE] text-[#3D2C8D]';

                      return (
                        <button
                          key={t}
                          onClick={() => { setReportType(t); setCategoryFilter(''); }}
                          className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl border-2 transition-all ${
                            reportType === t
                              ? activeColors
                              : 'border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs font-medium">{typeLabel[t]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-slate-700 mb-2 text-[15px]">Fecha inicio</label>
                    <input
                      type="date"
                      value={dateFrom}
                      max={dateTo || today}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-2 text-[15px]">Fecha fin</label>
                    <input
                      type="date"
                      value={dateTo}
                      min={dateFrom}
                      max={today}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-1">
                  <label className="block text-slate-700 mb-2 text-[15px]">Categoría <span className="text-slate-400">(opcional)</span></label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                  >
                    <option value="">Todas las categorías</option>
                    {availableCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Empty state message */}
              {recordCount === 0 && (
                <div className={`${cardBase} bg-amber-50 border-amber-200`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-amber-900 font-medium mb-1">No hay datos para generar el reporte</h3>
                      <p className="text-amber-700 text-sm">
                        No se encontraron {reportType === 'expenses' ? 'gastos' : reportType === 'incomes' ? 'ingresos' : 'gastos ni ingresos'} registrados en el período seleccionado. Intenta ajustar los filtros o registrar nuevas transacciones.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={generatePDF}
                  disabled={recordCount === 0}
                  className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    recordCount === 0
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-2 border-slate-300'
                      : 'bg-[#0D0D0D] text-white border-2 border-[#3D2C8D] hover:shadow-md active:scale-[0.98]'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Generar PDF
                </button>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>

            {/* Right column: history */}
            <div className="xl:col-span-1">
              <div className={cardBase}>
                <h2 className="text-[#3D2C8D] text-[18px] mb-5">Historial reciente</h2>

                {history.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-[#EEEDFE] rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-[#534AB7]" />
                    </div>
                    <p className="text-slate-500 text-sm">No hay reportes generados</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((h) => (
                      <div key={h.id} className="border border-slate-100 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm text-slate-800 font-medium leading-tight line-clamp-2">{h.name}</p>
                          <button
                            onClick={() => deleteHistory(h.id)}
                            className="p-1 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                          >
                            <X className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{h.generatedAt}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-0.5 rounded-md ${
                            h.type === 'expenses' ? 'bg-[#F87171] text-white' :
                            h.type === 'incomes' ? 'bg-[#28AF5A] text-white' :
                            'bg-[#EEEDFE] text-[#3D2C8D]'
                          }`}>{typeLabel[h.type]}</span>
                          <button
                            onClick={generatePDF}
                            className="flex items-center gap-1 text-xs text-[#3D2C8D] hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Descargar PDF
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </SidebarLayout>
  );
}
