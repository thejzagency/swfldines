import React, { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CSVUploaderProps {
  onUploadComplete: () => void;
}

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

export default function CSVUploader({ onUploadComplete }: CSVUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  const downloadTemplate = () => {
    const template = `name,cuisine_type,phone,email,address,city,state,zip_code,google_place_id
"Sample Restaurant","Italian","(239) 555-1234","contact@samplerestaurant.com","123 Main Street","Fort Myers","FL","33901","ChIJN1t_tDeuEmsRUsoyG83frY4"
"Another Example","Mexican","(239) 555-5678","info@anotherexample.com","456 Beach Blvd","Naples","FL","34102",""`;


    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'restaurant-upload-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return rows;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setResult(null);

    const text = await selectedFile.text();
    const parsed = parseCSV(text);
    setPreviewData(parsed.slice(0, 5));
    setShowPreview(true);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setResult(null);

    try {
      const text = await file.text();
      const rows = parseCSV(text);

      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const row of rows) {
        try {
          const restaurantData: any = {
            name: row.name,
            cuisine_type: row.cuisine_type || '',
            phone: row.phone || '',
            email: row.email || '',
            address: row.address || '',
            city: row.city || '',
            state: row.state || 'FL',
            zip_code: row.zip_code || '',
            description: '',
            price_range: '$',
            website: '',
            latitude: null,
            longitude: null,
            hours: {},
            features: [],
            images: [],
            menu_url: '',
            facebook_url: '',
            instagram_url: '',
            twitter_url: '',
            linkedin_url: '',
            youtube_url: '',
            listing_type: 'free',
            owner_claimed: false,
            status: 'active'
          };

          if (row.google_place_id && row.google_place_id.trim()) {
            restaurantData.google_place_id = row.google_place_id.trim();
          }

          const { data: inserted, error } = await supabase
            .from('restaurants')
            .insert([restaurantData])
            .select()
            .single();

          if (error) {
            failed++;
            errors.push(`Failed to upload "${row.name}": ${error.message}`);
          } else {
            success++;
          }
        } catch (error: any) {
          failed++;
          errors.push(`Error processing "${row.name}": ${error.message}`);
        }
      }

      setResult({ success, failed, errors });
      if (success > 0) {
        onUploadComplete();

        // Add user to SendGrid CSV upload list
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user?.email) {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            console.log('Calling add-to-sendgrid-list for:', user.email);
            const response = await fetch(`${supabaseUrl}/functions/v1/add-to-sendgrid-list`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${supabaseAnonKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                listType: 'csv_upload'
              })
            });

            const responseData = await response.json();
            console.log('SendGrid response:', responseData);

            if (!response.ok) {
              console.error('SendGrid API error:', responseData);
            } else {
              console.log('User successfully added to CSV upload email sequence');
            }
          } else {
            console.log('No user email found');
          }
        } catch (emailError) {
          console.error('Failed to add to email list:', emailError);
        }
      }
    } catch (error: any) {
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Bulk Restaurant Upload</h3>
        <p className="text-gray-600">Upload multiple restaurants at once using a CSV file</p>
      </div>

      <div className="mb-6">
        <button
          onClick={downloadTemplate}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <Download className="h-5 w-5" />
          <span>Download CSV Template</span>
        </button>
        <p className="text-sm text-gray-500 mt-2">
          Download the template to see the required format and fields
        </p>
      </div>

      <div className="mb-6">
        <label className="block">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-700 font-medium mb-2">
              {file ? file.name : 'Click to select CSV file'}
            </p>
            <p className="text-sm text-gray-500">
              CSV file with restaurant data
            </p>
          </div>
        </label>
      </div>

      {showPreview && previewData.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Preview (First 5 rows)</h4>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue-200">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Cuisine</th>
                  <th className="text-left p-2">City</th>
                  <th className="text-left p-2">Phone</th>
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx} className="border-b border-blue-100">
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">{row.cuisine_type}</td>
                    <td className="p-2">{row.city}</td>
                    <td className="p-2">{row.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {file && !uploading && !result && (
        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          Upload Restaurants
        </button>
      )}

      {uploading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Uploading restaurants...</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Upload Complete</h4>
            </div>
            <p className="text-green-700">
              Successfully uploaded {result.success} restaurant(s)
            </p>
            {result.failed > 0 && (
              <p className="text-red-600 mt-2">
                Failed to upload {result.failed} restaurant(s)
              </p>
            )}
          </div>

          {result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              <h4 className="font-semibold text-red-900 mb-2">Errors:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {result.errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setFile(null);
              setResult(null);
              setShowPreview(false);
              setPreviewData([]);
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
}
