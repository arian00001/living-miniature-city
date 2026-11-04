import { useState } from 'react';
import { emptyProject, useProjects } from '../../lib/projectsStore';
import type { Project } from '../../types';

const BLANK = emptyProject();

export default function AdminPanel() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Project>(BLANK);
  const [editing, setEditing] = useState<string | null>(null);
  const projects = useProjects((state) => state.projects);
  const add = useProjects((state) => state.add);
  const update = useProjects((state) => state.update);
  const remove = useProjects((state) => state.remove);
  const reset = useProjects((state) => state.reset);

  const startNew = () => {
    setEditing(null);
    setDraft(emptyProject());
  };

  const startEdit = (project: Project) => {
    setEditing(project.id);
    setDraft({ ...project, tech: project.tech });
  };

  const save = () => {
    if (!draft.name.trim()) return;
    const clean: Project = {
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      category: draft.category.trim(),
    };
    if (editing) update(editing, clean);
    else add(clean);
    startNew();
  };

  return (
    <>
      <button type="button" className="adm-trigger" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close' : 'Admin'}
      </button>

      {open ? (
        <section className="adm">
          <header className="adm-head">
            <div>
              <strong>Admin panel</strong>
              <small>{projects.length} projects · saved in this browser</small>
            </div>
            <button type="button" className="adm-ghost" onClick={reset}>Reset</button>
          </header>

          <ul className="adm-list">
            {projects.map((project) => (
              <li key={project.id} className={editing === project.id ? 'is-active' : ''}>
                <span>{project.name}</span>
                <div>
                  <button type="button" onClick={() => startEdit(project)}>Edit</button>
                  <button type="button" onClick={() => remove(project.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="adm-form">
            <label>
              Name
              <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </label>
            <label>
              Category
              <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} />
            </label>
            <label>
              Description
              <textarea rows={3} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
            </label>
            <label>
              Tech (comma separated)
              <input
                value={draft.tech.join(', ')}
                onChange={(e) => setDraft({ ...draft, tech: e.target.value.split(',').map((item) => item.trim()).filter(Boolean) })}
              />
            </label>
            <div className="adm-row">
              <label>
                Live URL
                <input value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} />
              </label>
              <label>
                Repo
                <input value={draft.repo} onChange={(e) => setDraft({ ...draft, repo: e.target.value })} />
              </label>
            </div>
            <div className="adm-row">
              <button type="button" className="adm-primary" onClick={save}>{editing ? 'Save changes' : 'Add project'}</button>
              <button type="button" className="adm-ghost" onClick={startNew}>New</button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}