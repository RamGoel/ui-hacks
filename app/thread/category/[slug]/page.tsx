'use client';

import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { useForumStore } from "@/lib/store";
import { CategoriesSidebar } from "@/components/CategoriesSidebar";
import { cn } from "@/lib/utils";
import { ChevronDown, ArrowDownAZ, Flame, ThumbsUp } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Thread } from "@/components/Thread";
import { NewThreadForm } from "@/components/NewThreadForm";

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const { threads, categories, addThread } = useForumStore();
  const category = categories.find(cat => cat.slug === categorySlug);
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'upvotes'>('latest');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);

  // Filter threads for this category
  const categoryThreads = threads.filter(thread => {
    const threadCategory = categories.find(cat => cat.id === thread.categoryId);
    return threadCategory?.slug === categorySlug;
  });

  // Sort threads
  const sortedThreads = useMemo(() => {
    let sorted = [...categoryThreads];
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
  }, [categoryThreads, sortBy]);

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Category not found</h1>
          <p className="text-slate-500">The category you're looking for doesn't exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Category and Threads */}
          <div className="lg:col-span-8 space-y-8">
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
            >
              <div className="flex items-center space-x-4">
                <div className={cn(
                  "w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl shadow-sm",
                  category.color
                )}>
                  {category.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">{category.name}</h1>
                  <p className="text-slate-500 mt-1">{category.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-slate-500">{categoryThreads.length} threads</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Threads Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-900">Threads</h2>
                <div className="flex items-center space-x-4">
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewThreadForm(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    New Thread
                  </motion.button>
                </div>
              </div>

              {showNewThreadForm && (
                <NewThreadForm selectedCategory={category.id} closeForm={() => setShowNewThreadForm(false)} />
              )}

              <div className="divide-y divide-slate-200">
                <AnimatePresence>
                  {sortedThreads.filter(thread => !thread.parentId).length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 text-center"
                    >
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No threads yet</h3>
                      <p className="text-slate-500">Be the first to start a discussion in this category!</p>
                    </motion.div>
                  ) : (
                    sortedThreads.filter(thread => !thread.parentId).map((thread) => (
                      <Thread key={thread.id} thread={thread} />
                    ))
                  )}
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