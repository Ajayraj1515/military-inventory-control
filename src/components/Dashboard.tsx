
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const dashboardData = {
  admin: {
    openingBalance: 15750,
    purchases: 2500,
    transfersIn: 800,
    transfersOut: 1200,
    assigned: 3200,
    expended: 450,
    closingBalance: 14200,
    bases: ['All Bases', 'Fort Liberty', 'Camp Pendleton', 'Joint Base Lewis']
  },
  base_commander: {
    openingBalance: 5250,
    purchases: 800,
    transfersIn: 300,
    transfersOut: 200,
    assigned: 1100,
    expended: 150,
    closingBalance: 4900,
    bases: ['Fort Liberty']
  },
  logistics_officer: {
    openingBalance: 5250,
    purchases: 800,
    transfersIn: 300,
    transfersOut: 200,
    assigned: 0,
    expended: 0,
    closingBalance: 5150,
    bases: ['Fort Liberty']
  }
};

const chartData = [
  { name: 'Jan', assets: 12000, movements: 2400 },
  { name: 'Feb', assets: 13500, movements: 1800 },
  { name: 'Mar', assets: 14200, movements: 3200 },
  { name: 'Apr', assets: 15100, movements: 2800 },
  { name: 'May', assets: 14800, movements: 2200 },
  { name: 'Jun', assets: 15750, movements: 2800 },
];

const assetTypeData = [
  { name: 'Weapons', value: 35, color: '#ef4444' },
  { name: 'Vehicles', value: 25, color: '#3b82f6' },
  { name: 'Communication', value: 20, color: '#10b981' },
  { name: 'Medical', value: 12, color: '#f59e0b' },
  { name: 'Other', value: 8, color: '#8b5cf6' },
];

const recentActivities = [
  { id: 1, type: 'Purchase', asset: 'M4A1 Rifles', quantity: 50, base: 'Fort Liberty', time: '2 hours ago', status: 'completed' },
  { id: 2, type: 'Transfer', asset: 'Humvee Vehicles', quantity: 3, base: 'Camp Pendleton → Fort Liberty', time: '4 hours ago', status: 'in_transit' },
  { id: 3, type: 'Assignment', asset: 'Body Armor', quantity: 25, base: 'Fort Liberty', time: '6 hours ago', status: 'completed' },
  { id: 4, type: 'Expenditure', asset: 'Ammunition 5.56', quantity: 1000, base: 'Joint Base Lewis', time: '8 hours ago', status: 'completed' },
];

export const Dashboard = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const data = dashboardData[user.role];
  const netMovement = data.purchases + data.transfersIn - data.transfersOut;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Asset overview and system activity</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          {user.role === 'admin' && (
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bases</SelectItem>
                <SelectItem value="fort_liberty">Fort Liberty</SelectItem>
                <SelectItem value="camp_pendleton">Camp Pendleton</SelectItem>
                <SelectItem value="joint_base">Joint Base Lewis</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Opening Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-900">{data.openingBalance.toLocaleString()}</div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-blue-600 mt-1">Total assets at period start</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Net Movement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-900">
                {netMovement > 0 ? '+' : ''}{netMovement.toLocaleString()}
              </div>
              {netMovement >= 0 ? (
                <ArrowUpRight className="h-8 w-8 text-green-600" />
              ) : (
                <ArrowDownRight className="h-8 w-8 text-red-600" />
              )}
            </div>
            <p className="text-xs text-green-600 mt-1">Purchases + Transfers In - Out</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Assigned Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-orange-900">{data.assigned.toLocaleString()}</div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-orange-600 mt-1">Assets assigned to personnel</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Closing Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-purple-900">{data.closingBalance.toLocaleString()}</div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-purple-600 mt-1">Current total assets</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Movements Over Time</CardTitle>
            <CardDescription>Monthly asset tracking and movement trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="assets" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="movements" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Distribution</CardTitle>
            <CardDescription>Distribution by asset type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-4">
              {assetTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-600">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest asset movements and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'Purchase' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'Transfer' ? 'bg-green-100 text-green-600' :
                    activity.type === 'Assignment' ? 'bg-orange-100 text-orange-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <Package className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{activity.type}: {activity.asset}</p>
                    <p className="text-sm text-slate-600">Quantity: {activity.quantity} • {activity.base}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                    {activity.status === 'completed' ? 'Completed' : 'In Transit'}
                  </Badge>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
