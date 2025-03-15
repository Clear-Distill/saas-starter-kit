import React from 'react';
import { useTranslation } from 'next-i18next';
import ReactMarkdown from 'react-markdown';

interface ContentItem {
  id: string;
  number: string;
  title: string;
  content: string;
}

interface ReportContentProps {
  content: ContentItem;
}

const ReportContent: React.FC<ReportContentProps> = ({ content }) => {
  const { t } = useTranslation('common');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          <span className="text-blue-600 dark:text-blue-400 mr-2">{content.number}</span>
          {content.title}
        </h2>
        <div className="w-16 h-1 bg-blue-500 mt-2 mb-4"></div>
      </div>
      
      <div className="prose prose-blue dark:prose-invert max-w-none">
        <ReactMarkdown>{content.content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ReportContent;
