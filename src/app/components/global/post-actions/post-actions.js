'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faShare, 
  faEye,
  faStopwatch
} from "@fortawesome/free-solid-svg-icons";
import FormatNumber from '../format-number/format-number';

export function LikeAction({ count = 0, isLiked = false, onLike, className = '' }) {
  return (
    <button
      onClick={onLike}
      aria-label={isLiked ? `Unlike this post` : `Like this post`}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}
    >
      <FontAwesomeIcon
        icon={faHeart}
        style={{
          fontSize: '1.2rem',
          color: isLiked ? 'var(--coke-red)' : 'white',
          transition: 'color 0.2s ease',
        }}
      />
      <span style={{ fontSize: '0.9rem', color: 'white' }}>
        <FormatNumber value={count} />
      </span>
    </button>
  );
}

export function ShareAction({ count = 0, className = '' }) {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <FontAwesomeIcon 
        icon={faShare} 
        style={{ 
          fontSize: '1.2rem',
          color: 'white'
        }} 
      />
      <span style={{ fontSize: '0.9rem', color: 'white' }}>
        <FormatNumber value={count} />
      </span>
    </div>
  );
}

export function ViewAction({ count = 0, className = '' }) {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <FontAwesomeIcon 
        icon={faEye} 
        style={{ 
          fontSize: '1.2rem',
          color: 'white'
        }} 
      />
      <span style={{ fontSize: '0.9rem', color: 'white' }}>
        <FormatNumber value={count} />
      </span>
    </div>
  );
}

export function ReadTimeAction({ minutes = 0, className = '' }) {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      <FontAwesomeIcon 
        icon={faStopwatch} 
        style={{ 
          fontSize: '1.2rem',
          color: 'white'
        }} 
      />
      <span style={{ fontSize: '0.9rem', color: 'white' }}>
        {minutes} min/s
      </span>
    </div>
  );
}