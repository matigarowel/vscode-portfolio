import { Project } from '@/types';

export const projects: Project[] = [
  {
    title: 'PesoWiFi',
    description:
      'A personal coin-operated WiFi hotspot project, combining an ESP32-based controller with a full-stack application for managing the service.',
    logo: '/logos/react_icon.svg',
    slug: 'pesowifi',
    category: 'Personal',
  },
  {
    title: 'Agentic AI Coding Workflow',
    description:
      'An evolving requirements-driven workflow that coordinates agents for workspace setup, backend and frontend development, validation, runtime fixes, Playwright smoke testing, reporting, and prompt improvement.',
    logo: '/logos/vsc.svg',
    slug: 'agentic-ai-coding-workflow',
    category: 'Personal',
  },
  {
    title: 'Bluebox Publisher (AHL)',
    description:
      'A dynamic report-generation application that automates document creation from uploaded files and configurable inputs, with validation and Azure publishing workflows. Contributed features, data models, SQL objects, and automated tests.',
    logo: '/logos/markdown_icon.svg',
    slug: 'bluebox-publisher',
    category: 'Professional',
  },
  {
    title: 'Customized Accounting Information System',
    description:
      'A customized accounting system developed as a solo programmer, alongside manufacturing execution system support, client-requested reports and validations, and database maintenance.',
    logo: '/logos/json_icon.svg',
    slug: 'custom-accounting-information-system',
    category: 'Professional',
  },
  {
    title: 'Online Overtime Application',
    description:
      'An internal web application built as a solo developer using C#, Web API, SignalR, AngularJS, JavaScript, jQuery, Bootstrap, and DataTables.',
    logo: '/logos/html_icon.svg',
    slug: 'online-overtime-application',
    category: 'Professional',
  },
  {
    title: 'Portal Online Application',
    description:
      'An internal portal application developed as a solo programmer with a Microsoft web stack and interactive real-time features.',
    logo: '/logos/js_icon.svg',
    slug: 'portal-online-application',
    category: 'Professional',
  },
];
