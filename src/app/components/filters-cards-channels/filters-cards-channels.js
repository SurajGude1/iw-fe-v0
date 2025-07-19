/**
 * SocialCards Component - Main container for discoverable content with advanced search
 * Features:
 * - Debounced search with multi-field matching
 * - Result scoring and relevance sorting
 * - Combined filtering and sorting
 * - Optimized rendering with memoization
 * - Responsive pagination
 */
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import styles from "./filters-cards-channels.module.css";
import Image from "next/image";
import Link from "next/link";
import Pagination from '@mui/material/Pagination';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import FormatNumber from '../global/format-number/format-number';
import { fetchPosts, fetchAdvertisements, fetchPostCategories } from '@/app/services/get-apis';

// Theme configuration for Material-UI components
const theme = createTheme({
  palette: {
    primary: { main: '#ffffff' },
    text: { primary: '#ffffff' },
  },
  components: {
    MuiPaginationItem: {
      styleOverrides: {
        root: { color: '#ffffff', borderColor: '#ffffff' },
      },
    },
  },
});

// ==============================================
// Skeleton Loading Components
// ==============================================

const CardSkeleton = () => (
  <div className={styles.SocialCardSkeleton}>
    <div className={styles.SkeletonImage}></div>
    <div className={styles.SkeletonContent}>
      <div className={styles.SkeletonTitle}></div>
      <div className={styles.SkeletonFooter}>
        <div className={styles.SkeletonViews}></div>
        <div className={styles.SkeletonButton}></div>
      </div>
    </div>
  </div>
);

const SidebarSkeleton = () => (
  <div className={styles.SidebarSkeleton}>
    <div className={styles.SkeletonHeader}></div>
    <div className={styles.SkeletonChannelBox}></div>
    <div className={styles.SkeletonSubheader}></div>
    <div className={styles.SkeletonChannelsGrid}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className={styles.SkeletonChannel}></div>
      ))}
    </div>
  </div>
);

const SearchSkeleton = () => (
  <div className={styles.SearchSkeleton}>
    <div className={styles.SkeletonSearchInput}></div>
    <div className={styles.SkeletonDropdown}></div>
  </div>
);

// ==============================================
// Main Component
// ==============================================

