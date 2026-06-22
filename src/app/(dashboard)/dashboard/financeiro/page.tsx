"use client";

import { useState } from "react";
import { useAura } from "@/context/AuraContext";
import { DollarSign, Plus, Calendar, FileText, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function FinanceiroPage() {
  const { financialEntries, addTransaction } = useAura();
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState<{
    type: "Entrada" | "Saída";
    category: "Venda Filhote" | "Cobertura" | "Hospedagem" | "Adestramento" | "Ração" | "Veterinário" | "Vacinas" | "Manutenção" | "Marketing" | "Outro";
    amount: string;
    description: string;
    date: string;
  }>({
    type: "Entrada",
    category: "Venda Filhote",
    amount: "",
    description: "",
    date: ""
  });

  const totalIn = financialEntries
    .filter((e) => e.type === "Entrada")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalOut = financialEntries
    .filter((e) => e.type === "Saída")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netBalance = totalIn - totalOut;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || isNaN(parseFloat(form.amount)) || !form.description) return;

    await addTransaction({
      type: form.type,
      category: form.category as any,
      amount: parseFloat(form.amount),
      description: form.description,
      date: form.date ? new Date(form.date).toISOString() : new Date().toISOString()
    });

    setShowAddModal(false);
    setForm({
      type: "Entrada",
      category: "Venda Filhote",
      amount: "",
      description: "",
      date: ""
    });
  };

  const getCategoryBadgeColor = (cat: string) => {
    switch (cat) {
      case "Venda Filhote":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Cobertura":
        return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
      case "Hospedagem":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "Adestramento":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      default:
        return "bg-red-500/10 text-red-400 border border-red-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Fluxo de Caixa / Financeiro</h2>
          <p className="text-salon-text-secondary text-sm">
            Monitore a receita de filhotes e serviços contra despesas de ração, veterinário e manutenção.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-hover text-salon-bg font-bold px-4 py-2 rounded-salon text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(201,169,110,0.15)]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Lançar Transação</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Entradas */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] text-salon-text-secondary font-medium uppercase tracking-wider">Total Entradas</span>
            <h3 className="text-2xl font-bold text-salon-success">+ R$ {totalIn.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
          </div>
          <ArrowUpCircle className="w-10 h-10 text-salon-success opacity-80" />
        </div>

        {/* Saídas */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] text-salon-text-secondary font-medium uppercase tracking-wider">Total Saídas</span>
            <h3 className="text-2xl font-bold text-salon-error">- R$ {totalOut.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</h3>
          </div>
          <ArrowDownCircle className="w-10 h-10 text-salon-error opacity-80" />
        </div>

        {/* Saldo Líquido */}
        <div className="bg-salon-surface border border-salon-border rounded-salon p-6 flex justify-between items-center">
          <div className="space-y-1">
            <span className="text-[10px] text-salon-text-secondary font-medium uppercase tracking-wider">Saldo Líquido</span>
            <h3 className={`text-2xl font-bold ${netBalance >= 0 ? "text-salon-text-primary" : "text-salon-error"}`}>
              R$ {netBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <DollarSign className="w-10 h-10 text-[#D97457] opacity-80" />
        </div>
      </div>

      {/* Ledger list */}
      <div className="bg-salon-surface border border-salon-border rounded-salon p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#D97457] border-b border-[#2A2A2A] pb-2">
          Livro Razão / Histórico de Transações
        </h3>

        <div className="space-y-3">
          {financialEntries.map((e) => {
            const dateStr = new Date(e.date).toLocaleDateString("pt-BR");
            return (
              <div
                key={e.id}
                className="p-4 bg-salon-bg/40 border border-salon-border/60 rounded-xl flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase shrink-0 mt-0.5 ${getCategoryBadgeColor(e.category)}`}>
                    {e.category}
                  </span>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold text-salon-text-primary">{e.description}</h5>
                    <div className="flex items-center gap-2.5 text-[9px] text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{dateStr}</span>
                      {e.payment_method && <span>&bull; {e.payment_method}</span>}
                    </div>
                  </div>
                </div>

                <span className={`text-xs font-bold shrink-0 ${e.type === "Entrada" ? "text-salon-success" : "text-salon-error"}`}>
                  {e.type === "Entrada" ? "+" : "-"} R$ {e.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Add Transaction */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-salon-surface border border-salon-border rounded-salon p-6 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold">Lançar Nova Transação</h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Tipo de Fluxo</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({
                      ...prev,
                      type: e.target.value as any,
                      category: e.target.value === "Entrada" ? "Venda Filhote" : "Ração"
                    }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  >
                    <option value="Entrada">Entrada (Receita)</option>
                    <option value="Saída">Saída (Despesa)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Categoria</label>
                  {form.type === "Entrada" ? (
                    <select
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    >
                      <option value="Venda Filhote">Venda de Filhote</option>
                      <option value="Cobertura">Cobertura / Monta</option>
                      <option value="Hospedagem">Hospedagem / Creche</option>
                      <option value="Adestramento">Adestramento</option>
                      <option value="Outro">Outro</option>
                    </select>
                  ) : (
                    <select
                      value={form.category}
                      onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    >
                      <option value="Ração">Ração / Alimentação</option>
                      <option value="Veterinário">Veterinário / Clínica</option>
                      <option value="Vacinas">Vacinas / Vermífugos</option>
                      <option value="Manutenção">Manutenção Canil</option>
                      <option value="Marketing">Marketing / Instagram</option>
                      <option value="Outro">Outro</option>
                    </select>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Valor em R$</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                    placeholder="Ex: 450..."
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 font-medium">Data Lançamento</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 font-medium">Descrição / Detalhe</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-salon-bg border border-salon-border p-2.5 rounded-lg text-white"
                  placeholder="Ex: Compra de vacinas V10..."
                  required
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-salon-bg border border-salon-border text-salon-text-primary py-2.5 rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#D97457] hover:bg-[#C25F43] text-[#0F0F0F] py-2.5 rounded-lg font-bold"
                >
                  Salvar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
