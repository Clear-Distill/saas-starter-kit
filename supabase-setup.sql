-- Create reports table to store report metadata
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  team_id UUID NOT NULL,
  author_id UUID,
  status TEXT DEFAULT 'draft',
  tags TEXT[]
);

-- Create report_content table to store report sections and subsections
CREATE TABLE IF NOT EXISTS report_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  section_number TEXT NOT NULL,
  section_title TEXT NOT NULL,
  section_content TEXT,
  subsection_number TEXT,
  subsection_title TEXT,
  content TEXT,
  reading_order INTEGER DEFAULT 0,
  content_type TEXT DEFAULT 'text', -- 'text', 'svg', 'image', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS report_content_report_id_idx ON report_content(report_id);
CREATE INDEX IF NOT EXISTS report_content_section_number_idx ON report_content(section_number);
CREATE INDEX IF NOT EXISTS reports_team_id_idx ON reports(team_id);

-- Insert sample report data
INSERT INTO reports (id, title, description, team_id)
VALUES 
  ('sample-report-1', 'Market Analysis Report', 'Comprehensive analysis of market trends, opportunities, and competitive landscape.', '00000000-0000-0000-0000-000000000000')
ON CONFLICT (id) DO NOTHING;

-- Insert sample report content
INSERT INTO report_content (report_id, section_number, section_title, section_content, subsection_number, subsection_title, content, reading_order, content_type)
VALUES
  -- Executive Summary section
  ('sample-report-1', '1', 'Executive Summary', 'Executive summary overview of the market analysis.', NULL, NULL, NULL, 1, 'text'),
  
  -- Executive Summary subsections
  ('sample-report-1', '1', 'Executive Summary', NULL, '1', 'Key Findings', '# Key Findings\n\nOur analysis has identified several critical insights that will shape the market in the coming years:\n\n- **Market Growth**: The global market is projected to grow at a Compound Annual Growth Rate (CAGR) of 7.2% from 2024 to 2029, reaching a value of $325 billion by the end of the forecast period.\n\n- **Regional Dominance**: North America continues to lead the market with a 35% share, followed by Europe (28%) and Asia-Pacific (25%). However, the Asia-Pacific region is expected to witness the highest growth rate during the forecast period.\n\n- **Sustainability Focus**: There is a significant shift towards sustainable and eco-friendly products, with 68% of consumers willing to pay a premium for environmentally responsible options.\n\n- **Digital Transformation**: Companies across all sectors are accelerating their digital initiatives, with 72% of businesses increasing their technology investments compared to previous years.\n\n- **Competitive Landscape**: The market is moderately fragmented, with the top five players accounting for approximately 40% of the total market share.\n\n![Market Share Distribution](https://example.com/market-share.png)\n\nThese findings highlight the dynamic nature of the market and the need for businesses to adapt their strategies to remain competitive in this evolving landscape.', 2, 'text'),
  
  ('sample-report-1', '1', 'Executive Summary', NULL, '2', 'Recommendations', '# Strategic Recommendations\n\nBased on our comprehensive analysis, we recommend the following strategic initiatives:\n\n## 1. Accelerate Digital Transformation\n\n- Implement advanced analytics capabilities to gain deeper customer insights\n- Develop omnichannel customer engagement strategies\n- Invest in automation to improve operational efficiency\n- Enhance cybersecurity measures to protect digital assets\n\n## 2. Embrace Sustainability\n\n- Develop eco-friendly product alternatives\n- Implement sustainable supply chain practices\n- Communicate sustainability efforts transparently to consumers\n- Pursue relevant certifications to validate environmental claims\n\n## 3. Geographic Expansion\n\n- Prioritize entry into high-growth emerging markets\n- Adapt offerings to meet local preferences and regulations\n- Establish strategic partnerships with local entities\n- Implement phased approach to minimize risks\n\n## 4. Innovation Focus\n\n- Increase R&D investments in key technology areas\n- Establish innovation labs to explore disruptive technologies\n- Collaborate with startups and academic institutions\n- Implement agile development methodologies\n\n## 5. Strategic Partnerships\n\n- Identify complementary businesses for potential alliances\n- Explore joint ventures to enter new markets\n- Consider vertical integration opportunities\n- Evaluate M&A targets that align with long-term vision\n\nImplementation of these recommendations should be prioritized based on your organization\'s specific circumstances, capabilities, and strategic objectives.', 3, 'text'),
  
  -- Market Overview section
  ('sample-report-1', '2', 'Market Overview', '# Market Overview\n\nThe global market has experienced significant transformation over the past decade, driven by technological advancements, changing consumer preferences, and evolving regulatory landscapes.\n\n## Market Size and Growth\n\nThe market was valued at $215 billion in 2023 and is projected to reach $325 billion by 2029, growing at a CAGR of 7.2% during the forecast period. This growth is primarily attributed to increasing adoption of digital solutions, rising consumer spending, and expanding applications across various industries.\n\n## Geographic Distribution\n\n- North America: 35%\n- Europe: 28%\n- Asia-Pacific: 25%\n- Rest of the World: 12%\n\n## Market Segments\n\nThe market can be segmented based on:\n\n1. **Product Type**\n   - Segment A (45%)\n   - Segment B (30%)\n   - Segment C (25%)\n\n2. **End-User Industry**\n   - Industry X (38%)\n   - Industry Y (32%)\n   - Industry Z (30%)\n\n3. **Distribution Channel**\n   - Direct Sales (55%)\n   - Distributors (30%)\n   - Online Channels (15%)\n\n## Key Market Drivers\n\n- Technological advancements enabling new applications\n- Increasing consumer demand for personalized solutions\n- Growing focus on sustainability and environmental responsibility\n- Favorable government initiatives and regulatory frameworks\n- Rising investments in research and development', NULL, NULL, NULL, 4, 'text'),
  
  -- Market Overview subsections
  ('sample-report-1', '2', 'Market Overview', NULL, '1', 'Market Size and Growth', '# Market Size and Growth\n\n## Current Market Valuation\n\nThe global market was valued at $215 billion in 2023, representing a 5.8% increase from the previous year. This growth occurred despite challenging macroeconomic conditions, including inflation and supply chain disruptions, highlighting the resilience and fundamental strength of the market.\n\n## Growth Projections\n\nThe market is projected to reach $325 billion by 2029, growing at a Compound Annual Growth Rate (CAGR) of 7.2% during the forecast period (2024-2029). This growth trajectory is expected to be relatively consistent, with slightly higher growth rates anticipated in the earlier years of the forecast period.\n\n## Historical Context\n\nLooking at historical data, the market has demonstrated steady growth over the past decade:\n\n| Year | Market Size (USD Billions) | YoY Growth (%) |\n|------|----------------------------|----------------|\n| 2019 | 165                        | 4.2            |\n| 2020 | 172                        | 4.0            |\n| 2021 | 185                        | 7.6            |\n| 2022 | 203                        | 9.7            |\n| 2023 | 215                        | 5.8            |\n\nThe temporary slowdown in 2020 was primarily due to the global pandemic, followed by a strong recovery in 2021 and 2022 as pent-up demand was released and digital transformation initiatives accelerated.\n\n## Growth Drivers\n\nThe projected growth is supported by several key factors:\n\n1. **Technological Innovation**: Continued advancements in technology are expanding the market\'s capabilities and applications\n2. **Digital Transformation**: Accelerated adoption of digital solutions across industries\n3. **Emerging Markets**: Increasing penetration in developing economies\n4. **Sustainability Initiatives**: Growing demand for environmentally responsible solutions\n5. **Industry Convergence**: Blurring boundaries between traditional industry segments creating new opportunities\n\n## Growth Inhibitors\n\nDespite the positive outlook, several factors could potentially constrain growth:\n\n1. **Economic Uncertainty**: Potential recessions or economic downturns\n2. **Regulatory Challenges**: Increasing compliance requirements and data privacy concerns\n3. **Talent Shortages**: Limited availability of skilled professionals\n4. **Supply Chain Vulnerabilities**: Ongoing disruptions in global supply chains\n5. **Geopolitical Tensions**: Trade restrictions and regional conflicts\n\nThe interplay between these growth drivers and inhibitors will ultimately determine the market\'s trajectory over the forecast period.', 5, 'text'),
  
  ('sample-report-1', '2', 'Market Overview', NULL, '2', 'Geographic Distribution', '# Geographic Distribution\n\nThe global market exhibits distinct regional patterns in terms of size, growth, and maturity. Understanding these geographic nuances is essential for developing effective regional strategies.\n\n## Regional Market Share (2023)\n\n- **North America**: 35% ($75.3 billion)\n- **Europe**: 28% ($60.2 billion)\n- **Asia-Pacific**: 25% ($53.8 billion)\n- **Latin America**: 7% ($15.1 billion)\n- **Middle East & Africa**: 5% ($10.8 billion)\n\n## North America\n\nNorth America remains the largest regional market, driven by:\n- Early technology adoption and digital maturity\n- Substantial R&D investments\n- Presence of major industry players\n- Favorable regulatory environment\n- High consumer spending power\n\nThe United States dominates the North American market with approximately 85% share, followed by Canada (12%) and Mexico (3%).\n\n## Europe\n\nThe European market is characterized by:\n- Strong focus on sustainability and ethical practices\n- Stringent regulatory frameworks\n- High degree of market fragmentation\n- Varying adoption rates across countries\n- Increasing cross-border integration\n\nWestern European countries (UK, Germany, France) account for approximately 65% of the European market, while Eastern Europe represents a growing opportunity with higher growth rates.\n\n## Asia-Pacific\n\nThe Asia-Pacific region represents the fastest-growing market with a projected CAGR of 9.8% during the forecast period. Key characteristics include:\n- Large and growing consumer base\n- Rapid digital transformation\n- Increasing disposable incomes\n- Government initiatives supporting industry growth\n- Varying levels of market maturity across countries\n\nChina and Japan collectively account for over 60% of the Asia-Pacific market, while India, South Korea, and Australia represent significant growth opportunities.\n\n## Emerging Markets\n\nLatin America, Middle East, and Africa currently represent smaller portions of the global market but offer substantial growth potential due to:\n- Untapped consumer bases\n- Improving digital infrastructure\n- Rising middle-class populations\n- Increasing foreign investments\n- Favorable demographic trends\n\nBrazil, Saudi Arabia, and South Africa serve as regional hubs within their respective regions.', 6, 'text'),
  
  -- Competitive Landscape section
  ('sample-report-1', '3', 'Competitive Landscape', '# Competitive Landscape\n\nThe market features a diverse mix of established players and innovative new entrants, creating a dynamic competitive environment.\n\n## Market Structure\n\nThe global market is moderately fragmented, with the top five players accounting for approximately 40% of the total market share. The remaining market is distributed among numerous mid-sized and small players, many of which focus on specific niches or regional markets.\n\n## Key Players\n\n1. **Company Alpha**\n   - Market Share: 12%\n   - Strengths: Broad product portfolio, strong brand recognition, extensive distribution network\n   - Weaknesses: Slower innovation cycle, higher cost structure\n\n2. **Company Beta**\n   - Market Share: 10%\n   - Strengths: Technological leadership, robust R&D pipeline, premium positioning\n   - Weaknesses: Limited presence in emerging markets, premium pricing\n\n3. **Company Gamma**\n   - Market Share: 8%\n   - Strengths: Cost leadership, operational efficiency, strong emerging market presence\n   - Weaknesses: Narrower product range, lower brand equity in developed markets\n\n4. **Company Delta**\n   - Market Share: 6%\n   - Strengths: Digital capabilities, agile operations, strong customer relationships\n   - Weaknesses: Smaller scale, limited manufacturing capacity\n\n5. **Company Epsilon**\n   - Market Share: 4%\n   - Strengths: Innovative product features, sustainability focus, rapid growth\n   - Weaknesses: Limited global reach, less established brand\n\n## Competitive Trends\n\n- Increasing consolidation through mergers and acquisitions\n- Growing emphasis on sustainability as a competitive differentiator\n- Rising investments in digital capabilities and customer experience\n- Expansion of direct-to-consumer channels\n- Increasing focus on service-based business models\n\n## Barriers to Entry\n\n- High capital requirements for manufacturing infrastructure\n- Stringent regulatory compliance needs\n- Established customer relationships and brand loyalty\n- Intellectual property protections\n- Economies of scale in production and distribution\n\n## Future Competitive Outlook\n\nThe competitive landscape is expected to evolve significantly over the forecast period, with increased consolidation among mid-sized players and continued emergence of disruptive startups focusing on technological innovation and sustainability.', NULL, NULL, NULL, 7, 'text'),
  
  -- Add an SVG example
  ('sample-report-1', '2', 'Market Overview', NULL, '1', 'Market Size and Growth', '<svg width="500" height="300" xmlns="http://www.w3.org/2000/svg">
    <style>
      .title { font-family: Arial; font-size: 24px; font-weight: bold; }
      .label { font-family: Arial; font-size: 12px; }
      .bar { fill: #2A7AE2; }
      .bar:hover { fill: #0F2F54; }
    </style>
    <text x="250" y="30" text-anchor="middle" class="title">Market Growth Projection</text>
    <g transform="translate(50, 50)">
      <!-- Y-axis -->
      <line x1="0" y1="0" x2="0" y2="200" stroke="black" />
      <!-- X-axis -->
      <line x1="0" y1="200" x2="400" y2="200" stroke="black" />
      
      <!-- Bars -->
      <rect class="bar" x="25" y="100" width="50" height="100" />
      <rect class="bar" x="100" y="80" width="50" height="120" />
      <rect class="bar" x="175" y="50" width="50" height="150" />
      <rect class="bar" x="250" y="30" width="50" height="170" />
      <rect class="bar" x="325" y="0" width="50" height="200" />
      
      <!-- Labels -->
      <text x="50" y="220" text-anchor="middle" class="label">2023</text>
      <text x="125" y="220" text-anchor="middle" class="label">2024</text>
      <text x="200" y="220" text-anchor="middle" class="label">2025</text>
      <text x="275" y="220" text-anchor="middle" class="label">2026</text>
      <text x="350" y="220" text-anchor="middle" class="label">2027</text>
      
      <!-- Values -->
      <text x="50" y="95" text-anchor="middle" class="label">$215B</text>
      <text x="125" y="75" text-anchor="middle" class="label">$235B</text>
      <text x="200" y="45" text-anchor="middle" class="label">$260B</text>
      <text x="275" y="25" text-anchor="middle" class="label">$290B</text>
      <text x="350" y="-5" text-anchor="middle" class="label">$325B</text>
    </g>
  </svg>', 8, 'svg');
