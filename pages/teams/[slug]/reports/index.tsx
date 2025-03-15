import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Error, Loading } from '@/components/shared';
import { TeamTab } from '@/components/team';
import ReportsDashboard from '@/components/reports/ReportsDashboard';
import useTeam from 'hooks/useTeam';
import env from '@/lib/env';
import { TeamFeature } from 'types';
import { useState, useEffect } from 'react';

// Mock data for reports
const mockReports = [
  {
    id: 'report-1',
    title: 'Market Analysis Report',
    description: 'Comprehensive analysis of market trends, opportunities, and competitive landscape.',
    createdAt: '2025-02-15T12:00:00Z',
  },
  {
    id: 'report-2',
    title: 'Customer Insights Report',
    description: 'Detailed analysis of customer behavior, preferences, and satisfaction metrics.',
    createdAt: '2025-02-20T14:30:00Z',
  },
  {
    id: 'report-3',
    title: 'Product Performance Report',
    description: 'In-depth evaluation of product performance, usage patterns, and improvement opportunities.',
    createdAt: '2025-03-01T09:15:00Z',
  },
];

const Reports = ({ teamFeatures }: { teamFeatures: TeamFeature }) => {
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
      <TeamTab activeTab="reports" team={team} teamFeatures={teamFeatures} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('reports')}
          </h1>
        </div>

        {isLoadingReports ? (
          <Loading />
        ) : (
          <ReportsDashboard reports={reports} teamSlug={slug} />
        )}
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

export default Reports;
