/**
 * BlueprintJourneyView
 *
 * Renders the three-chapter developmental arc of the seeker's Gene Keys blueprint:
 *   Chapter 1 — Identity Layer (Activation Sequence: Life's Work, Evolution, Radiance, Purpose)
 *   Chapter 2 — Relational Layer (Venus Sequence: Attraction, IQ, EQ, SQ, Core)
 *   Chapter 3 — Expansion Layer (Pearl Sequence: Vocation, Culture, Brand/Mercury, Pearl)
 *
 * Also shows an activation concentration summary: which sign cluster has the most activations.
 */

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { geneKeys, lines, signs } from '../../data';
import { EntityLink } from '../entities';
import type { GeneKeysProfile, GeneKeySphere, CosmicProfile } from '../../types';
import type { EntityInfo } from '../../services/entities';

interface JourneyChapterProps {
  title: string;
  subtitle: string;
  colorClass: string;
  borderClass: string;
  titleColorClass: string;
  spheres: { key: string; data: GeneKeySphere | undefined }[];
  onEntityClick: (entity: EntityInfo) => void;
}

function JourneyChapterCard({
  sphereKey,
  data,
  colorClass,
  onEntityClick,
}: {
  sphereKey: string;
  data: GeneKeySphere;
  colorClass: string;
  onEntityClick: (entity: EntityInfo) => void;
}) {
  const gk = geneKeys.get(data.geneKeyId);
  const lineData = lines.get(`line-${data.line}`);

  return (
    <div className="bg-surface-base/50 rounded-lg p-3 border border-theme-border-subtle hover:bg-surface-overlay transition-colors min-w-[160px]">
      <div className="flex items-center justify-between mb-1">
        <span className={`${colorClass} text-xs font-medium`}>{data.sphereName}</span>
        <span className="text-theme-text-muted text-xs">{data.line}◆</span>
      </div>
      <p className="text-genekey-300 font-medium text-base">
        Key {data.geneKeyNumber}.{data.line}
      </p>
      {gk && (
        <EntityLink
          entityId={data.geneKeyId}
          displayName={gk.name}
          onClick={onEntityClick}
          className="text-xs mt-0.5 block truncate"
        />
      )}
      {gk && (
        <div className="mt-1 text-xs space-y-0.5">
          <span className="text-red-400 block truncate">{gk.shadow?.name}</span>
          <span className="text-emerald-400 block truncate">{gk.gift?.name}</span>
        </div>
      )}
      {/* Chakra + Element pills from Sprint BB line data */}
      {(lineData?.chakraResonance || lineData?.elementalExpression) && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {lineData?.chakraResonance && (
            <span className="px-1.5 py-0.5 bg-violet-500/10 text-violet-300 rounded text-xs">
              {lineData.chakraResonance}
            </span>
          )}
          {lineData?.elementalExpression && (
            <span className="px-1.5 py-0.5 bg-teal-500/10 text-teal-300 rounded text-xs">
              {lineData.elementalExpression}
            </span>
          )}
        </div>
      )}
      <Link
        to={`/profile/gene-keys/${sphereKey}`}
        className="text-xs text-theme-text-muted hover:text-genekey-300 transition-colors mt-2 block"
        title="Full sphere detail"
      >
        Explore →
      </Link>
    </div>
  );
}

function JourneyChapter({
  title,
  subtitle,
  colorClass,
  borderClass,
  titleColorClass,
  spheres,
  onEntityClick,
}: JourneyChapterProps) {
  const validSpheres = spheres.filter(({ data }) => data != null) as { key: string; data: GeneKeySphere }[];

  return (
    <div className={`rounded-xl p-4 border ${borderClass} bg-surface-base/30`}>
      <div className="mb-3">
        <h3 className={`font-serif text-base font-medium ${titleColorClass}`}>{title}</h3>
        <p className="text-theme-text-secondary text-xs mt-0.5">{subtitle}</p>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {validSpheres.map(({ key, data }) => (
          <JourneyChapterCard
            key={key}
            sphereKey={key}
            data={data}
            colorClass={colorClass}
            onEntityClick={onEntityClick}
          />
        ))}
      </div>
    </div>
  );
}

interface Props {
  profile: CosmicProfile;
  gkProfile: GeneKeysProfile;
  onEntityClick: (entity: EntityInfo) => void;
}

