'use client';

import { useRef, useTransition } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { importFromCsvAction } from '../actions';
import { useEffect } from 'react';
import { Loader2, Upload } from 'lucide-react';

const initialState = {
  message: '',
  success: false,
};

export default function BatchImport() {
  const [state, dispatch] = useFormState(importFromCsvAction, initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.message) {
      if (state.success) {
        toast({ title: 'Success', description: state.message });
        formRef.current?.reset();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: state.message });
      }
    }
  }, [state, toast]);

  const handleFormSubmit = (formData: FormData) => {
    startTransition(async () => {
      await dispatch(formData);
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Upload a CSV file with columns: `kanji`, `hiragana`, `hanViet`, `vietnameseMeaning`, `itContext`.
      </p>
      <form ref={formRef} action={handleFormSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="csvFile">CSV File</Label>
          <Input id="csvFile" name="csvFile" type="file" accept=".csv" required />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Import from CSV
        </Button>
      </form>
    </div>
  );
}
