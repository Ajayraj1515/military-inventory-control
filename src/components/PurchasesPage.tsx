
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Filter, Download, Calendar, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Purchase {
  id: string;
  assetType: string;
  quantity: number;
  purchaseDate: string;
  supplier: string;
  base: string;
  unitCost: number;
  totalCost: number;
  status: 'pending' | 'approved' | 'delivered';
  requestedBy: string;
}

const mockPurchases: Purchase[] = [
  {
    id: 'PUR-001',
    assetType: 'M4A1 Rifle',
    quantity: 50,
    purchaseDate: '2025-06-10',
    supplier: 'Defense Systems Corp',
    base: 'Fort Liberty',
    unitCost: 850,
    totalCost: 42500,
    status: 'delivered',
    requestedBy: 'John Mitchell'
  },
  {
    id: 'PUR-002',
    assetType: 'Body Armor Vest',
    quantity: 100,
    purchaseDate: '2025-06-08',
    supplier: 'Tactical Solutions Inc',
    base: 'Fort Liberty',
    unitCost: 320,
    totalCost: 32000,
    status: 'approved',
    requestedBy: 'Sarah Chen'
  },
  {
    id: 'PUR-003',
    assetType: 'Night Vision Goggles',
    quantity: 25,
    purchaseDate: '2025-06-05',
    supplier: 'OpTech Industries',
    base: 'Camp Pendleton',
    unitCost: 2800,
    totalCost: 70000,
    status: 'pending',
    requestedBy: 'Mike Rodriguez'
  }
];

export const PurchasesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBase, setSelectedBase] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [newPurchase, setNewPurchase] = useState({
    assetType: '',
    quantity: '',
    purchaseDate: '',
    supplier: '',
    base: user?.baseName || '',
    unitCost: '',
    requestedBy: `${user?.firstName} ${user?.lastName}` || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const purchase: Purchase = {
      id: `PUR-${String(purchases.length + 1).padStart(3, '0')}`,
      assetType: newPurchase.assetType,
      quantity: parseInt(newPurchase.quantity),
      purchaseDate: newPurchase.purchaseDate,
      supplier: newPurchase.supplier,
      base: newPurchase.base || user?.baseName || '',
      unitCost: parseFloat(newPurchase.unitCost),
      totalCost: parseInt(newPurchase.quantity) * parseFloat(newPurchase.unitCost),
      status: 'pending',
      requestedBy: newPurchase.requestedBy
    };

    setPurchases([purchase, ...purchases]);
    setIsDialogOpen(false);
    setNewPurchase({
      assetType: '',
      quantity: '',
      purchaseDate: '',
      supplier: '',
      base: user?.baseName || '',
      unitCost: '',
      requestedBy: `${user?.firstName} ${user?.lastName}` || ''
    });

    toast({
      title: 'Purchase Request Created',
      description: `Purchase request ${purchase.id} has been submitted for approval.`,
    });
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBase = selectedBase === 'all' || purchase.base === selectedBase;
    const matchesStatus = selectedStatus === 'all' || purchase.status === selectedStatus;
    const matchesUserBase = user?.role === 'admin' || purchase.base === user?.baseName;
    
    return matchesSearch && matchesBase && matchesStatus && matchesUserBase;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Purchase Management</h1>
          <p className="text-slate-600 mt-1">Manage asset purchases and procurement requests</p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                New Purchase
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Purchase Request</DialogTitle>
                <DialogDescription>
                  Submit a new asset purchase request for approval.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assetType">Asset Type</Label>
                    <Select value={newPurchase.assetType} onValueChange={(value) => setNewPurchase({...newPurchase, assetType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M4A1 Rifle">M4A1 Rifle</SelectItem>
                        <SelectItem value="Body Armor Vest">Body Armor Vest</SelectItem>
                        <SelectItem value="Night Vision Goggles">Night Vision Goggles</SelectItem>
                        <SelectItem value="Communication Radio">Communication Radio</SelectItem>
                        <SelectItem value="Medical Kit">Medical Kit</SelectItem>
                        <SelectItem value="Humvee Vehicle">Humvee Vehicle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newPurchase.quantity}
                      onChange={(e) => setNewPurchase({...newPurchase, quantity: e.target.value})}
                      placeholder="Enter quantity"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={newPurchase.purchaseDate}
                      onChange={(e) => setNewPurchase({...newPurchase, purchaseDate: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unitCost">Unit Cost ($)</Label>
                    <Input
                      id="unitCost"
                      type="number"
                      step="0.01"
                      value={newPurchase.unitCost}
                      onChange={(e) => setNewPurchase({...newPurchase, unitCost: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={newPurchase.supplier}
                      onChange={(e) => setNewPurchase({...newPurchase, supplier: e.target.value})}
                      placeholder="Enter supplier name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="base">Base</Label>
                    {user?.role === 'admin' ? (
                      <Select value={newPurchase.base} onValueChange={(value) => setNewPurchase({...newPurchase, base: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select base" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fort Liberty">Fort Liberty</SelectItem>
                          <SelectItem value="Camp Pendleton">Camp Pendleton</SelectItem>
                          <SelectItem value="Joint Base Lewis">Joint Base Lewis</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="base"
                        value={newPurchase.base}
                        disabled
                        className="bg-gray-50"
                      />
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="requestedBy">Requested By</Label>
                  <Input
                    id="requestedBy"
                    value={newPurchase.requestedBy}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                {newPurchase.quantity && newPurchase.unitCost && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600">Total Cost</p>
                    <p className="text-2xl font-bold text-slate-900">
                      ${(parseFloat(newPurchase.quantity) * parseFloat(newPurchase.unitCost)).toLocaleString()}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by asset type, supplier, or ID..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {user?.role === 'admin' && (
              <Select value={selectedBase} onValueChange={setSelectedBase}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bases</SelectItem>
                  <SelectItem value="Fort Liberty">Fort Liberty</SelectItem>
                  <SelectItem value="Camp Pendleton">Camp Pendleton</SelectItem>
                  <SelectItem value="Joint Base Lewis">Joint Base Lewis</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Purchase List */}
      <div className="grid gap-4">
        {filteredPurchases.map((purchase) => (
          <Card key={purchase.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">{purchase.assetType}</h3>
                    <Badge className={getStatusColor(purchase.status)}>
                      {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Purchase ID</p>
                      <p className="font-medium">{purchase.id}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Quantity</p>
                      <p className="font-medium">{purchase.quantity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Unit Cost</p>
                      <p className="font-medium">${purchase.unitCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Supplier</p>
                      <p className="font-medium">{purchase.supplier}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Base</p>
                      <p className="font-medium">{purchase.base}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Purchase Date</p>
                      <p className="font-medium">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="lg:text-right">
                  <div className="mb-3">
                    <p className="text-slate-500 text-sm">Total Cost</p>
                    <p className="text-2xl font-bold text-slate-900">${purchase.totalCost.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-slate-500">Requested by {purchase.requestedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPurchases.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-slate-400 mb-2">
              <Package className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No purchases found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or create a new purchase request.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
