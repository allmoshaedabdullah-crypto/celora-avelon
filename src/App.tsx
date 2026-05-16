import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Archive, 
  Image as ImageIcon, 
  LogOut,
  ChevronRight,
  Shirt,
  Box,
  Layers,
  Diamond,
  ArrowRight,
  Plus,
  Search,
  RefreshCw,
  MoreHorizontal,
  X,
  Upload,
  User,
  MapPin,
  Phone,
  Euro,
  Clipboard,
  Trash2,
  ExternalLink,
  Share2,
  Copy,
  CheckCircle2,
  ArrowLeft,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

import { supabase } from './lib/supabase';
import { 
  orderServices, 
  catalogServices, 
  galleryServices, 
  type Order, 
  type OrderStatus, 
  type CatalogFolder, 
  type CatalogImage,
  type GalleryFolder,
  type GalleryImage 
} from './services/supabaseService';

// --- Types & Interfaces ---
type Tab = 'executive' | 'celora_dress' | 'celora_shoes' | 'avelon_dress' | 'avelon_shoes' | 'global_catalog' | 'global_galleries';

// --- Constants & Initial Data ---
const BRAND_CONFIGS = {
  celora_dress: { name: 'Celora Dress', subtitle: "WOMEN'S FORMAL AND CASUAL WEAR", icon: Shirt },
  celora_shoes: { name: 'Celora Shoes', subtitle: 'ELEGANT FOOTWEAR COLLECTION', icon: Box },
  avelon_dress: { name: 'Avelon Dress', subtitle: 'PREMIUM DESIGNER DRESSES', icon: Layers },
  avelon_shoes: { name: 'Avelon Shoes', subtitle: 'LUXURY SHOE DESIGNS', icon: Diamond },
};

// --- Shared Specialized Components ---

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, onLogout }: { activeTab: Tab; setActiveTab: (t: Tab) => void; isOpen: boolean; setIsOpen: (b: boolean) => void; onLogout: () => void }) => {
  const mainItems: { id: Tab; icon: any; label: string }[] = [
    { id: 'executive', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'global_catalog', icon: Archive, label: 'Private Catalog' },
    { id: 'global_galleries', icon: ImageIcon, label: 'Customer Galleries' },
  ];

  const brandItems: { id: Tab; icon: any; label: string }[] = [
    { id: 'celora_dress', icon: Shirt, label: 'Celora Dress' },
    { id: 'celora_shoes', icon: Box, label: 'Celora Shoes' },
    { id: 'avelon_dress', icon: Layers, label: 'Avelon Dress' },
    { id: 'avelon_shoes', icon: Diamond, label: 'Avelon Shoes' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed lg:relative h-full bg-[#0a0a0a] flex flex-col text-white z-[100] transition-transform duration-500 w-72 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-10 pb-16 flex items-center justify-between lg:block">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-black tracking-tighter text-lg shadow-xl shadow-white/5">CA</div>
              <h1 className="luxury-heading text-2xl font-bold tracking-tighter leading-none">CELORA<br/><span className="text-[12px] opacity-40">& AVELON</span></h1>
            </div>
            <p className="text-technical mt-2 opacity-30 text-[9px]">LUXURY OPERATIONAL OS v3.5</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 bg-white/5 rounded-full">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-8 overflow-y-auto no-scrollbar">
          <div className="space-y-1">
            <p className="text-technical text-[8px] opacity-20 px-5 mb-4">PLATFORM CORE</p>
            {mainItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 text-[12px] transition-all duration-300 rounded-xl group",
                  activeTab === item.id 
                    ? "bg-white text-black" 
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50"
                )}
              >
                <item.icon size={16} strokeWidth={1.5} className={cn(activeTab === item.id ? "opacity-100" : "opacity-40 group-hover:opacity-100")} />
                <span className={cn(activeTab === item.id ? "font-semibold tracking-tight" : "font-light")}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <p className="text-technical text-[8px] opacity-20 px-5 mb-4">OPERATIONAL PORTS</p>
            {brandItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 text-[12px] transition-all duration-300 rounded-xl group",
                  activeTab === item.id 
                    ? "bg-white text-black" 
                    : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50"
                )}
              >
                <item.icon size={16} strokeWidth={1.5} className={cn(activeTab === item.id ? "opacity-100" : "opacity-40 group-hover:opacity-100")} />
                <span className={cn(activeTab === item.id ? "font-semibold tracking-tight" : "font-light")}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-10 shrink-0">
          <button 
            onClick={onLogout}
            className="flex items-center gap-4 px-5 py-3 text-neutral-500 hover:text-white transition-colors text-[12px] font-light w-full"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span>Internal Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[150] flex md:items-center justify-center p-0 md:p-6 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 100 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 100 }} 
          className="relative bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] overflow-hidden flex flex-col rounded-t-[40px] md:rounded-[48px]"
        >
          <div className="flex items-center justify-between p-6 md:p-10 border-b border-neutral-100">
            <h3 className="luxury-heading text-xl md:text-2xl">{title}</h3>
            <button onClick={onClose} className="p-3 hover:bg-neutral-50 rounded-full transition-colors">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-12 no-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Component Engines ---

