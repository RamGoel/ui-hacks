import { categories } from "@/lib/data";
import { useForumStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { Thread as ThreadType } from "@/lib/store";
import { Link, X } from "lucide-react";

export const NewThreadForm = ({ closeForm, selectedCategory }: { closeForm: () => void, selectedCategory?: string }) => {
  const { addThread } = useForumStore();
  const [newThread, setNewThread] = useState({ title: '', content: '', categoryId: selectedCategory || '' });

  const handleAddThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title || !newThread.content || !newThread.categoryId) return;

    const thread: ThreadType = {
      id: Date.now().toString(),
      ...newThread,
      views: 0,
      upvotes: 0,
      downvotes: 0,
      authorId: "user-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    };

    addThread(thread);
    setNewThread({ title: '', content: '', categoryId: '' });
    closeForm();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setNewThread(prev => ({ ...prev, content }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 border-b border-slate-200"
    >
      <form onSubmit={handleAddThread} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Create New Thread</h3>
          <button
            type="button"
            onClick={closeForm}
            className="text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-slate-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={newThread.title}
            onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter thread title"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="block text-sm font-medium text-slate-700">
            Content
          </label>
          <textarea
            id="content"
            value={newThread.content}
            onChange={handleContentChange}
            placeholder="Write your thread content..."
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 placeholder:text-slate-400 min-h-[150px]"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="relative">
            <select
              value={newThread.categoryId}
              onChange={e => setNewThread(prev => ({ ...prev, categoryId: e.target.value }))}
              className="appearance-none w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Link className="w-4 h-4" />
            Post Thread
          </button>
        </div>
      </form>
    </motion.div>
  );
}
