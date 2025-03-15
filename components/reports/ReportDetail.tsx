import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { DocumentArrowDownIcon, SpeakerWaveIcon, ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ReportNavigation from './ReportNavigation';
import ReportContent from './ReportContent';
import ReportChat from './ReportChat';

interface Section {
  id: string;
  number: string;
  title: string;
  content: string;
  subsections?: Section[];
}

interface Report {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  createdAt: string;
}

interface ReportDetailProps {
  report: Report;
  teamSlug: string;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report, teamSlug }) => {
  const { t } = useTranslation('common');
  const [activeSection, setActiveSection] = useState<string>(report.sections[0]?.id || '');
  const [activeSubsection, setActiveSubsection] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Find the active section and subsection objects
  const currentSection = report.sections.find(section => section.id === activeSection);
  const currentSubsection = currentSection?.subsections?.find(
    subsection => subsection.id === activeSubsection
  );

  // Determine which content to display
  const contentToDisplay = currentSubsection || currentSection;

  const handleDownload = (type: 'summary' | 'full' | 'audio') => {
    // Download logic would go here
    console.log(`Downloading ${type} for report ${report.id}`);
  };

  return (
    <div className="relative">
      <div className={`flex flex-col ${isChatOpen ? 'lg:mr-96' : ''} transition-all duration-300`}>
        {/* Report Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {report.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {report.description}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleDownload('summary')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
              {t('executive-summary')}
            </button>
            <button
              onClick={() => handleDownload('full')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
              {t('full-report')}
            </button>
            <button
              onClick={() => handleDownload('audio')}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <SpeakerWaveIcon className="h-4 w-4 mr-1" />
              {t('audio-version')}
            </button>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-auto"
            >
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
              {isChatOpen ? t('close-chat') : t('open-chat')}
            </button>
          </div>
        </div>

        {/* Navigation and Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Navigation Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <ReportNavigation
              sections={report.sections}
              activeSection={activeSection}
              activeSubsection={activeSubsection}
              onSectionChange={setActiveSection}
              onSubsectionChange={setActiveSubsection}
            />
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {contentToDisplay ? (
              <ReportContent content={contentToDisplay} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300">
                  {t('select-section')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-96 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 ease-in-out ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('chat-assistant')}
            </h3>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <ReportChat reportId={report.id} />
        </div>
      </div>

      {/* Mobile Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-4 right-4 md:hidden z-50 p-3 rounded-full shadow-lg ${
          isChatOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
      >
        {isChatOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default ReportDetail;