const RegistryEngine = ({ brand, category, orders, setOrders, showToast, onSessionEnd }: { brand: 'Celora' | 'Avelon'; category: 'Dress' | 'Shoes'; orders: Order[]; setOrders: React.Dispatch<React.SetStateAction<Order[]>>; showToast: (m: string) => void; onSessionEnd: () => void }) => {
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('NEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  // Sync selectedOrder with global orders state for real-time updates
  const orderInDetail = useMemo(() => orders.find(o => o.id === selectedOrder?.id) || null, [orders, selectedOrder]);

  // Form State
  const [formData, setFormData] = useState({
    customerName: '',
    contact: '',
    facebookLink: '',
    location: '',
    description: '',
    shippingMark: '',
    amount: '' as string | number,
    paidAmount: '' as string | number,
    images: [] as string[],
  });

  const parseBulkText = (text: string) => {
    const lines = text.split('\n');
    const newValues: any = {};
    
    lines.forEach(line => {
      const lower = line.toLowerCase();
      if (lower.includes('name')) newValues.customerName = line.split(':')[1]?.trim() || line;
      if (lower.includes('phone') || lower.includes('contact')) newValues.contact = line.split(':')[1]?.trim() || line;
      if (lower.includes('location') || lower.includes('address')) newValues.location = line.split(':')[1]?.trim() || line;
      if (lower.includes('mark') || lower.includes('ship')) newValues.shippingMark = line.split(':')[1]?.trim() || line;
      if (lower.includes('fb') || lower.includes('facebook')) newValues.facebookLink = line.split(':')[1]?.trim() || line;
    });

    // Fallback simple regex for phone
    if (!newValues.contact) {
      const phoneMatch = text.match(/(?:\+?88)?01[3-9]\d{8}/);
      if (phoneMatch) newValues.contact = phoneMatch[0];
    }

    setFormData(prev => ({ ...prev, ...newValues }));
    showToast('SMART PARSER: AUTO-FILLED');
  };

  const dueAmount = useMemo(() => {
    if (formData.amount === '' && formData.paidAmount === '') return '';
    const total = typeof formData.amount === 'string' ? (parseFloat(formData.amount) || 0) : formData.amount;
    const paid = typeof formData.paidAmount === 'string' ? (parseFloat(formData.paidAmount) || 0) : formData.paidAmount;
    return total - paid;
  }, [formData.amount, formData.paidAmount]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const isCorrectCategory = o.brand === brand && o.category === category;
      const matchesStatus = o.status === activeStatus;
      const matchesSearch = (o.customerName || 'No Name').toLowerCase().includes(searchQuery.toLowerCase()) || 
                           o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return isCorrectCategory && matchesStatus && matchesSearch;
    });
  }, [orders, brand, category, activeStatus, searchQuery]);

  const totalDueOnStatus = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.amount - o.paidAmount), 0);
  }, [filteredOrders]);

  const openCreateModal = () => {
    setEditingOrder(null);
    setFormData({
      customerName: '',
      contact: '',
      facebookLink: '',
      location: '',
      description: '',
      shippingMark: '',
      amount: '',
      paidAmount: '',
      images: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      customerName: order.customerName,
      contact: order.contact,
      facebookLink: order.facebookLink,
      location: order.location,
      description: order.description,
      shippingMark: order.shippingMark,
      amount: order.amount || '',
      paidAmount: order.paidAmount || '',
      images: [...order.images],
    });
    setIsModalOpen(true);
    setSelectedOrder(null); 
  };

  const handleSaveOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dbOrder = await orderServices.save(
        { 
          ...formData as any, 
          amount: parseFloat(formData.amount.toString()) || 0,
          paidAmount: parseFloat(formData.paidAmount.toString()) || 0,
          id: editingOrder?.id, 
          brand, 
          category, 
          orderNumber: editingOrder?.orderNumber || `${brand.substring(0,2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`, 
          status: editingOrder?.status || 'NEW', 
          date: editingOrder?.date || new Date().toISOString().split('T')[0] 
        },
        editingOrder?.images || [],
        newFiles
      );
      
      // Refresh local state
      const updatedOrders = await orderServices.fetchAll();
      setOrders(updatedOrders);
      
      showToast(editingOrder ? 'ORDER UPDATED SUCCESSFULLY' : 'NEW ORDER REGISTERED');
      setIsModalOpen(false);
      setNewFiles([]);
    } catch (err: any) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        onSessionEnd();
        showToast('SESSION EXPIRED. PLEASE LOGIN.');
      } else {
        showToast('FAILED TO SAVE ORDER: ' + err.message);
      }
    }
  };

  const [newFiles, setNewFiles] = useState<(File | string)[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const addedFiles = Array.from(files);
    setNewFiles(prev => [...prev, ...addedFiles]);

    addedFiles.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async () => {
    if (orderToDelete) {
      try {
        await orderServices.delete(orderToDelete);
        setOrders(prev => prev.filter(o => o.id !== orderToDelete));
        setOrderToDelete(null);
        showToast('ORDER PERMANENTLY ARCHIVED');
      } catch (err: any) {
        if (err.message === 'AUTHENTICATION_REQUIRED') {
          onSessionEnd();
          showToast('SESSION EXPIRED');
        } else {
          showToast('DELETE FAILED: ' + err.message);
        }
      }
    }
  };

  const updateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
    try {
      await orderServices.updateStatus(orderId, nextStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
      showToast(`MOVED TO ${nextStatus}`);
    } catch (err: any) {
      if (err.message === 'AUTHENTICATION_REQUIRED') {
        onSessionEnd();
        showToast('SESSION EXPIRED');
      } else {
        showToast('STATUS UPDATE FAILED: ' + err.message);
      }
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
    setNewFiles(prev => prev.filter((_, i) => i !== (index - (editingOrder?.images?.length || 0))));
  };

  const confirmDelete = (id: string) => {
    setOrderToDelete(id);
    setSelectedOrder(null);
  };
  const copyDetailInfo = (order: Order) => {
    const info = `Order: ${order.orderNumber}\nClient: ${order.customerName || 'No Name'}\nFB: ${order.facebookLink || 'No FB'}\nContact: ${order.contact || 'No Contact'}\nStatus: ${order.status}\nValue: ৳${order.amount}\nPaid: ৳${order.paidAmount}\nDue: ৳${order.amount - order.paidAmount}\nLocation: ${order.location || 'No Location'}\nNote: ${order.description || 'No Note'}\nShip Mark: ${order.shippingMark || 'No Mark'}`;
    navigator.clipboard.writeText(info);
    showToast('OPERATIONAL DATA COPIED TO CLIPBOARD');
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-luxury-in pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 p-1 md:p-0">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <h2 className="luxury-heading text-3xl md:text-4xl italic">{brand} {category}</h2>
            <div className="bg-red-50 px-4 py-2 rounded-2xl border border-red-100/50">
               <p className="text-[9px] text-red-400 font-bold tracking-widest uppercase">Total Status Due</p>
               <p className="text-sm font-black text-red-600">৳{totalDueOnStatus.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-technical text-neutral-400">OPERATIONAL PORTAL / REGISTRY</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative group w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
            <input 
              type="text" 
              placeholder="Search registry..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-100 pl-11 pr-4 py-3.5 text-xs outline-none focus:border-black rounded-xl transition-all"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 text-xs font-bold tracking-widest rounded-xl hover:bg-neutral-800 transition-all shadow-xl shadow-black/5"
          >
            <Plus size={16} />
            CREATE ORDER
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between py-2 border-b border-neutral-100 -mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-6 md:gap-10 min-w-max">
          {(['NEW', 'PLACED', 'HOLD', 'DELIVERY'] as const).map((status) => (
            <button 
              key={status} 
              onClick={() => setActiveStatus(status)}
              className={cn(
                "text-technical whitespace-nowrap transition-all px-1 pb-4 -mb-[10px] text-[10px] md:text-xs",
                activeStatus === status ? "text-black border-b-2 border-black font-bold" : "text-neutral-300 hover:text-black"
              )}
            >
              {status} ({orders.filter(o => o.brand === brand && o.category === category && o.status === status).length})
            </button>
          ))}
        </div>
        <button className="hidden md:flex text-technical text-neutral-300 hover:text-black items-center gap-2 transition-colors whitespace-nowrap ml-4">
          <RefreshCw size={12} />
          SYNC WITH VAULT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const getNextStatus = (curr: OrderStatus): OrderStatus | null => {
                if (curr === 'NEW') return 'PLACED';
                if (curr === 'PLACED') return 'DELIVERY';
                return null;
              };
              const nextStatus = getNextStatus(order.status);

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedOrder(order)}
                  className="group bg-white border border-neutral-100 p-4 md:p-6 rounded-[24px] md:rounded-3xl hover:border-black transition-all cursor-pointer luxury-card relative flex flex-col justify-between h-full min-h-[160px]"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-technical text-[9px] text-neutral-300 font-bold uppercase tracking-widest">{order.orderNumber}</span>
                        <h4 className="luxury-heading text-[14px] md:text-lg font-bold truncate leading-tight">
                          {order.customerName || 'No Name'}
                        </h4>
                      </div>
                      <span className={cn(
                        "text-[8px] md:text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm",
                        order.status === 'NEW' ? "bg-black text-white" :
                        order.status === 'DELIVERY' ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-500"
                      )}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-neutral-50 rounded-xl overflow-hidden shrink-0 border border-neutral-100">
                        {order.images.length > 0 ? (
                          <img src={order.images[0]} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-200">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                         <div className="flex items-center justify-between">
                            <span className="text-[14px] font-bold">৳{(order.amount || 0).toLocaleString()}</span>
                            {order.shippingMark && <span className="text-[9px] bg-neutral-100 px-2 py-0.5 rounded opacity-60 uppercase">{order.shippingMark}</span>}
                         </div>
                         <p className="text-[10px] text-rose-500 font-bold">DUE ৳{(order.amount - order.paidAmount).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {nextStatus && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, nextStatus); }}
                      className="mt-4 w-full py-2 bg-neutral-50 hover:bg-black hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Process to {nextStatus}
                    </button>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full h-64 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-neutral-200 rounded-[40px]">
              <Archive size={48} strokeWidth={1} />
              <p className="luxury-heading text-xl mt-4 italic">No Records Found in Archive</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingOrder ? `Modify Registry: ${editingOrder.orderNumber}` : `New Registry: ${brand} Portfolio`}>
        <div className="mb-8 p-6 bg-neutral-50 rounded-[32px] border border-neutral-100">
          <label className="text-technical text-[10px] font-black tracking-widest text-neutral-400 uppercase mb-3 block">Smart Parser (Paste Raw Text to Auto-Fill)</label>
          <textarea 
            placeholder="Paste customer name, address, phone here..."
            className="w-full bg-white border-none rounded-2xl p-4 text-xs focus:ring-1 focus:ring-black/5 min-h-[80px] resize-none shadow-sm"
            onPaste={(e) => {
              const text = e.clipboardData.getData('text');
              if (text.length > 5) {
                parseBulkText(text);
              }
            }}
          />
          <p className="text-[9px] text-neutral-400 mt-2 italic px-1">Tip: Paste any text containing "Name:", "Contact:" etc. to auto-fill fields below.</p>
        </div>
        <form onSubmit={handleSaveOrder} className="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Product Media</label>
              <div className="grid grid-cols-2 gap-4">
                {formData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group/img">
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple 
                  accept="image/*"
                  className="hidden" 
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-100 rounded-2xl aspect-square flex flex-col items-center justify-center p-4 text-neutral-300 group hover:border-black transition-colors"
                >
                   <Plus size={24} strokeWidth={1} className="mb-2 group-hover:scale-110 transition-transform" />
                   <p className="text-technical text-[8px] text-center uppercase tracking-tighter">UPLOAD PHOTOS</p>
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Customer Identity</label>
                <input 
                  value={formData.customerName}
                  onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                  placeholder="Full Name"
                  className="w-full px-6 py-4 bg-neutral-50 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all text-sm" 
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Phone Number</label>
                  <input 
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    placeholder="+00 000 000 00"
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all text-sm" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Facebook Profile</label>
                  <input 
                    value={formData.facebookLink}
                    onChange={(e) => setFormData({...formData, facebookLink: e.target.value})}
                    placeholder="URL or handle"
                    className="w-full px-6 py-4 bg-neutral-50 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all text-sm" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 flex flex-col h-full">
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Address / Special Notes</label>
                <textarea 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  rows={2} 
                  placeholder="Customer address or specialized instructions..."
                  className="w-full px-6 py-4 bg-neutral-50 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all resize-none text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Product Description / Details</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3} 
                  placeholder="Material specs, sizing details, etc."
                  className="w-full px-6 py-4 bg-neutral-50 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all resize-none text-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Shipping Mark</label>
                <input 
                  value={formData.shippingMark}
                  onChange={(e) => setFormData({...formData, shippingMark: e.target.value})}
                  className="w-full px-6 py-4 bg-neutral-50 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all text-sm" 
                />
              </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Total Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">৳</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full pl-8 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all text-sm font-bold" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Advance</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">৳</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({...formData, paidAmount: e.target.value})}
                      className="w-full pl-8 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none focus:bg-white focus:ring-1 focus:ring-black transition-all text-sm font-bold text-green-600" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-technical text-neutral-400 text-[10px] font-bold tracking-widest uppercase">Due Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">৳</span>
                    <div className="w-full pl-8 pr-4 py-4 bg-neutral-100 rounded-2xl text-sm font-black text-red-600 min-h-[56px] flex items-center">
                      {dueAmount === '' ? '' : (typeof dueAmount === 'number' ? dueAmount.toLocaleString() : dueAmount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-black text-white py-6 rounded-3xl font-bold tracking-[0.2em] text-[11px] uppercase shadow-2xl shadow-black/20 hover:scale-[1.01] active:scale-[0.99] transition-transform">
              {editingOrder ? 'UPDATE REGISTRY ENTRY' : 'CONFIRM REGISTRY ENTRY'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Portal */}
      <AnimatePresence>
        {orderToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOrderToDelete(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white p-12 rounded-[48px] max-w-md w-full text-center space-y-8"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                <Trash2 size={40} strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h3 className="luxury-heading text-2xl">Delete Record?</h3>
                <p className="text-neutral-400 text-sm font-light">Are you sure you want to permanently remove this order from the archive? This action cannot be reversed.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setOrderToDelete(null)} className="py-4 border border-neutral-100 rounded-2xl text-xs font-bold tracking-widest hover:bg-neutral-50 transition-colors uppercase">Cancel</button>
                 <button onClick={handleDelete} className="py-4 bg-red-500 text-white rounded-2xl text-xs font-bold tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 uppercase">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Modal isOpen={!!orderInDetail} onClose={() => setSelectedOrder(null)} title={orderInDetail?.orderNumber ?? ''}>
        {orderInDetail && (
          <div className="relative pt-4 overflow-hidden">
            {/* Corner Quick Actions */}
            <div className="absolute top-0 right-0 flex gap-2 z-10">
              <button 
                onClick={() => openEditModal(orderInDetail)}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                title="Edit Record"
              >
                <ExternalLink size={16} />
              </button>
              <button 
                onClick={() => confirmDelete(orderInDetail.id)}
                className="w-10 h-10 bg-white border border-neutral-100 text-neutral-300 hover:text-red-500 hover:border-red-500 rounded-full flex items-center justify-center shadow-sm transition-all"
                title="Delete Record"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex flex-col items-center text-center space-y-8">
              {/* Compact Thumbnail Container */}
              <div className="space-y-4 w-full flex flex-col items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-neutral-50 rounded-[28px] overflow-hidden shadow-xl border-4 border-white flex items-center justify-center shrink-0">
                  {orderInDetail.images.length > 0 ? (
                    <img src={orderInDetail.images[0]} className="w-full h-full object-cover" alt="Primary" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-200">
                      <ImageIcon className="size-10" strokeWidth={1} />
                    </div>
                  )}
                </div>
                
                {orderInDetail.images.length > 1 && (
                  <div className="flex gap-1.5 justify-center overflow-x-auto no-scrollbar w-full px-4">
                    {orderInDetail.images.slice(1, 6).map((img, i) => (
                      <div key={i} className="w-8 h-8 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 shrink-0">
                        <img src={img} className="w-full h-full object-cover" alt="thumb" />
                      </div>
                    ))}
                    {orderInDetail.images.length > 6 && (
                      <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center text-[8px] font-bold text-neutral-400 border border-neutral-200 uppercase">
                        +{orderInDetail.images.length - 6}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Info Section - Immediately below Image */}
              <div className="space-y-6 w-full">
                <div className="space-y-1">
                  <span className="text-technical text-neutral-300 tracking-[0.3em] text-[9px] uppercase">Client Identity</span>
                  <div className="flex items-center justify-center gap-2 px-4 group/field">
                    <h3 className="luxury-heading text-2xl md:text-3xl italic leading-tight">{orderInDetail.customerName || 'No Name Archetype'}</h3>
                    <button onClick={() => { navigator.clipboard.writeText(orderInDetail.customerName); showToast('NAME COPIED'); }} className="text-neutral-700 hover:text-black transition-colors">
                      <Copy size={12} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center gap-2 group/field">
                    <p className="text-[10px] text-blue-500 font-medium break-all px-6">{orderInDetail.facebookLink || 'No Profile link'}</p>
                    {orderInDetail.facebookLink && (
                      <button onClick={() => { navigator.clipboard.writeText(orderInDetail.facebookLink); showToast('LINK COPIED'); }} className="text-neutral-700 hover:text-black transition-colors">
                        <Copy size={10} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6 text-neutral-500 border-y border-neutral-50 py-4">
                  <div className="flex items-center gap-2 text-[10px] group/field">
                    <MapPin size={12} className="shrink-0" /> 
                    <span>{orderInDetail.location || 'N/A'}</span>
                    <button onClick={() => { navigator.clipboard.writeText(orderInDetail.location); showToast('LOCATION COPIED'); }} className="text-neutral-700 hover:text-black transition-colors">
                      <Copy size={10} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] group/field">
                    <Phone size={12} className="shrink-0" /> 
                    <span>{orderInDetail.contact || 'N/A'}</span>
                    <button onClick={() => { navigator.clipboard.writeText(orderInDetail.contact); showToast('CONTACT COPIED'); }} className="text-neutral-700 hover:text-black transition-colors">
                      <Copy size={10} />
                    </button>
                  </div>
                </div>

                {/* Integrated Product Details */}
                <div className="space-y-4 px-6 text-center">
                  <div className="bg-black text-white inline-block px-4 py-1.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase">
                    MARK: {orderInDetail.shippingMark || 'UNMARKED'}
                  </div>
                  <div className="relative group/field">
                    <p className="text-xs text-neutral-500 leading-relaxed font-light italic max-w-sm mx-auto">
                      "{orderInDetail.description || 'No additional internal notes for this record.'}"
                    </p>
                    <button onClick={() => { navigator.clipboard.writeText(orderInDetail.description); showToast('NOTES COPIED'); }} className="absolute -top-4 -right-2 text-neutral-700 hover:text-black transition-all">
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Section - Below Details */}
              <div className="w-full bg-neutral-50/50 p-6 rounded-[32px] border border-neutral-100/50 space-y-4">
                 <p className="text-technical text-neutral-400 font-bold tracking-widest uppercase text-[9px]">Workflow Management</p>
                 <div className="grid grid-cols-2 xs:flex flex-wrap lg:flex-nowrap justify-center gap-2">
                   {(['NEW', 'PLACED', 'HOLD', 'DELIVERY'] as OrderStatus[]).map(s => (
                     <button 
                       key={s}
                       onClick={(e) => { e.stopPropagation(); updateOrderStatus(orderInDetail.id, s); }}
                       className={cn(
                         "flex-1 min-w-[70px] py-3 text-[9px] font-bold tracking-tighter border rounded-xl transition-all uppercase",
                         orderInDetail.status === s ? "bg-black border-black text-white shadow-lg scale-[1.05]" : "bg-white border-neutral-200 text-neutral-300 hover:border-black hover:text-black"
                       )}
                     >
                       {s}
                     </button>
                   ))}
                 </div>
              </div>

              {/* Financial Section */}
              <div className="w-full max-w-sm mx-auto">
                <div className="space-y-3">
                  <p className="text-technical text-neutral-400 font-bold tracking-widest uppercase text-[9px]">Financial Audit</p>
                  <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-[10px] opacity-60">
                      <span>TOTAL CONTRACT</span>
                      <span className="font-bold">৳{(orderInDetail.amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600 text-[10px]">
                      <span>SETTLED</span>
                      <span className="font-bold">-৳{(orderInDetail.paidAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-50 flex justify-between items-center">
                      <span className="text-[10px] font-bold">BALANCE DUE</span>
                      <span className="text-lg font-bold text-red-600 italic">৳{(orderInDetail.amount - orderInDetail.paidAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- Executive Dash ---

const DashboardView = ({ setActiveTab }: { setActiveTab: (t: Tab) => void }) => (
  <div className="max-w-7xl mx-auto space-y-12 md:space-y-24 animate-luxury-in pb-20">
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center font-black tracking-tighter text-xl shadow-xl">CA</div>
        <div className="h-0.5 w-12 bg-black/10" />
      </div>
      <div className="space-y-2">
        <h2 className="luxury-heading text-3xl md:text-5xl font-medium tracking-tight">Executive Suite</h2>
        <p className="text-technical text-neutral-400 opacity-40">CELORA & AVELON GLOBAL OPERATIONAL DASHBOARD</p>
      </div>
    </div>

    {/* Port Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
      {Object.entries(BRAND_CONFIGS).map(([id, config]) => (
        <motion.div 
          key={id}
          whileHover={{ y: -8, scale: 1.01 }}
          onClick={() => setActiveTab(id as Tab)}
          className="bg-white border border-neutral-100 p-8 md:p-10 rounded-[32px] md:rounded-[48px] luxury-glow group cursor-pointer h-full flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-neutral-50 rounded-[15px] md:rounded-[20px] flex items-center justify-center mb-8 md:mb-12 group-hover:bg-black group-hover:text-white transition-all duration-700">
               <config.icon size={24} strokeWidth={1} />
            </div>
            <h3 className="luxury-heading text-xl md:text-2xl mb-3">{config.name}</h3>
            <p className="text-technical text-neutral-300 text-[8px] leading-relaxed max-w-[140px] italic">{config.subtitle}</p>
          </div>
          <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-neutral-50 flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-300 group-hover:text-black transition-colors">ACCESS PORTAL</span>
            <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500" />
          </div>
        </motion.div>
      ))}
    </div>

    {/* Feature Vaults */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
      <motion.div 
        whileHover={{ scale: 1.005 }}
        onClick={() => setActiveTab('global_catalog')}
        className="relative bg-[#0a0a0a] rounded-[40px] md:rounded-[56px] p-10 md:p-16 text-white overflow-hidden luxury-glow group min-h-[400px] md:min-h-[500px] flex flex-col cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-white/5 blur-[100px] md:blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
        <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
           <RefreshCw size={80} strokeWidth={0.5} className="md:size-[120px] opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />
        </div>
        
        <div className="relative z-10 space-y-3 mb-12 md:mb-16">
          <span className="text-technical text-white/30 tracking-[0.3em]">VAULT_ACCESS</span>
          <h3 className="luxury-heading text-3xl md:text-4xl font-medium italic">Private Catalog</h3>
        </div>
        
        <p className="relative z-10 text-neutral-400 font-light text-base md:text-lg leading-relaxed max-w-sm mb-auto opacity-60">
          Secure SKU management with internal pricing metrics and material specifications.
        </p>

        <button className="relative z-10 self-start group-hover:bg-white group-hover:text-black bg-transparent border border-white/20 px-8 md:px-12 py-4 md:py-6 text-[10px] md:text-xs font-bold tracking-[0.3em] rounded-full transition-all duration-700">
          EXPLORE INVENTORY
        </button>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.005 }}
        onClick={() => setActiveTab('global_galleries')}
        className="relative bg-white border border-neutral-100 rounded-[40px] md:rounded-[56px] p-10 md:p-16 overflow-hidden group min-h-[400px] md:min-h-[500px] flex flex-col cursor-pointer"
      >
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity duration-1000 rotate-12">
          <Diamond size={300} className="md:size-[600px]" strokeWidth={0.5} />
        </div>

        <div className="relative z-10 space-y-3 mb-12 md:mb-16">
          <span className="text-technical text-neutral-400 tracking-[0.3em]">SHOWROOM_SYSTEM</span>
          <h3 className="luxury-heading text-3xl md:text-4xl font-medium italic">Client Galleries</h3>
        </div>
        
        <p className="relative z-10 text-neutral-500 font-light text-base md:text-lg leading-relaxed max-w-sm mb-auto opacity-70">
          Curate high-end shared collections for clients with automated shareable URLs.
        </p>

        <button className="relative z-10 self-start border border-black text-black px-8 md:px-12 py-4 md:py-6 text-[10px] md:text-xs font-bold tracking-[0.3em] rounded-full hover:bg-black hover:text-white transition-all duration-700 group-hover:scale-105">
          DISTRIBUTE ASSETS
        </button>
      </motion.div>
    </div>
  </div>
);

// --- Sub-Engines ---

const CatalogEngine = ({ folders, setFolders, showToast, onSessionEnd }: { folders: CatalogFolder[]; setFolders: React.Dispatch<React.SetStateAction<CatalogFolder[]>>; showToast: (m: string) => void; onSessionEnd: () => void }) => {
  const [pendingUploads, setPendingUploads] = useState<CatalogImage[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<CatalogFolder | null>(null);
  const [editingImage, setEditingImage] = useState<{folderId: string, image: CatalogImage} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [folderName, setFolderName] = useState('');
  const [imageForm, setImageForm] = useState({
    price: '',
    size: '',
    url: ''
  });

  const activeFolder = useMemo(() => folders.find(f => f.id === activeFolderId), [folders, activeFolderId]);

  const filteredFolders = useMemo(() => {
    return folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [folders, searchQuery]);

  // Folder Operations
  const handleFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await catalogServices.saveFolder(folderName, editingFolder?.id);
      const updated = await catalogServices.fetchFolders();
      setFolders(updated);
      showToast(editingFolder ? 'FOLDER UPDATED' : 'FOLDER CREATED');
      setIsFolderModalOpen(false);
      setFolderName('');
      setEditingFolder(null);
    } catch (err: any) {
      showToast('ERROR: ' + err.message);
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await catalogServices.deleteFolder(id);
      setFolders(prev => prev.filter(f => f.id !== id));
      showToast('FOLDER DELETED');
      if (activeFolderId === id) setActiveFolderId(null);
    } catch (err: any) {
      showToast('ERROR: ' + err.message);
    }
  };

  // Image Operations
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !activeFolderId) return;
    const fileList = Array.from(files);
    
    setUploadingFiles(fileList);
    setPendingUploads(fileList.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(f as Blob),
      price: '',
      size: '',
      folder_id: activeFolderId
    })));
    setIsUploadModalOpen(true);
    if (e.target) e.target.value = '';
  };

  const confirmUpload = async () => {
    if (!activeFolderId) return;
    try {
      await Promise.all(pendingUploads.map((item, idx) => 
        catalogServices.addImage(activeFolderId, uploadingFiles[idx], item.price, item.size)
      ));
      const updated = await catalogServices.fetchFolders();
      setFolders(updated);
      setPendingUploads([]);
      setUploadingFiles([]);
      setIsUploadModalOpen(false);
      showToast(`${pendingUploads.length} ASSETS ADDED TO CATALOG`);
    } catch (err: any) {
      showToast('UPLOAD FAILED: ' + err.message);
    }
  };

  const updatePendingItem = (id: string, field: 'price' | 'size', value: string) => {
    setPendingUploads(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const updateImageMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      await catalogServices.updateImage(editingImage.image.id, imageForm.price, imageForm.size, selectedFile || undefined);
      const updated = await catalogServices.fetchFolders();
      setFolders(updated);
      showToast('IMAGE UPDATED');
      setIsImageModalOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      showToast('ERROR: ' + err.message);
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleReplaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImageForm(prev => ({ ...prev, url: URL.createObjectURL(file as Blob) }));
  };

  const deleteImage = async (folderId: string, imageId: string) => {
    try {
      await catalogServices.deleteImage(imageId);
      setFolders(prev => prev.map(f => f.id === folderId ? { ...f, images: f.images.filter(img => img.id !== imageId) } : f));
      showToast('IMAGE REMOVED');
    } catch (err: any) {
      showToast('ERROR: ' + err.message);
    }
  };

  if (activeFolderId && activeFolder) {
    return (
      <div className="space-y-8 animate-luxury-in pb-20 px-4 md:px-0">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setActiveFolderId(null)} className="p-3 bg-neutral-50 rounded-2xl hover:bg-black hover:text-white transition-all">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="luxury-heading text-2xl md:text-3xl italic">{activeFolder.name}</h2>
            <p className="text-technical text-neutral-400">FOLDER VAULT / {activeFolder.images.length} ASSETS</p>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="ml-auto bg-black text-white px-6 py-3 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center gap-2">
            <Plus size={14} /> ADD ASSETS
          </button>
          <input type="file" multiple hidden ref={fileInputRef} onChange={handleBulkUpload} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {activeFolder.images.map(img => (
              <motion.div
                layout
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  setEditingImage({ folderId: activeFolder.id, image: img });
                  setImageForm({ price: img.price, size: img.size, url: img.url });
                  setIsImageModalOpen(true);
                }}
                className="group bg-white border border-neutral-100 p-2 rounded-[24px] hover:shadow-xl transition-all relative cursor-pointer"
              >
                <div className="aspect-[3/4] bg-neutral-50 rounded-2xl overflow-hidden mb-3 relative">
                  <img src={img.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <div 
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-110 transition-all pointer-events-none"
                    >
                      <Edit2 size={16} />
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteImage(activeFolder.id, img.id); }} 
                      className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all relative z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="px-2 pb-1 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] font-black">{img.price ? `৳${img.price}` : 'No Price'}</p>
                    <p className="text-[9px] bg-neutral-50 px-2 py-0.5 rounded text-neutral-400 font-bold uppercase">{img.size || 'No Size'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {activeFolder.images.length === 0 && (
            <div className="col-span-full h-40 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-neutral-200 rounded-[32px]">
              <ImageIcon size={32} strokeWidth={1} />
              <p className="text-[10px] mt-2 font-bold tracking-widest uppercase">Folder is Empty</p>
            </div>
          )}
        </div>

        <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} title="Edit Asset Info">
          <form onSubmit={updateImageMetadata} className="space-y-8">
            <div className="relative group/editimg max-w-[200px] mx-auto rounded-2xl overflow-hidden bg-neutral-50 shadow-lg">
              <img src={imageForm.url} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => handleReplaceImage(e as any);
                  input.click();
                }}
                className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover/editimg:opacity-100 transition-opacity gap-2"
              >
                <Upload size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Replace Photo</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-technical text-[9px] text-neutral-400 font-bold uppercase tracking-widest">Price (৳)</label>
                <input value={imageForm.price} onChange={e => setImageForm({...imageForm, price: e.target.value})} className="w-full px-5 py-4 bg-neutral-50 rounded-2xl text-sm" placeholder="e.g. 5500" />
              </div>
              <div className="space-y-2">
                <label className="text-technical text-[9px] text-neutral-400 font-bold uppercase tracking-widest">Size Options</label>
                <input value={imageForm.size} onChange={e => setImageForm({...imageForm, size: e.target.value})} className="w-full px-5 py-4 bg-neutral-50 rounded-2xl text-sm" placeholder="e.g. 36-40 or M,L,XL" />
              </div>
            </div>
            <button className="w-full bg-black text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-xs">SAVE METADATA</button>
          </form>
        </Modal>

        <Modal isOpen={isUploadModalOpen} onClose={() => { setPendingUploads([]); setIsUploadModalOpen(false); }} title={`Complete SKU Details (${pendingUploads.length})`}>
          <div className="space-y-10 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            {pendingUploads.map((item, idx) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-6 p-4 bg-neutral-50 rounded-[32px] border border-neutral-100 animate-luxury-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="w-32 h-40 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm">
                  <img src={item.url} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-technical text-[8px] text-neutral-400 font-bold uppercase tracking-widest">Pricing ৳</label>
                        <input 
                          type="number"
                          value={item.price} 
                          onChange={(e) => updatePendingItem(item.id, 'price', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl text-xs outline-none focus:border-black"
                          placeholder="Amount"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-technical text-[8px] text-neutral-400 font-bold uppercase tracking-widest">Size Options</label>
                        <input 
                          value={item.size} 
                          onChange={(e) => updatePendingItem(item.id, 'size', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl text-xs outline-none focus:border-black"
                          placeholder="XL, 38-42 etc"
                        />
                      </div>
                   </div>
                   <button 
                     type="button" 
                     onClick={() => setPendingUploads(prev => prev.filter(p => p.id !== item.id))}
                     className="text-[8px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                   >
                     Remove from batch
                   </button>
                </div>
              </div>
            ))}
            {pendingUploads.length === 0 && (
              <div className="h-40 flex items-center justify-center text-neutral-300 italic text-sm">All items removed.</div>
            )}
            <div className="sticky bottom-0 bg-neutral-50 pt-6 border-t border-neutral-100 mt-8">
              <button 
                onClick={confirmUpload}
                disabled={pendingUploads.length === 0}
                className="w-full bg-black text-white py-5 rounded-2xl font-black tracking-[0.3em] uppercase text-[10px] shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-30"
              >
                COMMIT {pendingUploads.length} ITEMS TO CATALOG
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-luxury-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 p-4 md:p-0">
        <div className="space-y-2">
          <h2 className="luxury-heading text-3xl md:text-4xl italic">Private Catalog</h2>
          <p className="text-technical text-neutral-400">UNIFIED MASTER FOLDER REGISTRY</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
            <input 
              type="text" 
              placeholder="Search folders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-100 pl-11 pr-4 py-3.5 text-xs outline-none focus:border-black rounded-xl"
            />
          </div>
          <button onClick={() => { setEditingFolder(null); setFolderName(''); setIsFolderModalOpen(true); }} className="bg-black text-white px-8 py-3.5 text-xs font-bold tracking-widest rounded-xl flex items-center justify-center gap-2">
            <Plus size={16} /> NEW FOLDER
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 md:gap-8 px-4 md:px-0">
        <AnimatePresence>
          {filteredFolders.map(f => (
            <motion.div
              layout
              key={f.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group flex flex-col items-center gap-2 cursor-pointer relative"
            >
              <div 
                onClick={() => setActiveFolderId(f.id)}
                className="w-full aspect-square bg-white border border-neutral-100 rounded-[20px] md:rounded-[32px] flex items-center justify-center relative overflow-hidden group-hover:shadow-2xl transition-all"
              >
                {f.images[0] ? (
                  <img src={f.images[0].url} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Layers size={32} className="text-neutral-100" />
                )}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Archive size={20} className="text-neutral-200 group-hover:scale-125 transition-transform" />
                </div>
              </div>
              <div className="text-center w-full">
                <p className="luxury-heading text-[10px] md:text-sm truncate px-1">{f.name}</p>
                <p className="text-[8px] text-neutral-300 font-bold">{f.images.length} ITEMS</p>
              </div>
              
              {/* Folder Actions */}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFolder(f);
                    setFolderName(f.name);
                    setIsFolderModalOpen(true);
                  }}
                  className="p-1.5 bg-black text-white rounded-full shadow-lg"
                >
                  <Plus size={10} />
                </button>
                <button 
                   onClick={(e) => { e.stopPropagation(); deleteFolder(f.id); }}
                   className="p-1.5 bg-red-500 text-white rounded-full shadow-lg"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} title={editingFolder ? 'Update Folder Name' : 'Create New Folder'}>
        <form onSubmit={handleFolderSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-technical text-[9px] text-neutral-400 font-bold uppercase tracking-widest">FOLDER IDENTITY</label>
            <input required value={folderName} onChange={e => setFolderName(e.target.value)} className="w-full px-5 py-4 bg-neutral-50 rounded-2xl text-sm" placeholder="e.g. New Summer Arrival" />
          </div>
          <button className="w-full bg-black text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-xs">
            {editingFolder ? 'RENAME FOLDER' : 'CREATE FOLDER'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

const GalleryEngine = ({ folders, setFolders, showToast, onSessionEnd }: { folders: GalleryFolder[]; setFolders: React.Dispatch<React.SetStateAction<GalleryFolder[]>>; showToast: (m: string) => void; onSessionEnd: () => void }) => {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<GalleryFolder | null>(null);
  const [editingImage, setEditingImage] = useState<{folderId: string, image: GalleryImage} | null>(null);
  const [pendingUploads, setPendingUploads] = useState<GalleryImage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [folderName, setFolderName] = useState('');
  const [imageForm, setImageForm] = useState({
    size: '',
    url: ''
  });

  const activeFolder = useMemo(() => folders.find(f => f.id === activeFolderId), [folders, activeFolderId]);

  const filteredFolders = useMemo(() => {
    return folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [folders, searchQuery]);

  const handleFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await galleryServices.saveFolder(folderName, editingFolder?.id);
      const updated = await galleryServices.fetchFolders();
      setFolders(updated);
      showToast(editingFolder ? 'GALLERY UPDATED' : 'GALLERY FOLDER CREATED');
      setIsFolderModalOpen(false);
      setFolderName('');
      setEditingFolder(null);
    } catch (err: any) {
      showToast('ERROR: ' + err.message);
    }
  };

  const deleteFolder = async (id: string) => {
    try {
      await galleryServices.deleteFolder(id);
      setFolders(prev => prev.filter(f => f.id !== id));
      showToast('GALLERY DELETED');
      if (activeFolderId === id) setActiveFolderId(null);
    } catch (err: any) {
      showToast('ERROR: ' + err.message);
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !activeFolderId) return;
    const fileList = Array.from(files);
    
    setUploadingFiles(fileList);
    setPendingUploads(fileList.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(f as Blob),
      size: '',
      folder_id: activeFolderId
    })));
    setIsUploadModalOpen(true);
    if (e.target) e.target.value = '';
  };

  const confirmUpload = async () => {
    if (!activeFolderId) return;
    try {
      await Promise.all(pendingUploads.map((item, idx) => 
        galleryServices.addImage(activeFolderId, uploadingFiles[idx], item.size)
      ));
      const updated = await galleryServices.fetchFolders();
      setFolders(updated);
      setPendingUploads([]);
      setUploadingFiles([]);
      setIsUploadModalOpen(false);
      showToast(`${pendingUploads.length} ASSETS ADDED TO GALLERY`);
    } catch (err: any) {
      showToast('UPLOAD FAILED: ' + err.message);
    }
  };

  const updatePendingItem = (id: string, field: 'size', value: string) => {
    setPendingUploads(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const updateImageMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    try {
      await galleryServices.updateImage(editingImage.image.id, imageForm.size, selectedFile || undefined);
      const updated = await galleryServices.fetchFolders();
      setFolders(updated);
      showToast('ASSET UPDATED');
      setIsImageModalOpen(false);
      setSelectedFile(null);
    } catch (err: any) {
      showToast('ERROR: ' + err.message);
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleReplaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setImageForm(prev => ({ ...prev, url: URL.createObjectURL(file as Blob) }));
  };

  const deleteImage = async (folderId: string, imageId: string) => {
    try {
      await galleryServices.deleteImage(imageId);
      setFolders(prev => prev.map(f => f.id === folderId ? { ...f, images: f.images.filter(img => img.id !== imageId) } : f));
      showToast('ASSET REMOVED');
    } catch (err: any) {
      showToast('ERROR: ' + err.message);
    }
  };

  const shareGalleryLink = async (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('view', 'gallery');
    url.searchParams.set('gid', id);
    const finalUrl = url.toString();

    const copyToClipboard = async (text: string) => {
      try {
        // Try to regain focus if lost
        window.focus();
        await navigator.clipboard.writeText(text);
        showToast('LINK COPIED TO CLIPBOARD');
      } catch (err) {
        console.error('Clipboard error:', err);
        // Extreme fallback for older/restricted browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          showToast('LINK COPIED');
        } catch (copyErr) {
          showToast('UNABLE TO COPY LINK');
        }
        document.body.removeChild(textArea);
      }
    };

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'CA Showroom Access',
          text: 'View our exclusive collection portfolio.',
          url: finalUrl,
        });
      } catch (err: any) {
        // If user cancelled, don't show error, but if it failed technically, fallback
        if (err.name !== 'AbortError') {
          await copyToClipboard(finalUrl);
        }
      }
    } else {
      await copyToClipboard(finalUrl);
    }
  };

  if (activeFolderId && activeFolder) {
    return (
      <div className="space-y-6 md:space-y-8 animate-luxury-in pb-20 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveFolderId(null)} className="p-3 bg-neutral-50 rounded-2xl hover:bg-black hover:text-white transition-all shrink-0">
              <ArrowLeft size={18} />
            </button>
            <div className="min-w-0">
              <h2 className="luxury-heading text-lg md:text-3xl italic truncate">{activeFolder.name}</h2>
              <p className="text-technical text-neutral-400 text-[10px]">CLIENT SHOWROOM / {activeFolder.images.length} ASSETS</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto md:ml-auto">
            <button onClick={() => shareGalleryLink(activeFolder.id)} className="flex-1 md:flex-none bg-neutral-50 text-black px-4 md:px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 border border-neutral-100 hover:bg-black hover:text-white transition-all shadow-sm">
              <Share2 size={12} /> <span className="hidden sm:inline">SHARE LINK</span><span className="sm:hidden">SHARE</span>
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex-1 md:flex-none bg-black text-white px-4 md:px-6 py-3 rounded-xl text-[9px] md:text-[10px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 shadow-xl shadow-black/10">
              <Plus size={12} /> <span className="hidden sm:inline">ADD ASSETS</span><span className="sm:hidden">ADD</span>
            </button>
          </div>
          <input type="file" multiple hidden ref={fileInputRef} onChange={handleBulkUpload} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          <AnimatePresence>
            {activeFolder.images.map(img => (
              <motion.div
                layout
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  setEditingImage({ folderId: activeFolder.id, image: img });
                  setImageForm({ size: img.size, url: img.url });
                  setIsImageModalOpen(true);
                }}
                className="group bg-white border border-neutral-100 p-1.5 md:p-2 rounded-[20px] md:rounded-[24px] hover:shadow-xl transition-all relative cursor-pointer"
              >
                <div className="aspect-[3/4] bg-neutral-50 rounded-xl md:rounded-2xl overflow-hidden mb-2 relative">
                  <img src={img.url} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-black">
                      <Edit2 size={14} className="md:size-4" />
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteImage(activeFolder.id, img.id); }} 
                      className="w-8 h-8 md:w-10 md:h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-all"
                    >
                      <Trash2 size={14} className="md:size-4" />
                    </button>
                  </div>
                </div>
                <div className="px-1 pb-1">
                    <p className="text-[9px] md:text-[10px] bg-neutral-50 px-1 py-1 rounded-lg text-neutral-400 font-bold uppercase text-center truncate">{img.size || 'No Size'}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {activeFolder.images.length === 0 && (
            <div className="col-span-full h-40 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-neutral-200 rounded-[32px]">
              <ImageIcon size={32} strokeWidth={1} />
              <p className="text-[10px] mt-2 font-bold tracking-widest uppercase">No assets in showroom</p>
            </div>
          )}
        </div>

        <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} title="Edit Asset Meta">
          <form onSubmit={updateImageMetadata} className="space-y-8">
            <div className="relative group/editimg max-w-[200px] mx-auto rounded-2xl overflow-hidden bg-neutral-50 shadow-lg">
              <img src={imageForm.url} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => handleReplaceImage(e as any);
                  input.click();
                }}
                className="absolute inset-0 bg-black/60 text-white flex flex-col items-center justify-center opacity-0 group-hover/editimg:opacity-100 transition-opacity gap-2"
              >
                <Upload size={24} />
                <span className="text-[10px] font-bold tracking-widest uppercase">Replace Photo</span>
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-technical text-[9px] text-neutral-400 font-bold uppercase tracking-widest">Available Sizes</label>
              <input value={imageForm.size} onChange={e => setImageForm({...imageForm, size: e.target.value})} className="w-full px-5 py-4 bg-neutral-50 rounded-2xl text-sm" placeholder="e.g. 36-40, S, M, L" />
            </div>
            <button className="w-full bg-black text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-xs">UPDATE METADATA</button>
          </form>
        </Modal>

        <Modal isOpen={isUploadModalOpen} onClose={() => { setPendingUploads([]); setIsUploadModalOpen(false); }} title={`Showroom Preparation (${pendingUploads.length})`}>
          <div className="space-y-10 max-h-[70vh] overflow-y-auto pr-4 custom-scrollbar">
            {pendingUploads.map((item, idx) => (
              <div key={item.id} className="flex flex-col md:flex-row gap-6 p-4 bg-neutral-50 rounded-[32px] border border-neutral-100">
                <div className="w-32 h-44 bg-white rounded-2xl overflow-hidden shrink-0 shadow-sm">
                  <img src={item.url} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-6 flex flex-col justify-center">
                    <div className="space-y-2">
                      <label className="text-technical text-[8px] text-neutral-400 font-bold uppercase tracking-widest">Sizing Info</label>
                      <input 
                        value={item.size} 
                        onChange={(e) => updatePendingItem(item.id, 'size', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-neutral-100 rounded-xl text-xs outline-none focus:border-black"
                        placeholder="M, L, XL or 36-40"
                      />
                    </div>
                   <button 
                     type="button" 
                     onClick={() => setPendingUploads(prev => prev.filter(p => p.id !== item.id))}
                     className="self-start text-[8px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                   >
                     Exclude Item
                   </button>
                </div>
              </div>
            ))}
            <div className="sticky bottom-0 bg-neutral-50 pt-6 border-t border-neutral-100 mt-8">
              <button 
                onClick={confirmUpload}
                disabled={pendingUploads.length === 0}
                className="w-full bg-black text-white py-5 rounded-2xl font-black tracking-[0.3em] uppercase text-[10px] shadow-2xl disabled:opacity-30"
              >
                PUBLISH {pendingUploads.length} ASSETS TO SHOWROOM
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 animate-luxury-in pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 p-2 md:p-0">
        <div className="space-y-2">
          <h2 className="luxury-heading text-2xl md:text-4xl italic">Customer Showrooms</h2>
          <p className="text-technical text-neutral-400 text-[10px] md:text-xs">ELEGANT CLIENT-FACING ASSET DISTRIBUTIONS</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center w-full md:w-auto">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={14} />
            <input 
              type="text" 
              placeholder="Search showrooms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-100 pl-11 pr-4 py-3.5 text-xs outline-none focus:border-black rounded-xl"
            />
          </div>
          <button onClick={() => { setEditingFolder(null); setFolderName(''); setIsFolderModalOpen(true); }} className="bg-black text-white px-8 py-3.5 text-xs font-bold tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-black/10">
            <Plus size={16} /> <span className="whitespace-nowrap uppercase">NEW SHOWROOM</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-6">
        <AnimatePresence>
          {filteredFolders.map(f => (
            <motion.div
              layout
              key={f.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group flex flex-col items-center gap-2 md:gap-4 cursor-pointer relative"
              onClick={() => setActiveFolderId(f.id)}
            >
              <div 
                className="w-full aspect-[4/5] bg-white border border-neutral-100 rounded-[24px] md:rounded-[32px] flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all"
              >
                {f.images[0] ? (
                  <img src={f.images[0].url} className="w-full h-full object-cover transition-all duration-700" />
                ) : (
                  <ImageIcon size={32} className="text-neutral-50" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-center w-full px-1">
                <p className="luxury-heading text-sm md:text-base truncate mb-0.5">{f.name}</p>
                <p className="text-[8px] md:text-[10px] text-neutral-400 font-bold tracking-widest uppercase">{f.images.length} TOTAL ASSETS</p>
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingFolder(f);
                    setFolderName(f.name);
                    setIsFolderModalOpen(true);
                  }}
                  className="p-2 bg-white text-black rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                   onClick={(e) => { e.stopPropagation(); deleteFolder(f.id); }}
                   className="p-2 bg-red-500 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} title={editingFolder ? 'Rename Showroom' : 'New Client Showroom'}>
        <form onSubmit={handleFolderSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-technical text-[9px] text-neutral-400 font-bold uppercase tracking-widest">SHOWROOM DESCRIPTOR</label>
            <input required value={folderName} onChange={e => setFolderName(e.target.value)} className="w-full px-5 py-4 bg-neutral-50 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-black" placeholder="e.g. Master Collection Spring 2024" />
          </div>
          <button className="w-full bg-black text-white py-5 rounded-2xl font-bold tracking-widest uppercase text-xs">
            {editingFolder ? 'RENAME SHOWROOM' : 'CREATE SHOWROOM'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

const PublicGalleryView = () => {
  const [folder, setFolder] = useState<GalleryFolder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const activeFolderId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('gid');
  }, []);

  useEffect(() => {
    if (activeFolderId) {
      galleryServices.fetchFolderById(activeFolderId)
        .then(data => setFolder(data))
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [activeFolderId]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <RefreshCw className="animate-spin text-neutral-200" size={32} />
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-8 text-center space-y-4">
        <ImageIcon size={64} strokeWidth={1} className="text-neutral-200" />
        <h2 className="luxury-heading text-2xl">Showroom Not Found</h2>
        <p className="text-neutral-400 font-light max-w-xs">The link you followed may have expired or the collection was moved to the private archive.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto no-scrollbar selection:bg-black selection:text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 space-y-24 md:space-y-40">
        <header className="space-y-8 text-center">
           <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black tracking-tighter text-xl mx-auto mb-8 shadow-xl">CA</div>
           <p className="text-technical text-[10px] tracking-[0.4em] opacity-30 uppercase">Exclusive Showroom Access</p>
           <h1 className="luxury-heading text-4xl md:text-8xl italic leading-[1.1] tracking-tighter">{folder.name}</h1>
           <div className="w-px h-24 bg-neutral-100 mx-auto" />
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {(folder.images || []).map((img, i) => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="group space-y-6"
            >
              <div className="aspect-[3/4] bg-neutral-50 rounded-[40px] overflow-hidden relative shadow-sm group-hover:shadow-2xl transition-all duration-700">
                <img 
                  src={img.url} 
                  className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-all duration-1000" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
              </div>
              <div className="px-8 flex justify-between items-center">
                <span className="text-technical text-[9px] text-neutral-300 font-black tracking-widest uppercase leading-none">CA PORTFOLIO</span>
                {img.size && (
                  <span className="text-[10px] bg-neutral-50 px-3 py-1 rounded-full font-bold uppercase leading-none">{img.size}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

         <footer className="pt-40 pb-20 border-t border-neutral-50 flex flex-col items-center space-y-6 text-center">
            <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black tracking-tighter text-xl shadow-2xl">CA</div>
            <h4 className="luxury-heading text-2xl font-bold tracking-tighter">CELORA & AVELON</h4>
           <div className="space-y-1">
             <p className="text-technical text-[9px] opacity-30 italic">Curated Digital Experience Platform</p>
             <p className="text-technical text-[8px] opacity-20 tracking-widest uppercase">Private Distribution Node © 2024</p>
           </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('executive');
  const [session, setSession] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [folders, setFolders] = useState<CatalogFolder[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [galleries, setGalleries] = useState<GalleryFolder[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    try {
      const [fetchedOrders, fetchedFolders, fetchedGalleries] = await Promise.all([
        orderServices.fetchAll(),
        catalogServices.fetchFolders(),
        galleryServices.fetchFolders()
      ]);
      setOrders(fetchedOrders);
      setFolders(fetchedFolders);
      setGalleries(fetchedGalleries);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password
    });
    if (error) {
      setLoginError(error.message);
    } else {
      setLoginError('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (m: string) => setToast(m);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (toast) {
      const isError = toast.toLowerCase().includes('fail') || toast.toLowerCase().includes('error');
      const duration = isError ? 15000 : 4000;
      const timer = setTimeout(() => setToast(null), duration);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const isPublicView = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'gallery';
  }, []);

  if (isPublicView) {
    return <PublicGalleryView />;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-6">
        <RefreshCw className="animate-spin text-white/20" size={48} strokeWidth={0.5} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-12 relative z-10"
        >
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-white text-black rounded-[24px] flex items-center justify-center mx-auto font-black tracking-tighter text-4xl shadow-2xl shadow-white/10">CA</div>
            <div className="space-y-2">
              <h1 className="luxury-heading text-4xl text-white tracking-tight">CELORA & AVELON</h1>
              <p className="text-technical text-white/20 tracking-[0.4em] text-[10px]">PRIVATE SECURE TERMINAL</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-technical text-white/30 text-[9px] font-bold uppercase tracking-widest pl-1">AUTHORIZED PROXY</label>
                <input 
                  type="email" 
                  required
                  value={loginForm.email}
                  onChange={e => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/40 transition-all text-sm" 
                  placeholder="email@address.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-technical text-white/30 text-[9px] font-bold uppercase tracking-widest pl-1">SECURITY TOKEN</label>
                <input 
                  type="password" 
                  required
                  value={loginForm.password}
                  onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-white/40 transition-all text-sm" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            {loginError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-[10px] font-bold text-center uppercase tracking-widest">
                {loginError}
              </motion.p>
            )}

            <button type="submit" className="w-full bg-white text-black py-5 rounded-2xl font-black tracking-[0.3em] uppercase text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl">
              INITIALIZE SESSION
            </button>
          </form>

          <p className="text-center text-white/10 text-[8px] tracking-widest font-bold">SYSTEM ACCESS RESTRICTED TO PERSONNEL ONLY © 2024</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#fdfdfd] text-black selection:bg-black selection:text-white overflow-hidden relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col overflow-y-auto px-6 md:px-16 py-8 md:py-20 scroll-smooth relative">
        <div className="fixed inset-0 pointer-events-none border-[12px] md:border-[32px] border-white z-10" />
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8 relative z-20">
          <div className="flex items-center gap-4">
            {activeTab !== 'executive' && (
              <button 
                onClick={() => setActiveTab('executive')}
                className="p-2 -ml-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center font-black tracking-tighter text-sm shadow-lg">CA</div>
              <div className="luxury-heading text-xl font-bold tracking-tight">CELORA & AVELON</div>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2">
            <Layers size={24} />
          </button>
        </div>

        {/* Global Desktop Back Button */}
        <AnimatePresence>
          {activeTab !== 'executive' && (
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => setActiveTab('executive')}
              className="hidden lg:flex items-center gap-3 text-technical text-neutral-400 hover:text-black mb-12 transition-colors group relative z-20 w-fit"
            >
              <div className="w-8 h-8 rounded-full border border-neutral-100 flex items-center justify-center group-hover:border-black transition-colors">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
              </div>
              <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Back to Executive Suite</span>
            </motion.button>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-12 right-12 z-[200] bg-black text-white px-8 py-4 rounded-2xl shadow-2xl text-technical text-[10px] font-bold tracking-[0.2em]"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.99, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.01, y: -10 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative z-0"
          >
            {activeTab === 'executive' && <DashboardView setActiveTab={setActiveTab} />}
            
            {activeTab === 'global_galleries' && <GalleryEngine folders={galleries} setFolders={setGalleries} showToast={setToast} onSessionEnd={() => setSession(null)} />}
            
            {activeTab === 'global_catalog' && <CatalogEngine folders={folders} setFolders={setFolders} showToast={setToast} onSessionEnd={() => setSession(null)} />}

            {activeTab.includes('dress') || activeTab.includes('shoes') ? (
               <RegistryEngine 
                 brand={activeTab.startsWith('celora') ? 'Celora' : 'Avelon'} 
                 category={activeTab.endsWith('dress') ? 'Dress' : 'Shoes'} 
                 orders={orders}
                 setOrders={setOrders}
                 showToast={setToast}
                 onSessionEnd={() => setSession(null)}
               />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
