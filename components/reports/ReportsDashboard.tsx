import React from 'react';
import { useTranslation } from 'next-i18next';
import { Card } from '@/components/shared';
import { DocumentTextIcon, SpeakerWaveIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface ReportsDashboardProps {
  reports: Report[];
  teamSlug: string;
}

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ reports, teamSlug }) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <div className="space-y-8">
      {/* Key Insights Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('key-insights')}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4 text-center">
            {t('market-insights')}
          </h3>
          <ul className="space-y-3 max-w-3xl mx-auto">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                Global market expected to grow at CAGR of 7.2% (2024-2029)
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                Rising popularity of digital solutions driving market expansion
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                Cloud-based segment showing strongest growth
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700 dark:text-gray-300">
                North America remains largest market with 35% share
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Available Reports Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('available-reports')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports && reports.length > 0 ? (
            reports.map((report) => (
              <Card key={report.id}>
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {report.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {report.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </div>
                  <div className="pt-2">
                    <Link
                      href={`/teams/${teamSlug}/reports/${report.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {t('view-report')}
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300">
                  {t('no-reports-available')}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Audio Insights Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('audio-insights')}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <SpeakerWaveIcon className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-4 text-center">
            {t('market-insights-podcast')}
          </h3>
          
          {/* Simple Audio Player */}
          <div className="max-w-md mx-auto">
            <audio 
              className="w-full" 
              controls
              src="/sample-audio.mp3"
            >
              {t('browser-not-support-audio')}
            </audio>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
              {t('listen-to-market-analysis')}
            </p>
          </div>
        </div>
      </section>

      {/* Download Resources Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t('download-resources')}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <div className="max-w-md mx-auto space-y-4">
            <button 
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {/* Download logic */}}
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              {t('executive-summary')} (PDF)
            </button>
            
            <button 
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {/* Download logic */}}
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              {t('full-report')} (PDF)
            </button>
            
            <button 
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {/* Download logic */}}
            >
              <SpeakerWaveIcon className="h-5 w-5 mr-2" />
              {t('podcast')} (MP3)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportsDashboard;
