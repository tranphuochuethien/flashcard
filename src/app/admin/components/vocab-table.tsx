'use client';

import { useState, useTransition } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Trash, FilePenLine, Loader2 } from 'lucide-react';
import { deleteVocabularyAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import type { Vocabulary } from '@/lib/types';
import VocabForm from './vocab-form';

interface VocabTableProps {
  vocabs: Vocabulary[];
}

export default function VocabTable({ vocabs }: VocabTableProps) {
  const [isDeleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleDeleteClick = (vocab: Vocabulary) => {
    setSelectedVocab(vocab);
    setDeleteAlertOpen(true);
  };
  
  const handleEditClick = (vocab: Vocabulary) => {
    setSelectedVocab(vocab);
    setEditModalOpen(true);
  };

  const executeDelete = () => {
    if (!selectedVocab) return;
    startTransition(async () => {
      const result = await deleteVocabularyAction(selectedVocab.id);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
      setDeleteAlertOpen(false);
      setSelectedVocab(null);
    });
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kanji</TableHead>
              <TableHead>Hiragana</TableHead>
              <TableHead>Vietnamese</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vocabs.length > 0 ? vocabs.map((vocab) => (
              <TableRow key={vocab.id}>
                <TableCell className="font-medium">{vocab.kanji}</TableCell>
                <TableCell>{vocab.hiragana}</TableCell>
                <TableCell>{vocab.vietnameseMeaning}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(vocab)}>
                        <FilePenLine className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteClick(vocab)} className="text-destructive focus:text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No vocabulary found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vocabulary word
              <span className="font-bold mx-1">"{selectedVocab?.kanji}"</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={executeDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Vocabulary</DialogTitle>
          </DialogHeader>
          {selectedVocab && <VocabForm vocab={selectedVocab} onSuccess={() => setEditModalOpen(false)} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
