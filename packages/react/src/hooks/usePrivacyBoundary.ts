import { usePrivacyBoundaryLevel } from '../context';

export const usePrivacyBoundary = () => {
  const level = usePrivacyBoundaryLevel();
  return { level };
};


