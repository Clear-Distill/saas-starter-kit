import { GetServerSidePropsContext } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Error, Loading } from '@/components/shared';
import { TeamTab } from '@/components/team';
import ReportDetail from '@/components/reports/ReportDetail';
import useTeam from 'hooks/useTeam';
import env from '@/lib/env';
import { TeamFeature } from 'types';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { createClient } from '@supabase/supabase-js';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';

// Import the interfaces from ReportDetail to ensure compatibility
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

// Interface for Supabase content items
interface SupabaseContentItem {
  id: string;
  template_name: string;
  topic_name: string;
  subtopic_level1: string;
  subsubtopic_level2?: string;
  word_limit?: number;
  category: string;
  generated_content?: string;
  generated_content_compiled: string;
  reading_order?: number;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dynamic report structure that will be populated from Supabase data
let REPORT_STRUCTURE: {
  number: string;
  title: string;
  subtopics: { number: string; title: string; key: string }[];
}[] = [
  {
    "number": "1",
    "title": "Executive Summary",
    "subtopics": [
      { "number": "1.1", "title": "INTRODUCTION", "key": "introduction" },
      { "number": "1.2", "title": "MARKET OVERVIEW AND INDUSTRY TRENDS", "key": "market_overview_industry_trends" },
      { "number": "1.3", "title": "AUDIENCE ANALYSIS", "key": "audience_analysis" },
      { "number": "1.4", "title": "CONSUMER BEHAVIOR", "key": "consumer_behavior" },
      { "number": "1.5", "title": "PRODUCT POSITIONING", "key": "product_positioning" },
      { "number": "1.6", "title": "COMPETITIVE ANALYSIS", "key": "competitive_analysis" },
      { "number": "1.7", "title": "PRICING STRATEGY", "key": "pricing_strategy" },
      { "number": "1.8", "title": "DISTRIBUTION STRATEGY", "key": "distribution_strategy" },
      { "number": "1.9", "title": "REGULATORY ENVIRONMENT", "key": "regulatory_environment" },
      { "number": "1.10", "title": "MARKETING INSIGHTS", "key": "marketing_insights" },
      { "number": "1.11", "title": "RISK ASSESSMENT", "key": "risk_assessment" },
      { "number": "1.12", "title": "SWOT ANALYSIS", "key": "swot_analysis" }
    ]
  },
  {
    "number": "2",
    "title": "Market Overview",
    "subtopics": [
      { "number": "2.1", "title": "Industry Size & Growth Trends", "key": "industry_size_and_growth_trends" },
      { "number": "2.2", "title": "Competitive Landscape", "key": "competitive_landscape" },
      { "number": "2.3", "title": "Consumer Preferences & Demand", "key": "consumer_preferences_and_demand" },
      { "number": "2.4", "title": "Opportunities & Challenges", "key": "opportunities_and_challenges" },
      { "number": "2.5", "title": "Regional Insights", "key": "regional_insights" }
    ]
  },
  {
    "number": "3",
    "title": "Target Audience Analysis",
    "subtopics": [
      { "number": "3.1", "title": "Demographics", "key": "demographics" },
      { "number": "3.2", "title": "Psychographics", "key": "psychographics" },
      { "number": "3.3", "title": "Pain Points and Needs", "key": "pain_points_and_needs" }
    ]
  },
  {
    "number": "4",
    "title": "Consumer Behavior",
    "subtopics": [
      { "number": "4.1", "title": "Buying Preferences", "key": "buying_preferences" },
      { "number": "4.2", "title": "Decision-Making Factors", "key": "decision_making_factors" },
      { "number": "4.3", "title": "Cultural or Regional Influences", "key": "cultural_or_regional_influences" }
    ]
  },
  {
    "number": "5",
    "title": "Product Positioning",
    "subtopics": [
      { "number": "5.1", "title": "Product Features", "key": "product_features" },
      { "number": "5.2", "title": "Perception", "key": "perception" },
      { "number": "5.3", "title": "Localization Needs", "key": "localization_needs" }
    ]
  },
  {
    "number": "6",
    "title": "Competitive Analysis",
    "subtopics": [
      { "number": "6.1", "title": "Key Competitors", "key": "key_competitors" },
      { "number": "6.2", "title": "Competitive Strategies", "key": "competitive_strategies" },
      { "number": "6.3", "title": "Market Gaps", "key": "market_gaps" },
      { "number": "6.4", "title": "Business Relevance for Niphean", "key": "business_relevance_for_niphean" }
    ]
  },
  {
    "number": "7",
    "title": "Pricing Strategy",
    "subtopics": [
      { "number": "7.1", "title": "Price Sensitivity", "key": "price_sensitivity" },
      { "number": "7.2", "title": "Pricing Models", "key": "pricing_models" },
      { "number": "7.3", "title": "Discounts and Promotions", "key": "discounts_and_promotions" },
      { "number": "7.4", "title": "Business Relevance for Niphean", "key": "business_relevance_for_niphean" }
    ]
  },
  {
    "number": "8",
    "title": "Distribution Channels",
    "subtopics": [
      { "number": "8.1", "title": "Preferred Channels", "key": "preferred_channels" },
      { "number": "8.2", "title": "Channel Partners", "key": "channel_partners" },
      { "number": "8.3", "title": "Barriers to Entry", "key": "barriers_to_entry" }
    ]
  },
  {
    "number": "9",
    "title": "Regulatory Environment",
    "subtopics": [
      { "number": "9.1", "title": "Legal and Compliance Requirements", "key": "legal_and_compliance_requirements" },
      { "number": "9.2", "title": "Trade Policies", "key": "trade_policies" },
      { "number": "9.3", "title": "Environmental Regulations", "key": "environmental_regulations" }
    ]
  },
  {
    "number": "10",
    "title": "Marketing Insights",
    "subtopics": [
      { "number": "10.1", "title": "Marketing Channels", "key": "marketing_channels" },
      { "number": "10.2", "title": "Messaging", "key": "messaging" },
      { "number": "10.3", "title": "Advertising Trends", "key": "advertising_trends" },
      { "number": "10.4", "title": "Data and Market Context", "key": "data_and_market_context" }
    ]
  },
  {
    "number": "11",
    "title": "Risk Assessment",
    "subtopics": [
      { "number": "11.1", "title": "Market Risks", "key": "market_risks" },
      { "number": "11.2", "title": "Implications for Niphean", "key": "implications_for_niphean" }
    ]
  },
  {
    "number": "12",
    "title": "SWOT Analysis",
    "subtopics": [
      { "number": "12.1", "title": "Strengths", "key": "strengths" },
      { "number": "12.2", "title": "Weaknesses", "key": "weaknesses" },
      { "number": "12.3", "title": "Opportunities", "key": "opportunities" },
      { "number": "12.4", "title": "Threats", "key": "threats" }
    ]
  },
  {
    "number": "13",
    "title": "Conclusions and Recommendations",
    "subtopics": [
      { "number": "13.1", "title": "Key Conclusions", "key": "strategic_recommendations" },
      { "number": "13.2", "title": "Strategic Recommendations", "key": "product_expansion_recommendations" }
    ]
  }
];

// Function to create report structure from Supabase data
const createReportFromSupabase = async (reportId: string): Promise<Report> => {
  try {
    // Fetch report content from Supabase
    const { data: contentData, error: contentError } = await supabase
      .from('report23')
      .select('*')
      .order('reading_order', { ascending: true });
    
    if (contentError) throw contentError;
    
    if (!contentData || contentData.length === 0) {
      throw { message: 'No report data found' };
    }
    
    // Group data by topic_name and maintain the order from REPORT_STRUCTURE
    const topicGroups: Record<string, SupabaseContentItem[]> = {};
    
    // First, initialize the groups with the order from REPORT_STRUCTURE
    REPORT_STRUCTURE.forEach(section => {
      topicGroups[section.title] = [];
    });
    
    // Then populate with actual data
    contentData.forEach(item => {
      if (!topicGroups[item.topic_name]) {
        topicGroups[item.topic_name] = [];
      }
      topicGroups[item.topic_name].push(item);
    });
    
    // Create sections based on the original REPORT_STRUCTURE order
    const orderedSections = REPORT_STRUCTURE.map((section, sectionIndex) => {
      const items = topicGroups[section.title] || [];
      
      // Map subtopics while preserving the original numbering
      const subtopics = items.map((item, subtopicIndex) => {
        // Find the matching subtopic in the original structure if possible
        const originalSubtopic = section.subtopics.find(s => 
          s.title.toLowerCase() === item.subtopic_level1.toLowerCase()
        );
        
        return {
          number: originalSubtopic ? originalSubtopic.number : `${sectionIndex + 1}.${subtopicIndex + 1}`,
          title: item.subtopic_level1,
          key: item.id
        };
      });
      
      // Sort subtopics by their number
      subtopics.sort((a, b) => {
        const aNum = parseFloat(a.number.replace(/[^0-9.]/g, ''));
        const bNum = parseFloat(b.number.replace(/[^0-9.]/g, ''));
        return aNum - bNum;
      });
      
      return {
        number: section.number,
        title: section.title,
        subtopics: subtopics
      };
    });
    
    // Filter out sections with no content
    const filteredSections = orderedSections.filter(section => section.subtopics.length > 0);
    
    // Update REPORT_STRUCTURE with the ordered and filtered sections
    REPORT_STRUCTURE = filteredSections;
    
    // Initialize the report structure
    const report: Report = {
      id: reportId,
      title: 'Dynamic Report',
      description: 'Generated report based on Supabase data.',
      createdAt: new Date().toISOString(),
      sections: []
    };
    
    // Create sections and subsections based on the dynamic REPORT_STRUCTURE
    report.sections = REPORT_STRUCTURE.map(section => {
      return {
        id: `section-${section.number}`,
        number: section.number,
        title: section.title,
        content: '', // Section content will be empty as we'll use subsections
        subsections: section.subtopics.map(subtopic => {
          // Find the corresponding content item
          const contentItem = contentData.find(item => 
            item.id === subtopic.key
          );
          
          return {
            id: `subsection-${subtopic.number}`,
            number: subtopic.number,
            title: subtopic.title,
            content: contentItem ? JSON.stringify(contentItem) : ''
          };
        })
      };
    });
    
    return report;
  } catch (error) {
    console.error('Error creating report from Supabase:', error);
    
    // Return a fallback report structure
    return {
      id: reportId,
      title: 'Error Loading Report',
      description: 'There was an error loading the report data.',
      createdAt: new Date().toISOString(),
      sections: []
    };
  }
};

const ReportDetailPage = ({ teamFeatures }: { teamFeatures: TeamFeature }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { slug, reportId } = router.query as { slug: string; reportId: string };
  const { isLoading, isError, team } = useTeam();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(true);
  const [supabaseData, setSupabaseData] = useState<SupabaseContentItem[]>([]);
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);
  const [activeContent, setActiveContent] = useState<SupabaseContentItem | null>(null);
  const [keyInsightsContent, setKeyInsightsContent] = useState<SupabaseContentItem | null>(null);
  const [showChatbot, setShowChatbot] = useState<boolean>(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Fetch data from Supabase
  const fetchData = useCallback(async () => {
    try {
      const { data: fetchedData, error: fetchError } = await supabase
        .from('report23')
        .select('*')
        .order('reading_order', { ascending: true });

      if (fetchError) throw fetchError;
      setSupabaseData(fetchedData || []);
    } catch (err) {
      console.error('Error fetching data from Supabase:', err);
    }
  }, []);

  // Find key insights content
  const findKeyInsights = useCallback((reportData: Report) => {
    if (!reportData || !reportData.sections || reportData.sections.length === 0) return null;
    
    // Look for key insights in the first section (Executive Summary)
    const executiveSummary = reportData.sections.find(section => 
      section.title.toLowerCase().includes('executive summary') || 
      section.number === '1'
    );
    
    if (executiveSummary && executiveSummary.subsections && executiveSummary.subsections.length > 0) {
      // Try to find introduction or first subsection
      const introSubsection = executiveSummary.subsections.find(subsection => 
        subsection.title.toLowerCase().includes('introduction') || 
        subsection.number === '1.1'
      ) || executiveSummary.subsections[0];
      
      if (introSubsection && introSubsection.content) {
        return JSON.parse(introSubsection.content);
      }
    }
    
    return null;
  }, []);

  useEffect(() => {
    // Function to fetch report data from Supabase
    const fetchReport = async () => {
      setIsLoadingReport(true);
      try {
        // Fetch Supabase data
        await fetchData();
        
        // Initialize an empty report structure
        const initialReport: Report = {
          id: reportId as string,
          title: 'Loading Report...',
          description: 'Report content is being loaded.',
          createdAt: new Date().toISOString(),
          sections: []
        };
        
        // Set initial report structure
        setReport(initialReport);
        
        // Fetch the full report data
        const fullReport = await createReportFromSupabase(reportId as string);
        
        // Update the report
        setReport(fullReport);
        
        // Set key insights content
        const insights = findKeyInsights(fullReport);
        if (insights) {
          setKeyInsightsContent(insights);
        }
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setIsLoadingReport(false);
      }
    };

    if (team && reportId) {
      fetchReport();
    }
  }, [team, reportId, fetchData, findKeyInsights]);

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
        <div className="flex items-center mb-6">
          <Link
            href={`/teams/${slug}/reports`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            {t('back-to-reports')}
          </Link>
        </div>

        {isLoadingReport ? (
          <Loading />
        ) : report ? (
          <div className="relative">
            <div className="flex flex-col transition-all duration-300">
              {/* Report Header */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {report.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {report.description}
                </p>
              </div>
              
              {/* Downloadable Files and Chatbot Section */}
              <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap items-center justify-between">
                  <div className="flex space-x-4 mb-4 md:mb-0">
                    <a 
                      href="#" 
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.preventDefault();
                        // Download functionality would be implemented here
                        alert('Download Summary functionality would be implemented here');
                      }}
                    >
                      Download Summary
                    </a>
                    <a 
                      href="#" 
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.preventDefault();
                        // Download functionality would be implemented here
                        alert('Download Full Report functionality would be implemented here');
                      }}
                    >
                      Download Full Report
                    </a>
                    <a 
                      href="#" 
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.preventDefault();
                        // Download functionality would be implemented here
                        alert('Download Podcast functionality would be implemented here');
                      }}
                    >
                      Download Podcast
                    </a>
                  </div>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => setShowChatbot(!showChatbot)}
                  >
                    {showChatbot ? 'Hide Chatbot' : 'Show Chatbot'}
                  </button>
                </div>
                
                {/* Chatbot Section */}
                {showChatbot && (
                  <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Chat with your report</h3>
                    <div className="flex">
                      <input
                        type="text"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ask a question about this report..."
                      />
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation and Content */}
              <div className="flex flex-col md:flex-row gap-6">
                {/* Navigation Sidebar */}
                <div className="md:w-64 flex-shrink-0">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3">{t('report-sections')}</h3>
                    <div className="space-y-1">
                      {report.sections.map((section) => (
                        <div key={section.id} className="mb-2">
                          <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                            {section.number}. {section.title}
                          </div>
                          {section.subsections && section.subsections.length > 0 && (
                            <div className="ml-4 space-y-1">
                              {section.subsections.map((subsection) => {
                                const content = subsection.content ? JSON.parse(subsection.content) : null;
                                return (
                                  <button
                                    key={subsection.id}
                                    className={`text-sm text-left w-full px-2 py-1 rounded ${
                                      activeSubtopic === subsection.id
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => {
                                      setActiveSubtopic(subsection.id);
                                      if (content) {
                                        setActiveContent(content);
                                      }
                                    }}
                                  >
                                    {subsection.number} {subsection.title}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              
                {/* Main Content */}
                <div className="flex-grow" ref={mainContentRef}>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                    {activeContent ? (
                      <div className="prose prose-blue dark:prose-invert max-w-none">
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                          {activeContent.topic_name}: {activeContent.subtopic_level1}
                        </h2>
                        
                        {/* Render markdown content */}
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {activeContent.generated_content_compiled}
                        </ReactMarkdown>
                        
                        {/* If category is mermaid, render the diagram below the content */}
                        {activeContent.category === 'mermaid' && (
                          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Diagram</h3>
                            <div dangerouslySetInnerHTML={{ __html: activeContent.generated_content_compiled }} />
                          </div>
                        )}
                      </div>
                    ) : keyInsightsContent ? (
                      <div className="prose prose-blue dark:prose-invert max-w-none">
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                          Key Insights
                        </h2>
                        
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                          {keyInsightsContent.generated_content_compiled}
                        </ReactMarkdown>
                        
                        {keyInsightsContent.category === 'mermaid' && (
                          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Diagram</h3>
                            <div dangerouslySetInnerHTML={{ __html: keyInsightsContent.generated_content_compiled }} />
                          </div>
                        )}
                        
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                          Select a topic from the sidebar to view more detailed information.
                        </p>
                      </div>
                    ) : (
                      <div className="prose prose-blue dark:prose-invert max-w-none">
                        <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                          Select a topic from the sidebar
                        </h2>
                        <p>
                          This report is loaded directly from the Supabase table 'report23'. 
                          The content is organized by topics and subtopics.
                        </p>
                        <p>
                          To view specific content:
                        </p>
                        <ul>
                          <li>Click on any subtopic in the navigation sidebar</li>
                          <li>Content will be rendered as markdown for text</li>
                          <li>Diagrams will be rendered as SVG if the category is 'mermaid'</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Error message={t('report-not-found')} />
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

export default ReportDetailPage;
