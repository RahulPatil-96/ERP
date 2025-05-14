import React, { useState } from 'react';
import { MessageSquare, Search, Users, ThumbsUp, MessageCircle, Share2, Filter, BookOpen } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  category: string;
  tags: string[];
  likes: number;
  replies: number;
  timestamp: string;
}

const SAMPLE_POSTS: Post[] = [
  {
    id: 1,
    title: 'Help with Calculus Integration Problem',
    content: "I'm struggling with solving this complex integration problem. Can someone help explain the steps?",
    author: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100',
      role: 'Student',
    },
    category: 'Mathematics',
    tags: ['calculus', 'integration', 'help-needed'],
    likes: 12,
    replies: 5,
    timestamp: '2024-02-28T10:30:00Z',
  },
  {
    id: 2,
    title: 'Physics Lab Report Format Discussion',
    content: 'What are the key components we need to include in the upcoming physics lab report?',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
      role: 'Student',
    },
    category: 'Physics',
    tags: ['lab-report', 'formatting', 'guidelines'],
    likes: 8,
    replies: 3,
    timestamp: '2024-02-27T15:45:00Z',
  },
  {
    id: 3,
    title: 'Study Group for Midterm Exams',
    content: 'Looking to form a study group for the upcoming midterm exams. Anyone interested?',
    author: {
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100',
      role: 'Student',
    },
    category: 'General',
    tags: ['study-group', 'midterms', 'collaboration'],
    likes: 15,
    replies: 8,
    timestamp: '2024-02-26T09:15:00Z',
  },
];

const CATEGORIES = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'General'];

export function Discussion() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });

  const filteredPosts = SAMPLE_POSTS.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle new post submission
    setShowNewPostForm(false);
    setNewPost({ title: '', content: '', category: 'General' });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discussion Forum"
        subtitle="Engage with your peers and discuss academic topics"
        icon={MessageSquare}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
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

          <button
            onClick={() => setShowNewPostForm(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            New Discussion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm text-gray-600">{post.author.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm">
                  {post.category}
                </span>
              </div>

              <p className="mt-4 text-gray-600">{post.content}</p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button aria-label="Like post" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                    <ThumbsUp className="w-5 h-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button aria-label="View comments" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.replies}</span>
                  </button>
                  <button aria-label="Share post" className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-indigo-600" />
              Active Users
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Alex Johnson', status: 'online' },
                { name: 'Sarah Chen', status: 'online' },
                { name: 'Michael Brown', status: 'away' },
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{user.name}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-indigo-600" />
              Popular Topics
            </h2>
            <div className="space-y-2">
              {[
                'Calculus Help',
                'Lab Reports',
                'Study Groups',
                'Assignment Tips',
                'Exam Preparation',
              ].map((topic, index) => (
                <button
                  key={index}
                  className="w-full text-left p-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {showNewPostForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Discussion</h2>
            <form onSubmit={handleNewPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {CATEGORIES.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Create Discussion
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
