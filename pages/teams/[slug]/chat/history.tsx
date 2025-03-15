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
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock data for chat history
const mockChatHistory = [
  {
    id: 'chat-1',
    title: 'Market Analysis Discussion',
    lastMessage: 'What are the key growth drivers for Q2?',
    timestamp: '2025-03-04T14:30:00Z',
  },
  {
    id: 'chat-2',
    title: 'Customer Feedback Analysis',
    lastMessage: 'Can you summarize the main customer pain points?',
    timestamp: '2025-03-03T10:15:00Z',
  },
  {
    id: 'chat-3',
    title: 'Competitor Research',
    lastMessage: 'How does our pricing compare to the market?',
    timestamp: '2025-03-01T16:45:00Z',
  },
  {
    id: 'chat-4',
    title: 'Product Feature Discussion',
    lastMessage: 'What features should we prioritize for the next release?',
    timestamp: '2025-02-28T09:20:00Z',
  },
  {
    id: 'chat-5',
    title: 'Sales Performance Review',
    lastMessage: 'Which regions are showing the strongest growth?',
    timestamp: '2025-02-25T11:30:00Z',
  },
];

const ChatHistory = ({ teamFeatures }: { teamFeatures: TeamFeature }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { slug } = router.query as { slug: string };
  const { isLoading, isError, team } = useTeam();
  const [chatHistory, setChatHistory] = useState<typeof mockChatHistory>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    // In a real implementation, this would be an API call to fetch chat history
    // For now, we'll use mock data with a simulated delay
    const fetchChatHistory = async () => {
      setIsLoadingHistory(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setChatHistory(mockChatHistory);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (team) {
      fetchChatHistory();
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
      <TeamTab activeTab="chat" team={team} teamFeatures={teamFeatures} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('chat-history')}
          </h1>
          <Link
            href={`/teams/${slug}/dashboard`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('new-chat')}
          </Link>
        </div>

        {isLoadingHistory ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <Card key={chat.id}>
                  <div className="p-5">
                    <div className="flex items-start">
                      <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-500 mr-3" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {chat.title}
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(chat.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {chat.lastMessage}
                        </p>
                        <div className="mt-3">
                          <Link
                            href={`/teams/${slug}/dashboard?chatId=${chat.id}`}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {t('continue-conversation')} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center border border-gray-200 dark:border-gray-700">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('no-chat-history')}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t('start-new-conversation')}
                </p>
                <Link
                  href={`/teams/${slug}/dashboard`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {t('start-chat')}
                </Link>
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

export default ChatHistory;
