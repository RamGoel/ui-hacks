import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { categories, threads } from './data'

export interface User {
    id: string;
    username: string;
    avatarUrl: string;
    joinDate: string;
    karma: number;
    bio?: string;
    interests: string[];
}

export interface Category {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    threadCount: number;
    slug: string;
}

export interface Thread {
    id: string;
    title: string;
    content: string;
    categoryId: string;
    authorId: string;
    parentId?: string;
    createdAt: string;
    updatedAt: string;
    upvotes: number;
    downvotes: number;
    views: number;
    tags: string[];
}

// Store interface
interface ForumStore {
    // State
    categories: Category[]
    threads: Thread[]
    selectedCategories: string[]
    isLoading: boolean
    error: string | null

    // Actions
    setCategories: (categories: Category[]) => void
    setThreads: (threads: Thread[]) => void
    addThread: (thread: Thread) => void
    updateThread: (thread: Thread) => void
    toggleCategory: (categoryId: string) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
}

export const useForumStore = create<ForumStore>()(
    persist(
        (set, get) => ({
            // Initial state
            categories: categories,
            threads: [],
            selectedCategories: [],
            isLoading: false,
            error: null,

            // Actions
            setCategories: (categories) => set({ categories }),
            setThreads: (threads) => set({ threads }),

            addThread: (thread) =>
                set((state) => ({
                    threads: [...state.threads, thread]
                })),

            updateThread: (thread) =>
                set((state) => ({
                    threads: state.threads.map((t) =>
                        t.id === thread.id ? thread : t
                    ),
                })),

            toggleCategory: (categoryId) =>
                set((state) => ({
                    selectedCategories: state.selectedCategories.includes(categoryId)
                        ? state.selectedCategories.filter((id) => id !== categoryId)
                        : [...state.selectedCategories, categoryId],
                })),

            deleteThread: (threadId: string) =>
                set((state) => ({
                    threads: state.threads.filter((thread) => thread.id !== threadId)
                })),

            upvoteThread: (threadId: string) =>
                set((state) => ({
                    threads: state.threads.map((thread) =>
                        thread.id === threadId
                            ? { ...thread, upvotes: thread.upvotes + 1 }
                            : thread
                    ),
                })),

            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
        }),
        {
            name: 'forum-storage',
            partialize: (state) => ({
                selectedCategories: state.selectedCategories,
            }),
        }
    )
)
