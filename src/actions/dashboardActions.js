'use server';
import { getAssignedTasks, getProjectsWithTasks, getDashboardStats } from '@/api';

export async function getAssignedTasksAction() {
  return getAssignedTasks();
}

export async function getProjectsWithTasksAction() {
  return getProjectsWithTasks();
}

export async function getDashboardStatsAction() {
  return getDashboardStats();
}