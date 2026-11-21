'use client';

import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Package,
  FileDown,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  WifiOff,
  Wifi,
  Search,
  Receipt,
  FileSpreadsheet,
  FileCode,
} from 'lucide-react';
import {
  MartInventoryItem,
  MartSaleTransaction,
  MartSaleItem,
  MartLedgerState,
} from '@/types/drps';
import { StatusBadge } from './ui/StatusBadge';
import { Modal } from './ui/Modal';
import { ConfirmationDialog } from './ui/ConfirmationDialog';

interface MartContinuityViewProps {
  martLedger: MartLedgerState;
  onToggleOfflineMode: (active?: boolean) => void;
  onPrestageInventory: (newInventory: MartInventoryItem[]) => void;
  onResetInventorySeed: () => void;
  onUpsertInventoryItem: (item: MartInventoryItem) => void;
  onRecordSale: (saleData: {
    items: MartSaleItem[];
    paymentMethod: MartSaleTransaction['paymentMethod'];
    cashierName: string;
    notes?: string;
  }) => MartSaleTransaction;
  onReconcileSales: (receiptIds?: string[]) => void;
  onClearSalesHistory: () => void;
  onExportSalesCsv: () => void;
  onExportInventoryCsv: () => void;
}

export const MartContinuityView: React.FC<MartContinuityViewProps> = ({
  martLedger,
  onToggleOfflineMode,
  onPrestageInventory,
  onResetInventorySeed,
  onUpsertInventoryItem,
  onRecordSale,
  onReconcileSales,
  onClearSalesHistory,
  onExportSalesCsv,
  onExportInventoryCsv,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'checkout' | 'inventory' | 'sales_history'>('checkout');

  // Checkout State
  const [cart, setCart] = useState<{ item: MartInventoryItem; quantity: number }[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [paymentMethod, setPaymentMethod] = useState<MartSaleTransaction['paymentMethod']>('Cash');
  const [cashierName, setCashierName] = useState('Adeola (Counter 1)');
  const [receiptNote, setReceiptNote] = useState('');
  const [lastCompletedSale, setLastCompletedSale] = useState<MartSaleTransaction | null>(null);

  // New Item modal/form state
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);
  const [newItemSku, setNewItemSku] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Groceries & Foods');
  const [newItemPrice, setNewItemPrice] = useState<number>(1000);
  const [newItemStock, setNewItemStock] = useState<number>(50);
  const [newItemUnit, setNewItemUnit] = useState('Piece');

  // CSV Import State
  const [csvUploadFeedback, setCsvUploadFeedback] = useState<string | null>(null);

  // Categories list
  const categories = useMemo(() => {
    return Array.from(new Set(martLedger.inventory.map((item) => item.category)));
  }, [martLedger.inventory]);

  // Filtered Inventory for Checkout & Catalog
  const filteredInventory = useMemo(() => {
    return martLedger.inventory.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        item.sku.toLowerCase().includes(productSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [martLedger.inventory, selectedCategory, productSearch]);

  // Cart actions
  const addToCart = (item: MartInventoryItem) => {
    if (item.currentStock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.item.sku === item.sku);
      if (existing) {
        if (existing.quantity >= item.currentStock) return prev;
        return prev.map((c) => (c.item.sku === item.sku ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const updateCartQuantity = (sku: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((c) => {
          if (c.item.sku === sku) {
            const nextQty = c.quantity + delta;
            if (nextQty <= 0) return null;
            if (nextQty > c.item.currentStock) return c;
            return { ...c, quantity: nextQty };
          }
          return c;
        })
        .filter(Boolean) as { item: MartInventoryItem; quantity: number }[];
    });
  };

  const removeFromCart = (sku: string) => {
    setCart((prev) => prev.filter((c) => c.item.sku !== sku));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, c) => acc + c.item.unitPrice * c.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, c) => acc + c.quantity, 0);
  }, [cart]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const saleItems: MartSaleItem[] = cart.map((c) => ({
      sku: c.item.sku,
      name: c.item.name,
      unitPrice: c.item.unitPrice,
      quantity: c.quantity,
      lineTotal: c.item.unitPrice * c.quantity,
    }));

    const transaction = onRecordSale({
      items: saleItems,
      paymentMethod,
      cashierName,
      notes: receiptNote.trim() || undefined,
    });

    setLastCompletedSale(transaction);
    setCart([]);
    setReceiptNote('');
  };

  // Add Item to Inventory
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemSku || !newItemName) return;

    const newItem: MartInventoryItem = {
      sku: newItemSku.trim().toUpperCase(),
      name: newItemName.trim(),
      category: newItemCategory,
      unitPrice: Number(newItemPrice),
      openingStock: Number(newItemStock),
      currentStock: Number(newItemStock),
      reorderLevel: Math.max(5, Math.floor(Number(newItemStock) * 0.2)),
      unit: newItemUnit.trim() || 'Piece',
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    onUpsertInventoryItem(newItem);
    setShowAddItemModal(false);
    setNewItemSku('');
    setNewItemName('');
  };

  // CSV Import Parser
  const handleCsvFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        setCsvUploadFeedback('CSV file contains no data rows.');
        return;
      }

      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''));
      const skuIdx = headers.findIndex((h) => h.includes('sku'));
      const nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('item'));
      const priceIdx = headers.findIndex((h) => h.includes('price'));
      const stockIdx = headers.findIndex((h) => h.includes('stock') || h.includes('quantity') || h.includes('opening'));
      const catIdx = headers.findIndex((h) => h.includes('category'));

      if (skuIdx === -1 || nameIdx === -1 || priceIdx === -1) {
        setCsvUploadFeedback('Invalid CSV structure. Expected columns: SKU, Name, Unit_Price, Opening_Stock');
        return;
      }

      const parsedItems: MartInventoryItem[] = [];
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      for (let i = 1; i < lines.length; i++) {
        const rawLine = lines[i];
        const cols = rawLine.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
        if (cols.length <= Math.max(skuIdx, nameIdx, priceIdx)) continue;

        const sku = cols[skuIdx]?.toUpperCase();
        const name = cols[nameIdx];
        const price = parseFloat(cols[priceIdx]) || 1000;
        const stock = stockIdx !== -1 ? parseInt(cols[stockIdx]) || 50 : 50;
        const cat = catIdx !== -1 && cols[catIdx] ? cols[catIdx] : 'General Provisions';

        if (sku && name) {
          parsedItems.push({
            sku,
            name,
            category: cat,
            unitPrice: price,
            openingStock: stock,
            currentStock: stock,
            reorderLevel: Math.max(5, Math.floor(stock * 0.2)),
            unit: 'Unit',
            lastUpdated: now,
          });
        }
      }

      if (parsedItems.length > 0) {
        onPrestageInventory(parsedItems);
        setCsvUploadFeedback(`Successfully pre-staged ${parsedItems.length} inventory items into offline memory.`);
      } else {
        setCsvUploadFeedback('No valid inventory records found in file.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setCsvUploadFeedback(`Error reading file: ${msg}`);
    }
  };

  // Export Mart Sales as JSON
  const exportMartSalesJson = () => {
    const jsonStr = JSON.stringify(martLedger.sales, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UI_VENTURES_MART_SALES_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export Inventory as JSON
  const exportMartInventoryJson = () => {
    const jsonStr = JSON.stringify(martLedger.inventory, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `UI_VENTURES_MART_INVENTORY_SNAPSHOT_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalOfflineRevenue = useMemo(() => {
    return martLedger.sales.reduce((acc, s) => acc + s.totalAmount, 0);
  }, [martLedger.sales]);

  const pendingSyncSalesCount = useMemo(() => {
    return martLedger.sales.filter((s) => s.offlineSyncStatus === 'Pending Sync').length;
  }, [martLedger.sales]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-16">
      {/* Hero Status & Mode Toggle Banner */}
      <div className="card-hero-forest text-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono-metrics text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white/10 text-[#4ADE80]">
              UV-MRT
            </span>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${martLedger.offlineModeActive ? 'bg-[#4ADE80] animate-pulse' : 'bg-white/40'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-[#4ADE80]">
                {martLedger.offlineModeActive ? 'Offline Continuity Mode Active' : 'Online Sync Mode'}
              </span>
            </div>
            <span className="hidden sm:inline text-xs text-white/50">• Process P15 (1h RTO)</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            UI Ventures Mart Offline Sales & Inventory Ledger
          </h2>

          <p className="text-xs text-white/80 max-w-2xl leading-relaxed">
            Zero-internet retail checkout appliance for UI Ventures Mart. Pre-stages local prices, executes instantaneous cash and voucher checkout, deducts stock, and exports audit-ready logs for post-disaster reconciliation.
          </p>
        </div>

        {/* Right Toggle and Quick Prestage Action */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onToggleOfflineMode()}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              martLedger.offlineModeActive
                ? 'bg-[#4ADE80] text-[#0A261D] hover:bg-[#22C55E]'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
            }`}
          >
            {martLedger.offlineModeActive ? (
              <>
                <WifiOff className="w-4 h-4" />
                <span>Offline Active</span>
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4" />
                <span>Enable Offline</span>
              </>
            )}
          </button>

          <button
            onClick={onResetInventorySeed}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-medium rounded-xl border border-white/10 transition-colors"
            title="Reload default university mart inventory catalog"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="hidden sm:inline">Reset Catalog</span>
          </button>
        </div>
      </div>

      {/* Key Telemetry Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-white rounded-[18px] p-4 sm:p-5 shadow-xs border border-[#E5E7EB]">
          <div className="text-[11px] font-semibold text-[#6B7280]">Pre-staged SKUs</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#111827] mt-1">
            {martLedger.inventory.length}
          </div>
          <div className="text-[11px] text-[#103E2E] font-medium mt-0.5">
            Local price cache ready
          </div>
        </div>

        <div className="bg-white rounded-[18px] p-4 sm:p-5 shadow-xs border border-[#E5E7EB]">
          <div className="text-[11px] font-semibold text-[#6B7280]">Offline Sales Recorded</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#103E2E] mt-1">
            {martLedger.sales.length}
          </div>
          <div className="text-[11px] text-[#6B7280] mt-0.5">
            {pendingSyncSalesCount} pending sync
          </div>
        </div>

        <div className="bg-white rounded-[18px] p-4 sm:p-5 shadow-xs border border-[#E5E7EB]">
          <div className="text-[11px] font-semibold text-[#6B7280]">Offline Gross Revenue</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#111827] mt-1">
            ₦{totalOfflineRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#16A34A] font-semibold mt-0.5">
            Cash & Vouchers total
          </div>
        </div>

        <div className="bg-white rounded-[18px] p-4 sm:p-5 shadow-xs border border-[#E5E7EB]">
          <div className="text-[11px] font-semibold text-[#6B7280]">RTO Threshold</div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono-metrics text-[#4ADE80] mt-1">
            1.0 Hour
          </div>
          <div className="text-[11px] text-[#6B7280] mt-0.5">
            Sim-09 benchmark: 22m (MET)
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-[18px] p-2 flex flex-wrap items-center justify-between gap-2 shadow-xs border border-[#E5E7EB]">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('checkout')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'checkout'
                ? 'bg-[#0A261D] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Offline POS Checkout ({cartItemCount})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'inventory'
                ? 'bg-[#0A261D] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Pre-staged Inventory ({martLedger.inventory.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sales_history')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'sales_history'
                ? 'bg-[#0A261D] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6]'
            }`}
          >
            <Receipt className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span>Offline Sales Audit Log ({martLedger.sales.length})</span>
          </button>
        </div>

        {/* Global CSV & JSON Export Tools */}
        <div className="flex items-center gap-2 pr-1">
          <button
            onClick={onExportSalesCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827] transition-colors"
            title="Download CSV of all offline sales transactions"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#103E2E]" />
            <span className="hidden sm:inline">Export Sales CSV</span>
          </button>

          <button
            onClick={onExportInventoryCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827] transition-colors"
            title="Download CSV of stock reconciliation"
          >
            <FileDown className="w-3.5 h-3.5 text-[#103E2E]" />
            <span className="hidden sm:inline">Stock CSV</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Offline POS Checkout */}
      {activeSubTab === 'checkout' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
          {/* Product Catalog Grid (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-[20px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E7EB]">
              <div>
                <h3 className="text-sm font-bold text-[#111827]">
                  Select Pre-staged Mart Products
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Click items to add to cart. Stock is deducted immediately in local memory.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search SKU or name..."
                    className="pl-8 pr-3 py-1.5 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#103E2E] w-40"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="py-1.5 px-2 text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredInventory.map((item) => {
                const inCart = cart.find((c) => c.item.sku === item.sku);
                const isOutOfStock = item.currentStock <= 0;
                const isLowStock = item.currentStock <= item.reorderLevel && item.currentStock > 0;

                return (
                  <div
                    key={item.sku}
                    onClick={() => !isOutOfStock && addToCart(item)}
                    className={`p-3.5 rounded-xl border transition-all duration-150 flex flex-col justify-between ${
                      isOutOfStock
                        ? 'opacity-50 cursor-not-allowed bg-[#F9FAFB] border-[#E5E7EB]'
                        : inCart
                        ? 'border-[#103E2E] bg-[#ECFDF5] shadow-xs cursor-pointer'
                        : 'border-[#E5E7EB] bg-[#F9FAFB] hover:bg-[#F3F4F6] hover:border-[#D1D5DB] cursor-pointer'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono-metrics text-[10px] font-bold text-[#6B7280]">
                          {item.sku}
                        </span>
                        <StatusBadge
                          label={isOutOfStock ? 'OUT OF STOCK' : `${item.currentStock} left`}
                          variant={isOutOfStock ? 'danger' : isLowStock ? 'warning' : 'success'}
                          size="sm"
                        />
                      </div>

                      <h4 className="text-xs font-bold text-[#111827] mt-1.5 line-clamp-2">
                        {item.name}
                      </h4>
                      <div className="text-[10px] text-[#6B7280] mt-0.5">{item.category}</div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="font-mono-metrics font-extrabold text-sm text-[#111827]">
                        ₦{item.unitPrice.toLocaleString()}
                      </span>
                      {inCart ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#103E2E] text-white">
                          In Cart: {inCart.quantity}
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-[#103E2E] hover:underline">
                          + Add
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Cart Column (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-[20px] p-5 sm:p-6 shadow-xs border border-[#E5E7EB] space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">
                    Offline Sales Order Cart
                  </h3>
                  <div className="text-xs text-[#6B7280]">
                    {cart.length} distinct item(s) • {cartItemCount} total units
                  </div>
                </div>

                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    className="text-xs text-[#DC2626] font-semibold hover:underline"
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              {/* Cart Items List */}
              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="p-8 text-center text-xs text-[#9CA3AF] border border-dashed border-[#E5E7EB] rounded-xl">
                    Cart is empty. Click items on the left catalog to add them to this offline checkout ticket.
                  </div>
                ) : (
                  cart.map(({ item, quantity }) => (
                    <div
                      key={item.sku}
                      className="p-3 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-between gap-3"
                    >
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="text-xs font-bold text-[#111827] truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] font-mono-metrics text-[#6B7280]">
                          ₦{item.unitPrice.toLocaleString()} × {quantity}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateCartQuantity(item.sku, -1)}
                          className="w-6 h-6 rounded-lg bg-white border border-[#D1D5DB] text-xs font-bold flex items-center justify-center hover:bg-[#F3F4F6]"
                        >
                          -
                        </button>
                        <span className="font-mono-metrics font-bold text-xs w-5 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.sku, 1)}
                          disabled={quantity >= item.currentStock}
                          className="w-6 h-6 rounded-lg bg-white border border-[#D1D5DB] text-xs font-bold flex items-center justify-center hover:bg-[#F3F4F6] disabled:opacity-40"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.sku)}
                          className="p-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded-md ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cashier & Payment Details Form */}
              <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-3 border-t border-[#E5E7EB] text-xs">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[#4B5563] mb-1 font-semibold">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as MartSaleTransaction['paymentMethod'])}
                      className="w-full py-1.5 px-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] font-semibold text-xs"
                    >
                      <option value="Cash">Cash (Physical Currency)</option>
                      <option value="Bank Transfer / POS Voucher">Bank Transfer / Paper Slip</option>
                      <option value="Campus Student Wallet">Campus Student ID Account</option>
                      <option value="Credit / Departmental Charge">Dept Charge Voucher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#4B5563] mb-1 font-semibold">Cashier Name</label>
                    <input
                      type="text"
                      value={cashierName}
                      onChange={(e) => setCashierName(e.target.value)}
                      className="w-full py-1.5 px-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#4B5563] mb-1 font-semibold">Receipt / Department Note</label>
                  <input
                    type="text"
                    value={receiptNote}
                    onChange={(e) => setReceiptNote(e.target.value)}
                    placeholder="e.g. Faculty of Science Exam refreshment order"
                    className="w-full py-1.5 px-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-[#111827] text-xs"
                  />
                </div>

                {/* Subtotal Calculation */}
                <div className="p-3.5 rounded-xl bg-[#0A261D] text-white flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-white/70">Total Amount Due</div>
                    <div className="text-lg font-extrabold font-mono-metrics text-[#4ADE80]">
                      ₦{cartTotal.toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={cart.length === 0}
                    className="px-4 py-2 bg-[#4ADE80] text-[#0A261D] hover:bg-[#22C55E] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Confirm Offline Sale
                  </button>
                </div>
              </form>
            </div>

            {/* Last Transaction Mini Print Slip */}
            {lastCompletedSale && (
              <div className="p-3 rounded-xl bg-[#DCFCE7] border border-[#BBF7D0] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-[#16A34A]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Receipt: {lastCompletedSale.receiptId}</span>
                  </div>
                  <span className="font-mono-metrics text-[10px] text-[#16A34A]">
                    {lastCompletedSale.timestamp.slice(11)}
                  </span>
                </div>
                <div className="text-[11px] text-[#14533D]">
                  ₦{lastCompletedSale.totalAmount.toLocaleString()} paid via {lastCompletedSale.paymentMethod} ({lastCompletedSale.items.length} items). Stock updated in local memory.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Pre-staged Inventory */}
      {activeSubTab === 'inventory' && (
        <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">
                Mart Pre-staged Price & Stock Manifest
              </h3>
              <p className="text-xs text-[#6B7280]">
                Pre-staged inventory buffer kept in browser storage. Allows instantaneous retail pricing even during severe power & internet blackouts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827] transition-colors">
                <Upload className="w-3.5 h-3.5 text-[#103E2E]" />
                <span>Upload CSV</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileUpload}
                  className="hidden"
                />
              </label>

              <button
                onClick={exportMartInventoryJson}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827] transition-colors"
              >
                <FileCode className="w-3.5 h-3.5 text-[#103E2E]" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={() => setShowAddItemModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A261D] text-white hover:bg-[#154E3A] rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Add Item</span>
              </button>
            </div>
          </div>

          {csvUploadFeedback && (
            <div className="p-3 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#14533D] flex items-center justify-between">
              <span>{csvUploadFeedback}</span>
              <button
                onClick={() => setCsvUploadFeedback(null)}
                className="font-bold text-[#103E2E] hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-[#6B7280] bg-[#F9FAFB] rounded-xl">
                  <th className="py-2.5 px-3.5 font-semibold rounded-l-xl">SKU Code</th>
                  <th className="py-2.5 px-3.5 font-semibold">Product Description</th>
                  <th className="py-2.5 px-3.5 font-semibold">Category</th>
                  <th className="py-2.5 px-3.5 font-semibold text-right">Unit Price</th>
                  <th className="py-2.5 px-3.5 font-semibold text-center">Opening</th>
                  <th className="py-2.5 px-3.5 font-semibold text-center">Current Stock</th>
                  <th className="py-2.5 px-3.5 font-semibold text-center">Units Sold</th>
                  <th className="py-2.5 px-3.5 font-semibold text-center rounded-r-xl">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {martLedger.inventory.map((item) => {
                  const unitsSold = item.openingStock - item.currentStock;
                  const isLow = item.currentStock <= item.reorderLevel;

                  return (
                    <tr key={item.sku} className="hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-3 px-3.5 font-mono-metrics font-bold text-[#111827]">
                        {item.sku}
                      </td>
                      <td className="py-3 px-3.5 font-bold text-[#111827]">
                        {item.name}
                      </td>
                      <td className="py-3 px-3.5 text-[#6B7280]">{item.category}</td>
                      <td className="py-3 px-3.5 text-right font-mono-metrics font-extrabold text-[#111827]">
                        ₦{item.unitPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 text-center font-mono-metrics text-[#6B7280]">
                        {item.openingStock}
                      </td>
                      <td className="py-3 px-3.5 text-center font-mono-metrics font-extrabold text-sm text-[#103E2E]">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3 px-3.5 text-center font-mono-metrics font-bold text-[#16A34A]">
                        {unitsSold > 0 ? `-${unitsSold}` : '0'}
                      </td>
                      <td className="py-3 px-3.5 text-center">
                        <StatusBadge
                          label={item.currentStock === 0 ? 'Out of Stock' : isLow ? 'Reorder Alert' : 'Adequate'}
                          variant={item.currentStock === 0 ? 'danger' : isLow ? 'warning' : 'success'}
                          size="sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Offline Sales History */}
      {activeSubTab === 'sales_history' && (
        <div className="bg-white rounded-[20px] p-5 sm:p-7 shadow-xs border border-[#E5E7EB] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E5E7EB]">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">
                Offline Sales Transactions Audit Ledger
              </h3>
              <p className="text-xs text-[#6B7280]">
                Sequential receipts issued during network blackout. Supervisors can review line items, verify payment methods, and reconcile balances.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => onReconcileSales()}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0] rounded-xl text-xs font-bold transition-colors"
                title="Mark all transactions as reconciled"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Reconciled</span>
              </button>

              <button
                onClick={onExportSalesCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0A261D] text-white hover:bg-[#154E3A] rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Export Sales CSV</span>
              </button>

              <button
                onClick={exportMartSalesJson}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-xs font-semibold text-[#111827] transition-colors"
              >
                <FileCode className="w-3.5 h-3.5 text-[#103E2E]" />
                <span>Export JSON</span>
              </button>

              {martLedger.sales.length > 0 && (
                <button
                  onClick={() => setShowClearHistoryConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-semibold text-red-700 transition-colors"
                  title="Clear sales history after auditing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear History</span>
                </button>
              )}
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {martLedger.sales.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9CA3AF] border border-dashed border-[#E5E7EB] rounded-xl">
                No offline sales transactions recorded yet. Switch to Offline Checkout Mode to process retail sales.
              </div>
            ) : (
              martLedger.sales.map((sale) => (
                <div
                  key={sale.receiptId}
                  className="p-4 rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono-metrics font-extrabold text-xs text-[#111827]">
                        {sale.receiptId}
                      </span>
                      <span className="text-xs text-[#6B7280]">
                        Cashier: <strong className="text-[#111827]">{sale.cashierName}</strong>
                      </span>
                      <StatusBadge label={sale.paymentMethod} variant="accent" size="sm" />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono-metrics text-xs text-[#6B7280]">
                        {sale.timestamp}
                      </span>
                      <StatusBadge
                        label={sale.offlineSyncStatus}
                        variant={sale.offlineSyncStatus === 'Reconciled / Audited' ? 'success' : 'warning'}
                        size="sm"
                      />
                      <div className="font-mono-metrics font-extrabold text-sm text-[#111827]">
                        ₦{sale.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Line items mini-table */}
                  <div className="pt-2 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-between">
                        <div>
                          <div className="font-bold text-[#111827] truncate">{item.name}</div>
                          <div className="text-[10px] text-[#6B7280]">
                            ₦{item.unitPrice.toLocaleString()} × {item.quantity}
                          </div>
                        </div>
                        <div className="font-mono-metrics font-bold text-[#111827]">
                          ₦{item.lineTotal.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {sale.notes && (
                    <div className="text-[11px] text-[#4B5563] italic">
                      Note: {sale.notes}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      <Modal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        title="Add Pre-staged Item"
        description="Insert new product into local offline cache"
      >
        <form onSubmit={handleAddNewItem} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#4B5563] mb-1 font-semibold">SKU Code</label>
            <input
              type="text"
              value={newItemSku}
              onChange={(e) => setNewItemSku(e.target.value)}
              placeholder="e.g. MRT-GRC-020"
              className="w-full py-1.5 px-3 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-[#111827] font-mono-metrics font-bold uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-[#4B5563] mb-1 font-semibold">Product Name</label>
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="e.g. Milo Refill 500g"
              className="w-full py-1.5 px-3 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-[#111827]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#4B5563] mb-1 font-semibold">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full py-1.5 px-2 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-[#111827] font-semibold"
              >
                <option value="Groceries & Foods">Groceries & Foods</option>
                <option value="Bakery & Fresh">Bakery & Fresh</option>
                <option value="Beverages">Beverages</option>
                <option value="Stationeries & Academic">Stationeries & Academic</option>
                <option value="Provisions">Provisions</option>
                <option value="Toiletries & Health">Toiletries & Health</option>
              </select>
            </div>

            <div>
              <label className="block text-[#4B5563] mb-1 font-semibold">Unit Price (₦)</label>
              <input
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(Number(e.target.value))}
                className="w-full py-1.5 px-3 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-[#111827] font-mono-metrics font-bold"
                min="10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[#4B5563] mb-1 font-semibold">Opening Stock Quantity</label>
              <input
                type="number"
                value={newItemStock}
                onChange={(e) => setNewItemStock(Number(e.target.value))}
                className="w-full py-1.5 px-3 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-[#111827] font-mono-metrics"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-[#4B5563] mb-1 font-semibold">Unit Label</label>
              <input
                type="text"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                placeholder="Piece / Loaf / Pack"
                className="w-full py-1.5 px-3 bg-[#F9FAFB] border border-[#D1D5DB] rounded-xl text-[#111827]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddItemModal(false)}
              className="px-3.5 py-1.5 rounded-xl border border-[#D1D5DB] text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#0A261D] text-white hover:bg-[#154E3A] rounded-xl text-xs font-bold shadow-xs"
            >
              Save Item
            </button>
          </div>
        </form>
      </Modal>

      {/* Confirmation Dialog for Clearing Sales History */}
      <ConfirmationDialog
        isOpen={showClearHistoryConfirm}
        onClose={() => setShowClearHistoryConfirm(false)}
        onConfirm={onClearSalesHistory}
        title="Clear Offline Sales History"
        message="Are you sure you want to clear all offline sales history? Please ensure you have exported your CSV or JSON sales logs before proceeding."
        confirmLabel="Clear History"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
};
