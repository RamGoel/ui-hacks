import { animate, motion } from "framer-motion";
import { Thread as ThreadType, useForumStore } from "@/lib/store";
import { cn, timeAgo } from "@/lib/utils";
import { useState } from "react";
import { users } from "@/lib/data";
import { ArrowUp, Reply, ChevronDown, MessageSquare, Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";

interface ThreadProps {
  thread: {
    id: string;
    title: string;
    content: string;
    categoryId: string;
    authorId: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    upvotes: number;
    views: number;
    downvotes: number;
    tags: string[];
  };
}

export function Thread({ thread }: ThreadProps) {
  const { categories, threads, updateThread, addThread } = useForumStore()
  const author = users.find(u => u.id === thread.authorId);
  const category = categories.find(c => c.id === thread.categoryId);
  const replies = threads.filter(t => t.parentId === thread.id);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [upvoted, setUpvoted] = useState(false);

  if (!author || !category) {
    return null
  }

  const handleReply = () => {
    if (!replyContent.trim()) return;

    addThread({
      id: Date.now().toString(),
      title: '',
      content: replyContent,
      categoryId: category.id,
      authorId: author.id,
      parentId: thread.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      views: 0,
      downvotes: 0,
      tags: [],
    });

    setReplyContent("");
    setReplyingTo(null);
  };

  return (
    <motion.div
      key={thread.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm",
            category?.color
          )}>
            {category?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {
            !thread.parentId && (
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-slate-900 line-clamp-1">{thread.title}</span>
                  <span className="text-sm text-slate-400">•</span>
                  <span className="text-sm text-slate-500">{timeAgo(thread.createdAt)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {thread.views} views
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                  </span>
                </div>
              </div>
            )
          }
          <p className="text-sm text-slate-600 whitespace-pre-wrap line-clamp-3">{thread.content}</p>
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => {
                if (!upvoted) {
                  updateThread({ ...thread, upvotes: thread.upvotes + 1 });
                  setUpvoted(true);
                }
              }}
              className={cn(
                "flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors",
                upvoted && "text-indigo-600"
              )}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{thread.upvotes}</span>
            </button>
            <button
              onClick={() => setReplyingTo(thread.id)}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>
          </div>
          {replyingTo === thread.id && (
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm text-slate-900 placeholder:text-slate-400"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Post Reply
                </button>
              </div>
            </div>
          )}
          {replies.length > 0 && (
            <div className="mt-6 space-y-4 pl-6 border-l-2 border-slate-200">
              {replies.map(reply => (
                <Thread key={reply.id} thread={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
} 