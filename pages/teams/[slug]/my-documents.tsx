import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Error, Loading, Card } from '@/components/shared';
import { TeamTab } from '@/components/team';
import useTeam from 'hooks/useTeam';
import env from '@/lib/env';
import { TeamFeature } from 'types';
import { useState, useEffect } from 'react';
import { DocumentTextIcon, DocumentPlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock data for user documents
const mockUserDocuments = [
  {
    id: 'doc-1',
    title: 'Q1 Sales Analysis',
    description: 'Personal analysis of Q1 sales performance across regions.',
    createdAt: '2025-03-01T10:30:00Z',
    fileType: 'pdf',
  },
  {
    id: 'doc-2',
    title: 'Customer Feedback Summary',
    description: 'Summary of customer feedback collected from support tickets.',
    createdAt: '2025-02-25T14:15:00Z',
    fileType: 'docx',
  },
  {
    id: 'doc-3',
    title: 'Product Roadmap Draft',
    description: 'Draft of the product roadmap for the next two quarters.',
    createdAt: '2025-02-20T09:45:00Z',
    fileType: 'pptx',
  },
];

const MyDocuments = ({ teamFeatures }: { teamFeatures: TeamFeature }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const { isLoading, isError, team } = useTeam();
  const [documents, setDocuments] = useState<typeof mockUserDocuments>([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);

  useEffect(() => {
    // In a real implementation, this would be an API call to fetch user documents
    // For now, we'll use mock data with a simulated delay
    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setDocuments(mockUserDocuments);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setIsLoadingDocuments(false);
      }
    };

    if (team) {
      fetchDocuments();
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
      <TeamTab activeTab="my-documents" team={team} teamFeatures={teamFeatures} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('my-documents')}
          </h1>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => {
              // Upload document logic would go here
              alert('Upload document functionality would be implemented here');
            }}
          >
            <DocumentPlusIcon className="h-5 w-5 mr-2" />
            {t('upload-document')}
          </button>
        </div>

        {isLoadingDocuments ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.length > 0 ? (
              documents.map((document) => (
                <Card key={document.id}>
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-2" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {document.title}
                        </h3>
                      </div>
                      <span className="text-xs font-medium uppercase bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                        {document.fileType}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {document.description}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(document.createdAt).toLocaleDateString()}
                    </div>
                    <div className="pt-2 flex space-x-3">
                      <Link
                        href={`/teams/${slug}/reports/${document.id}`}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {t('view')}
                      </Link>
                      <button
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => {
                          // Download document logic would go here
                          alert(`Download ${document.title}`);
                        }}
                      >
                        {t('download')}
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center border border-gray-200 dark:border-gray-700">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {t('no-documents')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t('upload-your-first-document')}
                  </p>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      // Upload document logic would go here
                      alert('Upload document functionality would be implemented here');
                    }}
                  >
                    <DocumentPlusIcon className="h-5 w-5 mr-2" />
                    {t('upload-document')}
                  </button>
                </div>
              </div>
            )}
          </div>
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

export default MyDocuments;
