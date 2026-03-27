import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import AwardCategoryCard from './AwardCategoryCard';
import { X, Star } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { getAwardIcon } from '@/utils/awardIconMapper.js';

const CURRENT_YEAR = 2026;
const ENABLE_MEDIA = false;

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
};

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const getFocusable = (root) => {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
};

const AwardCategoriesGrid = () => {
  const CATEGORY_PROMPT_BY_AWARD_ID = {
    'animated-tv': 'What was the funniest animated TV show with new episodes airing in 2025?',
    'live-tv': 'What was the funniest live action TV show with new episodes airing in 2025?',
    'lead-tv': 'Who gave the funniest lead performance in a TV show that aired in 2025?',
    'support-tv': 'Who gave the funniest supporting performance in a TV show that aired in 2025?',
    song: 'What was the funniest song released in 2025?',
    movie: 'What was the funniest movie released in 2025?',
    'lead-movie': 'Who gave the funniest lead performance in a movie released in 2025?',
    'support-movie': 'Who gave the funniest supporting performance in a movie released in 2025?',
    standup: 'Who was the funniest comedian who performed new material in 2025?',
    special: 'What was the funniest comedy special or comedy album released in 2025?',
    podcast: 'What was the funniest podcast with new episodes released in 2025?',
    social: 'What was the funniest social media account, based on posts made in 2025?',
    book: 'What was the funniest book released in 2025?',
    article: 'What was the funniest short humor piece published in 2025?',
    'comic-strip': 'What was the funniest comic strip or single-panel cartoon published in 2025?'
  };

  const [categories, setCategories] = useState([]);
  const [nomineesByCategory, setNomineesByCategory] = useState({});
  const [loadedNomineesByCategory, setLoadedNomineesByCategory] = useState({});
  const [categoryState, setCategoryState] = useState({});

  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [navDirection, setNavDirection] = useState(0);
  const [pendingId, setPendingId] = useState(null);
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const [manualFrom, setManualFrom] = useState(null);
  const [manualTo, setManualTo] = useState(null);
  const [isManualClosing, setIsManualClosing] = useState(false);

  const reducedMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const swipeViewportRef = useRef(null);
  const [swipeW, setSwipeW] = useState(0);

  const gridRef = useRef(null);
  const cardRefs = useRef({});
  const pendingOpenScrollRef = useRef(false);

  useLayoutEffect(() => {
    const el = swipeViewportRef.current;
    if (!el) return;

    const measure = () => setSwipeW(el.getBoundingClientRect().width);

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isOpen]);

  useEffect(() => {
    if (!pendingId) return;
    setActiveId(pendingId);
    setPendingId(null);
  }, [pendingId]);

  const getHeaderHeight = () => {
    const headerEl = document.getElementById('site-header');
    return headerEl ? headerEl.getBoundingClientRect().height : 0;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('award_categories')
          .select('id, title, award_id, year, display_order')
          .eq('year', CURRENT_YEAR)
          .order('display_order', { ascending: true });

        if (error) throw error;

        const mappedCategories = (data || []).map((record) => ({
          id: record.id,
          title: record.title,
          awardId: record.award_id,
          icon: getAwardIcon(record.award_id) || Star
        }));

        console.log('Fetched categories:', mappedCategories);
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Failed to fetch award categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    if (loadedNomineesByCategory[activeId]) return;

    const fetchNominees = async () => {
      try {
        const { data, error } = await supabase
          .from('nominees')
          .select('id, category_id, name, year, media_url, sort_order')
          .eq('category_id', activeId)
          .eq('year', CURRENT_YEAR)
          .order('sort_order', { ascending: true });

        if (error) throw error;

        console.log(`Fetched nominees for ${activeId}:`, data);

        setNomineesByCategory((prev) => ({
          ...prev,
          [activeId]: data || []
        }));

        setLoadedNomineesByCategory((prev) => ({
          ...prev,
          [activeId]: true
        }));
      } catch (error) {
        console.error(`Failed to fetch nominees for category ${activeId}:`, error);

        setNomineesByCategory((prev) => ({
          ...prev,
          [activeId]: []
        }));

        setLoadedNomineesByCategory((prev) => ({
          ...prev,
          [activeId]: true
        }));
      }
    };

    fetchNominees();
  }, [activeId, loadedNomineesByCategory]);

  const expandedCategory = useMemo(
    () => categories.find((c) => c.id === activeId) || null,
    [activeId, categories]
  );

  const nominees = activeId ? nomineesByCategory[activeId] || [] : [];
  const nomineesLoaded = activeId ? Boolean(loadedNomineesByCategory[activeId]) : false;

  const activeIndex = useMemo(() => {
    if (!activeId) return -1;
    return categories.findIndex((c) => c.id === activeId);
  }, [activeId, categories]);

  const prevId = useMemo(() => {
    if (activeIndex < 0 || categories.length === 0) return null;
    const idx = (activeIndex - 1 + categories.length) % categories.length;
    return categories[idx].id;
  }, [activeIndex, categories]);

  const nextId = useMemo(() => {
    if (activeIndex < 0 || categories.length === 0) return null;
    const idx = (activeIndex + 1) % categories.length;
    return categories[idx].id;
  }, [activeIndex, categories]);

  const goPrev = () => {
    if (isManualClosing || !prevId) return;
    pendingOpenScrollRef.current = false;
    setLightboxSrc(null);
    setNavDirection(-1);
    setPendingId(prevId);
  };

  const goNext = () => {
    if (isManualClosing || !nextId) return;
    pendingOpenScrollRef.current = false;
    setLightboxSrc(null);
    setNavDirection(1);
    setPendingId(nextId);
  };

  const stateFor = (id) => {
    return (
      categoryState[id] || {
        email: '',
        selection: '',
        isSubmitting: false,
        hasConfirmed: false,
        error: '',
        usedEmails: {},
        mediaOpen: {}
      }
    );
  };

  const setStateFor = (id, patch) => {
    setCategoryState((prev) => ({
      ...prev,
      [id]: { ...stateFor(id), ...patch }
    }));
  };

  const toggleMedia = (catId, idx) => {
    if (!ENABLE_MEDIA) return;
  
    const s = stateFor(catId);
    setStateFor(catId, {
      mediaOpen: { ...s.mediaOpen, [idx]: !s.mediaOpen[idx] }
    });
  };

  const openDialog = (id) => {
    pendingOpenScrollRef.current = true;
    setNavDirection(0);
    setActiveId(id);

    const wrapperEl = gridRef.current;
    const cardEl = cardRefs.current[id];

    if (wrapperEl && cardEl) {
      const wrapperRect = wrapperEl.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();

      const x = cardRect.left - wrapperRect.left;
      const y = cardRect.top - wrapperRect.top;
      const sx = cardRect.width / wrapperRect.width;
      const sy = cardRect.height / wrapperRect.height;

      setManualFrom({ x, y, sx, sy });
    } else {
      setManualFrom(null);
    }

    setManualTo(null);
    setIsManualClosing(false);
    setIsOpen(true);
  };

  const attemptCloseDialog = () => {
    if (!isOpen || !activeId) return;

    const currentId = activeId;
    const s = stateFor(currentId);
    const hasUnsent = !s.hasConfirmed && (s.email.trim() !== '' || s.selection !== '');

    if (hasUnsent) {
      const ok = window.confirm('Discard your unsent vote info?');
      if (!ok) return;
    }

    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }

    pendingOpenScrollRef.current = false;

    setCategoryState((prev) => ({
      ...prev,
      [currentId]: {
        ...stateFor(currentId),
        email: '',
        selection: '',
        isSubmitting: false,
        hasConfirmed: false,
        error: '',
        usedEmails: {},
        mediaOpen: {}
      }
    }));

    const wrapperEl = gridRef.current;
    const cardEl = cardRefs.current[currentId];

    if (wrapperEl && cardEl) {
      const wrapperRect = wrapperEl.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();

      const x = cardRect.left - wrapperRect.left;
      const y = cardRect.top - wrapperRect.top;
      const sx = cardRect.width / wrapperRect.width;
      const sy = cardRect.height / wrapperRect.height;

      setManualTo({ x, y, sx, sy });
    } else {
      setManualTo(null);
    }

    setIsManualClosing(true);
    setLightboxSrc(null);
  };

  useEffect(() => {
    if (!isOpen) return;

    const root = dialogRef.current;

    setTimeout(() => {
      if (root) root.focus({ preventScroll: true });
    }, 0);

    const onKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        attemptCloseDialog();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusable(root);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!pendingOpenScrollRef.current) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = gridRef.current;
        if (!el) return;

        const headerH = getHeaderHeight();
        const extraPadding = 12;

        const top = el.getBoundingClientRect().top + window.scrollY;
        const targetY = Math.max(0, top - headerH - extraPadding);

        window.scrollTo({ top: targetY, behavior: 'smooth' });
        pendingOpenScrollRef.current = false;
      });
    });
  }, [isOpen]);

  const submitVote = async (catId) => {
    const s = stateFor(catId);
    const email = normalizeEmail(s.email);
    const nomineeId = s.selection;

    if (!isValidEmail(email)) {
      setStateFor(catId, { error: 'Please enter a valid email address.' });
      return;
    }

    if (!nomineeId) {
      setStateFor(catId, { error: 'Please select a nominee.' });
      return;
    }

    if (s.usedEmails?.[email]) {
      setStateFor(catId, {
        error:
          'This email has been used to vote on this category already. To cast another vote, use a different email.'
      });
      return;
    }

    setStateFor(catId, { error: '', isSubmitting: true });

    try {
      const { data: existingVote, error: existingVoteError } = await supabase
        .from('votes')
        .select('id')
        .eq('email', email)
        .eq('category_id', catId)
        .eq('year', CURRENT_YEAR)
        .maybeSingle();

      if (existingVoteError) {
        throw existingVoteError;
      }

      if (existingVote) {
        setStateFor(catId, {
          isSubmitting: false,
          error:
            'This email has been used to vote on this category already. To cast another vote, use a different email.',
          usedEmails: { ...(s.usedEmails || {}), [email]: true }
        });
        return;
      }

      const { error: insertError } = await supabase.from('votes').insert([
        {
          email,
          category_id: catId,
          nominee_id: nomineeId,
          year: CURRENT_YEAR
        }
      ]);

      if (insertError) {
        const duplicateLike =
          insertError.code === '23505' ||
          String(insertError.message || '').toLowerCase().includes('duplicate') ||
          String(insertError.message || '').toLowerCase().includes('unique');

        if (duplicateLike) {
          setStateFor(catId, {
            isSubmitting: false,
            error:
              'This email has been used to vote on this category already. To cast another vote, use a different email.',
            usedEmails: { ...(s.usedEmails || {}), [email]: true }
          });
          return;
        }

        throw insertError;
      }

      setStateFor(catId, {
        isSubmitting: false,
        hasConfirmed: true,
        usedEmails: { ...(s.usedEmails || {}), [email]: true }
      });
    } catch (err) {
      console.error('Vote submission error:', err);
      setStateFor(catId, {
        isSubmitting: false,
        error: err.message || 'An error occurred while submitting your vote. Please try again.'
      });
    }
  };

  return (
    <section id="categories" className="bg-dark pt-16 md:pt-20 pb-4 md:pb-10 px-6 scroll-mt-20">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-20 bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={attemptCloseDialog}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            text-3xl md:text-5xl lg:text-6xl
            font-serif text-center
            mb-3 md:mb-4
            bg-[linear-gradient(90deg,#FF671A,#FDD74A,#FF671A)]
            bg-clip-text text-transparent
          "
        >
          AWARD CATEGORIES
        </motion.h2>

        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="
            text-center
            text-lg md:text-xl
            font-light
            text-gray-300
            leading-relaxed
            max-w-3xl
            mx-auto
            mt-2
            mb-10 md:mb-14
          "
        >
          Click into each category to view this year’s nominees and cast your vote.
        </motion.h3>

        <div className="relative z-30" ref={gridRef}>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="absolute inset-0 z-10 bg-black/35 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-0">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                ref={(el) => {
                  if (el) cardRefs.current[category.id] = el;
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.03 }}
                className="relative"
              >
                <div
                  className={isOpen ? 'pointer-events-none opacity-60' : ''}
                  onClick={() => !isOpen && openDialog(category.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (!isOpen && (e.key === 'Enter' || e.key === ' ')) openDialog(category.id);
                  }}
                  aria-label={`Open ${category.title}`}
                >
                  <AwardCategoryCard title={category.title} icon={category.icon} />
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {isOpen && expandedCategory && (
              <motion.div
                key="expanded-card"
                className="absolute inset-0 z-40 bg-light rounded-2xl shadow-2xl border-l-4 border-orange overflow-visible"
                style={{ transformOrigin: 'top left' }}
                initial={
                  manualFrom
                    ? { x: manualFrom.x, y: manualFrom.y, scaleX: manualFrom.sx, scaleY: manualFrom.sy, opacity: 1 }
                    : { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }
                }
                animate={
                  isManualClosing && manualTo
                    ? { x: manualTo.x, y: manualTo.y, scaleX: manualTo.sx, scaleY: manualTo.sy, opacity: 0.35 }
                    : { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }
                }
                transition={{ duration: reducedMotion ? 0 : 0.25, ease: 'easeInOut' }}
                onAnimationComplete={() => {
                  if (isManualClosing) {
                    setIsOpen(false);
                    setIsManualClosing(false);
                    setManualFrom(null);
                    setManualTo(null);
                    setActiveId(null);
                    setNavDirection(0);
                  }
                }}
                role="dialog"
                aria-modal="true"
                aria-label={`${expandedCategory.title} voting dialog`}
                tabIndex={-1}
                ref={dialogRef}
              >
                <button
                  type="button"
                  onClick={goPrev}
                  aria-label="Previous category"
                  className="
                    absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                    z-50
                    w-12 h-12 md:w-14 md:h-14
                    bg-orange
                    rounded-lg
                    shadow-xl
                    flex items-center justify-center
                    hover:brightness-110
                    focus:outline-none focus:ring-2 focus:ring-orange
                  "
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="15,5 7,12 15,19" fill="white" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  aria-label="Next category"
                  className="
                    absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                    z-50
                    w-12 h-12 md:w-14 md:h-14
                    bg-orange
                    rounded-lg
                    shadow-xl
                    flex items-center justify-center
                    hover:brightness-110
                    focus:outline-none focus:ring-2 focus:ring-orange
                  "
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="9,5 17,12 9,19" fill="white" />
                  </svg>
                </button>

                <div className="relative h-full w-full overflow-hidden">
                  <AnimatePresence initial={false} custom={navDirection}>
                    <motion.div
                      key={`content-${activeId}`}
                      custom={navDirection}
                      initial={(direction) => ({
                        x: direction > 0 ? '100%' : direction < 0 ? '-100%' : 0,
                        opacity: 1
                      })}
                      animate={{ x: 0, opacity: 1 }}
                      exit={(direction) => ({
                        x: direction > 0 ? '-100%' : direction < 0 ? '100%' : 0,
                        opacity: 1
                      })}
                      transition={{ duration: reducedMotion ? 0 : 0.22, ease: 'easeInOut' }}
                      className="absolute inset-0"
                    >
                      <div className="h-full w-full overflow-auto" ref={swipeViewportRef}>
                        <div className="p-8 md:p-14">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-serif text-xl md:text-3xl text-dark leading-tight">
                                {expandedCategory.title}
                              </h3>
                              {CATEGORY_PROMPT_BY_AWARD_ID?.[expandedCategory.awardId] && (
                                <p className="mt-3 text-dark font-sans font-medium text-sm md:text-base leading-relaxed max-w-3xl">
                                  {CATEGORY_PROMPT_BY_AWARD_ID[expandedCategory.awardId]}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={attemptCloseDialog}
                              className="
                                inline-flex items-center justify-center
                                rounded-lg p-2
                                text-dark/70 hover:text-dark
                                hover:bg-black/5
                                transition-colors
                                focus:outline-none focus:ring-2 focus:ring-orange
                              "
                              aria-label="Close"
                            >
                              <X size={22} />
                            </button>
                          </div>

                          <div className="mt-6 md:mt-8">
                          <h4 className="font-sans text-dark mb-3">
                            <span className="font-semibold text-base md:text-lg">Nominees</span>{' '}
                            <span className="font-normal text-sm md:text-base">
                              (in no particular order)
                            </span>
                          </h4>

                            {!nomineesLoaded ? (
                              <p className="text-dark/60 italic">Loading nominees...</p>
                            ) : nominees.length === 0 ? (
                              <p className="text-dark/60 italic">No nominees found for this category.</p>
                            ) : (
                              <ul className="space-y-4">
                                {nominees.map((n, idx) => {
                                  const s = stateFor(expandedCategory.id);
                                  const open = Boolean(s.mediaOpen?.[idx]);
                                  const hasAnyMedia = ENABLE_MEDIA && Boolean(n.media_url);

                                  return (
                                    <li key={n.id || idx} className="text-dark">
                                      <div className="flex items-start justify-between gap-4">
                                      <div className="text-sm md:text-base">
                                        {n.name}
                                      </div>

                                        {hasAnyMedia && (
                                          <button
                                            onClick={() => toggleMedia(expandedCategory.id, idx)}
                                            className="
                                              text-orange text-sm md:text-base
                                              hover:underline
                                              focus:outline-none focus:ring-2 focus:ring-orange rounded
                                            "
                                          >
                                            {open ? 'Hide Media' : 'Show Media'}
                                          </button>
                                        )}
                                      </div>

                                      <AnimatePresence initial={false}>
                                        {hasAnyMedia && open && (
                                          <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: reducedMotion ? 0 : 0.2 }}
                                            className="mt-3 overflow-hidden"
                                          >
                                            <div className="max-w-[640px]">
                                              <button
                                                type="button"
                                                onClick={() => setLightboxSrc(n.media_url)}
                                                className="block focus:outline-none focus:ring-2 focus:ring-orange rounded"
                                                aria-label={`Enlarge image for ${n.name}`}
                                              >
                                                <img
                                                  src={n.media_url}
                                                  alt={`${n.name} thumbnail`}
                                                  loading="lazy"
                                                  className="rounded-lg shadow-sm w-full object-cover"
                                                />
                                              </button>
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>

                          <div className="mt-8 md:mt-10 pt-6 border-t border-black/10">
                            <p className="text-dark font-sans font-medium mb-3">
                              Enter your email to vote on this category!
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                              <div>
                                <label htmlFor="vote-email" className="block text-sm font-medium text-dark mb-2">
                                  Email
                                </label>
                                <input
                                  id="vote-email"
                                  type="email"
                                  placeholder="Enter your email"
                                  value={stateFor(expandedCategory.id).email}
                                  disabled={stateFor(expandedCategory.id).isSubmitting}
                                  onChange={(e) => {
                                    const nextEmail = e.target.value;
                                    const s = stateFor(expandedCategory.id);
                                    setStateFor(expandedCategory.id, {
                                      email: nextEmail,
                                      error: '',
                                      hasConfirmed: s.hasConfirmed ? false : s.hasConfirmed
                                    });
                                  }}
                                  className="
                                    w-full rounded-lg border border-black/15
                                    px-4 py-3
                                    bg-white
                                    text-dark
                                    focus:outline-none focus:ring-2 focus:ring-orange
                                    disabled:opacity-60
                                  "
                                />
                              </div>

                              <div>
                                <label htmlFor="vote-nominee" className="block text-sm font-medium text-dark mb-2">
                                  Your Vote
                                </label>
                                <select
                                  id="vote-nominee"
                                  value={stateFor(expandedCategory.id).selection}
                                  disabled={
                                    stateFor(expandedCategory.id).isSubmitting ||
                                    stateFor(expandedCategory.id).hasConfirmed
                                  }
                                  onChange={(e) => {
                                    const nextSelection = e.target.value;
                                    const s = stateFor(expandedCategory.id);
                                    setStateFor(expandedCategory.id, {
                                      selection: nextSelection,
                                      error: '',
                                      hasConfirmed: s.hasConfirmed ? false : s.hasConfirmed
                                    });
                                  }}
                                  className="
                                    w-full rounded-lg border border-black/15
                                    px-4 py-3
                                    bg-white
                                    text-dark
                                    focus:outline-none focus:ring-2 focus:ring-orange
                                    disabled:opacity-60
                                  "
                                >
                                  <option value="" disabled>
                                    Select Nominee
                                  </option>
                                  {nominees.map((n) => (
                                    <option key={n.id} value={n.id}>
                                      {n.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="mt-5 flex items-center gap-4">
                              <button
                                onClick={() => submitVote(expandedCategory.id)}
                                disabled={
                                  stateFor(expandedCategory.id).isSubmitting ||
                                  stateFor(expandedCategory.id).hasConfirmed ||
                                  !isValidEmail(stateFor(expandedCategory.id).email) ||
                                  !stateFor(expandedCategory.id).selection
                                }
                                className="
                                  bg-orange text-white
                                  font-sans font-semibold
                                  px-7 py-3
                                  rounded-full
                                  shadow-md
                                  transition-all duration-300
                                  disabled:opacity-50 disabled:cursor-not-allowed
                                  focus:outline-none focus:ring-2 focus:ring-orange
                                "
                              >
                                {stateFor(expandedCategory.id).isSubmitting ? 'Submitting...' : 'Submit Vote'}
                              </button>

                              <AnimatePresence>
                                {stateFor(expandedCategory.id).hasConfirmed && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    className="text-dark font-sans font-medium"
                                  >
                                    ✅{' '}
                                    <span className="font-semibold">
                                      Your vote has been received!{' '}
                                      <a
                                        href="https://www.funny-con.com/tickets"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-bold text-orange hover:underline focus:outline-none focus:ring-2 focus:ring-orange rounded"
                                      >
                                        Get tickets
                                      </a>{' '}
                                      to the awards and{' '}
                                      <button
                                        type="button"
                                        onClick={goNext}
                                        className="font-bold text-orange hover:underline focus:outline-none focus:ring-2 focus:ring-orange rounded"
                                      >
                                        continue voting
                                      </button>{' '}
                                      in the other categories.
                                    </span>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <p className="mt-3 text-xs text-dark/60">
                              By entering your email, you agree to receive updates about The Funny Awards and FunnyCon.
                              One click unsubscribe anytime. We&apos;ll never share or sell your data. Voting on
                              TheFunnys.org is counted towards the Audience Choice. The official award winners are
                              determined by votes cast by the Funny Academy.
                            </p>

                            {stateFor(expandedCategory.id).error && (
                              <p className="mt-3 text-sm text-red-600">{stateFor(expandedCategory.id).error}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {lightboxSrc && (
                    <motion.div
                      className="absolute inset-0 bg-black/70 flex items-center justify-center p-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setLightboxSrc(null)}
                      aria-label="Image lightbox"
                      role="dialog"
                      aria-modal="true"
                    >
                      <motion.div
                        initial={{ scale: 0.98, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.98, opacity: 0 }}
                        transition={{ duration: reducedMotion ? 0 : 0.15 }}
                        className="max-w-[900px] w-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <img
                          src={lightboxSrc}
                          alt="Enlarged nominee media"
                          className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
                        />
                        <div className="mt-3 flex justify-end">
                          <button
                            onClick={() => setLightboxSrc(null)}
                            className="text-white/90 hover:text-white underline"
                          >
                            Close
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default AwardCategoriesGrid;