export default function SocialCards() {
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("popular");
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Constants
  const cardsPerPage = 8;
  const searchContainerRef = useRef(null);

  // ==============================================
  // Data Fetching and Initialization
  // ==============================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [postsData, adsData, categoriesData] = await Promise.all([
          fetchPosts(),
          fetchAdvertisements(),
          fetchPostCategories()
        ]);

        // Format posts data with fallbacks
        const formattedData = Array.isArray(postsData) ? postsData.map(post => ({
          id: post.postId || post._id || Math.random().toString(36).substring(2, 9),
          title: post.postTitle || post.title || 'Untitled Post',
          thumbnail: post.thumbnailUrl || post.thumbnail || post.imageUrl || '/default-thumbnail.jpg',
          views: post.views || post.viewCount || 0,
          dateAdded: post.postCreatedOn || post.dateAdded || post.createdAt || new Date().toISOString(),
          postSummary: post.postContent || post.postSummary || post.summary || '',
          category: post.category || 'uncategorized'
        })) : [];

        setPosts(formattedData);
        setAdvertisements(adsData);

        // Format categories data
        const formattedCategories = Array.isArray(categoriesData)
          ? categoriesData.map(cat => ({
            value: cat.categoryName.toLowerCase().replace(/\s+/g, '-'),
            label: cat.categoryName
          }))
          : [];

        setCategories(formattedCategories);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==============================================
  // Memoized Derived Data
  // ==============================================

  const filterOptions = useMemo(() => {
    const baseOptions = {
      popular: 'Most Popular',
      dateAdded: 'Newest First'
    };

    const categoryOptions = categories.reduce((acc, category) => {
      acc[category.value] = category.label;
      return acc;
    }, {});

    return { ...baseOptions, ...categoryOptions };
  }, [categories]);

  const youtubeChannels = useMemo(() => {
    return advertisements
      .filter(ad => ad.advertiseType === 'youtube' && ad.youtubeChannelName)
      .map(ad => ({
        name: ad.youtubeChannelName,
        url: ad.youtubeChannelUrl || ad.redirectionUrl
      }));
  }, [advertisements]);

  // ==============================================
  // Search and Filter Functionality
  // ==============================================

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredAndSortedCards = useMemo(() => {
    if (!posts.length) return [];

    let filtered = [...posts];
    const term = debouncedSearchTerm.toLowerCase().trim();

    // Apply category filter if not default sort options
    if (sortOption !== 'popular' && sortOption !== 'dateAdded') {
      filtered = filtered.filter(card =>
        card.category.toLowerCase().includes(sortOption.toLowerCase())
      );
    }

    // Enhanced search with scoring system
    if (term) {
      const searchTerms = term.split(/\s+/).filter(t => t.length > 0);
      
      filtered = filtered.map(card => {
        const searchContent = `${card.title} ${card.postSummary} ${card.category}`.toLowerCase();
        let score = 0;
        
        // Calculate relevance score
        searchTerms.forEach(word => {
          if (card.title.toLowerCase().includes(word)) score += 3;
          if (card.postSummary.toLowerCase().includes(word)) score += 2;
          if (card.category.toLowerCase().includes(word)) score += 1;
        });

        return { ...card, score };
      })
      .filter(card => card.score > 0) // Only include cards with matches
      .sort((a, b) => b.score - a.score); // Sort by relevance
    }

    // Apply sorting based on selected option
    if (sortOption === "popular" && !term) {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortOption === "dateAdded" && !term) {
      filtered.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    }

    return filtered;
  }, [posts, debouncedSearchTerm, sortOption]);

  // Pagination calculations
  const currentCards = useMemo(() => {
    const startIndex = (currentPage - 1) * cardsPerPage;
    return filteredAndSortedCards.slice(startIndex, startIndex + cardsPerPage);
  }, [filteredAndSortedCards, currentPage, cardsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedCards.length / cardsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortOption]);

  // ==============================================
  // Event Handlers
  // ==============================================

  const handlePageChange = useCallback((_, value) => {
    setCurrentPage(value);
    searchContainerRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOption(e.target.value);
  }, []);

  // ==============================================
  // Render Logic
  // ==============================================

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <div className={styles.SocialCardsContainer}>
          <main className={styles.SocialCardsMain}>
            <div className={styles.SkeletonSectionTitle}></div>
            <SearchSkeleton />
            <div className={styles.SocialCardsGrid}>
              {[...Array(4)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </main>
          <SidebarSkeleton />
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.SocialCardsContainer}>
        <main className={styles.SocialCardsMain}>
          <p className={styles.SectionTitle}>Discover more</p>

          <SearchAndFilterControls
            searchTerm={searchTerm}
            sortOption={sortOption}
            onSearchChange={handleSearchChange}
            onSortChange={handleSortChange}
            searchContainerRef={searchContainerRef}
            filterOptions={filterOptions}
          />

          <CardsGrid currentCards={currentCards} />

          {filteredAndSortedCards.length > cardsPerPage && (
            <PaginationControls
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
          )}
        </main>

        <Sidebar youtubeChannels={youtubeChannels} />
      </div>
    </ThemeProvider>
  );
}

// ==============================================
// Utility Components and Hooks
// ==============================================

