/* ===== Carte (hauteur réduite + perso plus grand) ===== */
const Card = ({ data, role }: { data: CardDef; role: 'left' | 'center' | 'right' }) => (
  <div className={roleClass(role)} tabIndex={-1}>
    {/* Zone image : HAUTEUR RÉDUITE */}
    <div className="relative h-[460px] sm:h-[500px] lg:h-[540px] bg-black">
      {/* Boîte de calage : perso plus GRAND = on réduit les marges internes */}
      <div className="absolute inset-0 pt-1 sm:pt-2 px-3 pb-24 md:pb-28">
        <Image
          src={data.image}
          alt={data.name}
          fill
          priority={role === 'center'}
          sizes="(max-width: 768px) 84vw, (max-width: 1024px) 60vw, 32vw"
          className="object-contain object-bottom select-none pointer-events-none"
        />
      </div>

      {/* Gradient bas : réduit pour matcher le nouveau pb */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 md:h-28 bg-gradient-to-b from-transparent to-black/70"
        aria-hidden
      />
    </div>

    {/* Texte */}
    <div className="p-5">
      <h3 className="text-white text-lg font-semibold">{data.name}</h3>
      <p className={'mt-2 text-sm leading-relaxed text-muted ' + (role === 'center' ? '' : 'line-clamp-1')}>
        {data.blurb}
      </p>
      <Link href={`/agents/${data.slug}`} className="mt-3 inline-block text-sm text-[color:var(--gold-1)]">
        Voir les détails →
      </Link>
    </div>

    {/* Assombrissement intégral des cartes latérales */}
    {role !== 'center' && <div className="pointer-events-none absolute inset-0 bg-black/55" aria-hidden />}
  </div>
);
