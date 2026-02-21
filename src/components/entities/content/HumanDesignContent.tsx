import type { EntityInfo } from '../../../services/entities';
import { getEntity } from '../../../services/entities';
import { getStringValue } from '../entityPanelUtils';

interface HumanDesignContentProps {
  entity: EntityInfo;
  onEntityClick?: (entity: EntityInfo) => void;
}

export function HumanDesignContent({ entity, onEntityClick }: HumanDesignContentProps) {
  const data = entity.data as Record<string, unknown>;

  return (
    <>
      {/* HD Gate: Gate number and expressions */}
      {entity.type === 'hd-gate' && (
        <GateContent data={data} />
      )}

      {/* HD Channel: Connecting gates */}
      {entity.type === 'hd-channel' && (
        <ChannelContent data={data} onEntityClick={onEntityClick} />
      )}

      {/* HD Center: Defined/Undefined meanings */}
      {entity.type === 'hd-center' && (
        <CenterContent data={data} />
      )}

      {/* HD Type: Strategy & Signature */}
      {entity.type === 'hd-type' && (
        <TypeContent data={data} />
      )}
    </>
  );
}

function GateContent({ data }: { data: Record<string, unknown> }) {
  const gateNumber = typeof data.gateNumber === 'number' ? data.gateNumber : null;
  const iChingName = typeof data.iChingHexagramName === 'string' ? data.iChingHexagramName : null;
  const highExpr = typeof data.highExpression === 'string' ? data.highExpression : null;
  const lowExpr = typeof data.lowExpression === 'string' ? data.lowExpression : null;

  return (
    <div className="space-y-3">
      {(gateNumber || iChingName) && (
        <div className="flex items-center gap-3">
          {gateNumber && (
            <span className="text-3xl font-bold text-amber-300">{gateNumber}</span>
          )}
          {iChingName && (
            <div className="text-sm text-gray-400">{iChingName}</div>
          )}
        </div>
      )}
      {highExpr && (
        <div>
          <p className="text-xs text-emerald-400 mb-1">High Expression</p>
          <p className="text-sm text-gray-300">{highExpr}</p>
        </div>
      )}
      {lowExpr && (
        <div>
          <p className="text-xs text-red-400 mb-1">Low Expression</p>
          <p className="text-sm text-gray-300">{lowExpr}</p>
        </div>
      )}
    </div>
  );
}

function ChannelContent({ data, onEntityClick }: { data: Record<string, unknown>; onEntityClick?: (entity: EntityInfo) => void }) {
  const gate1Id = typeof data.gate1Id === 'string' ? data.gate1Id : null;
  const gate2Id = typeof data.gate2Id === 'string' ? data.gate2Id : null;
  const channelType = typeof data.channelType === 'string' ? data.channelType : null;

  const gate1Entity = gate1Id ? getEntity(gate1Id) : null;
  const gate2Entity = gate2Id ? getEntity(gate2Id) : null;

  return (
    <div className="space-y-3">
      {channelType && (
        <div className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs inline-block">
          {channelType}
        </div>
      )}
      {(gate1Entity || gate2Entity) && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-2">
            Connecting Gates
          </h4>
          <div className="flex items-center gap-2">
            {gate1Entity && (
              <button
                onClick={() => onEntityClick?.(gate1Entity)}
                className="px-3 py-2 bg-amber-900/30 rounded border border-amber-500/20 hover:bg-amber-900/50 text-sm text-amber-300 transition-colors"
              >
                Gate {gate1Id?.replace('gate-', '')}
              </button>
            )}
            <span className="text-amber-400">—</span>
            {gate2Entity && (
              <button
                onClick={() => onEntityClick?.(gate2Entity)}
                className="px-3 py-2 bg-amber-900/30 rounded border border-amber-500/20 hover:bg-amber-900/50 text-sm text-amber-300 transition-colors"
              >
                Gate {gate2Id?.replace('gate-', '')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CenterContent({ data }: { data: Record<string, unknown> }) {
  const centerType = typeof data.centerType === 'string' ? data.centerType : null;
  const definedMeaning = typeof data.definedMeaning === 'string' ? data.definedMeaning : null;
  const undefinedMeaning = typeof data.undefinedMeaning === 'string' ? data.undefinedMeaning : null;

  return (
    <div className="space-y-3">
      {centerType && (
        <div className="text-xs text-amber-400 uppercase tracking-wider">
          {centerType} Center
        </div>
      )}
      {definedMeaning && (
        <div>
          <p className="text-xs text-emerald-400 mb-1">When Defined</p>
          <p className="text-sm text-gray-300">{definedMeaning}</p>
        </div>
      )}
      {undefinedMeaning && (
        <div>
          <p className="text-xs text-gray-400 mb-1">When Undefined</p>
          <p className="text-sm text-gray-300">{undefinedMeaning}</p>
        </div>
      )}
    </div>
  );
}

function TypeContent({ data }: { data: Record<string, unknown> }) {
  return (
    <div className="space-y-2">
      {getStringValue(data, 'signatureEmotion') && (
        <div className="flex items-center gap-2">
          <span className="w-20 text-xs text-gray-500">Signature</span>
          <span className="text-sm text-emerald-400">
            {getStringValue(data, 'signatureEmotion')}
          </span>
        </div>
      )}
      {getStringValue(data, 'notSelfEmotion') && (
        <div className="flex items-center gap-2">
          <span className="w-20 text-xs text-gray-500">Not-Self</span>
          <span className="text-sm text-red-400">
            {getStringValue(data, 'notSelfEmotion')}
          </span>
        </div>
      )}
    </div>
  );
}
