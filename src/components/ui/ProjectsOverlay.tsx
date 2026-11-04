import { useProjects } from '../../lib/projectsStore';
import { profile } from '../../data/profile';

export default function ProjectsOverlay() {
  const selectedId = useProjects((state) => state.selectedId);
  const select = useProjects((state) => state.select);
  const project = useProjects((state) => state.projects.find((item) => item.id === state.selectedId));

  if (!selectedId || !project) return null;

  return (
    <div className="proj-backdrop" onClick={() => select(null)}>
      <article className="proj-card" onClick={(event) => event.stopPropagation()}>
        <header>
          <span className="proj-kicker">{project.category || 'Project'}</span>
          <h2>{project.name}</h2>
          <p className="proj-author">{profile.name} — {profile.title}</p>
        </header>
        <p className="proj-desc">{project.description}</p>
        {project.tech.length ? (
          <ul className="proj-tech">
            {project.tech.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
        <div className="proj-actions">
          {project.url ? (
            <a href={project.url} target="_blank" rel="noreferrer noopener">Open live</a>
          ) : null}
          {project.repo ? (
            <a href={project.repo} target="_blank" rel="noreferrer noopener">Repository</a>
          ) : null}
          <button type="button" onClick={() => select(null)}>Close</button>
        </div>
      </article>
    </div>
  );
}