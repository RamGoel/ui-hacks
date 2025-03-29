'use client'
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Newspaper, Clock, Globe, ArrowUpRight, TrendingUp, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Article {
    title: string;
    description: string;
    content: string;
    urlToImage: string;
    publishedAt: string;
    source: {
        name: string;
    };
    url: string;
}

const apiURLByCategory = {
    'health': 'https://saurav.tech/NewsAPI/top-headlines/category/health/in.json',
    'politics': 'https://saurav.tech/NewsAPI/everything/cnn.json',
    'business': 'https://saurav.tech/NewsAPI/top-headlines/category/health/in.json',
    'technology': 'https://saurav.tech/NewsAPI/everything/cnn.json',
}

const NewsApp = () => {
    const [featuredStories, setFeaturedStories] = useState<Article[]>([]);
    const [activeCategory, setActiveCategory] = useState('health');
    const [currentSlide, setCurrentSlide] = useState(0);

    const { data: sources, isLoading: isLoadingSources, error: errorSources } = useQuery({
        queryKey: ['sources'],
        queryFn: async () => {
            const res = await fetch('https://saurav.tech/NewsAPI/sources.json')
            const data = await res.json()
            return data.sources
        },
    })
    const { data: news, isLoading, error } = useQuery({
        queryKey: ['news', activeCategory],
        queryFn: async () => {
            const res = await fetch(apiURLByCategory[activeCategory as keyof typeof apiURLByCategory])
            const data = await res.json()
            setFeaturedStories(data.articles.slice(0, 5))
            return data.articles
        },
    })

    // Auto-slide effect
    useEffect(() => {
        if (!isLoading && featuredStories.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % featuredStories.length);
            }, 5000);

            return () => clearInterval(timer);
        }
    }, [isLoading, featuredStories.length]);

    if (isLoading) return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse">
                    <div className="h-12 w-64 bg-gray-200 rounded mb-8"></div>
                    <div className="flex space-x-4 mb-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
                        ))}
                    </div>
                    <div className="h-[400px] bg-gray-200 rounded-lg mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[300px] bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-600 text-center p-4"
        >
            {error.message}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.header
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 border-b border-gray-200 pb-8"
                >
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <Newspaper className="w-10 h-10 text-gray-900" />
                            The Daily News
                        </h1>
                        <p className="text-sm text-gray-500 uppercase tracking-wider">Your trusted source for global news</p>
                    </div>
                    <nav className="flex justify-center space-x-4 mt-8">
                        {['health', 'politics', 'business', 'technology'].map(category => (
                            <motion.button
                                key={category}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`px-6 py-2 text-sm font-medium transition-all ${activeCategory === category
                                    ? 'text-gray-900 border-b-2 border-gray-900'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </motion.button>
                        ))}
                    </nav>
                </motion.header>

                <div className="grid grid-cols-1 lg:grid-cols-16 gap-8">
                    {/* News Sources Sidebar */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-8 flex flex-col gap-6">
                            <div className="bg-gray-50 rounded-lg">
                                <motion.button
                                    className="w-full flex items-center justify-between text-lg font-serif font-bold text-gray-900 p-4 border-b border-gray-200"
                                >
                                    <span>News Sources</span>
                                </motion.button>

                                <AnimatePresence>
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 flex flex-col gap-4">
                                            {sources?.map((source: any) => (
                                                <motion.a
                                                    key={source.id}
                                                    href={source.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                                                ><motion.div
                                                    initial={{ opacity: 0, y: -20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className=""
                                                >
                                                        <div className="flex items-start justify-between mb-2">
                                                            <h3 className="text-sm font-medium text-gray-900">{source.name}</h3>

                                                            <ArrowUpRight className="w-4 h-4" />
                                                        </div>
                                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{source.description}</p>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Globe className="w-3 h-3" />
                                                                {source.country.toUpperCase()}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <TrendingUp className="w-3 h-3" />
                                                                {source.category}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                </motion.a>
                                            ))}
                                        </div>
                                    </motion.div>

                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-9">
                        <section className="mb-12">
                            <div className="relative h-[500px] overflow-hidden rounded-lg">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentSlide}
                                        initial={{ filter: "blur(20px)" }}
                                        animate={{ filter: "blur(0px)" }}
                                        exit={{ filter: "blur(20px)" }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0"
                                    >
                                        <div className="relative h-full">
                                            <img
                                                src={featuredStories[currentSlide].urlToImage}
                                                alt={featuredStories[currentSlide].title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                    className="max-w-3xl"
                                                >
                                                    <span className="text-sm font-medium uppercase tracking-wider mb-2 block">
                                                        Featured Story
                                                    </span>
                                                    <motion.h3
                                                        className="text-4xl font-serif font-bold mb-4 line-clamp-2"
                                                    >
                                                        {featuredStories[currentSlide].title}
                                                    </motion.h3>
                                                    <motion.p
                                                        className="text-lg mb-6 line-clamp-2"
                                                    >
                                                        {featuredStories[currentSlide].description}
                                                    </motion.p>
                                                    <motion.div
                                                        className="flex items-center gap-6 text-sm"
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <Globe className="w-4 h-4" />
                                                            {featuredStories[currentSlide].source.name}
                                                        </span>
                                                        <span className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4" />
                                                            {new Date(featuredStories[currentSlide].publishedAt).toLocaleDateString()}
                                                        </span>
                                                    </motion.div>
                                                    <motion.a
                                                        href={featuredStories[currentSlide].url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 mt-6 bg-white text-gray-900 px-6 py-3 rounded-none hover:bg-gray-100 transition-colors"
                                                    >
                                                        Read Full Story
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </motion.a>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                    {featuredStories.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`h-1 rounded-full transition-all ${currentSlide === index ? 'bg-white w-8' : 'bg-white/50 w-2'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">
                                Latest News
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {news?.slice(5).map((article: Article, index: number) => (
                                    <motion.article
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group"
                                    >
                                        <div className="relative h-48 overflow-hidden mb-4">
                                            <img
                                                src={article.urlToImage}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4 line-clamp-2">
                                                {article.description}
                                            </p>
                                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                                <span className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4" />
                                                    {article.source.name}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(article.publishedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-blue-900 hover:text-blue-800 transition-colors"
                                            >
                                                Read More
                                                <ArrowUpRight className="w-4 h-4" />
                                            </a>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-8 flex flex-col gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Top Stories</h3>
                                <div className="space-y-6">
                                    {news?.slice(0, 5).map((article: Article, index: number) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="group"
                                        >
                                            <a
                                                href={article.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block"
                                            >
                                                <h4 className="text-base font-medium text-gray-900 group-hover:text-blue-900 transition-colors line-clamp-2">
                                                    {article.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                    <span>{article.source.name}</span>
                                                    <span>•</span>
                                                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                                                </div>
                                            </a>
                                        </motion.div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewsApp;