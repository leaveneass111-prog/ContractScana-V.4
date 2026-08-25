/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ContractProjectData, StoredProjectItem } from './types';
import {
  loadProjectsCollection,
  upsertProject,
  deleteProject,
  duplicateProject,
  createSampleProject,
  convertProjectToStoredItem,
  saveProjectsCollection,
  ACTIVE_PROJECT_ID_KEY,
} from './utils/projectStorage';
import { TopBar } from './components/TopBar';
import { ProjectDrawer } from './components/ProjectDrawer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { OfficialDocPreviewModal } from './components/OfficialDocPreviewModal';
import { downloadDocxFile } from './utils/docxExport';

// Page components
import { Page0DocumentScan } from './components/pages/Page0DocumentScan';
import { Page1WeeklyMemo } from './components/pages/Page1WeeklyMemo';
import { Page2WeeklyTasks } from './components/pages/Page2WeeklyTasks';
import { Page3DailyLaborWeather } from './components/pages/Page3DailyLaborWeather';
import { Page4MonthlyMemo } from './components/pages/Page4MonthlyMemo';
import { Page5ProjectDetails } from './components/pages/Page5ProjectDetails';
import { Page6MonthlyProgressLog } from './components/pages/Page6MonthlyProgressLog';
import { Page7MilestonesMaterials } from './components/pages/Page7MilestonesMaterials';
import { Page8ObstaclesSummary } from './components/pages/Page8ObstaclesSummary';

const STORAGE_KEY = 'contractscan_project_data_v2';
const THEME_KEY = 'contractscan_theme_mode';
const PAGE_KEY = 'contractscan_active_page';

