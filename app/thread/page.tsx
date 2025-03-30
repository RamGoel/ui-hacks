'use client'
import { CategoriesSidebar } from "@/components/CategoriesSidebar";
import { NewThreadForm } from "@/components/NewThreadForm";
import { Thread } from "@/components/Thread";
import { categories, threads as threadsData } from "@/lib/data";
import { useForumStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownAZ, ChevronDown, Flame, Search, ThumbsUp, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ThreadSkeleton = () => {
  return (
    <motion.div 
      className="p-4"
      initial={{ filter: "blur(10px)" }}
      animate={{ filter: "blur(0px)" }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
    >
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="flex space-x-2">
            <div className="h-6 w-16 bg-muted rounded" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Home() {
  const {
    threads,
    selectedCategories,
    setThreads
  } = useForumStore();

  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'upvotes'>('latest');
  const [tagSearch, setTagSearch] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      setThreads(threadsData);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter threads based on selected categories and tags
  const filteredThreads = useMemo(() => {
    let filtered = threads;

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(thread => selectedCategories.includes(thread.categoryId));
    }

    // Filter by tags
    if (tagSearch.trim()) {
      const searchTags = tagSearch.toLowerCase().split(',').map(tag => tag.trim());
      filtered = filtered.filter(thread =>
        searchTags.some(tag =>
          thread.tags.some(threadTag => threadTag.toLowerCase().includes(tag))
        )
      );
    }

    return filtered;
  }, [threads, selectedCategories, tagSearch]);

  // Filter and sort threads
  const sortedThreads = useMemo(() => {
    let sorted = [...filteredThreads];
    switch (sortBy) {
      case 'popular':
        sorted.sort((a, b) => b.views - a.views);
        break;
      case 'upvotes':
        sorted.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'latest':
      default:
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [filteredThreads, sortBy]);


  if(isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Fetching threads...</h2>
                <ThreadSkeleton />
                <ThreadSkeleton />
                <ThreadSkeleton />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Threads List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <motion.div
                    layout
                    className="flex items-center space-x-2"
                  >
                    {
                      isSearchExpanded ? null : <motion.h2
                        layout
                        animate={{ opacity: isSearchExpanded ? 0 : 1 }}
                        className="text-xl font-semibold text-slate-900"
                      >
                        Latest Discussions
                      </motion.h2>
                    }
                    <motion.div
                      layout
                      className={cn(
                        "flex items-center relative p-1 text-sm rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                        isSearchExpanded ? "border border-slate-200 pl-2" : ""
                      )}
                    >
                      <motion.input
                        layout
                        initial={{ width: 0, opacity: 0 }}
                        animate={{
                          width: isSearchExpanded ? 300 : 0,
                          opacity: isSearchExpanded ? 1 : 0
                        }}
                        transition={{ duration: 0.2 }}
                        type="text"
                        placeholder="Search by tags (comma-separated)"
                        value={tagSearch}
                        onChange={(e) => setTagSearch(e.target.value)}
                        className="w-full bg-transparent focus:outline-none"
                      />
                      <motion.button
                        layout
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                        className="p-2 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
                      >
                        {isSearchExpanded ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>
                <motion.div
                  layout
                  className="flex items-center ml-auto mr-4 space-x-2"
                >
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 border border-slate-200 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors flex items-center space-x-1"
                      >
                        <span className="text-sm">Sort by</span>
                        <ChevronDown className="h-4 w-4" />
                      </motion.button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className="min-w-[180px] bg-white text-slate-900 rounded-lg p-1 shadow-lg border border-slate-200"
                        sideOffset={5}
                      >
                        <DropdownMenu.Item
                          className={cn(
                            "flex items-center space-x-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                            "hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900",
                            sortBy === 'latest' && "bg-slate-50 text-slate-900"
                          )}
                          onClick={() => setSortBy('latest')}
                        >
                          <ArrowDownAZ className="h-4 w-4" />
                          <span>Latest</span>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className={cn(
                            "flex items-center space-x-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                            "hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900",
                            sortBy === 'popular' && "bg-slate-50 text-slate-900"
                          )}
                          onClick={() => setSortBy('popular')}
                        >
                          <Flame className="h-4 w-4" />
                          <span>Most Viewed</span>
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                          className={cn(
                            "flex items-center space-x-2 px-3 py-2 text-sm rounded-md cursor-pointer outline-none",
                            "hover:bg-slate-50 hover:text-slate-900 focus:bg-slate-50 focus:text-slate-900",
                            sortBy === 'upvotes' && "bg-slate-50 text-slate-900"
                          )}
                          onClick={() => setSortBy('upvotes')}
                        >
                          <ThumbsUp className="h-4 w-4" />
                          <span>Most Upvoted</span>
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewThreadForm(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  New Thread
                </motion.button>
              </div>

              {showNewThreadForm && (
                <NewThreadForm closeForm={() => setShowNewThreadForm(false)} />
              )}

              <div className="divide-y min-h-[500px] divide-slate-200">
                <AnimatePresence>
                  {
                    sortedThreads.filter(thread => !thread.parentId).map((thread) => (
                      <motion.div
                        key={thread.id}
                        initial={{ opacity: 0, filter: "blur(10px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                      >
                        <Thread thread={thread} />
                      </motion.div>
                    ))
                  }
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Sidebar - Categories */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <CategoriesSidebar categories={categories} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

