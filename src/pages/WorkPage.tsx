import { useState } from 'react';
import { motion } from 'motion/react';
import { projects, skills } from '../data';
import type { Project } from '../data';
import ClosingBand from '../components/ClosingBand';
import { Arrow } from '../components/Icons';
import LineReveal from '../components/LineReveal';
import ProjectCover from '../components/ProjectCover';
import ProjectDialog from '../components/ProjectDialog';
import { fadeUp, fadeUpAfter, inView, rise, staggered } from '../lib/motion';

export default function WorkPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  return (
    <div className="portfolio-page page-work">
      <section id="work" className="work section-shell section-space">
        <motion.div
          className="section-heading"
          initial="hidden"
          animate="show"
          variants={staggered(0.1)}
        >
          <div>
            <h1 tabIndex={-1}>
              <LineReveal
                lines={[
                  <>
                    From ideas to <span className="serif-word">iterations.</span>
                  </>,
                ]}
              />
            </h1>
          </div>
          <motion.p variants={fadeUp}>
            Small steps. Real projects. <br />
            Here’s what’s on my workbench.
          </motion.p>
        </motion.div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <motion.article
              className={`project-card ${project.color}`}
              key={project.id}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              variants={fadeUpAfter(0.15 + index * 0.08)}
            >
              <ProjectCover project={project} onOpen={() => setSelectedProject(project)} />
              <div className="project-meta mono">
                <span>{project.category}</span>
                <span>/{project.number}</span>
              </div>
              <h2>
                <button
                  aria-label={`Read about ${project.title}`}
                  onClick={() => setSelectedProject(project)}
                >
                  {project.title}
                </button>
              </h2>
              <p>{project.description}</p>
              <p className="project-role">{project.role}</p>
              <div className="tags">
                {project.stack.map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
              {project.demo && (
                <div className="project-links">
                  <a className="text-link" href={project.demo} target="_blank" rel="noreferrer">
                    Live demo <Arrow diagonal />
                  </a>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      <section id="skills" className="skills section-shell section-space">
        <motion.div
          className="section-heading"
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={staggered(0.1)}
        >
          <div>
            <h2>
              <LineReveal
                lines={[
                  'Tools I use.',
                  <>
                    Things I’m <span className="serif-word">learning.</span>
                  </>,
                ]}
              />
            </h2>
          </div>
          <motion.p variants={fadeUp}>
            Always a student. <br />
            There’s something new to figure out.
          </motion.p>
        </motion.div>
        <div className="skill-rows">
          {skills.map((row, index) => (
            <motion.div
              className={index === 2 ? 'skill-row learning-row' : 'skill-row'}
              key={row.title}
              initial="hidden"
              whileInView="show"
              viewport={inView}
              variants={staggered(0.035)}
            >
              <motion.span className="skill-number mono" variants={rise}>
                0{index + 1}
              </motion.span>
              <motion.h3 variants={rise}>{row.title}</motion.h3>
              <div className="skill-tags">
                {row.items.map((item) => (
                  <motion.span key={item} variants={rise}>
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="ask-me"
          initial="hidden"
          whileInView="show"
          viewport={inView}
          variants={fadeUp}
        >
          <p>
            Happy to chat about <strong>Flutter + Firebase</strong>, getting started with{' '}
            <strong>Laravel</strong>, or using <strong>GitHub Copilot</strong> for student projects.
          </p>
        </motion.div>
      </section>

      <ClosingBand />

      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
