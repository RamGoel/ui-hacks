import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Category, useForumStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CategoriesSidebarProps {
  categories: Category[];
}

export function CategoriesSidebar({ categories }: CategoriesSidebarProps) {
  const { threads } = useForumStore();
  return (
    <TooltipProvider>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Categories</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-slate-500" />
              </TooltipTrigger>
              <TooltipContent>
                Click a category to view all threads in that category
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {categories.map((category) => {
              const threadCount = threads.filter(thread => thread.categoryId === category.id).length;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Link
                    href={`/thread/category/${category.slug}`}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm shadow-sm",
                      category.color
                    )}>
                      {category.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {category.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {threadCount} threads
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 