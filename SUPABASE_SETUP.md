# Supabase Integration for Report Loading

This document provides instructions for setting up and using the Supabase integration for loading report content in the SaaS Starter Kit.

## Overview

The integration allows you to store and load report content from Supabase, including:

- Report metadata (title, description, etc.)
- Report sections and subsections
- Support for different content types (text, SVG, etc.)
- Progressive loading of content

## Setup Instructions

### 1. Create a Supabase Project

1. Sign up for a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one already
2. Create a new project
3. Note your project URL and anon key (found in Project Settings > API)

### 2. Configure Environment Variables

Add the following variables to your `.env` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Create Database Tables

Run the SQL script in `supabase-setup.sql` in the Supabase SQL Editor to create the necessary tables and sample data:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase-setup.sql`
4. Paste into the SQL Editor and run the script

This will create:
- A `reports` table for report metadata
- A `report_content` table for report sections and subsections
- Sample data for a market analysis report

### 4. Test the Integration

1. Start your development server:
   ```
   npm run dev
   ```

2. Navigate to a report page:
   ```
   http://localhost:4002/teams/[team-slug]/reports/sample-report-1
   ```

## Database Schema

### Reports Table

Stores metadata about each report:

| Column      | Type      | Description                       |
|-------------|-----------|-----------------------------------|
| id          | UUID      | Primary key                       |
| title       | TEXT      | Report title                      |
| description | TEXT      | Report description                |
| created_at  | TIMESTAMP | Creation timestamp                |
| updated_at  | TIMESTAMP | Last update timestamp             |
| team_id     | UUID      | Team that owns the report         |
| author_id   | UUID      | User who created the report       |
| status      | TEXT      | Report status (draft, published)  |
| tags        | TEXT[]    | Array of tags                     |

### Report Content Table

Stores the actual content of reports:

| Column            | Type      | Description                                |
|-------------------|-----------|--------------------------------------------|
| id                | UUID      | Primary key                                |
| report_id         | UUID      | Foreign key to reports table               |
| section_number    | TEXT      | Section number (e.g., "1", "2")            |
| section_title     | TEXT      | Section title                              |
| section_content   | TEXT      | Content for the entire section (optional)  |
| subsection_number | TEXT      | Subsection number (e.g., "1.1", "2.3")     |
| subsection_title  | TEXT      | Subsection title                           |
| content           | TEXT      | Content for the subsection                 |
| reading_order     | INTEGER   | Order for displaying content               |
| content_type      | TEXT      | Type of content (text, svg, etc.)          |
| created_at        | TIMESTAMP | Creation timestamp                         |
| updated_at        | TIMESTAMP | Last update timestamp                      |

## Implementation Details

The implementation in `pages/teams/[slug]/reports/[reportId].tsx` includes:

1. **Supabase Client Setup**: Initializes the Supabase client with your project URL and anon key
2. **Report Structure Definition**: Defines the structure of reports with sections and subsections
3. **Data Fetching**: Fetches report data from Supabase based on the report ID
4. **Progressive Loading**: Updates the UI as sections are loaded
5. **SVG Rendering**: Safely renders SVG content using dangerouslySetInnerHTML

## Customization

### Adding New Reports

To add a new report:

1. Insert a new row into the `reports` table
2. Insert corresponding sections and subsections into the `report_content` table
3. Ensure the `report_id` in the content rows matches the `id` of the report

### Modifying the Report Structure

To change the structure of reports:

1. Update the `Section` and `Report` interfaces in `pages/teams/[slug]/reports/[reportId].tsx`
2. Update the `createMockReportFromSupabase` function to match your new structure

### Adding Support for New Content Types

To add support for new content types:

1. Add a new value for the `content_type` column in the `report_content` table
2. Update the `renderSVGContent` function or add new rendering functions as needed

## Troubleshooting

### Content Not Loading

- Check that your Supabase URL and anon key are correct in the `.env` file
- Verify that the report ID in the URL matches an ID in the `reports` table
- Check the browser console for any errors

### SVG Content Not Rendering

- Ensure the SVG content is valid and properly escaped
- Check that the `content_type` is set to 'svg' in the database
- Verify that the SVG content is being properly passed to the `dangerouslySetInnerHTML` attribute
