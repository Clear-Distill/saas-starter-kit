import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Error, Loading } from '@/components/shared';
import { TeamTab } from '@/components/team';
import { ReportsDashboard, ReportChat, AvailableReports } from '@/components/reports';
import useTeam from 'hooks/useTeam';
import env from '@/lib/env';
import { TeamFeature } from 'types';
import { useState, useEffect } from 'react';

// Mock data for reports
const mockReports = [
  {
    id: 'report-1',
    title: 'Nipheans Paddleboard Report',
    description: 'Comprehensive analysis of market trends, opportunities, and competitive landscape.',
    createdAt: '2025-02-15T12:00:00Z',
  },
  {
    id: 'report-2',
    title: 'Nipheans Paddleboard Report (Mandarin)',
    description: 'Detailed analysis of customer behavior, preferences, and satisfaction metrics.',
    createdAt: '2025-02-20T14:30:00Z',
  },
  {
    id: 'report-3',
    title: 'SeeSii Power Tools Report',
    description: 'In-depth evaluation of product performance, usage patterns, and improvement opportunities.',
    createdAt: '2025-03-01T09:15:00Z',
  }
];

const Dashboard = ({ teamFeatures }: { teamFeatures: TeamFeature }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const { isLoading, isError, team } = useTeam();
  const [reports, setReports] = useState<typeof mockReports>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(true);

  useEffect(() => {
    // In a real implementation, this would be an API call to fetch reports
    // For now, we'll use mock data with a simulated delay
    const fetchReports = async () => {
      setIsLoadingReports(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setReports(mockReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setIsLoadingReports(false);
      }
    };

    if (team) {
      fetchReports();
    }
  }, [team]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error message={isError.message} />;
  }

  if (!team) {
    return <Error message={t('team-not-found')} />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Available Reports Section */}
        {isLoadingReports ? (
          <Loading />
        ) : (
          <AvailableReports reports={reports} teamSlug={slug} />
        )}

        {/* Chat Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t('chat')}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {t('chat-welcome-message')}
            </p>
          </div>
          <div className="h-[500px]">
            <ReportChat reportId="dashboard" />
          </div>
        </div>

      </div>
    </>
  );
};

export async function getServerSideProps({
  locale,
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(locale ? await serverSideTranslations(locale, ['common']) : {}),
      teamFeatures: env.teamFeatures,
    },
  };
}

export default Dashboard;
