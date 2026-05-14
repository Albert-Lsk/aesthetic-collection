"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Site, SiteType } from "../data/site-types";
import { SITE_TYPES } from "../data/site-types";
import { getAllTags } from "../data/site-utils";
import { filterSites } from "../lib/filter-sites";
import { SiteCard } from "./SiteCard";

type ResourceLibraryProps = {
  sites: readonly Site[];
};

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable
  );
}

export function ResourceLibrary({ sites }: ResourceLibraryProps) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SiteType | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [focusedCardIndex, setFocusedCardIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const tags = useMemo(() => getAllTags(), []);
  const filteredSites = useMemo(
    () => filterSites(sites, { query, type, tags: selectedTags }),
    [query, selectedTags, sites, type],
  );

  const hasFilters = query.trim() !== "" || type !== "all" || selectedTags.length > 0;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "/" && !isTypingTarget(event.target)) {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if (event.key === "Escape") {
        setQuery("");
        setType("all");
        setSelectedTags([]);
        searchInputRef.current?.blur();
        return;
      }

      if (isTypingTarget(event.target) || filteredSites.length === 0) {
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setFocusedCardIndex((index) => Math.min(index + 1, filteredSites.length - 1));
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setFocusedCardIndex((index) => Math.max(index - 1, 0));
        return;
      }

      const focusedSite = filteredSites[focusedCardIndex] ?? filteredSites[0];

      if (event.key === "Enter") {
        event.preventDefault();
        window.open(focusedSite.url, "_blank", "noreferrer");
        return;
      }

      if (event.key === "d" || event.key === "D") {
        event.preventDefault();
        window.location.assign(`/sites/${focusedSite.slug}`);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredSites, focusedCardIndex]);

  function toggleTag(tag: string) {
    setFocusedCardIndex(0);
    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag],
    );
  }

  function updateQuery(nextQuery: string) {
    setFocusedCardIndex(0);
    setQuery(nextQuery);
  }

  function updateType(nextType: SiteType | "all") {
    setFocusedCardIndex(0);
    setType(nextType);
  }

  function clearFilters() {
    setQuery("");
    setType("all");
    setSelectedTags([]);
    setFocusedCardIndex(0);
    searchInputRef.current?.focus();
  }

  return (
    <section className="resource-library" aria-labelledby="resource-library-title">
      <div className="section-heading">
        <p className="section-kicker">Library</p>
        <h2 id="resource-library-title">资源库</h2>
      </div>

      <div className="resource-controls" aria-label="资源筛选">
        <div className="search-control">
          <label htmlFor="site-search">搜索网站</label>
          <input
            ref={searchInputRef}
            id="site-search"
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.target.value)}
            placeholder="搜索名称、标签、用途..."
          />
        </div>

        <div className="segmented-control" aria-label="网站类型">
          <button
            type="button"
            className="segment-button"
            aria-pressed={type === "all"}
            onClick={() => updateType("all")}
          >
            全部
          </button>
          {SITE_TYPES.map((siteType) => (
            <button
              type="button"
              className="segment-button"
              aria-pressed={type === siteType.id}
              onClick={() => updateType(siteType.id)}
              key={siteType.id}
            >
              {siteType.label}
            </button>
          ))}
        </div>

        <div className="tag-filter" aria-label="标签筛选">
          {tags.map((tag) => (
            <button
              type="button"
              className="tag-filter__button"
              aria-pressed={selectedTags.includes(tag)}
              onClick={() => toggleTag(tag)}
              key={tag}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="resource-controls__footer">
          <p aria-live="polite">{filteredSites.length} 个网站</p>
          {hasFilters && filteredSites.length > 0 ? (
            <button type="button" className="clear-button" onClick={clearFilters}>
              清空筛选
            </button>
          ) : null}
        </div>
      </div>

      {filteredSites.length > 0 ? (
        <div className="site-grid" aria-label="网站列表">
          {filteredSites.map((site, index) => (
            <SiteCard key={site.slug} site={site} isFocused={index === focusedCardIndex} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h3>没有找到匹配的网站</h3>
          <button type="button" className="clear-button" onClick={clearFilters}>
            清空筛选
          </button>
        </div>
      )}
    </section>
  );
}
