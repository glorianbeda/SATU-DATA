import React, { useMemo } from 'react';
import DataTable from '~/components/DataTable/DataTable';
import { formatDateFull } from '~/utils/date'; // assuming exists

const ResponseTable = ({ form, responses, loading }) => {
  // Generate columns dynamically based on form schema
  const columns = useMemo(() => {
    // Info columns
    const baseColumns = [
      { 
        field: 'submittedAt', 
        headerName: 'Waktu Kirim', 
        width: 180,
        renderCell: (row) => formatDateFull(row.submittedAt),
        valueGetter: (row) => formatDateFull(row.submittedAt)
      },
      { 
        field: 'respondent', 
        headerName: 'Responden', 
        width: 200,
        valueGetter: (row) => row.user?.name || row.guestName || 'Anonim'
      },
    ];

    // Dynamic columns from schema
    if (!form?.schema) return baseColumns;

    const dynamicColumns = form.schema.map(field => ({
      field: `data.${field.id}`, // DataTable might support nested access? If not we map data
      headerName: field.label,
      width: 150,
      valueGetter: (row) => row.data?.[field.id] || '-'
    }));

    return [...baseColumns, ...dynamicColumns];
  }, [form]);

  return (
    <DataTable
      title={`Respons: ${form?.title || ''}`}
      columns={columns}
      data={responses}
      loading={loading}
      disableSelection
    />
  );
};

export default ResponseTable;
