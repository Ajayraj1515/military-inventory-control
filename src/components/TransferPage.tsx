
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, ArrowRightLeft, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transfer {
  id: string;
  assetType: string;
  quantity: number;
  fromBase: string;
  toBase: string;
  transferDate: string;
  status: 'pending' | 'in_transit' | 'completed';
  requestedBy: string;
  approvedBy?: string;
  notes?: string;
}

const mockTransfers: Transfer[] = [
  {
    id: 'TXF-001',
    assetType: 'Humvee Vehicle',
    quantity: 3,
    fromBase: 'Camp Pendleton',
    toBase: 'Fort Liberty',
    transferDate: '2025-06-09',
    status: 'in_transit',
    requestedBy: 'Mike Rodriguez',
    approvedBy: 'John Mitchell'
  },
  {
    id: 'TXF-002',
    assetType: 'Communication Radio',
    quantity: 15,
    fromBase: 'Fort Liberty',
    toBase: 'Joint Base Lewis',
    transferDate: '2025-06-07',
    status: 'completed',
    requestedBy: 'Sarah Chen',
    approvedBy: 'John Mitchell'
  }
];

export const TransferPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [newTransfer, setNewTransfer] = useState({
    assetType: '',
    quantity: '',
    fromBase: user?.baseName || '',
    toBase: '',
    transferDate: '',
    notes: '',
    requestedBy: `${user?.firstName} ${user?.lastName}` || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transfer: Transfer = {
      id: `TXF-${String(transfers.length + 1).padStart(3, '0')}`,
      assetType: newTransfer.assetType,
      quantity: parseInt(newTransfer.quantity),
      fromBase: newTransfer.fromBase,
      toBase: newTransfer.toBase,
      transferDate: newTransfer.transferDate,
      status: 'pending',
      requestedBy: newTransfer.requestedBy,
      notes: newTransfer.notes
    };

    setTransfers([transfer, ...transfers]);
    setIsDialogOpen(false);
    setNewTransfer({
      assetType: '',
      quantity: '',
      fromBase: user?.baseName || '',
      toBase: '',
      transferDate: '',
      notes: '',
      requestedBy: `${user?.firstName} ${user?.lastName}` || ''
    });

    toast({
      title: 'Transfer Request Created',
      description: `Transfer request ${transfer.id} has been submitted for approval.`,
    });
  };

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.fromBase.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toBase.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || transfer.status === selectedStatus;
    const matchesUserBase = user?.role === 'admin' || 
                           transfer.fromBase === user?.baseName || 
                           transfer.toBase === user?.baseName;
    
    return matchesSearch && matchesStatus && matchesUserBase;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_transit': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in_transit': return <ArrowRightLeft className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const availableBases = ['Fort Liberty', 'Camp Pendleton', 'Joint Base Lewis'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Asset Transfers</h1>
          <p className="text-slate-600 mt-1">Manage asset transfers between military bases</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Transfer Request</DialogTitle>
              <DialogDescription>
                Submit a new asset transfer request between bases.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assetType">Asset Type</Label>
                  <Select value={newTransfer.assetType} onValueChange={(value) => setNewTransfer({...newTransfer, assetType: value})}>
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
                    value={newTransfer.quantity}
                    onChange={(e) => setNewTransfer({...newTransfer, quantity: e.target.value})}
                    placeholder="Enter quantity"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fromBase">From Base</Label>
                  {user?.role === 'admin' ? (
                    <Select value={newTransfer.fromBase} onValueChange={(value) => setNewTransfer({...newTransfer, fromBase: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin base" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableBases.map(base => (
                          <SelectItem key={base} value={base}>{base}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="fromBase"
                      value={newTransfer.fromBase}
                      disabled
                      className="bg-gray-50"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="toBase">To Base</Label>
                  <Select value={newTransfer.toBase} onValueChange={(value) => setNewTransfer({...newTransfer, toBase: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination base" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBases.filter(base => base !== newTransfer.fromBase).map(base => (
                        <SelectItem key={base} value={base}>{base}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transferDate">Transfer Date</Label>
                  <Input
                    id="transferDate"
                    type="date"
                    value={newTransfer.transferDate}
                    onChange={(e) => setNewTransfer({...newTransfer, transferDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="requestedBy">Requested By</Label>
                  <Input
                    id="requestedBy"
                    value={newTransfer.requestedBy}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={newTransfer.notes}
                  onChange={(e) => setNewTransfer({...newTransfer, notes: e.target.value})}
                  placeholder="Additional notes or requirements"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                  Submit Transfer
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by asset type, transfer ID, or base..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transfer List */}
      <div className="grid gap-4">
        {filteredTransfers.map((transfer) => (
          <Card key={transfer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-slate-900">{transfer.assetType}</h3>
                    <Badge className={getStatusColor(transfer.status)}>
                      {getStatusIcon(transfer.status)}
                      {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500">Transfer ID</p>
                      <p className="font-medium">{transfer.id}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Quantity</p>
                      <p className="font-medium">{transfer.quantity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Transfer Route</p>
                      <p className="font-medium">{transfer.fromBase} → {transfer.toBase}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Transfer Date</p>
                      <p className="font-medium">{new Date(transfer.transferDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Requested By</p>
                      <p className="font-medium">{transfer.requestedBy}</p>
                    </div>
                    {transfer.approvedBy && (
                      <div>
                        <p className="text-slate-500">Approved By</p>
                        <p className="font-medium">{transfer.approvedBy}</p>
                      </div>
                    )}
                  </div>
                  
                  {transfer.notes && (
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600">{transfer.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransfers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-slate-400 mb-2">
              <ArrowRightLeft className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No transfers found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or create a new transfer request.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