export function BlueprintJourneyView({ profile, gkProfile, onEntityClick }: Props) {
  // Compute activation concentration: count activations per sign area
  const concentrationSummary = useMemo(() => {
    const allPlacements = profile.placements ?? [];
    const signCounts: Record<string, { count: number; signName: string }> = {};

    allPlacements.forEach(placement => {
      const sign = signs.get(placement.signId);
      if (sign) {
        if (!signCounts[placement.signId]) {
          signCounts[placement.signId] = { count: 0, signName: sign.name };
        }
        signCounts[placement.signId].count++;
      }
    });

    const sorted = Object.entries(signCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3);

    return sorted;
  }, [profile.placements]);

  const identitySpheres: { key: string; data: GeneKeySphere | undefined }[] = [
    { key: 'lifesWork', data: gkProfile.lifesWork },
    { key: 'evolution', data: gkProfile.evolution },
    { key: 'radiance', data: gkProfile.radiance },
    { key: 'purpose', data: gkProfile.purpose },
  ];

  const relationalSpheres: { key: string; data: GeneKeySphere | undefined }[] = [
    { key: 'attraction', data: gkProfile.attraction },
    { key: 'iq', data: gkProfile.iq },
    { key: 'eq', data: gkProfile.eq },
    { key: 'sq', data: gkProfile.sq },
    { key: 'core', data: gkProfile.core },
  ];

  const expansionSpheres: { key: string; data: GeneKeySphere | undefined }[] = [
    { key: 'vocation', data: gkProfile.vocation },
    { key: 'culture', data: gkProfile.culture },
    { key: 'brand', data: gkProfile.brand },
    { key: 'pearl', data: gkProfile.pearl },
  ];

  return (
    <div className="space-y-5">
      {/* Activation Concentration Summary */}
      {concentrationSummary.length > 0 && (
        <div className="bg-gradient-to-r from-genekey-500/10 to-violet-500/5 rounded-xl p-4 border border-genekey-500/20">
          <h3 className="font-serif text-sm font-medium text-genekey-300 mb-2">
            Activation Concentration
          </h3>
          <div className="flex gap-3 flex-wrap">
            {concentrationSummary.map(([signId, { count, signName }]) => {
              const sign = signs.get(signId);
              return (
                <div key={signId} className="flex items-center gap-1.5">
                  <span className="text-theme-text-secondary text-sm">{sign?.symbol ?? ''}</span>
                  <span className="text-theme-text-primary text-sm font-medium">{signName}</span>
                  <span className="px-1.5 py-0.5 bg-genekey-500/20 text-genekey-300 rounded text-xs">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-theme-text-muted text-xs mt-2">
            Top sign clusters across all planetary placements
          </p>
        </div>
      )}

      {/* Chapter 1: Identity Layer */}
      <JourneyChapter
        title="Identity Layer — The Solar Cluster"
        subtitle="Your four core activations governing ~70% of blueprint identity: who you are and what you're here to express"
        colorClass="text-amber-400"
        borderClass="border-amber-500/20"
        titleColorClass="text-amber-300"
        spheres={identitySpheres}
        onEntityClick={onEntityClick}
      />

      {/* Chapter 2: Relational Layer */}
      <JourneyChapter
        title="Relational Layer — The Venus Sequence"
        subtitle="Your developmental history and heart opening: how you love, what you carry, and what integration invites"
        colorClass="text-rose-400"
        borderClass="border-rose-500/20"
        titleColorClass="text-rose-300"
        spheres={relationalSpheres}
        onEntityClick={onEntityClick}
      />

      {/* Chapter 3: Expansion Layer */}
      <JourneyChapter
        title="Expansion Layer — The Pearl Sequence"
        subtitle="Your genius, legacy, and contribution arc: how your gifts reach the world and what you are building"
        colorClass="text-blue-400"
        borderClass="border-blue-500/20"
        titleColorClass="text-blue-300"
        spheres={expansionSpheres}
        onEntityClick={onEntityClick}
      />

      <div className="text-center pt-2">
        <Link
          to="/contemplate?type=fullBlueprintJourney"
          className="text-sm text-genekey-400 hover:text-genekey-300 transition-colors"
        >
          Contemplate Full Blueprint Journey →
        </Link>
      </div>
    </div>
  );
}
