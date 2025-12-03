'use client';

import { useForm, useFormContext, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormState } from 'react-dom';
import { useEffect, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { addVocabularyAction, updateVocabularyAction, enhanceNoteAction } from '../actions';
import { Wand2, Loader2 } from 'lucide-react';
import type { Vocabulary } from '@/lib/types';

const vocabSchema = z.object({
  kanji: z.string().min(1, 'Kanji is required.'),
  hiragana: z.string().min(1, 'Hiragana is required.'),
  hanViet: z.string().min(1, 'Han Viet is required.'),
  vietnameseMeaning: z.string().min(1, 'Vietnamese meaning is required.'),
  itContext: z.string().optional().default(''),
});

type VocabFormValues = z.infer<typeof vocabSchema>;

const initialState = {
  message: '',
  errors: {},
  success: false,
};

interface VocabFormProps {
  vocab?: Vocabulary;
  onSuccess?: () => void;
}

function AIButton() {
    const { getValues, setValue, formState: { errors } } = useFormContext<VocabFormValues>();
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleEnhanceNote = () => {
        const values = getValues();
        const requiredFields: (keyof VocabFormValues)[] = ['kanji', 'hiragana', 'hanViet', 'vietnameseMeaning'];
        const hasErrors = requiredFields.some(field => errors[field]);

        if (hasErrors || requiredFields.some(field => !values[field])) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please fill in Kanji, Hiragana, Han Viet, and Vietnamese Meaning before using AI enhancement.',
            });
            return;
        }

        startTransition(async () => {
            const result = await enhanceNoteAction({
                kanji: values.kanji,
                hiragana: values.hiragana,
                hanViet: values.hanViet,
                vietnameseMeaning: values.vietnameseMeaning,
                existingNote: values.itContext,
            });

            if (result.success && result.enhancedNote) {
                setValue('itContext', result.enhancedNote, { shouldValidate: true });
                toast({
                    title: 'Note Enhanced!',
                    description: 'The IT context has been updated by AI.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'AI Enhancement Failed',
                    description: result.message || 'An unknown error occurred.',
                });
            }
        });
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleEnhanceNote}
            disabled={isPending}
            className="gap-2"
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Wand2 className="h-4 w-4" />
            )}
            Enhance with AI
        </Button>
    );
}

export default function VocabForm({ vocab, onSuccess }: VocabFormProps) {
  const formAction = vocab ? updateVocabularyAction.bind(null, vocab.id) : addVocabularyAction;
  const [state, dispatch] = useFormState(formAction, initialState);
  const { toast } = useToast();

  const form = useForm<VocabFormValues>({
    resolver: zodResolver(vocabSchema),
    defaultValues: vocab ? {
      ...vocab,
      itContext: vocab.itContext ?? '',
    } : {
      kanji: '',
      hiragana: '',
      hanViet: '',
      vietnameseMeaning: '',
      itContext: '',
    },
  });

  const { formState: { isSubmitting, errors } } = form;

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast({
          title: 'Success!',
          description: state.message,
        });
        if (!vocab) { // only reset for new entry
          form.reset();
        }
        onSuccess?.();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: state.message,
        });
      }
    }
  }, [state, toast, form, vocab, onSuccess]);
  
  return (
    <form action={dispatch} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="kanji">Kanji (Từ gốc)</Label>
        <Input id="kanji" {...form.register('kanji')} />
        {errors.kanji && <p className="text-sm text-destructive">{errors.kanji.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="hiragana">Hiragana</Label>
        <Input id="hiragana" {...form.register('hiragana')} />
        {errors.hiragana && <p className="text-sm text-destructive">{errors.hiragana.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="hanViet">Hán Việt</Label>
        <Input id="hanViet" {...form.register('hanViet')} />
        {errors.hanViet && <p className="text-sm text-destructive">{errors.hanViet.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="vietnameseMeaning">Nghĩa tiếng Việt</Label>
        <Input id="vietnameseMeaning" {...form.register('vietnameseMeaning')} />
        {errors.vietnameseMeaning && <p className="text-sm text-destructive">{errors.vietnameseMeaning.message}</p>}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="itContext">Ghi chú (IT Context)</Label>
          <AIButton />
        </div>
        <Textarea id="itContext" {...form.register('itContext')} rows={4} />
         {errors.itContext && <p className="text-sm text-destructive">{errors.itContext.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {vocab ? 'Update Word' : 'Add Word'}
      </Button>
    </form>
  );
}
