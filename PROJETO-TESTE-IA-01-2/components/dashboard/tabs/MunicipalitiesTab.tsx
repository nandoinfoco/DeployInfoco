import React, { useState } from 'react';
import { FinanceData } from '../../../types';
import { useData } from '../../../contexts/DataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import { PlusCircle } from 'lucide-react';
import DataTable, { Column } from '../../ui/DataTable';
import DeleteConfirmationModal from '../../ui/DeleteConfirmationModal';

interface MunicipalitiesTabProps {}

const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const MunicipalityForm: React.FC<{
  municipality: Partial<FinanceData>;
  setMunicipality: React.Dispatch<React.SetStateAction<Partial<FinanceData>>>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}> = ({ municipality, setMunicipality, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Nome do Município</label>
      <Input
        type="text"
        value={municipality.municipality || ''}
        onChange={(e) => setMunicipality({ ...municipality, municipality: e.target.value.toUpperCase() })}
        required
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Valor Pago</label>
        <Input
          type="number"
          value={municipality.paid || 0}
          onChange={(e) => setMunicipality({ ...municipality, paid: Number(e.target.value) })}
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Valor Pendente</label>
         <Input
          type="number"
          value={municipality.pending || 0}
          onChange={(e) => setMunicipality({ ...municipality, pending: Number(e.target.value) })}
          required
          min="0"
          step="0.01"
        />
      </div>
    </div>
    <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
    </div>
  </form>
);

const MunicipalitiesTab: React.FC<MunicipalitiesTabProps> = () => {
  const { financeData, addMunicipality, updateMunicipality, deleteMunicipality } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingMunicipality, setEditingMunicipality] = useState<Partial<FinanceData>>({});

  const openModalForNew = () => {
    setEditingMunicipality({});
    setIsModalOpen(true);
  };

  const openModalForEdit = (municipality: FinanceData) => {
    setEditingMunicipality(municipality);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...data } = editingMunicipality;
    if (id) {
      updateMunicipality(editingMunicipality as FinanceData);
    } else {
      addMunicipality(data as Omit<FinanceData, 'id'>);
    }
    closeModal();
  };

  const handleDeleteRequest = (id: number) => {
    setDeletingId(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId !== null) {
      deleteMunicipality(deletingId);
    }
    setIsConfirmModalOpen(false);
    setDeletingId(null);
  };

  const columns: Column<FinanceData>[] = [
    { key: 'municipality', header: 'Município', className: 'font-medium text-gray-900' },
    { key: 'paid', header: 'Valor Pago', className: 'text-right text-green-600', render: (item) => formatCurrency(item.paid) },
    { key: 'pending', header: 'Valor Pendente', className: 'text-right text-yellow-600', render: (item) => formatCurrency(item.pending) },
    { key: 'actions', header: 'Ações', className: 'text-right' },
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gerenciar Municípios</h2>
        <Button onClick={openModalForNew}>
            <PlusCircle size={16} className="mr-2"/>
            Adicionar Município
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={financeData}
        onEdit={openModalForEdit}
        onDelete={handleDeleteRequest}
        emptyMessage="Nenhum município encontrado."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingMunicipality.id ? 'Editar Município' : 'Adicionar Município'}
        size="lg"
      >
        <MunicipalityForm municipality={editingMunicipality} setMunicipality={setEditingMunicipality} onSubmit={handleSave} onCancel={closeModal} />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este município? Esta ação não pode ser desfeita."
      />
    </Card>
  );
};

export default MunicipalitiesTab;
