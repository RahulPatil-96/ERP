import React, { useState } from 'react';
import { Library as LibraryIcon, Search, BookOpen, Clock, Star, Download, Filter, BookMarked } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

const BOOKS = [
  {
    id: 1,
    title: 'Advanced Calculus: A Geometric Approach',
    author: 'James Stewart',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=500',
    subject: 'Mathematics',
    rating: 4.5,
    available: true,
    format: 'PDF',
    description: 'A comprehensive guide to advanced calculus concepts with geometric interpretations.',
  },
  {
    id: 2,
    title: 'Quantum Physics: Principles and Applications',
    author: 'Richard Feynman',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=500',
    subject: 'Physics',
    rating: 4.8,
    available: true,
    format: 'EPUB',
    description: 'An in-depth exploration of quantum mechanics and its real-world applications.',
  },
  {
    id: 3,
    title: 'Organic Chemistry Fundamentals',
    author: 'Marie Curie',
    cover: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=500',
    subject: 'Chemistry',
    rating: 4.2,
    available: false,
    format: 'PDF',
    description: 'Essential concepts and reactions in organic chemistry explained clearly.',
  },
  {
    id: 4,
    title: 'Introduction to Algorithms',
    author: 'Thomas Cormen',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=500',
    subject: 'Computer Science',
    rating: 4.9,
    available: true,
    format: 'PDF',
    description: 'A comprehensive guide to algorithm design and analysis.',
  },
];

const CATEGORIES = [
  'All Subjects',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Computer Science',
  'Biology',
  'Literature',
];

export function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Subjects');
  const [selectedBook, setSelectedBook] = useState<number | null>(null);
  const [recentlyViewed] = useState(BOOKS.slice(0, 3));

  const filteredBooks = BOOKS.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Subjects' || book.subject === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <PageHeader
        title="Digital Library"
        subtitle="Access your course materials and recommended readings"
        icon={LibraryIcon}
      />

      {selectedBook === null ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => setSelectedBook(book.id)}
              >
                <div className="relative h-48">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center text-white space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm">{book.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs">
                      {book.subject}
                    </span>
                    <span className="text-xs text-gray-500">{book.format}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs ${
                        book.available ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {book.available ? 'Available' : 'Checked Out'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Recently Viewed
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentlyViewed.map((book) => (
                <div
                  key={book.id}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                  onClick={() => setSelectedBook(book.id)}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedBook(null)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to library
              </button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-1">
                <img
                  src={BOOKS[0].cover}
                  alt={BOOKS[0].title}
                  className="w-full rounded-xl shadow-lg"
                />
                <div className="mt-6 space-y-4">
                  <button className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    <Download className="w-5 h-5" />
                    <span>Download {BOOKS[0].format}</span>
                  </button>
                  <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-900 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <BookMarked className="w-5 h-5" />
                    <span>Add to Reading List</span>
                  </button>
                </div>
              </div>

              <div className="col-span-2 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {BOOKS[0].title}
                  </h2>
                  <p className="text-lg text-gray-600">by {BOOKS[0].author}</p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{BOOKS[0].rating}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{BOOKS[0].subject}</span>
                  <span className="text-gray-500">•</span>
                  <span className={BOOKS[0].available ? 'text-green-600' : 'text-red-600'}>
                    {BOOKS[0].available ? 'Available' : 'Checked Out'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{BOOKS[0].description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Table of Contents</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <span className="text-gray-600">Chapter {i + 1}</span>
                        <BookOpen className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}