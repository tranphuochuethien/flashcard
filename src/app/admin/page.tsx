import { getVocabulary } from '@/lib/data';
import VocabForm from './components/vocab-form';
import VocabTable from './components/vocab-table';
import { Separator } from '@/components/ui/separator';
import BatchImport from './components/batch-import';

export default async function AdminPage() {
  const vocabulary = await getVocabulary();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold font-headline mb-2">Admin Panel</h1>
      <p className="text-muted-foreground mb-8">
        Manage your Japanese vocabulary here.
      </p>

      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold font-headline mb-4">Add New Word</h2>
            <VocabForm />
            <Separator className="my-8" />
            <h2 className="text-2xl font-semibold font-headline mb-4">Batch Import</h2>
            <BatchImport />
        </div>
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-semibold font-headline mb-4">Vocabulary List</h2>
          <VocabTable vocabs={vocabulary} />
        </div>
      </div>
    </div>
  );
}
