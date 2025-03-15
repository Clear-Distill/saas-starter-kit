import { prisma } from '@/lib/prisma';
import { Report, Prisma } from '@prisma/client';

// Create a new report
export const createReport = async (params: {
  teamId: string;
  title: string;
  description?: string;
  keyInsights?: string;
  metadata?: any;
  conversationApiReport?: string;
  llmApiReport?: string;
}): Promise<Report> => {
  const {
    teamId,
    title,
    description,
    keyInsights,
    metadata,
    conversationApiReport,
    llmApiReport,
  } = params;

  return await prisma.report.create({
    data: {
      teamId,
      title,
      description,
      keyInsights,
      metadata,
      conversationApiReport,
      llmApiReport,
    },
  });
};

// Get a report by ID
export const getReportById = async (id: string): Promise<Report | null> => {
  return await prisma.report.findUnique({
    where: {
      id,
    },
  });
};

// Get a report by ID with documents
export const getReportWithDocuments = async (id: string) => {
  return await prisma.report.findUnique({
    where: {
      id,
    },
    include: {
      documents: true,
    },
  });
};

// Get all reports for a team
export const getTeamReports = async (teamId: string) => {
  return await prisma.report.findMany({
    where: {
      teamId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Update a report
export const updateReport = async (
  id: string,
  data: Prisma.ReportUpdateInput
): Promise<Report> => {
  return await prisma.report.update({
    where: {
      id,
    },
    data,
  });
};

// Delete a report
export const deleteReport = async (id: string): Promise<Report> => {
  return await prisma.report.delete({
    where: {
      id,
    },
  });
};
