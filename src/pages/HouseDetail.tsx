import { useParams, Link } from 'react-router-dom';
import { houses, signs, planets, chakras, hdGates, geneKeys } from '../data';
import { getPlacementsInHouse } from '../data/userProfile';

export function HouseDetail() {
  const { id } = useParams<{ id: string }>();
  const house = id ? houses.get(id) : undefined;

  if (!house) {
    return (
      <div className="text-center py-12">
        <h1 className="font-serif text-2xl mb-4">House Not Found</h1>
        <Link to="/houses" className="text-air-400 hover:underline">
          Back to Houses
        </Link>
      </div>
    );
  }

  const rulingSign = signs.get(house.rulingSignId);
  const rulingPlanet = planets.get(house.rulingPlanetId);
  const myPlacements = getPlacementsInHouse(house.houseNumber);
  const relatedChakra = Array.from(chakras.values()).find(c => c.relatedHouses.includes(house.houseNumber));

  // Derive HD Gates and Gene Keys via the house's natural sign
  const houseGates = rulingSign
    ? Array.from(hdGates.values())
        .filter(g => g.tropicalSignId === rulingSign.id)
        .sort((a, b) => a.gateNumber - b.gateNumber)
    : [];
  const houseGeneKeys = rulingSign
    ? Array.from(geneKeys.values())
        .filter(gk => gk.tropicalSignId === rulingSign.id)
        .sort((a, b) => a.keyNumber - b.keyNumber)
    : [];

  // Find adjacent houses
  const allHouses = Array.from(houses.values()).sort((a, b) => a.houseNumber - b.houseNumber);
  const currentIndex = allHouses.findIndex((h) => h.id === house.id);
  const prevHouse = currentIndex > 0 ? allHouses[currentIndex - 1] : allHouses[11];
  const nextHouse = currentIndex < 11 ? allHouses[currentIndex + 1] : allHouses[0];

  const houseTypeColors = {
    Angular: 'text-fire-400 bg-fire-500/10 border-fire-500/30',
    Succedent: 'text-earth-400 bg-earth-500/10 border-earth-500/30',
    Cadent: 'text-air-400 bg-air-500/10 border-air-500/30',
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header className="text-center py-8">
        <div className="text-6xl mb-4 font-serif">{house.houseNumber}</div>
        <h1 className="font-serif text-4xl font-medium mb-2">{house.name}</h1>
        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <span className={`px-3 py-1 rounded-full border ${houseTypeColors[house.houseType]}`}>
            {house.houseType} House
          </span>
          {rulingSign && (
            <span className="px-3 py-1 bg-neutral-800 rounded-full">
              {rulingSign.symbol} {rulingSign.name}
            </span>
          )}
          {/* World half badge */}
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${
            house.worldHalf === 'inner'
              ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
              : 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
          }`}>
            {house.worldHalf === 'inner' ? '◉ Inner World' : '◎ Outer World'}
          </span>
        </div>
      </header>

      {/* My Placements in this House */}
      {myPlacements.length > 0 && (
        <section className="rounded-xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-purple-600/5">
          <h2 className="font-serif text-xl mb-4 text-purple-300">My Placements in the {house.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {myPlacements.map((placement) => {
              const placementSign = signs.get(placement.signId);
              return (
                <div
                  key={placement.planetId}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    placement.placementType === 'planet'
                      ? 'bg-neutral-800/60'
                      : 'bg-neutral-800/40 border border-neutral-700/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{placement.planetSymbol}</span>
                    <div>
                      <div className="font-medium">
                        {placement.planetName}
                        {placement.isRetrograde && (
                          <span className="text-xs text-red-400 ml-1">R</span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400">
                        in {placementSign?.name}
                        {placement.dignity && (
                          <span className="text-amber-400 ml-1">({placement.dignity})</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-neutral-400">{placement.degree}</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Life Areas */}
      <section className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-xl p-6 border border-neutral-700">
        <h2 className="font-serif text-xl mb-4">Life Area Focus</h2>
        <div className="flex flex-wrap gap-2">
          {house.lifeAreaFocus.map((area, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-neutral-800 rounded-lg text-neutral-300"
            >
              {area}
            </span>
          ))}
        </div>
      </section>

      {/* Meaning */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">Meaning & Representation</h2>
        <p className="text-neutral-300 leading-relaxed">{house.meaningAndRepresentation}</p>
        {house.worldHalfTheme && (
          <p className={`mt-3 text-sm font-medium ${house.worldHalf === 'inner' ? 'text-amber-400/70' : 'text-indigo-400/70'}`}>
            {house.worldHalfTheme}
          </p>
        )}
      </section>

      {/* Rulers */}
      <div className="grid md:grid-cols-2 gap-6">
        {rulingSign && (
          <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
            <h2 className="font-serif text-xl mb-4">Natural Sign</h2>
            <Link
              to={`/signs/${rulingSign.id}`}
              className="flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <span className="text-3xl">{rulingSign.symbol}</span>
              <div>
                <div className="font-medium text-lg">{rulingSign.name}</div>
                <div className="text-sm text-neutral-400">{rulingSign.keyPhrase}</div>
              </div>
            </Link>
          </section>
        )}

        {rulingPlanet && (
          <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
            <h2 className="font-serif text-xl mb-4">Natural Ruler</h2>
            <Link
              to={`/planets/${rulingPlanet.id}`}
              className="flex items-center gap-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <span className="text-3xl">{rulingPlanet.symbol}</span>
              <div>
                <div className="font-medium text-lg">{rulingPlanet.name}</div>
                <div className="text-sm text-neutral-400">{rulingPlanet.archetype}</div>
              </div>
            </Link>
          </section>
        )}
      </div>

      {/* Chakra Resonance */}
      {relatedChakra && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-4">Chakra Resonance</h2>
          <p className="text-neutral-500 text-sm mb-4">
            In astrological alchemy, each house activates a specific energy center —
            the chakra whose qualities mirror the life area this house governs.
          </p>
          <Link
            to={`/chakras/${relatedChakra.id}`}
            className="flex items-center gap-4 p-4 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors border border-neutral-700 mb-4"
          >
            <div
              className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-xl"
              style={{ backgroundColor: relatedChakra.colorHex + '33', border: `2px solid ${relatedChakra.colorHex}66` }}
            >
              {relatedChakra.symbol}
            </div>
            <div>
              <p className="text-white font-medium">{relatedChakra.name}</p>
              <p className="text-neutral-400 text-sm italic">{relatedChakra.sanskritName}</p>
              <p className="text-neutral-500 text-xs mt-1">{relatedChakra.lifeTheme}</p>
            </div>
          </Link>
          {relatedChakra.alchemyNote && (
            <div
              className="p-4 rounded-lg bg-neutral-800/30 border-l-2"
              style={{ borderLeftColor: relatedChakra.colorHex + '90' }}
            >
              <p className="text-neutral-300 text-sm italic leading-relaxed">
                "{relatedChakra.alchemyNote}"
              </p>
            </div>
          )}
        </section>
      )}

      {/* Cross-System Resonance: HD Gates & Gene Keys */}
      {(houseGates.length > 0 || houseGeneKeys.length > 0) && (
        <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
          <h2 className="font-serif text-xl mb-2">Cross-System Resonance</h2>
          <p className="text-neutral-500 text-sm mb-4">
            Via the natural sign of this house ({rulingSign?.name}), these HD Gates and Gene Keys carry
            the same archetypal energy in the body graph and genetic wisdom.
          </p>
          {houseGates.length > 0 && (
            <div className="mb-4">
              <h3 className="text-humandesign-400 text-sm font-medium mb-2">Human Design Gates</h3>
              <div className="flex flex-wrap gap-2">
                {houseGates.map(gate => (
                  <Link
                    key={gate.id}
                    to={`/human-design/${gate.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-humandesign-500/10 rounded-lg hover:bg-humandesign-500/20 transition-colors text-sm"
                  >
                    <span className="font-serif text-humandesign-400">{gate.gateNumber}</span>
                    <span className="text-neutral-300">{gate.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {houseGeneKeys.length > 0 && (
            <div>
              <h3 className="text-genekey-400 text-sm font-medium mb-2">Gene Keys</h3>
              <div className="flex flex-wrap gap-2">
                {houseGeneKeys.map(gk => (
                  <Link
                    key={gk.id}
                    to={`/gene-keys/${gk.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-genekey-500/10 rounded-lg hover:bg-genekey-500/20 transition-colors text-sm"
                  >
                    <span className="font-serif text-genekey-400">{gk.keyNumber}</span>
                    <span className="text-neutral-300">{gk.name}</span>
                    <span className="text-neutral-600">·</span>
                    <span className="text-emerald-400/70 text-xs">{gk.gift.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Contemplation Questions */}
      {house.contemplationQuestions && house.contemplationQuestions.length > 0 && (
        <section className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 rounded-xl p-6 border border-neutral-700">
          <h2 className="font-serif text-xl mb-4">Contemplation Questions</h2>
          <ul className="space-y-3">
            {house.contemplationQuestions.map((question, index) => (
              <li key={index} className="flex gap-3 text-neutral-300">
                <span className="text-neutral-500">{index + 1}.</span>
                <span className="italic">{question}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* House Type Explanation */}
      <section className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
        <h2 className="font-serif text-xl mb-4">About {house.houseType} Houses</h2>
        <p className="text-neutral-300 leading-relaxed">
          {house.houseType === 'Angular' && (
            "Angular houses (1st, 4th, 7th, 10th) are the most powerful positions in the chart. Planets here express themselves strongly and visibly. These houses represent the cardinal points of identity, home, relationships, and career."
          )}
          {house.houseType === 'Succedent' && (
            "Succedent houses (2nd, 5th, 8th, 11th) follow the angular houses and represent resources, values, and consolidation of the angular house themes. Planets here provide stability and depth."
          )}
          {house.houseType === 'Cadent' && (
            "Cadent houses (3rd, 6th, 9th, 12th) are houses of learning, adaptation, and transition. Planets here work more subtly, influencing mental processes and behind-the-scenes activities."
          )}
        </p>
      </section>

      {/* Navigation */}
      <nav className="flex justify-between pt-6 border-t border-neutral-800">
        <Link to={`/houses/${prevHouse.id}`} className="text-neutral-400 hover:text-white transition-colors">
          &larr; {prevHouse.name}
        </Link>
        <Link to="/houses" className="text-neutral-400 hover:text-white transition-colors">
          All Houses
        </Link>
        <Link to={`/houses/${nextHouse.id}`} className="text-neutral-400 hover:text-white transition-colors">
          {nextHouse.name} &rarr;
        </Link>
      </nav>
    </div>
  );
}
export default HouseDetail;
