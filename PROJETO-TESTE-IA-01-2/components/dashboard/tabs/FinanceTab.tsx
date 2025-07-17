import React from 'react';
import { useData } from '../../../contexts/DataContext';
import Card from '../../ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DataTable, { Column } from '../../ui/DataTable';
import { FinanceData } from '../../../types';

interface FinanceTabProps {}

const FinanceTab: React.FC<FinanceTabProps> = () => {
  const { financeData } = useData();
  const totalPaid = financeData.reduce((acc, item) => acc + item.paid, 0);
  const totalPending = financeData.reduce((acc, item) => acc + item.pending, 0);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const columns: Column<FinanceData>[] = [
    { key: 'municipality', header: 'Município', className: 'font-medium text-gray-900' },
    {
      key: 'paid',
      header: 'Valor Pago',
      className: 'text-right text-green-600',
      render: (item) => formatCurrency(item.paid)
    },
    {
      key: 'pending',
      header: 'Valor Pendente',
      className: 'text-right text-yellow-600',
      render: (item) => formatCurrency(item.pending)
    },
    {
      key: 'total',
      header: 'Total',
      className: 'text-right font-semibold',
      render: (item) => formatCurrency(item.paid + item.pending)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-gray-500 font-medium">Total Pago</h3>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
        </Card>
        <Card>
          <h3 className="text-gray-500 font-medium">Total Pendente</h3>
          <p className="text-3xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p>
        </Card>
        <Card>
          <h3 className="text-gray-500 font-medium">Balanço Geral</h3>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(totalPaid + totalPending)}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Balanço por Município</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={financeData}
              margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="municipality" />
              <YAxis tickFormatter={(value) => `R$${Number(value) / 1000}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="paid" name="Pago" fill="#22c55e" />
              <Bar dataKey="pending" name="Pendente" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalhes Financeiros</h2>
         <DataTable
            columns={columns}
            data={financeData}
            emptyMessage="Nenhum dado financeiro encontrado."
         />
      </Card>
    </div>
  );
};

export default FinanceTab;
