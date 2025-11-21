import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { toast } from 'sonner';
import {
  MessageSquare,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Slogan {
  _id: string;
  userId: string;
  profileId: string;
  userName: string;
  userEmail: string;
  slogan: string;
  round: number;
  credits: number;
  status: 'pending' | 'approved' | 'rejected';
  isVisible: boolean;
  adminNotes: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function SloganManagement() {
  const [slogans, setSlogans] = useState<Slogan[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  // Filters
  const [roundFilter, setRoundFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog state
  const [selectedSlogan, setSelectedSlogan] = useState<Slogan | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'view' | 'delete'>('view');

  useEffect(() => {
    loadSlogans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, roundFilter, statusFilter, searchQuery]);

  const loadSlogans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (roundFilter) params.append('round', roundFilter);
      if (statusFilter) params.append('status', statusFilter);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`http://localhost:5000/api/slogan/admin/all?${params}`);
      const data = await response.json();

      if (data.success) {
        setSlogans(data.data.slogans);
        setStats(data.data.stats);
        setTotalPages(data.data.pagination.pages);
      }
    } catch (error) {
      console.error('Error loading slogans:', error);
      toast.error('Failed to load slogans');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (sloganId: string, status: 'approved' | 'rejected', notes: string = '') => {
    try {
      const response = await fetch(`http://localhost:5000/api/slogan/admin/${sloganId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Slogan ${status} successfully`);
        loadSlogans();
        setShowDialog(false);
      } else {
        toast.error(data.message || 'Failed to update slogan');
      }
    } catch (error) {
      console.error('Error updating slogan:', error);
      toast.error('Failed to update slogan');
    }
  };

  const handleDelete = async (sloganId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/slogan/admin/${sloganId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Slogan deleted successfully');
        loadSlogans();
        setShowDialog(false);
      } else {
        toast.error(data.message || 'Failed to delete slogan');
      }
    } catch (error) {
      console.error('Error deleting slogan:', error);
      toast.error('Failed to delete slogan');
    }
  };

  const openDialog = (slogan: Slogan, action: 'approve' | 'reject' | 'view' | 'delete') => {
    setSelectedSlogan(slogan);
    setActionType(action);
    setAdminNotes(slogan.adminNotes || '');
    setShowDialog(true);
  };

  const handleDialogAction = () => {
    if (!selectedSlogan) return;

    switch (actionType) {
      case 'approve':
        handleStatusUpdate(selectedSlogan._id, 'approved', adminNotes);
        break;
      case 'reject':
        handleStatusUpdate(selectedSlogan._id, 'rejected', adminNotes);
        break;
      case 'delete':
        handleDelete(selectedSlogan._id);
        break;
      default:
        setShowDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Slogan Management</h1>
        <p className="text-gray-600 mt-1">Review and manage user-submitted slogans</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Slogans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Filter className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by name, email, or slogan..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="round">Round</Label>
            <Select value={roundFilter} onValueChange={(value: string) => {
              setRoundFilter(value);
              setPage(1);
            }}>
              <SelectTrigger id="round">
                <SelectValue placeholder="All Rounds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Rounds</SelectItem>
                <SelectItem value="1">Round 1</SelectItem>
                <SelectItem value="2">Round 2</SelectItem>
                <SelectItem value="3">Round 3</SelectItem>
                <SelectItem value="4">Round 4</SelectItem>
                <SelectItem value="5">Round 5</SelectItem>
                <SelectItem value="6">Round 6</SelectItem>
                <SelectItem value="7">Round 7</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={(value: string) => {
              setStatusFilter(value);
              setPage(1);
            }}>
              <SelectTrigger id="status">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Slogans Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slogan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Round
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading slogans...
                  </td>
                </tr>
              ) : slogans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No slogans found
                  </td>
                </tr>
              ) : (
                slogans.map((slogan) => (
                  <tr key={slogan._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{slogan.userName}</div>
                        <div className="text-sm text-gray-500">{slogan.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {slogan.slogan}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">Round {slogan.round}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          slogan.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : slogan.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {slogan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(slogan.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDialog(slogan, 'view')}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {slogan.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => openDialog(slogan, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => openDialog(slogan, 'reject')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openDialog(slogan, 'delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Action Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approve Slogan'}
              {actionType === 'reject' && 'Reject Slogan'}
              {actionType === 'view' && 'View Slogan'}
              {actionType === 'delete' && 'Delete Slogan'}
            </DialogTitle>
            <DialogDescription>
              {selectedSlogan && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label>User</Label>
                    <p className="text-sm text-gray-900">
                      {selectedSlogan.userName} ({selectedSlogan.userEmail})
                    </p>
                  </div>
                  <div>
                    <Label>Slogan</Label>
                    <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                      {selectedSlogan.slogan}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Round</Label>
                      <p className="text-sm text-gray-900">Round {selectedSlogan.round}</p>
                    </div>
                    <div>
                      <Label>Credits</Label>
                      <p className="text-sm text-gray-900">{selectedSlogan.credits}</p>
                    </div>
                  </div>
                  <div>
                    <Label>Submitted</Label>
                    <p className="text-sm text-gray-900">
                      {new Date(selectedSlogan.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {(actionType === 'approve' || actionType === 'reject') && (
                    <div>
                      <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                      <Textarea
                        id="adminNotes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes for the user..."
                        rows={3}
                      />
                    </div>
                  )}

                  {selectedSlogan.adminNotes && actionType === 'view' && (
                    <div>
                      <Label>Admin Notes</Label>
                      <p className="text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                        {selectedSlogan.adminNotes}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            {actionType !== 'view' && (
              <Button
                onClick={handleDialogAction}
                className={
                  actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : actionType === 'reject'
                    ? 'bg-yellow-600 hover:bg-yellow-700'
                    : 'bg-red-600 hover:bg-red-700'
                }
              >
                {actionType === 'approve' && 'Approve'}
                {actionType === 'reject' && 'Reject'}
                {actionType === 'delete' && 'Delete'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
