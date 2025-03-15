import React from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

interface Section {
  id: string;
  number: string;
  title: string;
  content: string;
  subsections?: Section[];
}

interface ReportNavigationProps {
  sections: Section[];
  activeSection: string;
  activeSubsection: string;
  onSectionChange: (sectionId: string) => void;
  onSubsectionChange: (subsectionId: string) => void;
}

const ReportNavigation: React.FC<ReportNavigationProps> = ({
  sections,
  activeSection,
  activeSubsection,
  onSectionChange,
  onSubsectionChange,
}) => {
  const { t } = useTranslation('common');

  return (
    <nav className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('table-of-contents')}
        </h3>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => onSectionChange(section.id)}
              className={classNames(
                'w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                {
                  'bg-blue-50 dark:bg-blue-900/20': activeSection === section.id,
                  'font-medium text-blue-600 dark:text-blue-400': activeSection === section.id,
                }
              )}
            >
              <span className="flex items-center">
                <span className="mr-2 text-sm">{section.number}</span>
                <span>{section.title}</span>
              </span>
              {section.subsections && section.subsections.length > 0 && (
                <svg
                  className={classNames('h-5 w-5 transform transition-transform', {
                    'rotate-90': activeSection === section.id,
                  })}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            
            {/* Subsections */}
            {section.subsections && section.subsections.length > 0 && activeSection === section.id && (
              <ul className="bg-gray-50 dark:bg-gray-700/50 pl-4">
                {section.subsections.map((subsection) => (
                  <li key={subsection.id}>
                    <button
                      onClick={() => onSubsectionChange(subsection.id)}
                      className={classNames(
                        'w-full text-left px-4 py-2 flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-sm',
                        {
                          'font-medium text-blue-600 dark:text-blue-400':
                            activeSubsection === subsection.id,
                        }
                      )}
                    >
                      <span className="mr-2">{subsection.number}</span>
                      <span>{subsection.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default ReportNavigation;
