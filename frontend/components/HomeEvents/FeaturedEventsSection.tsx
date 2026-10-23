'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowRight, Calendar, Sparkles, ExternalLink, Trophy, Users } from 'lucide-react'
import BlurImage from '@/components/ui/BlurImage'
import { useSummitData } from '@/hooks/useSummitData'
import { PORTFOLIO_EVENTS, PortfolioEvent } from '@/components/EventPortfolio/data'
import { DetailModal } from '@/components/EventPortfolio/DetailModal'

export default function FeaturedEventsSection() {
  const { data } = useSummitData()
  const [selectedEvent, setSelectedEvent] = useState<PortfolioEvent | null>(null)

  const featuredEvents: PortfolioEvent[] = useMemo(() => {
    const cmsEvents = Array.isArray(data?.events) && data.events.length > 0 ? data.events : []
    const portfolioMedia = Array.isArray(data?.portfolioMedia) ? data.portfolioMedia : []
    const baseEvents = cmsEvents.length > 0 ? cmsEvents : PORTFOLIO_EVENTS

    return baseEvents.slice(0, 3).map((e, idx) => {
      const numStr = e.number || `0${idx + 1}`.slice(-2)
      const matched = portfolioMedia.find(
        (p) =>
          p.eventId === e.id ||
          p.eventId === numStr ||
          (p.eventId === 'venturex' && e.title.includes('VentureX')) ||
          (p.eventId === 'baazar' && e.title.includes('Bazaar')) ||
          (p.eventId === 'funding-conclave' && e.title.includes('Funding'))
      )

      return {
        id: e.id,
        number: numStr,
        title: e.title,
        category: e.category,
        eyebrow: e.eyebrow,
        image: matched?.imageUrl || e.image,
        purpose: e.purpose,
        delivery: e.delivery,
        expectedParticipation: e.expectedParticipation,
        tags: e.tags,
        partner: e.partner ?? undefined,
        registrationUrl: e.registrationUrl ?? null,
      }
    })
  }, [data?.events, data?.portfolioMedia])

  return (
    <section
      id="featured-events"
      className="relative z-20 bg-section-1 text-primary py-16 sm:py-20 md:py-24 border-t border-mint/20 overflow-hidden"
      aria-label="Featured Events"
    >
      {/* Background Decorative Lighting */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-25 blur-3xl rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(116, 251, 68, 0.25) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* Cyber Geometric Capsule Pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='105' viewBox='0 0 80 105'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='death-star' fill='%238AC53F' fill-opacity='0.12'%3E%3Cpath d='M20 10a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm15 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zM20 75a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zm30-65a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V10zm0 65a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V75zM35 10a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zM5 45a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10zm60 35a5 5 0 0 1 10 0v50a5 5 0 0 1-10 0V45zm0-35a5 5 0 0 1 10 0v20a5 5 0 0 1-10 0V10z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="section-container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Block */}
        <div className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-mint/10 border border-mint/20 mb-3">
              <Sparkles size={13} className="text-mint animate-pulse" />
              <span className="font-mono-data text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-mint">
                FLAGSHIP INITIATIVES
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-primary leading-tight">
              FEATURED <span className="text-gradient-mint">EVENTS</span>
            </h2>

            <p className="font-body text-xs sm:text-sm text-secondary leading-relaxed mt-2 max-w-xl">
              From overnight hackathons to venture capital pitch stages and live market simulations, experience North India’s premier student entrepreneurship summit.
            </p>
          </div>

          {/* Quick Header CTA Button (redirects to /events) */}
          <div className="shrink-0">
            <Link
              href="/events"
              id="header-show-all-events-btn"
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono-data text-xs font-bold uppercase tracking-wider text-primary hover:text-void bg-panel-alt hover:btn-mint-gradient border border-border-subtle hover:border-mint transition-all duration-300 shadow-sm cursor-pointer"
            >
              <span>SHOW ALL EVENTS</span>
              <ArrowUpRight
                size={15}
                strokeWidth={2.4}
                className="text-mint group-hover:text-void transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        {/* 3 Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {featuredEvents.map((event, index) => {
            const isComp = ['hackathon', 'competition', 'quiz', 'auction', 'strategy'].some((keyword) =>
              event.category.toLowerCase().includes(keyword)
            )
            const hasLink = Boolean(event.registrationUrl) || isComp
            const registerLink = event.registrationUrl || (isComp ? 'https://unstop.com' : '/register')
            const buttonLabel = isComp ? 'Register' : 'Apply'

            return (
              <motion.div
                key={event.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                onClick={() => setSelectedEvent(event)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedEvent(event)
                  }
                }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-panel border border-border-panel hover:border-mint/50 focus-visible:ring-2 focus-visible:ring-mint focus:outline-none transition-all duration-300 shadow-xl cursor-pointer"
                style={{
                  boxShadow: '0 16px 36px -6px rgba(0,0,0,0.35)',
                }}
              >
                {/* ── Top: Framed Banner Image ── */}
                <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-black/40 shrink-0">
                  <BlurImage
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />

                  {/* Gradient Scrims for Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-panel via-black/20 to-black/60" />

                  {/* Top-Left: Category Tag Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="font-mono-data text-[9px] font-bold uppercase tracking-wider text-mint bg-void/85 backdrop-blur-md px-2.5 py-1 rounded-md border border-mint/30 shadow-sm">
                      {event.eyebrow || event.category}
                    </span>
                  </div>

                  {/* Top-Right: Index Counter */}
                  <div className="absolute top-3.5 right-3.5 z-10">
                    <span className="font-mono-data text-[9.5px] font-bold text-primary bg-panel-alt/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-border-subtle">
                      0{index + 1} / 03
                    </span>
                  </div>

                  {/* Bottom Overlay: Partner or Expected Participation */}
                  {event.partner && (
                    <div className="absolute bottom-3 left-3.5 right-3.5 z-10 flex items-center justify-between text-[10px] font-mono-data text-slate-300">
                      <span className="truncate max-w-[85%] text-slate-300 drop-shadow-md">
                        Partner: <span className="text-white font-semibold">{event.partner}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Middle: Structured Content Body ── */}
                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 bg-panel">
                  <div>
                    {/* Category Label */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono-data text-[9.5px] font-bold uppercase tracking-widest text-muted">
                        {event.category}
                      </span>
                    </div>

                    {/* Event Title */}
                    <h3 className="font-display text-xl sm:text-2xl font-bold uppercase tracking-tight text-primary group-hover:text-mint transition-colors duration-200 line-clamp-1 leading-snug">
                      {event.title}
                    </h3>

                    {/* Purpose / Summary */}
                    <p className="font-body text-xs sm:text-sm text-secondary font-normal line-clamp-2 leading-relaxed mt-2.5 mb-4">
                      {event.purpose}
                    </p>

                    {/* Tags Chips */}
                    {Array.isArray(event.tags) && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {event.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="font-mono-data text-[9px] font-semibold text-secondary bg-panel-alt border border-border-subtle px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ── Card Footer: Participation & Action Buttons ── */}
                  <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-auto">
                    <span className="font-mono-data text-[10px] font-semibold text-muted truncate max-w-[150px] flex items-center gap-1.5">
                      <Users size={12} className="text-mint shrink-0" />
                      <span className="truncate">{event.expectedParticipation || 'PEC E-Summit 2026'}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {hasLink && (
                        <a
                          href={registerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center justify-center h-8 px-3.5 rounded-lg bg-mint text-void font-mono-data text-[10.5px] font-black uppercase tracking-wider hover:brightness-110 hover:scale-105 active:scale-95 transition-all shadow-sm"
                        >
                          {buttonLabel}
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedEvent(event)
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-panel-alt hover:bg-mint hover:text-void text-primary border border-border-subtle transition-colors shadow-xs"
                        aria-label={`View details for ${event.title}`}
                      >
                        <ArrowUpRight size={15} strokeWidth={2.4} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* ── Bottom Section CTA: Option to Show All Events (Redirects to /events) ── */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="relative mx-auto max-w-2xl rounded-2xl bg-panel-alt/70 border border-border-subtle p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 text-left">
              <div>
                <span className="font-mono-data text-[10px] font-bold uppercase tracking-widest text-mint block mb-1">
                  FULL SUMMIT SCHEDULE &amp; ARENAS
                </span>
                <h4 className="font-display text-lg sm:text-xl font-bold uppercase tracking-tight text-primary">
                  EXPLORE ALL 12+ SUMMIT EVENTS
                </h4>
                <p className="font-body text-xs text-secondary mt-1 max-w-md">
                  Discover all hackathons, pitch stages, VC conclaves, keynote arenas, and interactive expos.
                </p>
              </div>

              <Link
                href="/events"
                id="bottom-show-all-events-cta"
                className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-7 py-3.5 btn-mint-gradient text-void font-mono-data text-xs font-black uppercase tracking-wider shadow-[0_4px_20px_rgba(116,251,68,0.35)] hover:scale-105 active:scale-95 hover:brightness-110 transition-all cursor-pointer w-full sm:w-auto"
              >
                <span>SHOW ALL EVENTS</span>
                <ArrowRight
                  size={15}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Full Event Details Modal */}
      <DetailModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </section>
  )
}
