import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const HeroSection = () => {
  const { t } = useTranslation('common');
  return (
<div className="hero py-52 bg-white">
  <div className="hero-content text-center">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-5xl font-bold text-black">ClearDistill AI</h1>
      <p className="py-6 text-2xl font-normal text-black">
        Transform Data into Your Competitive Advantage
      </p>
      <p className="pb-8 text-lg font-normal text-gray-800">
        ClearDistill leverages advanced AI to deliver market intelligence, strategic insights, 
        and actionable recommendations. Stay ahead of your competitors with AI-driven market 
        research, internal data analytics, conversational AI interfaces, and expertly distilled 
        insights tailored for informed decisions and sustained growth.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          href="/auth/join"
          className="btn btn-primary px-8 no-underline"
        >
          {t('get-started')}
        </Link>
        <Link
          href="/features"
          className="btn btn-outline px-8"
        >
          Explore Features
        </Link>
      </div>
    </div>
  </div>
</div>

  );
};

export default HeroSection;