/**
 * Custom hook for debouncing values
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function ErrorState({ error }) {
  return (
    <div className={styles.SocialCardsContainer}>
      <main className={styles.SocialCardsMain}>
        <p className={styles.SectionTitle}>Error loading content: {error}</p>
      </main>
      <Sidebar youtubeChannels={[]} />
    </div>
  );
}

// ==============================================
// UI Components
// ==============================================

function SearchAndFilterControls({
  searchTerm,
  sortOption,
  onSearchChange,
  onSortChange,
  searchContainerRef,
  filterOptions
}) {
  return (
    <div className={styles.SocialCardsSearchContainer} ref={searchContainerRef}>
      <FormControl fullWidth variant="standard" className={styles.SearchInputWrapper}>
        <OutlinedInput
          id="search-input"
          placeholder="Search by title, content or category"
          value={searchTerm}
          onChange={onSearchChange}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'var(--off-white)' }} />
            </InputAdornment>
          }
          sx={{
            height: '40px',
            borderRadius: '4px',
            paddingLeft: '8px',
            color: 'white',
            backgroundColor: 'var(--charcoal)',
            transition: 'background-color 0.3s, color 0.3s',
            '&:hover': {
              backgroundColor: 'var(--off-white)',
              color: 'black',
              '& .MuiSvgIcon-root': { color: 'black' },
            },
            '&.Mui-focused': {
              backgroundColor: 'var(--off-white)',
              color: 'black',
              '& .MuiSvgIcon-root': { color: 'black' },
            },
            '& .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
          }}
        />
      </FormControl>

      <FormControl variant="outlined" className={styles.DropdownWrapper} sx={{ height: '40px' }}>
        <Select
          value={sortOption}
          onChange={onSortChange}
          displayEmpty
          input={
            <OutlinedInput
              notched={false}
              sx={{
                height: '40px',
                padding: '0 16px',
                backgroundColor: 'var(--charcoal) !important',
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
                '& input': { padding: 0, height: '100%', boxSizing: 'border-box' },
              }}
            />
          }
          sx={{
            height: '40px',
            backgroundColor: 'var(--charcoal)',
            color: 'white',
            borderRadius: '4px',
            '& .MuiSelect-select': {
              paddingLeft: '12px',
              paddingTop: '10px',
              paddingBottom: '10px',
            },
            '& .MuiSelect-icon': { color: 'white', top: 'calc(50% - 12px)' },
            '& .MuiOutlinedInput-root': { height: '40px' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: 'var(--charcoal)',
                color: 'var(--off-white)',
                '& .MuiMenuItem-root': {
                  minHeight: '36px',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                },
              },
            },
          }}
        >
          {Object.entries(filterOptions).map(([value, label]) => (
            <MenuItem key={value} value={value}>{label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

function CardsGrid({ currentCards }) {
  return (
    <div className={styles.SocialCardsGrid}>
      {currentCards.length > 0 ? (
        currentCards.map((card) => (
          <article key={card.id} className={styles.SocialCard}>
            <div className={styles.SocialCardImageContainer}>
              <Image
                src={card.thumbnail}
                alt={card.title}
                fill
                style={{ objectFit: 'cover', borderRadius: 'inherit' }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={false}
              />
            </div>
            <div className={styles.SocialCardContent}>
              <h2 className={styles.SocialCardTitle}>{card.title}</h2>
              <div className={styles.SocialCardFooter}>
                <span className={styles.SocialCardViews}>
                  <FontAwesomeIcon icon={faEye} className={styles.FaEye} />{' '}
                  <FormatNumber value={card.views || 0} />
                </span>
                <Link
                  href={`/explore-articles/${card.id}/${encodeURIComponent(card.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.SocialCardKnowMore}
                >
                  Know more
                </Link>
              </div>
            </div>
          </article>
        ))
      ) : (
        <div className={styles.NoResults}>
          <p>No matching content found. Try different search terms or filters.</p>
        </div>
      )}
    </div>
  );
}

function PaginationControls({ totalPages, currentPage, onPageChange }) {
  return (
    <div className={styles.SocialCardsPagination}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={onPageChange}
        color="primary"
        shape="rounded"
      />
    </div>
  );
}

function Sidebar({ youtubeChannels }) {
  return (
    <aside className={styles.SocialCardsSidebar}>
      <p className={styles.SocialCardsSidebarHeader}>
        <span className={styles.RecordingIcon}></span>
        Wake & Participate
      </p>
      <div className={styles.SocialCardsChannelBox}>Upcoming Events</div>
      <p className={styles.SocialCardsSidebarSubheader}>
        <span className={styles.RecordingIcon}></span>
        Featured
        <FontAwesomeIcon icon={faYoutube} className={styles.YoutubeIcon} />
        channels
      </p>

      <div className={styles.YouTubeChannelsGrid}>
        {youtubeChannels.length > 0 ? (
          youtubeChannels.map((channel, index) => (
            <a
              key={`${channel.name}-${index}`}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.YouTubeChannelBox}
            >
              {channel.name}
            </a>
          ))
        ) : (
          <p className={styles.NoChannels}>No featured YouTube channels available</p>
        )}
      </div>
    </aside>
  );
}