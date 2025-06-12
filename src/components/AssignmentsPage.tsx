
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Search, Users, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Assignment {
  id: string;
  assetType: string;
  quantity: number;
  assignedTo: string;
  assignedBy: string;
  assignmentDate: string;
  base: string;
  purpose: string;
  status: 'active' | 'returned';
}

interface Expenditure {
  id: string;
  assetType: string;
  quantity: number;
  expendedBy: string;
  expenditureDate: string;
  base: string;
  purpose: string;
  justification: string;
}

const mockAssignments: Assignment[] = [
  {
    id: 'ASG-001',
    assetType: 'M4A1 Rifle',
    quantity: 1,
    assignedTo: 'Sgt. James Wilson',
    assignedBy: 'John Mitchell',
    assignmentDate: '2025-06-08',
    base: 'Fort Liberty',
    purpose: 'Training Exercise',
    status: 'active'
  },
  {
    id: 'ASG-002',
    assetType: 'Body Armor Vest',
    quantity: 25,
    assignedTo: 'Alpha Company',
    assignedBy: 'Sarah Chen',
    assignmentDate: '2025-06-07',
    base: 'Fort Liberty',
    purpose: 'Deployment Preparation',
    status: 'active'
  }
];

const mockExpenditures: Expenditure[] = [
  {
    id: 'EXP-001',
    assetType: 'Ammunition 5.56',
    quantity: 1000,
    expendedBy: 'Training Command',
    expenditureDate: '2025-06-06',
    base: 'Fort Liberty',
    purpose: 'Live Fire Exercise',
    justification: 'Mandatory quarterly training requirements'
  }
];

