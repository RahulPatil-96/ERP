import {
  Download,
  BookOpen,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
  Presentation,
  Search,
  XCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { useState, useMemo, useCallback } from 'react';

interface Resource {
  title: string;
  type: 'Notes' | 'PPT';
  description: string;
  file: string;
  viewable: boolean;
  size?: string;
  uploaded?: string;
}

interface Unit {
  title: string;
  resources: Resource[];
}

interface Subject {
  name: string;
  lessonPlan: string;
  units: Unit[];
  icon: string;
  color: string;
}

const SUBJECTS: Subject[] = [
  {
    name: 'Computer Science',
    lessonPlan: '/lesson-plans/cs-plan.pdf',
    icon: '💻',
    color: 'bg-blue-100',
    units: [
      {
        title: 'Unit 1: Programming Basics',
        resources: [
          {
            title: 'Intro to Python',
            type: 'Notes',
            description: 'Basic syntax and concepts of Python programming',
            file: '/notes/python-basics.pdf',
            viewable: true,
            size: '2.4 MB',
            uploaded: '2024-03-15'
          },
          {
            title: 'OOP Concepts',
            type: 'PPT',
            description: 'PowerPoint presentation on Object-Oriented Programming',
            file: '/ppts/oop-concepts.pptx',
            viewable: false,
            size: '5.1 MB',
            uploaded: '2024-03-18'
          }
        ]
      },
      {
        title: 'Unit 2: Data Structures',
        resources: [
          {
            title: 'Algorithms Guide',
            type: 'Notes',
            description: 'Common algorithms and their implementations',
            file: '/notes/algorithms.pdf',
            viewable: true,
            size: '3.2 MB',
            uploaded: '2024-03-20'
          },
          {
            title: 'Trees and Graphs',
            type: 'PPT',
            description: 'Visual presentation on tree data structures',
            file: '/ppts/trees-graphs.pptx',
            viewable: true,
            size: '4.3 MB',
            uploaded: '2024-03-22'
          }
        ]
      }
    ]
  },
  {
    name: 'Mathematics',
    lessonPlan: '/lesson-plans/math-plan.pdf',
    icon: '🧮',
    color: 'bg-green-100',
    units: [
      {
        title: 'Unit 1: Calculus',
        resources: [
          {
            title: 'Derivatives Guide',
            type: 'Notes',
            description: 'Complete guide to differential calculus',
            file: '/notes/derivatives.pdf',
            viewable: true,
            size: '1.8 MB',
            uploaded: '2024-03-10'
          },
          {
            title: 'Integration Techniques',
            type: 'PPT',
            description: 'Step-by-step integration methods',
            file: '/ppts/integration.pptx',
            viewable: true,
            size: '3.9 MB',
            uploaded: '2024-03-12'
          }
        ]
      }
    ]
  }
];

export function ResourceSharing() {
  const [viewingNote, setViewingNote] = useState<string | null>(null);
  const [activeUnit, setActiveUnit] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'Notes' | 'PPT'>('all');
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState(false);

  const filteredSubjects = useMemo(() => {
    return SUBJECTS.map(subject => ({
      ...subject,
      units: subject.units.map(unit => ({
        ...unit,
        resources: unit.resources.filter(resource => {
          const matchesSearch =
            resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesType = selectedType === 'all' || resource.type === selectedType;
          return matchesSearch && matchesType;
        }),
      })).filter(unit => unit.resources.length > 0)
    })).filter(subject => subject.units.length > 0);
  }, [searchQuery, selectedType]);

  const handleDownload = useCallback((file: string) => {
    console.log('Download initiated:', file);
    window.open(file, '_blank');
  }, []);

  const handleViewNote = useCallback((file: string) => {
    setPdfLoading(true);
    setPdfError(false);
    setViewingNote(file);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setViewingNote(null);
    setPdfError(false);
  }, []);

  const toggleUnit = useCallback((unitIndex: number) => {
    setActiveUnit(prev => (prev === unitIndex ? null : unitIndex));
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Resource Sharing Portal"
        subtitle="Access course materials, lecture notes, presentations, and study resources"
        icon={BookOpen}
      />

      {/* Controls Section */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex gap-2 items-center justify-end">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              selectedType === 'all' 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setSelectedType('Notes')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              selectedType === 'Notes' 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-4 w-4" /> Notes
          </button>
          <button
            onClick={() => setSelectedType('PPT')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all ${
              selectedType === 'PPT' 
                ? 'bg-purple-500 text-white shadow-md' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Presentation className="h-4 w-4" /> PPT
          </button>
        </div>
      </div>

      {/* Resources List */}
      <div className="max-w-4xl mx-auto space-y-8">
        {filteredSubjects.map((subject, index) => (
          <SubjectCard
            key={index}
            subject={subject}
            activeUnit={activeUnit}
            toggleUnit={toggleUnit}
            handleViewNote={handleViewNote}
            handleDownload={handleDownload}
          />
        ))}
      </div>

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        viewingNote={viewingNote}
        pdfLoading={pdfLoading}
        pdfError={pdfError}
        handleCloseViewer={handleCloseViewer}
      />
    </div>
  );
}

function SubjectCard({
  subject,
  activeUnit,
  toggleUnit,
  handleViewNote,
  handleDownload,
}: {
  subject: Subject;
  activeUnit: number | null;
  toggleUnit: (unitIndex: number) => void;
  handleViewNote: (file: string) => void;
  handleDownload: (file: string) => void;
}) {
  return (
    <Card className="p-6 shadow-xl rounded-2xl bg-white transition-all hover:shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className={`${subject.color} p-3 rounded-xl text-2xl`}>
          {subject.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{subject.name}</h2>
          <p className="text-gray-500">{subject.units.length} Units Available</p>
        </div>
      </div>

      <div className="mb-6">
        <a
          href={subject.lessonPlan}
          className="inline-flex items-center gap-2 px-5 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="w-5 h-5" />
          Download Full Lesson Plan
        </a>
      </div>

      {subject.units.map((unit, unitIndex) => (
        <UnitAccordion
          key={unitIndex}
          unit={unit}
          unitIndex={unitIndex}
          activeUnit={activeUnit}
          toggleUnit={toggleUnit}
          handleViewNote={handleViewNote}
          handleDownload={handleDownload}
        />
      ))}
    </Card>
  );
}

function UnitAccordion({
  unit,
  unitIndex,
  activeUnit,
  toggleUnit,
  handleViewNote,
  handleDownload,
}: {
  unit: Unit;
  unitIndex: number;
  activeUnit: number | null;
  toggleUnit: (unitIndex: number) => void;
  handleViewNote: (file: string) => void;
  handleDownload: (file: string) => void;
}) {
  return (
    <div className="space-y-4">
      <button
        onClick={() => toggleUnit(unitIndex)}
        className="w-full flex justify-between items-center p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
        aria-expanded={activeUnit === unitIndex}
      >
        <h3 className="text-lg font-semibold text-gray-900">{unit.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {unit.resources.length} Resources
          </span>
          {activeUnit === unitIndex ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>

      {activeUnit === unitIndex && (
        <div className="space-y-4 pl-4 border-l-4 border-blue-500 ml-4">
          {unit.resources.map((resource, resourceIndex) => (
            <ResourceCard
              key={resourceIndex}
              resource={resource}
              handleViewNote={handleViewNote}
              handleDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceCard({
  resource,
  handleViewNote,
  handleDownload,
}: {
  resource: Resource;
  handleViewNote: (file: string) => void;
  handleDownload: (file: string) => void;
}) {
  return (
    <div className="p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors shadow-md group">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-gray-900 flex items-center gap-2">
            {resource.type === 'Notes' ? (
              <FileText className="w-5 h-5 text-green-500" />
            ) : (
              <Presentation className="w-5 h-5 text-purple-500" />
            )}
            {resource.title}
          </h4>
          <div className="mt-2 text-sm text-gray-600">{resource.description}</div>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {resource.size && <span>{resource.size}</span>}
          {resource.uploaded && <span className="ml-2"><Clock className="inline w-4 h-4" /> {new Date(resource.uploaded).toLocaleDateString()}</span>}
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => handleViewNote(resource.file)}
          className="flex items-center space-x-2 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
        <button
          onClick={() => handleDownload(resource.file)}
          className="flex items-center space-x-2 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}

function PdfViewerModal({
  viewingNote,
  pdfLoading,
  pdfError,
  handleCloseViewer,
}: {
  viewingNote: string | null;
  pdfLoading: boolean;
  pdfError: boolean;
  handleCloseViewer: () => void;
}) {
  return (
    viewingNote && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl max-w-3xl w-full relative">
          <button
            onClick={handleCloseViewer}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
          >
            <XCircle className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Viewing Note</h3>
          {pdfLoading && <div className="flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-blue-500" /></div>}
          {pdfError && (
            <div className="flex justify-center text-red-500">
              <XCircle className="w-6 h-6 mr-2" />
              <span>Error loading PDF. Please try again later.</span>
              <button onClick={handleCloseViewer} className="ml-4 text-blue-500 underline">Retry</button>
            </div>
          )}
          {!pdfLoading && !pdfError && (
            <iframe
              src={viewingNote}
              width="100%"
              height="600px"
              title="Resource PDF"
              className="border-2 border-gray-300 rounded-lg"
            />
          )}
        </div>
      </div>
    )
  );
}