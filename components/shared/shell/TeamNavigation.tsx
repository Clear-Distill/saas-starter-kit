import { Cog6ToothIcon, CodeBracketIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, DocumentDuplicateIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import NavigationItems from './NavigationItems';
import { NavigationProps, MenuItem } from './NavigationItems';

interface NavigationItemsProps extends NavigationProps {
  slug: string;
}

const TeamNavigation = ({ slug, activePathname }: NavigationItemsProps) => {
  const { t } = useTranslation('common');

  const menus: MenuItem[] = [
    {
      name: t('dashboard'),
      href: `/teams/${slug}/dashboard`,
      icon: ChartBarIcon,
      active: activePathname === `/teams/${slug}/dashboard`,
    },
    {
      name: t('chat-history'),
      href: `/teams/${slug}/chat/history`,
      icon: ChatBubbleLeftRightIcon,
      active: activePathname?.startsWith(`/teams/${slug}/chat`),
    },
    {
      name: t('insights'),
      icon: DocumentTextIcon,
      href: `/teams/${slug}/reports`,
      active: activePathname?.startsWith(`/teams/${slug}/reports`),
      items: [
        {
          name: t('reports'),
          href: `/teams/${slug}/reports`,
          active: activePathname === `/teams/${slug}/reports`,
        },
      ],
    },
    {
      name: t('my-documents'),
      href: `/teams/${slug}/my-documents`,
      icon: DocumentDuplicateIcon,
      active: activePathname === `/teams/${slug}/my-documents`,
    },
    {
      name: t('all-products'),
      href: `/teams/${slug}/products`,
      icon: CodeBracketIcon,
      active: activePathname === `/teams/${slug}/products`,
    },
    {
      name: t('settings'),
      href: `/teams/${slug}/settings`,
      icon: Cog6ToothIcon,
      active:
        activePathname?.startsWith(`/teams/${slug}/settings`),
    },
  ];

  return <NavigationItems menus={menus} />;
};

export default TeamNavigation;
