import React from 'react';
import { useTranslation } from 'next-i18next';
import { Card } from '@/components/shared';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Report {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface AvailableReportsProps {
  reports: Report[];
  teamSlug: string;
}

const AvailableReports: React.FC<AvailableReportsProps> = ({ reports, teamSlug }) => {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {t('available-reports')}
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
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
              <div className="text-center p-6">
                <p className="text-gray-600 dark:text-gray-300">
                  {t('no-reports-available')}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableReports;
