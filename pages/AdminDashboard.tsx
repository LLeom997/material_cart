
import React, { useState } from 'react';
import { useApp } from '../App';
import { useAdminData } from '../hooks/useAdminData';
import { useCRUD } from '../hooks/useCRUD';
import { supabase } from '../lib/supabase';
import Sidebar from '../components/Admin/Sidebar';
import HeaderBar from '../components/Admin/HeaderBar';
import TableOrders from '../components/Admin/TableOrders';
import TableProducts from '../components/Admin/TableProducts';
import GridVendors from '../components/Admin/GridVendors';
import TableCustomers from '../components/Admin/TableCustomers';
import LedgerTable from '../components/Admin/LedgerTable';
import AuditLogPanel from '../components/Admin/AuditLogPanel';
import ModalEntityForm from '../components/Admin/modals/ModalEntityForm';
import ModalOrderItems from '../components/Admin/modals/ModalOrderItems';
import ModalStatus from '../components/Admin/modals/ModalStatus';

type TabID = 'orders' | 'clients' | 'suppliers' | 'stock' | 'books' | 'logs';

const AdminDashboard: React.FC = () => {
  const { isAdmin } = useApp();
  const { enquiries, products, vendors, customers, ledger, audit, loadData, isLoading } = useAdminData(isAdmin);
  const [activeTab, setActiveTab] = useState<TabID>('orders');
  const [modal, setModal] = useState<any>(null);

  const logAction = async (action: string, resource: string, metadata: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('audit_logs').insert([{ action, resource, metadata, user_id: user?.id }]);
  };

  const { save, remove, updateStatus } = useCRUD(logAction);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar active={activeTab} setActive={setActiveTab as any} />
      
      <main className="flex-grow flex flex-col min-w-0 bg-[#fbfcfd]">
        <HeaderBar 
          active={activeTab} 
          refresh={loadData} 
          loading={isLoading}
          setModal={setModal}
        />

        <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
          {activeTab === 'orders' && <TableOrders data={enquiries} setModal={setModal} onRemove={(id) => remove('orders', id, 'order_id').then(() => loadData())} />}
          {activeTab === 'stock' && <TableProducts data={products} setModal={setModal} onRemove={(id) => remove('products', id).then(() => loadData())} />}
          {activeTab === 'suppliers' && <GridVendors data={vendors} setModal={setModal} onRemove={(id) => remove('vendors', id).then(() => loadData())} />}
          {activeTab === 'clients' && <TableCustomers data={customers} setModal={setModal} onRemove={(id) => remove('profiles', id).then(() => loadData())} />}
          {activeTab === 'books' && <LedgerTable data={ledger} />}
          {activeTab === 'logs' && <AuditLogPanel data={audit} />}
        </div>
      </main>

      {modal?.type === 'entity' && (
        <ModalEntityForm 
          modal={modal} 
          close={() => setModal(null)} 
          onSave={(payload) => save(modal.table, payload).then(() => { setModal(null); loadData(); })}
          logAction={logAction}
        />
      )}
      
      {modal?.type === 'items' && (
        <ModalOrderItems 
          modal={modal} 
          close={() => setModal(null)} 
          products={products}
          onSave={(payload) => save('orders', payload).then(() => { setModal(null); loadData(); })}
        />
      )}
      
      {modal?.type === 'status' && (
        <ModalStatus 
          modal={modal} 
          close={() => setModal(null)} 
          onUpdate={(id, status) => updateStatus(id, status).then(() => { setModal(null); loadData(); })}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
