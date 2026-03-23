import { 
  Tv,
  Star,
  Users,
  Theater,
  Film,
  Mic,
  Disc,
  Podcast,
  Globe,
  Monitor,
  MicVocal,
  Share2,
  Palette,
  Book,
  FileText,
  BookOpen,
  Sticker
} from 'lucide-react';

/**
 * Maps an award_id string to a Lucide React icon component.
 * @param {string} awardId - The award_id from the database
 * @returns {React.Component|null} - The icon component or null if not found
 */
export const getAwardIcon = (awardId) => {
  switch (awardId) {
    case 'animated-tv':
      return Tv;
    case 'live-tv':
      return Tv;
    case 'lead-tv':
      return Star;
    case 'support-tv':
      return Users;
    case 'song':
      return MicVocal;
    case 'movie':
      return Film;
    case 'lead-movie':
      return Film;
    case 'support-movie':
      return Film;
    case 'standup':
      return Mic;
    case 'special':
      return Disc;
    case 'podcast':
      return Podcast;
    case 'social':
      return Share2;
    case 'book':
      return Book;
    case 'article':
      return FileText;
    case 'comic-strip':
      return BookOpen;
    default:
      return null;
  }
};