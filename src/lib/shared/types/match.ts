export interface MatchSuggestion {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  avatar: string | null;
  extraPhotos: {
    id: string;
    url: string;
    order: number;
  }[];
  interests: {
    id: string;
    name: string;
    iconName: string;
  }[];
  commonInterests: number;
  compatibilityScore: number;
}

export interface MatchSuggestionsResponse {
  suggestions: MatchSuggestion[];
}
