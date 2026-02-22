import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../../context';
import { LoadingSkeleton } from '../../components';
import type {
  PersonalContext,
  PersonalContextProject,
  PersonalContextRelationship,
} from '../../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

type EditSection = 'professional' | 'focus' | 'values' | 'energy' | null;

function emptyContext(): PersonalContext {
  return {
    occupations: [],
    specializations: [],
    activeProjects: [],
    recentWins: [],
    coreValues: [],
    nonNegotiables: [],
    keyRelationships: [],
  };
}

function splitCSV(val: string): string[] {
  return val.split(',').map(s => s.trim()).filter(Boolean);
}

function joinCSV(arr: string[] | undefined): string {
  return arr?.join(', ') ?? '';
}

// ─── Section shell ────────────────────────────────────────────────────────────

function SectionShell({
  title,
  icon,
  editing,
  onEdit,
  onSave,
  onCancel,
  children,
  form,
}: {
  title: string;
  icon: string;
  editing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  form: React.ReactNode;
}) {
  return (
    <section className="bg-surface-base/50 rounded-xl p-6 border border-theme-border-subtle">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-theme-text-primary flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h2>
        {!editing && (
          <button
            onClick={onEdit}
            className="text-theme-text-tertiary hover:text-theme-text-primary transition-colors text-xl"
            title="Edit section"
          >
            ✎
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          {form}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onSave}
              className="px-4 py-2 bg-white text-neutral-900 font-medium rounded-lg text-sm hover:bg-neutral-200 transition-colors"
            >
              Save
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-surface-raised text-theme-text-secondary rounded-lg text-sm hover:bg-surface-interactive transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </section>
  );
}

// ─── Small form helpers ───────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-theme-text-secondary mb-1">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-surface-raised text-theme-text-primary rounded-lg border border-theme-border-subtle text-sm focus:outline-none focus:border-accent-primary"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 bg-surface-raised text-theme-text-primary rounded-lg border border-theme-border-subtle text-sm focus:outline-none focus:border-accent-primary resize-none"
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-surface-raised text-theme-text-primary rounded-lg border border-theme-border-subtle text-sm focus:outline-none focus:border-accent-primary"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-theme-text-tertiary italic">{children}</p>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded-full bg-surface-overlay text-theme-text-secondary text-xs">
      {label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ProfilePersonalContext() {
  const { cosmicProfile, saveCosmicProfile, isLoading } = useProfile();
  const [editingSection, setEditingSection] = useState<EditSection>(null);

  // Draft state per section (populated when user opens edit mode)
  const [profDraft, setProfDraft] = useState<Partial<PersonalContext>>({});
  const [focusDraft, setFocusDraft] = useState<Partial<PersonalContext>>({});
  const [valuesDraft, setValuesDraft] = useState<Partial<PersonalContext>>({});
  const [energyDraft, setEnergyDraft] = useState<Partial<PersonalContext>>({});

  const ctx = useMemo(() => cosmicProfile?.personalContext, [cosmicProfile]);

  if (isLoading) return <LoadingSkeleton variant="page" />;

  if (!cosmicProfile) {
    return (
      <div className="text-center py-16">
        <p className="text-theme-text-secondary mb-4">No profile loaded yet.</p>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 font-medium rounded-lg hover:bg-neutral-200 transition-colors"
        >
          Create Profile
        </Link>
      </div>
    );
  }

  function handleSave(partial: Partial<PersonalContext>) {
    if (!cosmicProfile) return;
    const updated: PersonalContext = {
      ...emptyContext(),
      ...ctx,
      ...partial,
      lastUpdated: new Date().toISOString(),
    };
    saveCosmicProfile({ ...cosmicProfile, personalContext: updated });
    setEditingSection(null);
  }

  // ── Section 1: Professional Context ──────────────────────────────────────

  function openProfessional() {
    setProfDraft({
      occupations: ctx?.occupations ?? [],
      workStyle: ctx?.workStyle,
      specializations: ctx?.specializations ?? [],
      professionalGoals: ctx?.professionalGoals ?? '',
      incomeStreams: ctx?.incomeStreams ?? [],
    });
    setEditingSection('professional');
  }

  const professionalForm = (
    <div className="space-y-4">
      <div>
        <Label>Occupations (comma-separated)</Label>
        <TextInput
          value={joinCSV(profDraft.occupations)}
          onChange={v => setProfDraft(d => ({ ...d, occupations: splitCSV(v) }))}
          placeholder="e.g. Coach, Astrologer, Developer"
        />
      </div>
      <div>
        <Label>Work Style</Label>
        <SelectInput
          value={profDraft.workStyle ?? ''}
          onChange={v => setProfDraft(d => ({ ...d, workStyle: v as PersonalContext['workStyle'] }))}
          options={[
            { value: 'solo', label: 'Solo' },
            { value: 'collaborative', label: 'Collaborative' },
            { value: 'hybrid', label: 'Hybrid' },
          ]}
          placeholder="Select work style…"
        />
      </div>
      <div>
        <Label>Specializations (comma-separated)</Label>
        <TextInput
          value={joinCSV(profDraft.specializations)}
          onChange={v => setProfDraft(d => ({ ...d, specializations: splitCSV(v) }))}
          placeholder="e.g. Human Design, Gene Keys, AI"
        />
      </div>
      <div>
        <Label>Professional Goals</Label>
        <Textarea
          value={profDraft.professionalGoals ?? ''}
          onChange={v => setProfDraft(d => ({ ...d, professionalGoals: v }))}
          placeholder="What are you building or achieving professionally?"
        />
      </div>
      <div>
        <Label>Income Streams (comma-separated)</Label>
        <TextInput
          value={joinCSV(profDraft.incomeStreams)}
          onChange={v => setProfDraft(d => ({ ...d, incomeStreams: splitCSV(v) }))}
          placeholder="e.g. Courses, Coaching, Products"
        />
      </div>
    </div>
  );

  const professionalView = (
    <div className="space-y-3">
      {ctx?.occupations?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Occupations</p>
          <div className="flex flex-wrap gap-2">
            {ctx.occupations.map(o => <Tag key={o} label={o} />)}
          </div>
        </div>
      ) : (
        <EmptyHint>Add your occupation so the AI knows your professional context. Click ✎ to edit.</EmptyHint>
      )}
      {ctx?.workStyle && (
        <p className="text-sm text-theme-text-secondary">
          <span className="text-theme-text-tertiary">Work style:</span> {ctx.workStyle}
        </p>
      )}
      {ctx?.specializations?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Specializations</p>
          <div className="flex flex-wrap gap-2">
            {ctx.specializations.map(s => <Tag key={s} label={s} />)}
          </div>
        </div>
      ) : null}
      {ctx?.professionalGoals && (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Professional Goals</p>
          <p className="text-sm text-theme-text-secondary leading-relaxed">{ctx.professionalGoals}</p>
        </div>
      )}
      {ctx?.incomeStreams?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Income Streams</p>
          <div className="flex flex-wrap gap-2">
            {ctx.incomeStreams.map(s => <Tag key={s} label={s} />)}
          </div>
        </div>
      ) : null}
    </div>
  );

  // ── Section 2: Current Focus ──────────────────────────────────────────────

  function openFocus() {
    setFocusDraft({
      activeProjects: ctx?.activeProjects ?? [],
      recentWins: ctx?.recentWins ?? [],
      activeKeyAreas: ctx?.activeKeyAreas ?? [],
    });
    setEditingSection('focus');
  }

  function addProject(draft: Partial<PersonalContext>) {
    const projects = [...(draft.activeProjects ?? [])];
    projects.push({ id: `project-new-${Date.now()}`, name: '', status: 'active' });
    setFocusDraft(d => ({ ...d, activeProjects: projects }));
  }

  function updateProject(idx: number, partial: Partial<PersonalContextProject>) {
    setFocusDraft(d => {
      const projects = [...(d.activeProjects ?? [])];
      projects[idx] = { ...projects[idx], ...partial };
      if (partial.name && !projects[idx].id.startsWith('project-')) {
        // Keep existing id
      } else if (partial.name) {
        projects[idx].id = `project-${partial.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      }
      return { ...d, activeProjects: projects };
    });
  }

  function removeProject(idx: number) {
    setFocusDraft(d => ({
      ...d,
      activeProjects: (d.activeProjects ?? []).filter((_, i) => i !== idx),
    }));
  }

  const focusForm = (
    <div className="space-y-4">
      {/* Projects */}
      <div>
        <Label>Active Projects</Label>
        <div className="space-y-3">
          {(focusDraft.activeProjects ?? []).map((p, idx) => (
            <div key={idx} className="p-3 bg-surface-overlay rounded-lg border border-theme-border-subtle space-y-2">
              <div className="flex gap-2">
                <TextInput
                  value={p.name}
                  onChange={v => updateProject(idx, { name: v })}
                  placeholder="Project name"
                />
                <button
                  onClick={() => removeProject(idx)}
                  className="text-theme-text-tertiary hover:text-rose-400 transition-colors text-lg flex-shrink-0"
                >
                  ✕
                </button>
              </div>
              <Textarea
                value={p.description ?? ''}
                onChange={v => updateProject(idx, { description: v })}
                placeholder="Short description"
                rows={2}
              />
              <div className="flex gap-2">
                <SelectInput
                  value={p.status ?? 'active'}
                  onChange={v => updateProject(idx, { status: v as PersonalContextProject['status'] })}
                  options={[
                    { value: 'planning', label: 'Planning' },
                    { value: 'active', label: 'Active' },
                    { value: 'review', label: 'Review' },
                    { value: 'paused', label: 'Paused' },
                  ]}
                />
                <TextInput
                  value={p.linkedKeyArea ?? ''}
                  onChange={v => updateProject(idx, { linkedKeyArea: v || undefined })}
                  placeholder="Key area (e.g. house-10)"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => addProject(focusDraft)}
            className="text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors"
          >
            + Add project
          </button>
        </div>
      </div>
      {/* Recent Wins */}
      <div>
        <Label>Recent Wins (comma-separated)</Label>
        <Textarea
          value={joinCSV(focusDraft.recentWins)}
          onChange={v => setFocusDraft(d => ({ ...d, recentWins: splitCSV(v) }))}
          placeholder="e.g. Launched course, Signed first client…"
        />
      </div>
      {/* Active Key Areas */}
      <div>
        <Label>Active Key Areas (comma-separated house IDs)</Label>
        <TextInput
          value={joinCSV(focusDraft.activeKeyAreas)}
          onChange={v => setFocusDraft(d => ({ ...d, activeKeyAreas: splitCSV(v) }))}
          placeholder="e.g. house-10, house-7"
        />
      </div>
    </div>
  );

  const focusView = (
    <div className="space-y-4">
      {ctx?.activeProjects?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-2 uppercase tracking-wide">Active Projects</p>
          <div className="space-y-2">
            {ctx.activeProjects.map(p => (
              <div key={p.id} className="p-3 bg-surface-overlay rounded-lg border border-theme-border-subtle">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-theme-text-primary">{p.name}</p>
                  {p.status && <Tag label={p.status} />}
                </div>
                {p.description && (
                  <p className="text-xs text-theme-text-secondary mt-1">{p.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyHint>Add your active projects so the AI understands what you are building. Click ✎ to edit.</EmptyHint>
      )}
      {ctx?.recentWins?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Recent Wins</p>
          <ul className="space-y-1">
            {ctx.recentWins.map(w => (
              <li key={w} className="text-sm text-theme-text-secondary flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );

  // ── Section 3: Values & Life ──────────────────────────────────────────────

  function openValues() {
    setValuesDraft({
      coreValues: ctx?.coreValues ?? [],
      nonNegotiables: ctx?.nonNegotiables ?? [],
      lifeStage: ctx?.lifeStage ?? '',
      primaryLocation: ctx?.primaryLocation ?? '',
      lifeManifesto: ctx?.lifeManifesto ?? '',
    });
    setEditingSection('values');
  }

  const valuesForm = (
    <div className="space-y-4">
      <div>
        <Label>Core Values (comma-separated)</Label>
        <TextInput
          value={joinCSV(valuesDraft.coreValues)}
          onChange={v => setValuesDraft(d => ({ ...d, coreValues: splitCSV(v) }))}
          placeholder="e.g. Truth, Love, Creation, Freedom"
        />
      </div>
      <div>
        <Label>Non-Negotiables (comma-separated)</Label>
        <TextInput
          value={joinCSV(valuesDraft.nonNegotiables)}
          onChange={v => setValuesDraft(d => ({ ...d, nonNegotiables: splitCSV(v) }))}
          placeholder="e.g. Daily nature time, family first"
        />
      </div>
      <div>
        <Label>Life Stage</Label>
        <TextInput
          value={valuesDraft.lifeStage ?? ''}
          onChange={v => setValuesDraft(d => ({ ...d, lifeStage: v || undefined }))}
          placeholder="e.g. Building phase, Transition, Expansion"
        />
      </div>
      <div>
        <Label>Primary Location</Label>
        <TextInput
          value={valuesDraft.primaryLocation ?? ''}
          onChange={v => setValuesDraft(d => ({ ...d, primaryLocation: v || undefined }))}
          placeholder="e.g. Rio de Janeiro, Remote"
        />
      </div>
      <div>
        <Label>Life Manifesto</Label>
        <Textarea
          value={valuesDraft.lifeManifesto ?? ''}
          onChange={v => setValuesDraft(d => ({ ...d, lifeManifesto: v || undefined }))}
          placeholder="Who are you, what do you stand for, what are you creating?"
          rows={4}
        />
      </div>
    </div>
  );

  const valuesView = (
    <div className="space-y-3">
      {ctx?.coreValues?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Core Values</p>
          <div className="flex flex-wrap gap-2">
            {ctx.coreValues.map(v => <Tag key={v} label={v} />)}
          </div>
        </div>
      ) : (
        <EmptyHint>Add your core values so the AI can align readings with what matters most to you. Click ✎ to edit.</EmptyHint>
      )}
      {ctx?.nonNegotiables?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Non-Negotiables</p>
          <div className="flex flex-wrap gap-2">
            {ctx.nonNegotiables.map(n => <Tag key={n} label={n} />)}
          </div>
        </div>
      ) : null}
      {(ctx?.lifeStage || ctx?.primaryLocation) && (
        <div className="flex gap-4 text-sm text-theme-text-secondary">
          {ctx.lifeStage && <span><span className="text-theme-text-tertiary">Stage:</span> {ctx.lifeStage}</span>}
          {ctx.primaryLocation && <span><span className="text-theme-text-tertiary">Location:</span> {ctx.primaryLocation}</span>}
        </div>
      )}
      {ctx?.lifeManifesto && (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Life Manifesto</p>
          <p className="text-sm text-theme-text-secondary leading-relaxed italic">"{ctx.lifeManifesto}"</p>
        </div>
      )}
    </div>
  );

  // ── Section 4: Energy & Relationships ────────────────────────────────────

  function openEnergy() {
    setEnergyDraft({
      chronotype: ctx?.chronotype,
      energyPeakTimes: ctx?.energyPeakTimes ?? [],
      depletionFactors: ctx?.depletionFactors ?? [],
      recoveryNeeds: ctx?.recoveryNeeds ?? [],
      keyRelationships: ctx?.keyRelationships ?? [],
      spiritualPractices: ctx?.spiritualPractices ?? [],
    });
    setEditingSection('energy');
  }

  function addRelationship() {
    setEnergyDraft(d => ({
      ...d,
      keyRelationships: [...(d.keyRelationships ?? []), { id: `rel-new-${Date.now()}`, name: '', role: '' }],
    }));
  }

  function updateRelationship(idx: number, partial: Partial<PersonalContextRelationship>) {
    setEnergyDraft(d => {
      const rels = [...(d.keyRelationships ?? [])];
      rels[idx] = { ...rels[idx], ...partial };
      if (partial.name) {
        rels[idx].id = `rel-${partial.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      }
      return { ...d, keyRelationships: rels };
    });
  }

  function removeRelationship(idx: number) {
    setEnergyDraft(d => ({
      ...d,
      keyRelationships: (d.keyRelationships ?? []).filter((_, i) => i !== idx),
    }));
  }

  const energyForm = (
    <div className="space-y-4">
      <div>
        <Label>Chronotype</Label>
        <SelectInput
          value={energyDraft.chronotype ?? ''}
          onChange={v => setEnergyDraft(d => ({ ...d, chronotype: v as PersonalContext['chronotype'] || undefined }))}
          options={[
            { value: 'morning', label: 'Morning bird' },
            { value: 'evening', label: 'Night owl' },
            { value: 'bimodal', label: 'Bimodal (morning + evening)' },
            { value: 'flexible', label: 'Flexible' },
          ]}
          placeholder="Select chronotype…"
        />
      </div>
      <div>
        <Label>Energy Peak Times (comma-separated)</Label>
        <TextInput
          value={joinCSV(energyDraft.energyPeakTimes)}
          onChange={v => setEnergyDraft(d => ({ ...d, energyPeakTimes: splitCSV(v) }))}
          placeholder="e.g. 7-10am, 4-7pm"
        />
      </div>
      <div>
        <Label>Depletion Factors (comma-separated)</Label>
        <TextInput
          value={joinCSV(energyDraft.depletionFactors)}
          onChange={v => setEnergyDraft(d => ({ ...d, depletionFactors: splitCSV(v) }))}
          placeholder="e.g. Long meetings, noisy environments"
        />
      </div>
      <div>
        <Label>Recovery Needs (comma-separated)</Label>
        <TextInput
          value={joinCSV(energyDraft.recoveryNeeds)}
          onChange={v => setEnergyDraft(d => ({ ...d, recoveryNeeds: splitCSV(v) }))}
          placeholder="e.g. Nature walks, solitude, beach football"
        />
      </div>
      <div>
        <Label>Spiritual Practices (comma-separated)</Label>
        <TextInput
          value={joinCSV(energyDraft.spiritualPractices)}
          onChange={v => setEnergyDraft(d => ({ ...d, spiritualPractices: splitCSV(v) }))}
          placeholder="e.g. Meditation, fasting, Gene Keys contemplation"
        />
      </div>
      <div>
        <Label>Key Relationships</Label>
        <div className="space-y-3">
          {(energyDraft.keyRelationships ?? []).map((r, idx) => (
            <div key={idx} className="flex gap-2">
              <TextInput
                value={r.name}
                onChange={v => updateRelationship(idx, { name: v })}
                placeholder="Name"
              />
              <TextInput
                value={r.role}
                onChange={v => updateRelationship(idx, { role: v })}
                placeholder="Role (e.g. partner, mentor)"
              />
              <button
                onClick={() => removeRelationship(idx)}
                className="text-theme-text-tertiary hover:text-rose-400 transition-colors text-lg flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            onClick={addRelationship}
            className="text-sm text-theme-text-secondary hover:text-theme-text-primary transition-colors"
          >
            + Add relationship
          </button>
        </div>
      </div>
    </div>
  );

  const energyView = (
    <div className="space-y-3">
      {ctx?.chronotype ? (
        <p className="text-sm text-theme-text-secondary">
          <span className="text-theme-text-tertiary">Chronotype:</span> {ctx.chronotype}
        </p>
      ) : (
        <EmptyHint>Add your energy patterns so the AI can time recommendations well. Click ✎ to edit.</EmptyHint>
      )}
      {ctx?.energyPeakTimes?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Peak Times</p>
          <div className="flex flex-wrap gap-2">
            {ctx.energyPeakTimes.map(t => <Tag key={t} label={t} />)}
          </div>
        </div>
      ) : null}
      {ctx?.spiritualPractices?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-1 uppercase tracking-wide">Spiritual Practices</p>
          <div className="flex flex-wrap gap-2">
            {ctx.spiritualPractices.map(p => <Tag key={p} label={p} />)}
          </div>
        </div>
      ) : null}
      {ctx?.keyRelationships?.length ? (
        <div>
          <p className="text-xs text-theme-text-tertiary mb-2 uppercase tracking-wide">Key Relationships</p>
          <div className="grid grid-cols-2 gap-2">
            {ctx.keyRelationships.map(r => (
              <div key={r.id} className="p-2 bg-surface-overlay rounded-lg border border-theme-border-subtle">
                <p className="text-sm text-theme-text-primary font-medium">{r.name}</p>
                <p className="text-xs text-theme-text-tertiary">{r.role}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-medium text-theme-text-primary mb-2">
          Personal Context
        </h1>
        <p className="text-theme-text-secondary">
          Your ILOS QUANTUM layer — who you are, what you're building, and how you operate.
          This context is injected into AI readings to make every session personal.
        </p>
        {ctx?.lastUpdated && (
          <p className="text-xs text-theme-text-tertiary mt-2">
            Last updated: {new Date(ctx.lastUpdated).toLocaleDateString()}
          </p>
        )}
      </div>

      <SectionShell
        title="Professional Context"
        icon="💼"
        editing={editingSection === 'professional'}
        onEdit={openProfessional}
        onSave={() => handleSave(profDraft)}
        onCancel={() => setEditingSection(null)}
        form={professionalForm}
      >
        {professionalView}
      </SectionShell>

      <SectionShell
        title="Current Focus"
        icon="🎯"
        editing={editingSection === 'focus'}
        onEdit={openFocus}
        onSave={() => handleSave(focusDraft)}
        onCancel={() => setEditingSection(null)}
        form={focusForm}
      >
        {focusView}
      </SectionShell>

      <SectionShell
        title="Values & Life"
        icon="✦"
        editing={editingSection === 'values'}
        onEdit={openValues}
        onSave={() => handleSave(valuesDraft)}
        onCancel={() => setEditingSection(null)}
        form={valuesForm}
      >
        {valuesView}
      </SectionShell>

      <SectionShell
        title="Energy & Relationships"
        icon="⚡"
        editing={editingSection === 'energy'}
        onEdit={openEnergy}
        onSave={() => handleSave(energyDraft)}
        onCancel={() => setEditingSection(null)}
        form={energyForm}
      >
        {energyView}
      </SectionShell>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/contemplate"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-900 font-medium rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <span>✦</span>
          Open Contemplation Chamber
        </Link>
      </div>
    </motion.div>
  );
}

export default ProfilePersonalContext;
