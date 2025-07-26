// pages/admin/upload.tsx
import { useState } from 'react';
import Papa from 'papaparse';
import { supabase } from '@/lib/supabaseClient';
import type { Word } from '@/types/supabase';

type CSVRow = {
  word: string;
  meaning: string;
  distractor1: string;
  distractor2: string;
  distractor3: string;
  synonym1?: string;
  synonym2?: string;
  antonym1?: string;
  antonym2?: string;
  example: string;
  poster_url?: string;
  created_at?: string;
};

export default function AdminUpload() {
  const [setName, setSetName] = useState('');
  const [file, setFile]       = useState<File | null>(null);
  const [preview, setPreview] = useState<CSVRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Show first 5 rows for preview
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setSuccess(null);
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (!f) return;
    Papa.parse<CSVRow>(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          setError('CSV parse error: ' + results.errors[0].message);
        } else {
          setPreview(results.data.slice(0, 5));
        }
      },
    });
  }

  // Insert all words and create the set
  async function handleUpload() {
    if (!setName.trim()) {
      setError('Please enter a Set name.');
      return;
    }
    if (!file) {
      setError('Please select a CSV file.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Parse entire CSV
    const text = await file.text();
    const parsed = Papa.parse<CSVRow>(text, {
      header: true,
      skipEmptyLines: true,
    });
    if (parsed.errors.length) {
      setLoading(false);
      setError('CSV parse error: ' + parsed.errors[0].message);
      return;
    }

    // Map each CSVRow → insert payload
    const rows = parsed.data as CSVRow[];
    const wordsToInsert: Omit<Word, 'id'>[] = rows.map((r: CSVRow) => ({
      word:        r.word,
      meaning:     r.meaning,
      distractor1: r.distractor1,
      distractor2: r.distractor2,
      distractor3: r.distractor3,
      synonym1:    r.synonym1 || null,
      synonym2:    r.synonym2 || null,
      antonym1:    r.antonym1 || null,
      antonym2:    r.antonym2 || null,
      example:     r.example,
      poster_url:  r.poster_url || null,
      created_at:  r.created_at || null,
    }));

    // 1) Bulk insert into `words`
    const { data: insertedRaw, error: insErr } = await supabase
      .from('words')
      .insert(wordsToInsert)
      .select('id');

    if (insErr || !insertedRaw) {
      setLoading(false);
      setError('Error uploading words: ' + insErr?.message);
      return;
    }

    // Extract IDs
    const inserted = insertedRaw as { id: string }[];
    const wordIds = inserted.map((w) => w.id);

    // 2) Create new set
    const { error: setErr } = await supabase
      .from('sets')
      .insert([{ name: setName.trim(), word_ids: wordIds }]);

    setLoading(false);
    if (setErr) {
      setError('Error creating set: ' + setErr.message);
    } else {
      setSuccess(`✔️ Set “${setName.trim()}” created with ${wordIds.length} words!`);
      setPreview([]);
      setFile(null);
      setSetName('');
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF6] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-heading font-bold text-[#002B42] mb-6 text-center">
          Admin Bulk Upload
        </h1>

        {/* Set Name */}
        <label className="block font-body mb-1 text-[#002B42]">Set Name</label>
        <input
          type="text"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          placeholder="e.g. Beginner Vocabulary"
          className="w-full border border-gray-300 p-2 rounded font-body text-[#002B42] placeholder-gray-400 mb-4"
        />

        {/* CSV File Selector */}
        <label className="block font-body mb-1 text-[#002B42]">CSV File</label>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="font-body text-[#002B42] mb-6"
        />

        {/* Preview Table */}
        {preview.length > 0 && (
          <div className="mb-6">
            <p className="font-body text-[#002B42] mb-2">
              Preview (first 5 rows):
            </p>
            <div className="overflow-auto border border-gray-200 rounded">
              <table className="min-w-full text-sm font-body">
                <thead className="bg-[#F5F3EE] text-[#002B42]">
                  <tr>
                    {Object.keys(preview[0]).map((h) => (
                      <th key={h} className="px-2 py-1 text-left font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr
                      key={i}
                      className={i % 2 ? 'bg-white' : 'bg-[#FFFDF6]'}
                    >
                      {Object.values(row).map((v, j) => (
                        <td key={j} className="px-2 py-1 truncate">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Error / Success Messages */}
        {error && <p className="text-red-600 font-body mb-2">{error}</p>}
        {success && <p className="text-green-600 font-body mb-2">{success}</p>}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className={
            `w-full py-3 rounded-[12px] font-body font-semibold text-[18px] transition ` +
            (loading
              ? 'bg-gray-400 text-gray-200'
              : 'bg-[#C90000] text-white hover:bg-red-700')
          }
        >
          {loading ? 'Uploading…' : 'Upload & Create Set'}
        </button>
      </div>
    </div>
  );
}
