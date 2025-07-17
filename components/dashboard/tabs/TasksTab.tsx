import React, { useState, useMemo } from 'react';
import { Task, Employee, TaskStatus } from '../../../types';
import { useData } from '../../../contexts/DataContext';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Badge from '../../ui/Badge';
import { formatDate, getEmployeeName } from '../../../lib/utils';
import { PlusCircle } from 'lucide-react';
import DataTable, { Column } from '../../ui/DataTable';
import DeleteConfirmationModal from '../../ui/DeleteConfirmationModal';
import TaskFilters from './TaskFilters';

interface TasksTabProps {}

const TaskForm: React.FC<{
  task: Partial<Task>;
  setTask: React.Dispatch<React.SetStateAction<Partial<Task>>>;
  employees: Employee[];
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}> = ({ task, setTask, employees, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
        <label className="block text-sm font-medium text-gray-700">Funcionário</label>
        <Select value={task.employeeId || ''} onChange={e => setTask({...task, employeeId: Number(e.target.value)})} required>
            <option value="">Selecione um funcionário</option>
            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
        </Select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Título da Tarefa</label>
      <Input type="text" value={task.title || ''} onChange={e => setTask({...task, title: e.target.value})} required />
    </div>
     <div>
      <label className="block text-sm font-medium text-gray-700">Descrição</label>
      <textarea value={task.description || ''} onChange={e => setTask({...task, description: e.target.value})} rows={3} className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" required />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Data</label>
            <Input type="date" value={task.date || ''} onChange={e => setTask({...task, date: e.target.value})} required />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Horas Trabalhadas</label>
            <Input type="number" value={task.hours || 0} onChange={e => setTask({...task, hours: Number(e.target.value)})} min="0" step="0.5" required />
        </div>
    </div>
    <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <Select value={task.status || 'Pendente'} onChange={e => setTask({...task, status: e.target.value as TaskStatus})} required>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluída">Concluída</option>
        </Select>
    </div>
    <div className="flex justify-end gap-4 pt-4">
      <Button type="button" variant="secondary" onClick={onCancel}>Cancelar</Button>
      <Button type="submit">Salvar Tarefa</Button>
    </div>
  </form>
);

const TasksTab: React.FC<TasksTabProps> = () => {
  const { tasks, employees, addTask, updateTask, deleteTask } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Partial<Task>>({});
  const [filters, setFilters] = useState({ employee: '', status: '', date: '' });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const employeeMatch = !filters.employee || task.employeeId === Number(filters.employee);
      const statusMatch = !filters.status || task.status === filters.status;
      const dateMatch = !filters.date || task.date === filters.date;
      return employeeMatch && statusMatch && dateMatch;
    });
  }, [tasks, filters]);

  const openModalForNew = () => {
    setEditingTask({ date: new Date().toISOString().split('T')[0], status: 'Pendente' });
    setIsModalOpen(true);
  };

  const openModalForEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    const { id, ...taskData } = editingTask;
    if (id) {
      updateTask(editingTask as Task);
    } else {
      addTask(taskData as Omit<Task, 'id'>);
    }
    closeModal();
  };

  const handleDeleteRequest = (id: number) => {
    setDeletingId(id);
    setIsConfirmModalOpen(true);
  };
  
  const handleConfirmDelete = () => {
    if (deletingId !== null) {
      deleteTask(deletingId);
    }
    setIsConfirmModalOpen(false);
    setDeletingId(null);
  };
  
  const columns: Column<Task>[] = [
      { key: 'employeeId', header: 'Funcionário', render: (task) => getEmployeeName(task.employeeId, employees), className: 'font-medium text-gray-900'},
      { key: 'title', header: 'Tarefa' },
      { key: 'date', header: 'Data', render: (task) => formatDate(task.date) },
      { key: 'hours', header: 'Horas', render: (task) => `${task.hours}h` },
      { key: 'status', header: 'Status', render: (task) => <Badge status={task.status} /> },
      { key: 'actions', header: 'Ações', className: 'text-right' },
  ];

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Gerenciar Tarefas</h2>
        <Button onClick={openModalForNew}><PlusCircle size={16} className="mr-2"/>Registrar Tarefa</Button>
      </div>

      <TaskFilters filters={filters} setFilters={setFilters} employees={employees} />

      <DataTable 
        columns={columns}
        data={filteredTasks}
        onEdit={openModalForEdit}
        onDelete={handleDeleteRequest}
        emptyMessage="Nenhuma tarefa encontrada para os filtros selecionados."
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingTask.id ? 'Editar Tarefa' : 'Registrar Tarefa'} size="lg">
        <TaskForm task={editingTask} setTask={setEditingTask} employees={employees} onSubmit={handleSaveTask} onCancel={closeModal} />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
      />
    </Card>
  );
};

export default TasksTab;
