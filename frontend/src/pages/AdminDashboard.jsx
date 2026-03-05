import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Search,
  Trash2,
  Users,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin");
      return;
    }
    fetchLeads();
    fetchCount();
  }, [navigate]);

  const fetchLeads = async (search = "") => {
    setIsLoading(true);
    try {
      const params = search ? { search } : {};
      const response = await axios.get(`${API}/leads`, { params });
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCount = async () => {
    try {
      const response = await axios.get(`${API}/leads/count`);
      setTotalCount(response.data.count);
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads(searchQuery);
  };

  const handleDelete = async (leadId) => {
    try {
      await axios.delete(`${API}/leads/${leadId}`);
      toast.success("Lead deleted successfully");
      fetchLeads(searchQuery);
      fetchCount();
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="min-h-screen bg-neutral-100"
      data-testid="admin-dashboard-page"
    >
      {/* Header */}
      <header className="bg-navy shadow-md">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="font-heading font-extrabold text-2xl text-white">
                Groove Media
              </a>
              <span className="text-white/50 font-body text-sm hidden sm:inline">
                Admin Dashboard
              </span>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white/80 hover:text-white hover:bg-white/10"
              data-testid="logout-btn"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-8">
        {/* Stats Card */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-navy/10 rounded-sm flex items-center justify-center">
              <Users className="w-7 h-7 text-navy" />
            </div>
            <div>
              <p className="text-neutral-800/60 font-body text-sm uppercase tracking-wide">
                Total Leads
              </p>
              <p
                className="font-heading font-bold text-3xl text-navy"
                data-testid="total-leads-count"
              >
                {totalCount}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-800/40" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, business, or email..."
                  className="input-base pl-10"
                  data-testid="search-input"
                />
              </div>
              <Button type="submit" className="btn-secondary" data-testid="search-btn">
                Search
              </Button>
            </form>
            <Button
              onClick={() => {
                setSearchQuery("");
                fetchLeads();
              }}
              variant="ghost"
              className="text-neutral-800/60 hover:text-navy"
              data-testid="refresh-btn"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-navy/30 border-t-navy rounded-full mx-auto mb-4" />
              <p className="text-neutral-800/60 font-body">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center" data-testid="no-leads-message">
              <Users className="w-12 h-12 text-neutral-800/20 mx-auto mb-4" />
              <p className="text-neutral-800/60 font-body">
                No leads found. New submissions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-100">
                    <TableHead className="font-heading font-bold text-navy">
                      Name
                    </TableHead>
                    <TableHead className="font-heading font-bold text-navy">
                      Business
                    </TableHead>
                    <TableHead className="font-heading font-bold text-navy">
                      Contact
                    </TableHead>
                    <TableHead className="font-heading font-bold text-navy">
                      Service
                    </TableHead>
                    <TableHead className="font-heading font-bold text-navy">
                      Date
                    </TableHead>
                    <TableHead className="font-heading font-bold text-navy text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className="hover:bg-neutral-50"
                      data-testid={`lead-row-${lead.id}`}
                    >
                      <TableCell className="font-body font-medium text-navy">
                        {lead.name}
                      </TableCell>
                      <TableCell className="font-body text-neutral-800/80">
                        {lead.business_name}
                        {lead.website && (
                          <a
                            href={lead.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center ml-2 text-orange hover:text-orange-hover"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="font-body text-neutral-800/80">
                        <div className="flex flex-col gap-1">
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center gap-1 text-navy hover:text-orange"
                          >
                            <Phone className="w-3 h-3" />
                            <span className="font-mono text-sm">{lead.phone}</span>
                          </a>
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-1 text-navy hover:text-orange"
                          >
                            <Mail className="w-3 h-3" />
                            <span className="text-sm">{lead.email}</span>
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-block bg-navy/10 text-navy font-body text-xs font-medium px-2 py-1 rounded-sm">
                          {lead.service_type}
                        </span>
                      </TableCell>
                      <TableCell className="font-body text-neutral-800/60 text-sm">
                        {formatDate(lead.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-error hover:text-error hover:bg-error/10"
                              data-testid={`delete-btn-${lead.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Lead?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the lead from{" "}
                                <strong>{lead.name}</strong> at{" "}
                                <strong>{lead.business_name}</strong>. This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(lead.id)}
                                className="bg-error hover:bg-error/90"
                                data-testid={`confirm-delete-${lead.id}`}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
