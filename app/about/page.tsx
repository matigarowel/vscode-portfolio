'use client';

import { VscGithub, VscMail } from 'react-icons/vsc';
import Link from 'next/link';

import styles from '@/styles/AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerText}>
              <h1 className={styles.name}>Rowel B. Matiga</h1>
              <p className={styles.role}>
                Programmer Analyst III | DevOps Engineer III
              </p>
              <div className={styles.location}>
                <span className={styles.dot} />
                Cavite, Philippines
              </div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <a
              href="https://github.com/itsnitinr"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconButton}
              aria-label="GitHub profile"
            >
              <VscGithub size={20} />
            </a>
            <Link
              href="/contact"
              className={styles.iconButton}
              aria-label="Contact"
            >
              <VscMail size={20} />
            </Link>
          </div>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>01</span>
              <h2 className={styles.sectionTitle}>About</h2>
            </div>
            <div className={styles.sectionBody}>
              <p className={styles.paragraph}>
                I&apos;m a full-stack developer and DevOps engineer with over
                eight years of experience building, deploying, and supporting
                enterprise applications, primarily with Microsoft technologies.
              </p>
              <p className={styles.paragraph}>
                My experience spans C#, ASP.NET, SQL Server, Azure, web
                development, CI/CD, and automation. I enjoy improving
                development and release workflows, supporting production
                systems, and exploring how AI and agentic workflows can help
                teams deliver software.
              </p>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>02</span>
              <h2 className={styles.sectionTitle}>Experience</h2>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.experienceCard}>
                <div className={styles.expMeta}>
                  <span className={styles.expPeriod}>February 2022 – Present</span>
                </div>
                <h3 className={styles.expRole}>Programmer Analyst III</h3>
                <p className={styles.expCompany}>Vertere Global Solutions, Inc.</p>

                <h4 className={styles.skillTitle}>DevOps Engineer III · May 2024 – Present</h4>
                <p className={styles.expDesc}>
                  Supporting multiple projects with deployments, certificate
                  renewals, server maintenance, CI/CD, automation, IIS, Azure
                  resources, security patches, and development support.
                </p>
                <ul className={styles.expList}>
                  <li>
                    Build smoke-test automation with Playwright and support
                    bug fixes across application and data platforms.
                  </li>
                  <li>
                    Work with Azure App Service, Functions, Key Vault, Azure
                    SQL, Storage, Docker, PowerShell, and Azure DevOps.
                  </li>
                  <li>
                    Support SQL performance improvements, including
                    non-clustered indexes, and monthly SharePoint patching.
                  </li>
                </ul>

                <h4 className={styles.skillTitle}>Programmer Analyst III · February 2022 – May 2024</h4>
                <p className={styles.expDesc}>
                  Developed Bluebox Publisher for the AHL business area, a
                  report-generation application that automates document
                  creation from uploaded files, custom inputs, and dynamic
                  tables, with validation and Azure publishing workflows.
                </p>
                <ul className={styles.expList}>
                  <li>
                    Delivered features from backlog requirements, building
                    application models, views, view models, and interfaces.
                  </li>
                  <li>
                    Designed SQL tables and stored procedures, prepared seed
                    data, and created unit tests and test cases.
                  </li>
                  <li>
                    Worked with C#/.NET WPF, ASP.NET MVC and Web API, SQL
                    Server, AngularJS, and Syncfusion.
                  </li>
                </ul>
              </div>

              <div className={styles.experienceCard}>
                <div className={styles.expMeta}>
                  <span className={styles.expPeriod}>March 2020 – February 2022</span>
                </div>
                <h3 className={styles.expRole}>Programmer</h3>
                <p className={styles.expCompany}>OE Works Manufacturing, Inc.</p>
                <p className={styles.expDesc}>
                  Solo developer for a customized accounting information
                  system, working with PowerShell 6 and SQL Server 2008.
                </p>
                <ul className={styles.expList}>
                  <li>Supported and maintained manufacturing execution systems.</li>
                  <li>Developed reports and system validations for client requests.</li>
                  <li>Maintained databases and backups.</li>
                </ul>
              </div>

              <div className={styles.experienceCard}>
                <div className={styles.expMeta}>
                  <span className={styles.expPeriod}>January 2018 – March 2020</span>
                </div>
                <h3 className={styles.expRole}>Programmer</h3>
                <p className={styles.expCompany}>Joyson Safety Systems Philippines</p>
                <p className={styles.expDesc}>
                  Solo developer for the Online Overtime and Portal Online
                  applications.
                </p>
                <ul className={styles.expList}>
                  <li>
                    Built application features with C#, JavaScript, Web API,
                    SignalR, AngularJS, jQuery, Bootstrap, and DataTables.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>03</span>
              <h2 className={styles.sectionTitle}>Projects & Development</h2>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.experienceCard}>
                <h3 className={styles.expRole}>Agentic AI Coding Workflow</h3>
                <p className={styles.expDesc}>
                  Exploring a requirements-driven workflow that coordinates
                  specialized agents for workspace setup, backend and frontend
                  development, validation, runtime fixes, Playwright smoke
                  testing, reporting, and prompt improvement.
                </p>
                <p className={styles.expCompany}>
                  Tools include Langflow, Kaggle-hosted Qwen, GitHub Copilot,
                  and MCP integrations.
                </p>
              </div>
              <div className={styles.experienceCard}>
                <h3 className={styles.expRole}>PesoWiFi</h3>
                <p className={styles.expDesc}>
                  Personal WiFi hotspot project using a coin acceptor, with an
                  ESP32 microcontroller and a full-stack application for
                  managing the service.
                </p>
                <p className={styles.expCompany}>
                  C++, Arduino/PlatformIO, React, TypeScript, Express, and
                  PostgreSQL.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>04</span>
              <h2 className={styles.sectionTitle}>Skills</h2>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.skillsGrid}>
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Languages</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>C#</span>
                    <span className={styles.skillTag}>VB.NET</span>
                    <span className={styles.skillTag}>JavaScript</span>
                    <span className={styles.skillTag}>TypeScript</span>
                    <span className={styles.skillTag}>Python</span>
                    <span className={styles.skillTag}>C++</span>
                  </div>
                </div>
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Frameworks & Web</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>.NET</span>
                    <span className={styles.skillTag}>ASP.NET MVC</span>
                    <span className={styles.skillTag}>Web API</span>
                    <span className={styles.skillTag}>SignalR</span>
                    <span className={styles.skillTag}>Angular</span>
                    <span className={styles.skillTag}>AngularJS</span>
                    <span className={styles.skillTag}>React</span>
                    <span className={styles.skillTag}>Express</span>
                    <span className={styles.skillTag}>NestJS</span>
                  </div>
                </div>
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Cloud & DevOps</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>Azure</span>
                    <span className={styles.skillTag}>Azure DevOps</span>
                    <span className={styles.skillTag}>CI/CD</span>
                    <span className={styles.skillTag}>Docker</span>
                    <span className={styles.skillTag}>PowerShell</span>
                    <span className={styles.skillTag}>IIS</span>
                    <span className={styles.skillTag}>Playwright</span>
                  </div>
                </div>
                <div className={styles.skillCategory}>
                  <h4 className={styles.skillTitle}>Data & Tools</h4>
                  <div className={styles.skillTags}>
                    <span className={styles.skillTag}>SQL Server</span>
                    <span className={styles.skillTag}>PostgreSQL</span>
                    <span className={styles.skillTag}>MySQL</span>
                    <span className={styles.skillTag}>Databricks</span>
                    <span className={styles.skillTag}>GitHub</span>
                    <span className={styles.skillTag}>MCP</span>
                    <span className={styles.skillTag}>Arduino</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionNumber}>05</span>
              <h2 className={styles.sectionTitle}>Education</h2>
            </div>
            <div className={styles.sectionBody}>
              <div className={styles.experienceCard}>
                <div className={styles.expMeta}>
                  <span className={styles.expPeriod}>June 2012 – March 2016</span>
                </div>
                <h3 className={styles.expRole}>
                  Bachelor of Science in Computer Science
                </h3>
                <p className={styles.expCompany}>
                  Eastern Samar State University – Salcedo Campus
                </p>
              </div>
              <div className={styles.experienceCard}>
                <div className={styles.expMeta}>
                  <span className={styles.expPeriod}>October – December 2012</span>
                </div>
                <h3 className={styles.expRole}>
                  Computer Hardware Servicing National Certificate II
                </h3>
                <p className={styles.expCompany}>
                  Maryland Global College Foundation, Inc.
                </p>
              </div>
              <p className={styles.paragraph}>
                Recognition includes Programmer of the Year (2014) and Best
                Researcher Award (2016).
              </p>
            </div>
          </section>
        </div>

        <footer className={styles.footer}>
          <Link href="/projects" className={styles.footerLink}>
            View my projects →
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
