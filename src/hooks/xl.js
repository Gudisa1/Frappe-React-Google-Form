import * as XLSX from 'xlsx';

export const exportSubmissionToExcel = (submission) => {
  try {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    
    // Prepare metadata section
    const metadata = [
      ['Submission Details'],
      ['Project:', submission.project || 'N/A'],
      ['Form:', submission.reporting_form || 'N/A'],
      ['Status:', submission.status || 'N/A'],
      ['Submitted By:', submission.submitted_by || submission.owner || 'N/A'],
      ['Submission ID:', submission.name || 'N/A'],
      ['Created On:', submission.creation ? new Date(submission.creation).toLocaleString() : 'N/A'],
      [],
      ['Submitted Data'],
      ['Field', 'Value']
    ];

    // Add parsed data rows
    const dataRows = Object.entries(submission.parsedData || {}).map(([key, value]) => [
      formatFieldName(key),
      value !== null && value !== undefined ? value : 'N/A'
    ]);

    // Combine metadata and data rows
    const worksheetData = [...metadata, ...dataRows];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Style the worksheet (optional - basic styling)
    ws['!cols'] = [
      { wch: 30 }, // Field column width
      { wch: 15 }  // Value column width
    ];

    // Add the worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Submission Data');

    // Generate filename
    const fileName = `${submission.project || 'Submission'}_${submission.reporting_form || 'Form'}_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);

    console.log('Export successful:', fileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export to Excel. Please try again.');
  }
};

// Helper function to format field names for better readability
const formatFieldName = (field) => {
  // Convert snake_case to Title Case with spaces
  return field
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Alternative: Export multiple submissions
export const exportMultipleSubmissionsToExcel = (submissions) => {
  try {
    const wb = XLSX.utils.book_new();

    submissions.forEach((submission, index) => {
      // Prepare data for each submission
      const metadata = [
        ['Submission Details'],
        ['Project:', submission.project || 'N/A'],
        ['Form:', submission.reporting_form || 'N/A'],
        ['Status:', submission.status || 'N/A'],
        ['Submitted By:', submission.submitted_by || submission.owner || 'N/A'],
        ['Submission ID:', submission.name || 'N/A'],
        [],
        ['Submitted Data'],
        ['Field', 'Value']
      ];

      const dataRows = Object.entries(submission.parsedData || {}).map(([key, value]) => [
        formatFieldName(key),
        value
      ]);

      const worksheetData = [...metadata, ...dataRows];
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      // Set column widths
      ws['!cols'] = [{ wch: 30 }, { wch: 15 }];
      
      // Add sheet with meaningful name
      const sheetName = `${submission.project || 'Submission'}_${index + 1}`.substring(0, 31); // Excel sheet name max length is 31
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    const fileName = `Submissions_Export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Error exporting multiple submissions:', error);
    alert('Failed to export submissions to Excel.');
  }
};

// Advanced: Export with data categorization
export const exportSubmissionWithCategorization = (submission) => {
  try {
    const wb = XLSX.utils.book_new();
    
    // Categorize the data based on field patterns
    const categorized = {
      enrollment: {},
      promotion: {},
      supplies: {},
      specialPrograms: {},
      other: {}
    };

    Object.entries(submission.parsedData || {}).forEach(([key, value]) => {
      if (key.includes('kg') || key.includes('grade') || key.includes('college') || key.includes('university')) {
        if (key.includes('promoted')) {
          categorized.promotion[key] = value;
        } else {
          categorized.enrollment[key] = value;
        }
      } else if (key.includes('support') || key.includes('notebook') || key.includes('pen') || 
                 key.includes('pencil') || key.includes('ruler') || key.includes('books') || 
                 key.includes('bag') || key.includes('uniform')) {
        categorized.supplies[key] = value;
      } else if (key.includes('special') || key.includes('tutorial') || key.includes('sunday') || 
                 key.includes('accepted') || key.includes('sports')) {
        categorized.specialPrograms[key] = value;
      } else {
        categorized.other[key] = value;
      }
    });

    // Create sheets for each category
    const categories = [
      { name: 'Enrollment', data: categorized.enrollment },
      { name: 'Promotion', data: categorized.promotion },
      { name: 'School Supplies', data: categorized.supplies },
      { name: 'Special Programs', data: categorized.specialPrograms },
      { name: 'Other Data', data: categorized.other }
    ];

    categories.forEach(category => {
      if (Object.keys(category.data).length > 0) {
        const data = [
          ['Field', 'Value'],
          ...Object.entries(category.data).map(([key, value]) => [formatFieldName(key), value])
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(data);
        ws['!cols'] = [{ wch: 30 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws, category.name);
      }
    });

    // Add metadata sheet
    const metadataWs = XLSX.utils.aoa_to_sheet([
      ['Submission Metadata'],
      ['Project:', submission.project || 'N/A'],
      ['Form:', submission.reporting_form || 'N/A'],
      ['Status:', submission.status || 'N/A'],
      ['Submitted By:', submission.submitted_by || submission.owner || 'N/A'],
      ['Submission ID:', submission.name || 'N/A'],
      ['Created On:', submission.creation ? new Date(submission.creation).toLocaleString() : 'N/A']
    ]);
    metadataWs['!cols'] = [{ wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(wb, metadataWs, 'Metadata');

    const fileName = `${submission.project}_Categorized_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Error in categorized export:', error);
    alert('Failed to export categorized data.');
  }
};