export const AssignmentsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [expenditures, setExpenditures] = useState<Expenditure[]>(mockExpenditures);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isExpenditureDialogOpen, setIsExpenditureDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [newAssignment, setNewAssignment] = useState({
    assetType: '',
    quantity: '',
    assignedTo: '',
    assignmentDate: '',
    base: user?.baseName || '',
    purpose: '',
    assignedBy: `${user?.firstName} ${user?.lastName}` || ''
  });

  const [newExpenditure, setNewExpenditure] = useState({
    assetType: '',
    quantity: '',
    expendedBy: '',
    expenditureDate: '',
    base: user?.baseName || '',
    purpose: '',
    justification: ''
  });

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assignment: Assignment = {
      id: `ASG-${String(assignments.length + 1).padStart(3, '0')}`,
      assetType: newAssignment.assetType,
      quantity: parseInt(newAssignment.quantity),
      assignedTo: newAssignment.assignedTo,
      assignedBy: newAssignment.assignedBy,
      assignmentDate: newAssignment.assignmentDate,
      base: newAssignment.base,
      purpose: newAssignment.purpose,
      status: 'active'
    };

    setAssignments([assignment, ...assignments]);
    setIsAssignmentDialogOpen(false);
    setNewAssignment({
      assetType: '',
      quantity: '',
      assignedTo: '',
      assignmentDate: '',
      base: user?.baseName || '',
      purpose: '',
      assignedBy: `${user?.firstName} ${user?.lastName}` || ''
    });

    toast({
      title: 'Assignment Created',
      description: `Asset assignment ${assignment.id} has been recorded.`,
    });
  };

  const handleExpenditureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expenditure: Expenditure = {
      id: `EXP-${String(expenditures.length + 1).padStart(3, '0')}`,
      assetType: newExpenditure.assetType,
      quantity: parseInt(newExpenditure.quantity),
      expendedBy: newExpenditure.expendedBy,
      expenditureDate: newExpenditure.expenditureDate,
      base: newExpenditure.base,
      purpose: newExpenditure.purpose,
      justification: newExpenditure.justification
    };

    setExpenditures([expenditure, ...expenditures]);
    setIsExpenditureDialogOpen(false);
    setNewExpenditure({
      assetType: '',
      quantity: '',
      expendedBy: '',
      expenditureDate: '',
      base: user?.baseName || '',
      purpose: '',
      justification: ''
    });

    toast({
      title: 'Expenditure Recorded',
      description: `Asset expenditure ${expenditure.id} has been logged.`,
    });
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
    const matchesUserBase = user?.role === 'admin' || assignment.base === user?.baseName;
    
    return matchesSearch && matchesStatus && matchesUserBase;
  });

  const filteredExpenditures = expenditures.filter(expenditure => {
    const matchesSearch = expenditure.assetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expenditure.expendedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expenditure.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUserBase = user?.role === 'admin' || expenditure.base === user?.baseName;
    
    return matchesSearch && matchesUserBase;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Assignments & Expenditures</h1>
          <p className="text-slate-600 mt-1">Manage asset assignments and track expenditures</p>
        </div>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="expenditures">Expenditures</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Asset Assignments</h2>
              <p className="text-slate-600">Track assets assigned to personnel and units</p>
            </div>
            
            <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Asset Assignment</DialogTitle>
                  <DialogDescription>
                    Assign assets to personnel or units for specific purposes.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assetType">Asset Type</Label>
                      <Select value={newAssignment.assetType} onValueChange={(value) => setNewAssignment({...newAssignment, assetType: value})}>
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
                        value={newAssignment.quantity}
                        onChange={(e) => setNewAssignment({...newAssignment, quantity: e.target.value})}
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Input
                        id="assignedTo"
                        value={newAssignment.assignedTo}
                        onChange={(e) => setNewAssignment({...newAssignment, assignedTo: e.target.value})}
                        placeholder="Personnel name or unit"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assignmentDate">Assignment Date</Label>
                      <Input
                        id="assignmentDate"
                        type="date"
                        value={newAssignment.assignmentDate}
                        onChange={(e) => setNewAssignment({...newAssignment, assignmentDate: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Input
                        id="purpose"
                        value={newAssignment.purpose}
                        onChange={(e) => setNewAssignment({...newAssignment, purpose: e.target.value})}
                        placeholder="Assignment purpose"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assignedBy">Assigned By</Label>
                      <Input
                        id="assignedBy"
                        value={newAssignment.assignedBy}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                      Create Assignment
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Assignment Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search assignments..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Assignment List */}
          <div className="grid gap-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{assignment.assetType}</h3>
                        <Badge className={assignment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-500">Assignment ID</p>
                          <p className="font-medium">{assignment.id}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Quantity</p>
                          <p className="font-medium">{assignment.quantity}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Assigned To</p>
                          <p className="font-medium">{assignment.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Assignment Date</p>
                          <p className="font-medium">{new Date(assignment.assignmentDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Purpose</p>
                          <p className="font-medium">{assignment.purpose}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Assigned By</p>
                          <p className="font-medium">{assignment.assignedBy}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expenditures" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Asset Expenditures</h2>
              <p className="text-slate-600">Track consumed or expended assets</p>
            </div>
            
            <Dialog open={isExpenditureDialogOpen} onOpenChange={setIsExpenditureDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Record Expenditure
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Record Asset Expenditure</DialogTitle>
                  <DialogDescription>
                    Log assets that have been consumed or expended.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleExpenditureSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="assetType">Asset Type</Label>
                      <Select value={newExpenditure.assetType} onValueChange={(value) => setNewExpenditure({...newExpenditure, assetType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ammunition 5.56">Ammunition 5.56</SelectItem>
                          <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                          <SelectItem value="Fuel">Fuel</SelectItem>
                          <SelectItem value="Rations">Rations</SelectItem>
                          <SelectItem value="Training Materials">Training Materials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={newExpenditure.quantity}
                        onChange={(e) => setNewExpenditure({...newExpenditure, quantity: e.target.value})}
                        placeholder="Enter quantity"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expendedBy">Expended By</Label>
                      <Input
                        id="expendedBy"
                        value={newExpenditure.expendedBy}
                        onChange={(e) => setNewExpenditure({...newExpenditure, expendedBy: e.target.value})}
                        placeholder="Unit or department"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expenditureDate">Expenditure Date</Label>
                      <Input
                        id="expenditureDate"
                        type="date"
                        value={newExpenditure.expenditureDate}
                        onChange={(e) => setNewExpenditure({...newExpenditure, expenditureDate: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="purpose">Purpose</Label>
                      <Input
                        id="purpose"
                        value={newExpenditure.purpose}
                        onChange={(e) => setNewExpenditure({...newExpenditure, purpose: e.target.value})}
                        placeholder="Expenditure purpose"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="justification">Justification</Label>
                    <Input
                      id="justification"
                      value={newExpenditure.justification}
                      onChange={(e) => setNewExpenditure({...newExpenditure, justification: e.target.value})}
                      placeholder="Detailed justification for expenditure"
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsExpenditureDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-red-600 hover:bg-red-700">
                      Record Expenditure
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Expenditure Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search expenditures..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expenditure List */}
          <div className="grid gap-4">
            {filteredExpenditures.map((expenditure) => (
              <Card key={expenditure.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">{expenditure.assetType}</h3>
                      <Badge className="bg-red-100 text-red-800">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Expended
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Expenditure ID</p>
                        <p className="font-medium">{expenditure.id}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Quantity</p>
                        <p className="font-medium">{expenditure.quantity.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Expended By</p>
                        <p className="font-medium">{expenditure.expendedBy}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Expenditure Date</p>
                        <p className="font-medium">{new Date(expenditure.expenditureDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Purpose</p>
                        <p className="font-medium">{expenditure.purpose}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Base</p>
                        <p className="font-medium">{expenditure.base}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600"><strong>Justification:</strong> {expenditure.justification}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
