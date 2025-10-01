"use client";

import React, { useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Checkbox } from '../ui/checkbox'
import { format } from 'date-fns';
import { categoryColors } from '@/data/category';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Tooltip } from '../ui/tooltip';
import { Badge, ChevronDown, ChevronDownIcon, ChevronUp, Clock, MoreHorizontal, RefreshCcw, Search, Trash, Trash2, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/input';
import { Select, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { SelectContent } from '../ui/select';
import useFetch from '@/hooks/use-fetch';
import { bulkDeleteTransactions } from '@/actions/account';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    MONTHLY: "Monthly",
    YEARLY: "Yearly"
}

const TransactionTable = ({ transactions }) => {

  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions)

  const handleBulkDelete = () => {
    setDeleteConfirmId('bulk');
  }

  const handleSingleDelete = (transactionId) => {
    setDeleteConfirmId(transactionId);
  }

  const handleConfirmDelete = async () => {
    if (deleteConfirmId === 'bulk') {
        await deleteFn(selectedIds);
    } else {
      await deleteFn([deleteConfirmId]);
    }
    setDeleteConfirmId(null);
  }

  useEffect(() => {
  
  if (deleted && !deleteLoading) {
    
    if (deleted.success) {
      toast.success("Transactions deleted successfully.")
      setSelectedIds([])
    } else {
      toast.error(deleted.error || "Failed to delete transactions")
    }
  }
}, [deleted, deleteLoading])

  const filteredAndSortedTransactions = useMemo(()=>{
    let result = [...transactions];
    if(searchTerm){
        const searchLower = searchTerm.toLowerCase();
        result = result.filter((transaction) => transaction.description?.toLowerCase().includes(searchLower));
    }
    if(recurringFilter){
        result = result.filter((transaction) => {
            if(recurringFilter == "recurring") return transaction.isRecurring;
            return !transaction.isRecurring;
        });
    }

    if(typeFilter){
        result = result.filter((transaction) => transaction.type === typeFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  },[
    transactions,
    searchTerm,
    typeFilter,
    recurringFilter,
    sortConfig
  ]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length/ITEMS_PER_PAGE)

  const paginatedTransactions = useMemo(()=>{
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);


  const handleSort = (field) => {
    setSortConfig((current) => ({
        field,
        direction: current.field == field && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  const handleSelect = (id) => {
    setSelectedIds(current => current.includes(id)? current.filter(item => item != id):[...current, id]);
  }

  const handleSelectAll = () => {
    setSelectedIds(current => current.length === filteredAndSortedTransactions.length ? [] : filteredAndSortedTransactions.map(t => t.id));
  }

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]);
  }

  return (
    <div className="space-y-6">
        {/* Enhanced Filter Section */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-lg shadow-primary/5">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        placeholder="Search transactions..."
                        className="pl-10 bg-[#393a40]  border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 hover:bg-[#393a40]/70"
                    />
                </div>
                <div className="flex gap-3">
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[120px] bg-[#393a40] border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 hover:bg-[#393a40]/70">
                            <SelectValue placeholder="All Types"/>
                        </SelectTrigger>
                        <SelectContent className="bg-popover/95 backdrop-blur-md border-border/50 rounded-xl shadow-xl">
                            <SelectItem value="INCOME" className="text-white focus:bg-primary/10 focus:text-primary">Income</SelectItem>
                            <SelectItem value="EXPENSE" className="text-white focus:bg-primary/10 focus:text-primary">Expense</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={recurringFilter} onValueChange={(value) => setRecurringFilter(value)}>
                        <SelectTrigger className="w-[160px] bg-[#393a40] border-border/50 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200 hover:bg-[#393a40]/70">
                            <SelectValue placeholder="All Transactions"/>
                        </SelectTrigger>
                        <SelectContent className="bg-popover/95 backdrop-blur-md border-border/50 rounded-xl shadow-xl">
                            <SelectItem value="recurring" className="text-white focus:bg-primary/10 focus:text-primary">Recurring Only</SelectItem>
                            <SelectItem value="non-recurring" className="text-white focus:bg-primary/10 focus:text-primary">Non Recurring Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                
                {selectedIds.length > 0 && (
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleBulkDelete}
                        className="bg-destructive/90 hover:bg-destructive text-destructive-foreground transition-all duration-200 shadow-lg"
                    >
                        <Trash className="h-4 w-4 mr-2"/> 
                        Delete All ({selectedIds.length})
                    </Button>
                )}
                
                {(searchTerm || typeFilter || recurringFilter) && (
                    <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleClearFilters} 
                        title="Clear Filters"
                        className="border-border/50 hover:bg-muted/50 transition-all duration-200"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden shadow-xl shadow-primary/5">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
                        <TableHead className="w-[50px] p-4">
                            <Checkbox 
                                checked={
                                  selectedIds.length === paginatedTransactions.length && paginatedTransactions.length > 0
                                }
                                onCheckedChange={handleSelectAll}
                                className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors"
                            />
                        </TableHead>
                        <TableHead className="cursor-pointer p-4 hover:bg-muted/20 transition-colors" onClick={()=>handleSort("date")}>
                            <div className="flex items-center font-medium">
                                Date{" "}
                                {sortConfig.field === 'date' && 
                                (sortConfig.direction === "asc" ? 
                                    (<ChevronUp className="ml-1 h-4 w-4 text-primary"/>) : (<ChevronDown className="ml-1 h-4 w-4 text-primary"/>) 
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="p-4 font-medium">Description</TableHead>
                        <TableHead className="cursor-pointer p-4 hover:bg-muted/20 transition-colors" onClick={()=>handleSort("category")}>
                            <div className="flex items-center font-medium">
                                Category{" "}
                                {sortConfig.field === 'category' && 
                                (sortConfig.direction === "asc" ? 
                                    (<ChevronUp className="ml-1 h-4 w-4 text-primary"/>) : (<ChevronDown className="ml-1 h-4 w-4 text-primary"/>) 
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="cursor-pointer p-4 hover:bg-muted/20 transition-colors" onClick={()=>handleSort("amount")}>
                            <div className="flex items-center justify-end font-medium">
                                Amount{" "}
                                {sortConfig.field === 'amount' && 
                                (sortConfig.direction === "asc" ? 
                                    (<ChevronUp className="ml-1 h-4 w-4 text-primary"/>) : (<ChevronDown className="ml-1 h-4 w-4 text-primary"/>) 
                                )}
                            </div>
                        </TableHead>
                        <TableHead className="p-4 font-medium">Recurring</TableHead>
                        <TableHead className="w-[50px] p-4"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedTransactions.length === 0? (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                <div className="flex flex-col items-center gap-2">
                                    <Search className="h-8 w-8 opacity-50" />
                                    <p>No transactions found</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ):(
                        paginatedTransactions.map((transaction)=>{
                            return(
                            <TableRow key={transaction.id} className="border-b border-border/30 hover:bg-muted/10 transition-all duration-200 group">
                                <TableCell className="p-4">
                                    <Checkbox 
                                        onCheckedChange={()=>handleSelect(transaction.id)}
                                        checked={selectedIds.includes(transaction.id)}
                                        className="border-white/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-colors"
                                    />
                                </TableCell>
                                <TableCell className="p-4 text-foreground">
                                    {format(new Date(transaction.date), "PP")}
                                </TableCell>
                                <TableCell className="p-4 font-medium text-foreground">
                                    {transaction.description}
                                </TableCell>
                                <TableCell className="p-4 capitalize">
                                    <span 
                                        style={{
                                            background: `${categoryColors[transaction.category]}20`,
                                            borderColor: categoryColors[transaction.category],
                                            color: categoryColors[transaction.category]
                                        }}
                                        className="border font-medium px-3 py-1 rounded-full"
                                    >
                                        {transaction.category}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right font-semibold p-4"
                                style={{
                                    color: transaction.type === "EXPENSE" ? "#ef4444" : "#22c55e"
                                }}>
                                {transaction.type === "EXPENSE" ? "-" : "+"}
                                    ₹{transaction.amount.toFixed(2)}
                                </TableCell>
                                <TableCell className="p-4">
                                    {transaction.isRecurring?(
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <div className="bg-primary/20 hover:bg-primary/30 flex items-center w-fit p-2 text-primary rounded-sm border-primary/30 transition-all duration-200 cursor-help">
                                                        <RefreshCcw className="h-3 w-3 mr-1"/>
                                                        {RECURRING_INTERVALS[transaction.recurringInterval]}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent className="bg-popover border-border/50 mb-3 rounded-lg shadow-xl">
                                                    <div className="p-2">
                                                        <div className="text-sm font-medium">Next Date:</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {format(new Date(transaction.nextRecurringDate), "PP")}
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ):(
                                       <div className="border-border/50 flex items-center p-2 w-fit rounded-sm text-gray-200 bg-muted/20">
                                           <Clock className="h-3 w-3 mr-1"/>
                                           One-Time
                                       </div>
                                    )}
                                </TableCell>
                                <TableCell className="p-4">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-8 w-8 p-0 text-white opacity-50 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white/50 hover:text-card"
                                            >
                                                <MoreHorizontal className="h-4 w-4"/>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-card p-3 rounded-sm shadow-xs shadow-white/30">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive mt-3"
                          onClick={() => handleSingleDelete(transaction.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            );
                        })
                    )}
                </TableBody>
            </Table>
        </div>

        {/* Enhanced Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center h-full justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm transform transition-all duration-300 scale-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
                  Delete Transaction{deleteConfirmId === 'bulk' ? 's' : ''}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Are you sure you want to delete {deleteConfirmId === 'bulk' ? `${selectedIds.length} selected transactions` : 'this transaction'}? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setDeleteConfirmId(null)}
                    variant="outline"
                    className="flex-1 border-border/50 hover:bg-muted/50 transition-all hover:text-white duration-200"
                    disabled={deleteLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmDelete}
                    variant="destructive"
                    className="flex-1 bg-destructive hover:bg-destructive/90 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </div>
                    ) : (
                      'Delete'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-4 shadow-lg shadow-primary/5">
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-border/50 hover:bg-muted/50 transition-all duration-200 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 p-0 transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                          : 'border-border/50 hover:bg-muted/50'
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-border/50 hover:bg-muted/50 transition-all duration-200 disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-center mt-3">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {filteredAndSortedTransactions.length} transactions
              </span>
            </div>
          </div>
        )}
    </div>
  )
}

export default TransactionTable