'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { saveListing, removeSavedListing } from '@/actions/saved-listings';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SaveButtonProps {
  listingId: string;
  isSaved?: boolean;
  savedId?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function SaveButton({
  listingId,
  isSaved = false,
  savedId,
  variant = 'outline',
  size = 'icon',
}: SaveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [internalSavedId, setInternalSavedId] = useState(savedId);
  const { toast } = useToast();

  const handleSaveToggle = async () => {
    setIsLoading(true);
    try {
      if (saved && internalSavedId) {
        // Remove from saved listings
        const result = await removeSavedListing({ id: internalSavedId });
        if (result.success) {
          setSaved(false);
          setInternalSavedId(undefined);
          toast({
            title: 'Listing removed',
            description: 'This property has been removed from your saved listings.',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      } else {
        // Add to saved listings
        const result = await saveListing({ listing_id: listingId });
        if (result.success) {
          setSaved(true);
          setInternalSavedId(result.data.id);
          toast({
            title: 'Listing saved',
            description: 'This property has been added to your saved listings.',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSaveToggle}
      disabled={isLoading}
      aria-label={saved ? 'Remove from saved listings' : 'Save to your listings'}
    >
      {saved ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
    </Button>
  );
}
