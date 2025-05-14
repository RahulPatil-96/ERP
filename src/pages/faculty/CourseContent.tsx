import { useState } from 'react';
import { Trash2, Edit2, Search, FileText, File, Presentation, BookOpen } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';

interface CourseContent {
  id: number;
  title: string;
  description: string;
  content: string;
  file: string | null;
  fileType: 'pdf' | 'doc' | 'ppt' | 'other';
  date: string;
}

export function CourseContent() {
  const [courseContents, setCourseContents] = useState<CourseContent[]>([
    {
      id: 1,
      title: "Introduction to React",
      description: "Learn the basics of React, including components, state, and hooks.",
      content: "React is a JavaScript library for building user interfaces...",
      file: "https://www.w3.org/WAI/WCAG21/quickref/WCAG20_Overview.pdf", // Example PDF file
      fileType: 'pdf', // Example file type
      date: new Date().toLocaleString(),
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      description: "Deep dive into JavaScript features like closures, promises, and async/await.",
      content: "JavaScript is a versatile language used for both front-end and back-end development...",
      file: "https://www.tutorialspoint.com/js/js_tutorial.pdf", // Another example PDF file
      fileType: 'pdf', // Example file type
      date: new Date().toLocaleString(),
    },
    {
      id: 3,
      title: "Web Design Basics",
      description: "Learn the fundamentals of web design including HTML, CSS, and responsive design.",
      content: "Web design involves creating the layout and structure of a website...",
      file: "https://www.ppt.com/website_design_intro.pptx", // Example PowerPoint file
      fileType: 'ppt', // Example file type
      date: new Date().toLocaleString(),
    },
    {
      id: 4,
      title: "Introduction to Python",
      description: "Learn the basics of Python, including variables, loops, and data structures.",
      content: "Python is a popular programming language used for various applications...",
      file: "https://example.com/python_intro.docx", // Example DOCX file
      fileType: 'doc', // Example file type
      date: new Date().toLocaleString(),
    },
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const getFileType = (fileName: string): CourseContent['fileType'] => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (ext === 'doc' || ext === 'docx') return 'doc';
    if (ext === 'ppt' || ext === 'pptx') return 'ppt';
    return 'other';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNewFile(file);
  };

  const handleSaveContent = () => {
    if (!newTitle || !newDescription || !newContent) {
      alert("Please fill all required fields");
      return;
    }

    const newContentItem: CourseContent = {
      id: editingId || courseContents.length + 1,
      title: newTitle,
      description: newDescription,
      content: newContent,
      file: newFile ? URL.createObjectURL(newFile) : null,
      fileType: newFile ? getFileType(newFile.name) : 'other',
      date: new Date().toLocaleString(),
    };

    if (editingId) {
      setCourseContents(prev => prev.map(item => item.id === editingId ? newContentItem : item));
    } else {
      setCourseContents(prev => [newContentItem, ...prev]);
    }

    resetForm();
  };

  const handleEditContent = (content: CourseContent) => {
    setEditingId(content.id);
    setNewTitle(content.title);
    setNewDescription(content.description);
    setNewContent(content.content);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteContent = (id: number) => {
    setCourseContents(prev => prev.filter(item => item.id !== id));
  };

  const resetForm = () => {
    setEditingId(null);
    setNewTitle('');
    setNewDescription('');
    setNewContent('');
    setNewFile(null);
  };

  const FileIcon = ({ type }: { type: CourseContent['fileType'] }) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'doc': return <File className="w-5 h-5 text-blue-500" />;
      case 'ppt': return <Presentation className="w-5 h-5 text-orange-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredContents = courseContents.filter(content =>
    [content.title, content.description, content.content]
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Course Content Manager"
        subtitle="Create and manage your course materials"
        icon={BookOpen}
      />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search and Form Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Search Bar */}
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Content Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Content' : 'Create New Content'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Short Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Detailed Content"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Material
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                    <div className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors">
                      <span className="text-gray-600">
                        {newFile ? newFile.name : 'Choose file...'}
                      </span>
                    </div>
                  </label>
                  {newFile && (
                    <button
                      onClick={() => setNewFile(null)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                {editingId && (
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSaveContent}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Publish'} Content
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content List */}
        <div className="space-y-4">
          {filteredContents.map(content => (
            <div key={content.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-xl font-semibold">{content.title}</h3>
                  </div>
                  <p className="text-gray-600">{content.description}</p>
                  <p className="text-gray-700">{content.content}</p>
                  {content.file && (
                    <div className="flex items-center space-x-2 mt-4">
                      <FileIcon type={content.fileType} />
                      <a
                        href={content.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Download Material
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-4">
                    <span>Posted: {content.date}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEditContent(content)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteContent(content.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}