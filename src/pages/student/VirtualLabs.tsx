import { useState, useEffect, useCallback } from 'react';
import {
  Microscope,
  Play,
  RotateCcw,
  Download,
  Share2,
  ChevronLeft,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/button';
import { Progress } from '../../components/common/Progress';
import { Tooltip } from '../../components/common/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

interface Experiment {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  subject: string;
  duration: string;
  difficulty: string;
  variables?: string[];
}

const EXPERIMENTS: Experiment[] = [
  {
    id: 1,
    title: 'Physics: Wave Motion Simulation',
    description: 'Study wave properties including amplitude, frequency, and wavelength.',
    thumbnail: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=500',
    subject: 'Physics',
    duration: '45 mins',
    difficulty: 'Intermediate',
    variables: ['amplitude', 'frequency', 'wavelength'],
  },
  {
    id: 2,
    title: 'Chemistry: Acid-Base Titration',
    description: 'Determine the concentration of an unknown solution using titration methods.',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=500',
    subject: 'Chemistry',
    duration: '60 mins',
    difficulty: 'Advanced',
    variables: ['concentration', 'volume'],
  },
  {
    id: 3,
    title: 'Biology: Enzyme Reaction Rates',
    description: 'Investigate how temperature and pH affect enzyme-catalyzed reactions.',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=500',
    subject: 'Biology',
    duration: '30 mins',
    difficulty: 'Beginner',
    variables: ['temperature', 'pH'],
  },
  {
    id: 4,
    title: 'Physics: Projectile Motion Analysis',
    description: 'Explore the relationship between launch angle and projectile trajectory.',
    thumbnail: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&q=80&w=500',
    subject: 'Physics',
    duration: '50 mins',
    difficulty: 'Intermediate',
    variables: ['angle', 'initial_velocity'],
  },
  {
    id: 5,
    title: 'Chemistry: Electrochemical Cells',
    description: 'Simulate voltage changes in different electrochemical cell configurations.',
    thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=500',
    subject: 'Chemistry',
    duration: '75 mins',
    difficulty: 'Advanced',
    variables: ['electrode_potential', 'concentration'],
  },
  {
    id: 6,
    title: 'Biology: Plant Transpiration Rates',
    description: 'Measure water loss in plants under different environmental conditions.',
    thumbnail: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&q=80&w=500',
    subject: 'Biology',
    duration: '90 mins',
    difficulty: 'Intermediate',
    variables: ['humidity', 'light_intensity'],
  }
];

const WaveSimulation = ({ amplitude }: { amplitude: number; frequency: number }) => {
  const path = `M 0 100 Q 35 ${100 - amplitude}, 70 100 T 140 100`;

  return (
    <svg viewBox="0 0 140 100" className="w-full h-full">
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        style={{
          transition: 'all 0.3s ease',
        }}
      />
    </svg>
  );
};

export function VirtualLabs() {
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const [variables, setVariables] = useState({ amplitude: 50, frequency: 50, wavelength: 50 });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedExperiment) {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedExperiment]);

  const handleReset = useCallback(() => {
    setVariables({ amplitude: 50, frequency: 50, wavelength: 50 });
    setTimeElapsed(0);
    setProgress(0);
  }, []);

  const handleDownload = async () => {
    if (!selectedExperiment) return;
    const element = document.getElementById('simulation-container');
    if (element) {
      const canvas = await html2canvas(element);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${selectedExperiment.title.replace(/:/g, '')}.png`);
        }
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: selectedExperiment?.title,
        text: `Check out this ${selectedExperiment?.subject} experiment: ${selectedExperiment?.description}`,
        url: window.location.href,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Virtual Labs"
        subtitle="Interactive simulations and virtual experiments"
        icon={Microscope}
      />

      <AnimatePresence mode="wait">
        {!selectedExperiment ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {EXPERIMENTS.map((experiment) => (
              <Card
                key={experiment.id}
                className="overflow-hidden group transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <img
                    src={experiment.thumbnail}
                    alt={experiment.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Button
                    onClick={() => setSelectedExperiment(experiment)}
                    className="absolute bottom-4 left-4 text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Play className="mr-2" />
                    Start Experiment
                  </Button>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">
                      {experiment.subject}
                    </span>
                    <span className="text-sm text-gray-500">{experiment.duration}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{experiment.title}</h3>
                  <p className="text-sm text-gray-600">{experiment.description}</p>
                </div>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <Button
                  onClick={() => setSelectedExperiment(null)}
                  variant="ghost"
                  className="text-gray-600"
                >
                  <ChevronLeft className="mr-2" />
                  Back to Experiments
                </Button>
                <div className="flex gap-2">
                  <Tooltip content="Reset Experiment">
                    <Button variant="ghost" onClick={handleReset}>
                      <RotateCcw />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Download Results">
                    <Button variant="ghost" onClick={handleDownload}>
                      <Download />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Share Experiment">
                    <Button variant="ghost" onClick={handleShare}>
                      <Share2 />
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div id="simulation-container" className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                  <WaveSimulation amplitude={variables.amplitude} frequency={variables.frequency} />
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm">Simulation Time: {formatTime(timeElapsed)}</div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold">Instructions</h3>
                </div>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <span className="text-indigo-600">1.</span>
                    <p>Set up equipment according to the simulation parameters</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-600">2.</span>
                    <p>Adjust variables using the control panel</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-indigo-600">3.</span>
                    <p>Observe wave patterns and record measurements</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold">Variables Control</h3>
                </div>
                <div className="space-y-6">
                  {Object.entries(variables).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="capitalize text-gray-600">{key}</span>
                        <span className="font-medium text-indigo-600">{value}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => setVariables((prev) => ({
                          ...prev,
                          [key]: parseInt(e.target.value),
                        }))}
                        className="w-full range range-sm range-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Microscope className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-lg font-semibold">Experiment Progress</h3>
                </div>
                <div className="space-y-4">
                  <Progress value={progress} />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Elapsed:</span>
                    <span className="font-medium text-gray-900">{formatTime(timeElapsed)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium text-gray-900">92%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completion:</span>
                    <span className="font-medium text-gray-900">75%</span>
                  </div>
                  <Button
                    onClick={() => setIsSubmitting(true)}
                    className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Submit Results
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isSubmitting && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold">Submitting Results...</h3>
              <p className="text-sm text-gray-600">Your results have been submitted successfully!</p>
              <Button onClick={() => setIsSubmitting(false)} className="mt-4">Close</Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}