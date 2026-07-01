'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export type PostCard = {
  slug: string;
  title: string;
  area: string;
  areaKey: string;
  description: string;
  readingTime: string;
};

export function BlogList({ posts }: { posts: PostCard[] }) {
  const filters = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of posts) if (!seen.has(p.areaKey)) seen.set(p.areaKey, p.area);
    return [{ key: 'todos', label: 'Todos' }, ...Array.from(seen, ([key, label]) => ({ key, label }))];
  }, [posts]);

  const [active, setActive] = useState('todos');
  const visible = posts.filter((p) => active === 'todos' || p.areaKey === active);

  return (
    <>
      <div className="filterbar" role="group" aria-label="Filtrar artigos por área">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filter-btn${active === f.key ? ' is-active' : ''}`}
            aria-pressed={active === f.key}
            onClick={() => setActive(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="post-list">
        {visible.map((post) => (
          <Link key={post.slug} className="card post-card" href={`/blog/${post.slug}`}>
            <span className="post-tag">{post.area}</span>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <span className="post-meta">
              <span>Análise técnica</span>
              <span>·</span>
              <span>{post.readingTime}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
