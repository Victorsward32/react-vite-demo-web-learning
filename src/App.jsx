import { useState, useEffect, useRef, useCallback } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);
  const observerRef = useRef(null);
  const fetchTimeoutRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const isInitialLoadRef = useRef(true);

  const fetchData = useCallback(async (pageNumber) => {
    // Prevent multiple calls within 500ms
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 500) {
      return;
    }
    lastFetchTimeRef.current = now;

    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${pageNumber}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();

      if (result?.data?.length > 0) {
        setData((prev) => [...prev, ...result.data]);
        setPage(pageNumber + 1);
        setHasMore(result.pagination?.has_next_page ?? false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore]);

  // Debounced fetch function
  const debouncedFetch = useCallback((pageNumber) => {
    // Clear any pending fetch
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    // Set a new timeout
    fetchTimeoutRef.current = setTimeout(() => {
      fetchData(pageNumber);
    }, 300); // 300ms debounce for API stability
  }, [fetchData]);

  // Initial data load
  useEffect(() => {
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      fetchData(1);
    }
  }, [fetchData]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (
          target.isIntersecting &&
          !loading &&
          hasMore &&
          !isInitialLoadRef.current
        ) {
          debouncedFetch(page);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    observerRef.current = observer;

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [debouncedFetch, loading, hasMore, page]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
        }

        .title {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 2rem;
          text-align: center;
          color: #333;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .anime-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .anime-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .anime-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .anime-image {
          width: 100%;
          height: 350px;
          object-fit: cover;
          display: block;
        }

        .anime-content {
          padding: 1.25rem;
        }

        .anime-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.75rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .anime-info {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .info-tag {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .anime-score {
          background: #fbbf24;
          color: #92400e;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .anime-synopsis {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .loader-container {
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 2rem 0;
        }

        .loading-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .loading-spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-text {
          color: #667eea;
          font-weight: 500;
        }

        .placeholder-dot {
          width: 1rem;
          height: 1rem;
          background-color: #d1d5db;
          border-radius: 50%;
        }

        .end-message {
          text-align: center;
          padding: 3rem 0;
          color: #9ca3af;
          font-size: 1.125rem;
        }

        .debug-info {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.8);
          color: #fff;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.75rem;
          z-index: 1000;
          backdrop-filter: blur(10px);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .container {
            padding: 0.75rem;
          }
          
          .anime-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          
          .title {
            font-size: 1.5rem;
          }

          .anime-image {
            height: 300px;
          }
        }

        @media (max-width: 480px) {
          .anime-content {
            padding: 1rem;
          }
          
          .anime-image {
            height: 250px;
          }
        }
      `}</style>

      <div className="container">
        <h1 className="title">Top Anime - Infinite Scroll</h1>

        <div className="anime-grid">
          {data.map((anime, index) => (
            <div key={`${anime.mal_id}-${index}`} className="anime-card">
              <img
                src={anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url}
                alt={anime.title}
                className="anime-image"
                loading="lazy"
              />
              <div className="anime-content">
                <h3 className="anime-title">{anime.title}</h3>

                <div className="anime-info">
                  <span className="info-tag">#{anime.rank}</span>
                  <span className="info-tag">{anime.type}</span>
                  {anime.year && <span className="info-tag">{anime.year}</span>}
                  {anime.score && <span className="anime-score">⭐ {anime.score}</span>}
                </div>

                {anime.synopsis && (
                  <p className="anime-synopsis">{anime.synopsis}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loader element */}
        {hasMore && (
          <div ref={loaderRef} className="loader-container">
            {loading ? (
              <div className="loading-content">
                <div className="loading-spinner"></div>
                <span className="loading-text">Loading more anime...</span>
              </div>
            ) : (
              <div className="placeholder-dot"></div>
            )}
          </div>
        )}

        {!hasMore && data.length > 0 && (
          <div className="end-message">
            🎌 That's all the top anime for now! 🎌
          </div>
        )}

        {/* Debug info */}
        <div className="debug-info">
          Page: {page} | Anime: {data.length} | Loading: {loading.toString()}
        </div>
      </div>
    </>
  );
}