export default function App() {
  // Load Project Collection from Storage
  const [projectsList, setProjectsList] = useState<StoredProjectItem[]>(() => {
    return loadProjectsCollection();
  });

  // Active Project ID
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const savedActive = localStorage.getItem(ACTIVE_PROJECT_ID_KEY);
      if (savedActive && projectsList.some((p) => p.id === savedActive)) {
        return savedActive;
      }
    } catch {
      // ignore
    }
    return projectsList[0]?.id || '';
  });

  // Load Active Project Data
  const [project, setProject] = useState<ContractProjectData>(() => {
    const activeItem = projectsList.find((p) => p.id === activeProjectId);
    if (activeItem) {
      return activeItem.data;
    }
    if (projectsList.length > 0) {
      return projectsList[0].data;
    }
    return createSampleProject();
  });

  // Dark mode defaults to true as specified in design doc
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved !== null ? saved === 'dark' : true;
  });

  const [activePage, setActivePage] = useState<number>(() => {
    const saved = localStorage.getItem(PAGE_KEY);
    return saved !== null ? Math.min(8, Math.max(0, Number(saved))) : 0;
  });

  const handleSelectPage = (newPage: number) => {
    if (newPage === activePage) return;
    setActivePage(newPage);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isAutoSaved, setIsAutoSaved] = useState<boolean>(true);

  // Sync Dark Mode class to HTML document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Persist Active Page
  useEffect(() => {
    localStorage.setItem(PAGE_KEY, activePage.toString());
  }, [activePage]);

  // Auto-Save Active Project Data to LocalStorage and update Project Collection with debounce
  useEffect(() => {
    setIsAutoSaved(false);
    const handler = setTimeout(() => {
      try {
        const { updatedList } = upsertProject(project, projectsList);
        setProjectsList(updatedList);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
        if (project.id) {
          localStorage.setItem(ACTIVE_PROJECT_ID_KEY, project.id);
        }
        setIsAutoSaved(true);
      } catch (err) {
        console.error('Failed to auto-save project', err);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [project]);

  // Multi-Project Operations
  const handleSwitchProject = (selectedProject: ContractProjectData) => {
    setProject(selectedProject);
    setActiveProjectId(selectedProject.id || '');
    if (selectedProject.id) {
      localStorage.setItem(ACTIVE_PROJECT_ID_KEY, selectedProject.id);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProject));
    setIsAutoSaved(true);
  };

  const handleCreateProject = (newProjectData: ContractProjectData) => {
    const { updatedList, savedItem } = upsertProject(newProjectData, projectsList);
    setProjectsList(updatedList);
    setProject(savedItem.data);
    setActiveProjectId(savedItem.id);
    localStorage.setItem(ACTIVE_PROJECT_ID_KEY, savedItem.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedItem.data));
    setIsAutoSaved(true);
  };

  const handleDeleteProject = (projectIdToDelete: string) => {
    const { updatedList, nextActiveProject } = deleteProject(projectIdToDelete, projectsList);
    setProjectsList(updatedList);
    if (projectIdToDelete === project.id || projectIdToDelete === activeProjectId) {
      setProject(nextActiveProject);
      setActiveProjectId(nextActiveProject.id || '');
      localStorage.setItem(ACTIVE_PROJECT_ID_KEY, nextActiveProject.id || '');
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextActiveProject));
    }
  };

  const handleDuplicateProject = (projectIdToDuplicate: string) => {
    const { updatedList, duplicatedProject } = duplicateProject(projectIdToDuplicate, projectsList);
    setProjectsList(updatedList);
    setProject(duplicatedProject);
    setActiveProjectId(duplicatedProject.id || '');
    localStorage.setItem(ACTIVE_PROJECT_ID_KEY, duplicatedProject.id || '');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(duplicatedProject));
    setIsAutoSaved(true);
  };

  const handleImportProjects = (
    imported: StoredProjectItem[] | ContractProjectData
  ) => {
    if (Array.isArray(imported)) {
      // List of projects
      setProjectsList(imported);
      saveProjectsCollection(imported);
      if (imported.length > 0) {
        setProject(imported[0].data);
        setActiveProjectId(imported[0].id);
        localStorage.setItem(ACTIVE_PROJECT_ID_KEY, imported[0].id);
      }
    } else {
      // Single project
      handleCreateProject(imported);
    }
    setIsAutoSaved(true);
  };

  const handleResetAllData = () => {
    const sample = createSampleProject();
    const sampleItem = convertProjectToStoredItem(sample);
    const initialList = [sampleItem];
    setProjectsList(initialList);
    saveProjectsCollection(initialList);
    setProject(sample);
    setActiveProjectId(sample.id || '');
    localStorage.setItem(ACTIVE_PROJECT_ID_KEY, sample.id || '');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    setIsAutoSaved(true);
  };

  const handleSaveCurrentProject = () => {
    const { updatedList } = upsertProject(project, projectsList);
    setProjectsList(updatedList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    if (project.id) {
      localStorage.setItem(ACTIVE_PROJECT_ID_KEY, project.id);
    }
    setIsAutoSaved(true);
  };

  const handleExportDocx = () => {
    downloadDocxFile(project);
  };

  // Render the currently selected Page component (Pages 1 to 8)
  const renderActivePageComponent = () => {
    switch (activePage) {
      case 1:
        return <Page1WeeklyMemo project={project} onChange={setProject} />;
      case 2:
        return <Page2WeeklyTasks project={project} onChange={setProject} />;
      case 3:
        return <Page3DailyLaborWeather project={project} onChange={setProject} />;
      case 4:
        return <Page4MonthlyMemo project={project} onChange={setProject} />;
      case 5:
        return <Page5ProjectDetails project={project} onChange={setProject} />;
      case 6:
        return <Page6MonthlyProgressLog project={project} onChange={setProject} />;
      case 7:
        return <Page7MilestonesMaterials project={project} onChange={setProject} />;
      case 8:
        return (
          <Page8ObstaclesSummary
            project={project}
            onChange={setProject}
            onOpenPreview={() => setIsPreviewOpen(true)}
          />
        );
      default:
        return <Page1WeeklyMemo project={project} onChange={setProject} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col selection:bg-amber-500/30 selection:text-amber-500 transition-colors overflow-x-hidden">
      {/* TopBar Header */}
      <TopBar
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
        activePage={activePage}
        onSelectPage={handleSelectPage}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        isAutoSaved={isAutoSaved}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onExportDocx={handleExportDocx}
        projectName={project.projectName}
        contractNumber={project.contractNumber}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 pb-24 lg:pb-12">
        <div key={`page-view-${activePage}`} className="w-full focus:outline-none">
          {renderActivePageComponent()}
        </div>
      </main>

      {/* Slide-out Project Drawer */}
      <ProjectDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        project={project}
        projectsList={projectsList}
        onSwitchProject={handleSwitchProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
        onImportProjects={handleImportProjects}
        onResetAllData={handleResetAllData}
        onSaveCurrentProject={handleSaveCurrentProject}
      />

      {/* Official Thai Government Preview Modal */}
      <OfficialDocPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        project={project}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        activePage={activePage}
        onSelectPage={handleSelectPage}
        totalPages={8}
      />
    </div>
  );
}
